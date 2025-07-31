import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

// Apply authentication middleware to all routes in this file
router.use(authMiddleware);

// GET /api/users/profile - Get the logged-in user's profile
router.get('/profile', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { // Select only the fields you want to expose
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// PUT /api/users/profile - Update the logged-in user's profile
router.put('/profile', async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { first_name, last_name, email },
      select: { id: true, first_name: true, last_name: true, email: true },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    // Handle potential unique constraint violation on email
    if (error.code === 'P2002') {
        return res.status(409).json({ message: 'Email address is already in use.' });
    }
    res.status(500).json({ message: 'Error updating user profile' });
  }
});

// GET /api/users/role - Get the logged-in user's role
router.get('/role', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ role: user.role });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ message: 'Error fetching user role' });
  }
});

export default router;
