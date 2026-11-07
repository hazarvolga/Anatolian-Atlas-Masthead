import crypto from 'node:crypto';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import {
  authMiddleware,
  issueAuthSession,
  clearAuthCookies,
  extractRefreshTokenFromReq,
  verifyAndConsumeRefreshToken,
  revokeFamily,
  devUserStore,
  findUserByIdSafe,
} from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

async function findUserByEmailSafe(email) {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      return devUserStore.get(email) || null;
    }
    throw err;
  }
}

async function createUserSafe(data) {
  try {
    return await prisma.user.create({ data });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      const user = {
        id: crypto.randomUUID(),
        ...data,
        is_active: true,
        email_verified: false,
        created_at: new Date().toISOString(),
      };
      devUserStore.set(data.email, user);
      return user;
    }
    throw err;
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILED_ATTEMPTS = 5;
const failedLoginStore = new Map();

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication requests from this IP. Please try again in 15 minutes.' },
});

function checkAccountLockout(email) {
  const key = String(email || '').trim().toLowerCase();
  const entry = failedLoginStore.get(key);
  if (!entry) return { locked: false };
  if (Date.now() > entry.resetAt) {
    failedLoginStore.delete(key);
    return { locked: false };
  }
  if (entry.count >= MAX_FAILED_ATTEMPTS) {
    return {
      locked: true,
      retryAfterSeconds: Math.ceil((entry.resetAt - Date.now()) / 1000),
    };
  }
  return { locked: false };
}

function recordFailedLogin(email) {
  const key = String(email || '').trim().toLowerCase();
  const now = Date.now();
  const existing = failedLoginStore.get(key);
  if (!existing || now > existing.resetAt) {
    failedLoginStore.set(key, { count: 1, resetAt: now + LOCKOUT_WINDOW_MS });
  } else {
    existing.count += 1;
    failedLoginStore.set(key, existing);
  }
}

function clearFailedLogin(email) {
  const key = String(email || '').trim().toLowerCase();
  failedLoginStore.delete(key);
}

// POST /api/auth/register
router.post('/register', authRateLimiter, async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const first_name = String(req.body?.first_name || '').trim();
    const last_name = String(req.body?.last_name || '').trim();
    const phone = req.body?.phone ? String(req.body.phone).trim().slice(0, 40) : null;

    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!EMAIL_PATTERN.test(email) || email.length > 200) {
      return res.status(400).json({ message: 'Invalid email address format' });
    }
    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({ message: 'Password must be between 8 and 128 characters' });
    }
    if (first_name.length > 100 || last_name.length > 100) {
      return res.status(400).json({ message: 'Name fields must not exceed 100 characters' });
    }

    const existingUser = await findUserByEmailSafe(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const user = await createUserSafe({
      email,
      password_hash,
      first_name,
      last_name,
      phone,
      role: 'user',
    });

    const session = issueAuthSession(res, user, req);

    res.status(201).json({
      token: session.accessToken,
      accessToken: session.accessToken,
      expiresIn: session.expiresIn,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', authRateLimiter, async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if (!email || !password || !EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ message: 'Valid email and password are required' });
    }

    const lockout = checkAccountLockout(email);
    if (lockout.locked) {
      return res.status(429).json({
        message: `Account temporarily locked due to repeated failed attempts. Retry in ${lockout.retryAfterSeconds}s.`,
      });
    }

    const user = await findUserByEmailSafe(email);
    if (!user) {
      recordFailedLogin(email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      recordFailedLogin(email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    clearFailedLogin(email);
    const session = issueAuthSession(res, user, req);

    res.json({
      token: session.accessToken,
      accessToken: session.accessToken,
      expiresIn: session.expiresIn,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Login failed' });
  }
});

// POST /api/auth/refresh - Rotate refresh token and issue new short-lived access token
router.post('/refresh', authRateLimiter, async (req, res) => {
  try {
    const rawRefresh = extractRefreshTokenFromReq(req);
    const result = verifyAndConsumeRefreshToken(rawRefresh);

    if (!result.valid) {
      clearAuthCookies(res);
      return res.status(401).json({
        message: 'Refresh token invalid, expired, or reused.',
        reason: result.reason,
      });
    }

    const user = await findUserByIdSafe(result.userId, {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      role: true,
      is_active: true,
    });

    if (!user || !user.is_active) {
      clearAuthCookies(res);
      return res.status(401).json({ message: 'Account not found or inactive.' });
    }

    const session = issueAuthSession(res, user, req, result.familyId);

    res.json({
      token: session.accessToken,
      accessToken: session.accessToken,
      expiresIn: session.expiresIn,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Token refresh error:', error.message);
    clearAuthCookies(res);
    res.status(401).json({ message: 'Failed to refresh session.' });
  }
});

// POST /api/auth/logout - Revoke refresh token family and clear HttpOnly cookies
router.post('/logout', (req, res) => {
  try {
    const rawRefresh = extractRefreshTokenFromReq(req);
    if (rawRefresh) {
      const decoded = jwt.decode(rawRefresh);
      if (decoded && typeof decoded === 'object' && decoded.familyId) {
        revokeFamily(decoded.familyId);
      }
    }
  } catch {
    // Ignore decode errors during logout
  }
  clearAuthCookies(res);
  res.json({ success: true, message: 'Logged out and session cookies cleared.' });
});

// GET /api/auth/me - Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await findUserByIdSafe(req.user.id, {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      role: true,
      email_verified: true,
      created_at: true,
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error.message);
    res.status(500).json({ message: 'Failed to get user information' });
  }
});

export default router;
