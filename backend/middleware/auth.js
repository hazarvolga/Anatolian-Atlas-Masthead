import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60; // 15 minutes
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

/**
 * In-memory rotating refresh token family ledger.
 * Maps `jti -> { userId, role, familyId, used, revoked, expiresAt }`.
 * Detecting reuse of a previously consumed `jti` immediately revokes the entire `familyId`.
 */
const refreshTokenLedger = new Map();

/**
 * Development-only in-memory user store fallback when local PostgreSQL (:5432) is offline.
 * Never active when NODE_ENV === 'production'.
 */
export const devUserStore = new Map();

export async function findUserByIdSafe(id, select) {
  try {
    return await prisma.user.findUnique({ where: { id }, select });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      for (const u of devUserStore.values()) {
        if (u.id === id) return u;
      }
    }
    throw err;
  }
}

export function parseCookies(req) {
  const header = req.headers?.cookie;
  if (!header || typeof header !== 'string') return {};
  const out = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key) {
      try {
        out[key] = decodeURIComponent(val);
      } catch {
        out[key] = val;
      }
    }
  }
  return out;
}

function getRefreshSecret() {
  return process.env.JWT_REFRESH_SECRET || `${process.env.JWT_SECRET || 'nst-dev-secret'}-refresh`;
}

function getAccessSecret() {
  return process.env.JWT_SECRET || 'nst-dev-secret';
}

function buildCookieDirectives(name, value, maxAgeSeconds, secure = true) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (secure) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

/**
 * Issues a short-lived (15m) access token + rotating (7d) refresh token and writes
 * `__Host-nst_access` and `__Host-nst_refresh` HttpOnly cookies.
 */
export function issueAuthSession(res, user, req, existingFamilyId = null) {
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role, type: 'access' },
    getAccessSecret(),
    { expiresIn: `${ACCESS_TOKEN_TTL_SECONDS}s` }
  );

  const jti = crypto.randomUUID();
  const familyId = existingFamilyId || crypto.randomUUID();

  const refreshToken = jwt.sign(
    { userId: user.id, role: user.role, jti, familyId, type: 'refresh' },
    getRefreshSecret(),
    { expiresIn: `${REFRESH_TOKEN_TTL_SECONDS}s` }
  );

  refreshTokenLedger.set(jti, {
    userId: user.id,
    role: user.role,
    familyId,
    used: false,
    revoked: false,
    expiresAt: Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000,
  });

  const isHttps =
    req?.secure ||
    req?.headers?.['x-forwarded-proto'] === 'https' ||
    process.env.NODE_ENV === 'production';

  const cookies = [
    // RFC 6265bis __Host- prefix (Secure + Path=/ + no Domain; supported on HTTPS and localhost in Chromium)
    buildCookieDirectives('__Host-nst_access', accessToken, ACCESS_TOKEN_TTL_SECONDS, true),
    buildCookieDirectives('__Host-nst_refresh', refreshToken, REFRESH_TOKEN_TTL_SECONDS, true),
  ];

  // Plain-HTTP local development fallback so non-Chromium HTTP clients on 127.0.0.1 also carry HttpOnly cookies
  if (!isHttps) {
    cookies.push(
      buildCookieDirectives('nst_access', accessToken, ACCESS_TOKEN_TTL_SECONDS, false),
      buildCookieDirectives('nst_refresh', refreshToken, REFRESH_TOKEN_TTL_SECONDS, false)
    );
  }

  res.setHeader('Set-Cookie', cookies);

  return {
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    familyId,
  };
}

export function clearAuthCookies(res) {
  res.setHeader('Set-Cookie', [
    buildCookieDirectives('__Host-nst_access', '', 0, true),
    buildCookieDirectives('__Host-nst_refresh', '', 0, true),
    buildCookieDirectives('nst_access', '', 0, false),
    buildCookieDirectives('nst_refresh', '', 0, false),
  ]);
}

