import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body;

    if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password_hash,
        first_name,
        last_name,
        phone: phone || null,
        role: 'user', // Default role
      },
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
        token,
        user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role }
     });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.is_active) {
        return res.status(403).json({ message: 'Account is deactivated' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
        token,
        user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// GET /api/auth/me - Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { 
          id: true, 
          email: true, 
          first_name: true, 
          last_name: true, 
          role: true, 
          email_verified: true, 
          created_at: true 
        },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to get user information' });
  }
});

export default router;
