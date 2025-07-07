import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// Get all destinations
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, 
             COUNT(t.id) as tour_count
      FROM destinations d
      LEFT JOIN tours t ON d.id = t.destination_id AND t.is_active = true
      GROUP BY d.id
      ORDER BY d.featured DESC, d.name ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ message: 'Error fetching destinations' });
  }
});

// Get single destination with tours
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get destination
    const destResult = await pool.query('SELECT * FROM destinations WHERE id = $1', [id]);
    
    if (destResult.rows.length === 0) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    // Get tours for this destination
    const toursResult = await pool.query(`
      SELECT * FROM tours 
      WHERE destination_id = $1 AND is_active = true
      ORDER BY created_at DESC
    `, [id]);
    
    const destination = destResult.rows[0];
    destination.tours = toursResult.rows;
    
    res.json(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({ message: 'Error fetching destination' });
  }
});

export default router;