export function revokeFamily(familyId) {
  if (!familyId) return;
  for (const [key, entry] of refreshTokenLedger.entries()) {
    if (entry.familyId === familyId) {
      entry.revoked = true;
      refreshTokenLedger.set(key, entry);
    }
  }
}

export function extractRefreshTokenFromReq(req) {
  const cookies = parseCookies(req);
  return cookies['__Host-nst_refresh'] || cookies['nst_refresh'] || null;
}

export function verifyAndConsumeRefreshToken(rawToken) {
  if (!rawToken) {
    return { valid: false, reason: 'missing_token' };
  }
  try {
    const decoded = jwt.verify(rawToken, getRefreshSecret());
    if (decoded.type !== 'refresh' || !decoded.jti || !decoded.familyId) {
      return { valid: false, reason: 'invalid_token_type' };
    }

    const record = refreshTokenLedger.get(decoded.jti);
    if (!record) {
      // Token may have been issued before server restart or is unknown
      return { valid: false, reason: 'unknown_jti' };
    }

    if (record.revoked) {
      return { valid: false, reason: 'family_revoked' };
    }

    if (record.used) {
      // Refresh token reuse detected -> revoke entire token family immediately
      revokeFamily(record.familyId);
      return { valid: false, reason: 'token_reuse_detected' };
    }

    if (Date.now() > record.expiresAt) {
      return { valid: false, reason: 'expired' };
    }

    record.used = true;
    refreshTokenLedger.set(decoded.jti, record);

    return {
      valid: true,
      userId: decoded.userId,
      role: decoded.role,
      familyId: decoded.familyId,
    };
  } catch {
    return { valid: false, reason: 'jwt_verify_failed' };
  }
}

const ALLOWED_ORIGINS = new Set([
  process.env.FRONTEND_URL || 'http://localhost:3100',
  'http://localhost:3100',
  'http://127.0.0.1:3100',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:8080',
]);

/**
 * CSRF Origin/Referer validation middleware for state-changing HTTP methods.
 */
export const originCheckMiddleware = (req, res, next) => {
  const method = req.method?.toUpperCase();
  if (!method || ['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return next();
  }
  if (req.originalUrl?.startsWith('/api/payments/webhook')) {
    return next();
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  if (origin) {
    if (!ALLOWED_ORIGINS.has(origin)) {
      return res.status(403).json({
        message: 'Forbidden: Untrusted Origin header (CSRF protection).',
      });
    }
    return next();
  }

  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      if (!ALLOWED_ORIGINS.has(refOrigin)) {
        return res.status(403).json({
          message: 'Forbidden: Untrusted Referer header (CSRF protection).',
        });
      }
    } catch {
      return res.status(403).json({
        message: 'Forbidden: Malformed Referer header.',
      });
    }
  }

  return next();
};

export const authMiddleware = async (req, res, next) => {
  try {
    const cookies = parseCookies(req);
    const cookieToken = cookies['__Host-nst_access'] || cookies['nst_access'];
    const headerToken = req.header('Authorization')?.replace(/^Bearer\s+/i, '');
    const token = cookieToken || headerToken;

    if (!token) {
      return res.status(401).json({ message: 'Authentication failed: No token provided.' });
    }

    const decoded = jwt.verify(token, getAccessSecret());

    if (decoded.type === 'refresh') {
      return res.status(401).json({ message: 'Authentication failed: Refresh token cannot be used as access token.' });
    }

    // Fetch the user from the database to ensure they exist and are active
    const user = await findUserByIdSafe(decoded.userId, {
      id: true,
      role: true,
      is_active: true,
    });

    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Authentication failed: User not found or inactive.' });
    }

    // Attach the validated user information to the request object
    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.name);
    res.status(401).json({ message: 'Authentication failed: Invalid or expired token.' });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin' || req.user.role === 'superadmin')) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admin access required.' });
  }
};
