import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// Get all tours
router.get('/', async (req, res) => {
  try {
    const { limit = 10, offset = 0, destination, category } = req.query;
    
    let query = `
      SELECT t.*, d.name as destination_name, d.country, d.city
      FROM tours t
      LEFT JOIN destinations d ON t.destination_id = d.id
      WHERE t.is_active = true
    `;
    
    const params = [];
    let paramCount = 0;
    
    if (destination) {
      paramCount++;
      query += ` AND d.name ILIKE $${paramCount}`;
      params.push(`%${destination}%`);
    }
    
    if (category) {
      paramCount++;
      query += ` AND t.category ILIKE $${paramCount}`;
      params.push(`%${category}%`);
    }
    
    query += ` ORDER BY t.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) 
      FROM tours t 
      LEFT JOIN destinations d ON t.destination_id = d.id 
      WHERE t.is_active = true
      ${destination ? 'AND d.name ILIKE $1' : ''}
      ${category ? `AND t.category ILIKE $${destination ? '2' : '1'}` : ''}
    `;
    
    const countParams = [];
    if (destination) countParams.push(`%${destination}%`);
    if (category) countParams.push(`%${category}%`);
    
    const countResult = await pool.query(countQuery, countParams);
    
    res.json({
      tours: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({ message: 'Error fetching tours' });
  }
});

// Get single tour by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT t.*, d.name as destination_name, d.country, d.city, d.description as destination_description
      FROM tours t
      LEFT JOIN destinations d ON t.destination_id = d.id
      WHERE t.id = $1 AND t.is_active = true
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    
    // Get reviews for this tour
    const reviewsQuery = `
      SELECT r.*, u.first_name, u.last_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.tour_id = $1 AND r.is_verified = true
      ORDER BY r.created_at DESC
      LIMIT 10
    `;
    
    const reviewsResult = await pool.query(reviewsQuery, [id]);
    
    const tour = result.rows[0];
    tour.reviews = reviewsResult.rows;
    
    res.json(tour);
  } catch (error) {
    console.error('Error fetching tour:', error);
    res.status(500).json({ message: 'Error fetching tour' });
  }
});

// Get featured tours
router.get('/featured/list', async (req, res) => {
  try {
    const query = `
      SELECT t.*, d.name as destination_name, d.country, d.city
      FROM tours t
      LEFT JOIN destinations d ON t.destination_id = d.id
      WHERE t.is_active = true AND d.featured = true
      ORDER BY t.created_at DESC
      LIMIT 6
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching featured tours:', error);
    res.status(500).json({ message: 'Error fetching featured tours' });
  }
});

export default router;
