import express from 'express';
import { pool } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, first_name, last_name, email, role, created_at FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;
    const result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, email = $3, updated_at = NOW() WHERE id = $4 RETURNING id, first_name, last_name, email',
      [first_name, last_name, email, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
});

export default router;