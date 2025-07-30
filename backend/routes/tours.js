import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// Get all tours
router.get('/', async (req, res) => {
  try {
    const { limit = 10, offset = 0, destination, category } = req.query;
    
    let query = `
      SELECT t.*, d.name as destination_name, c.name as country_name, ci.name as city_name
      FROM tours t
      LEFT JOIN destinations d ON t.destination_id = d.id
      LEFT JOIN countries c ON d.country_id = c.id  
      LEFT JOIN cities ci ON d.city_id = ci.id
      WHERE t.status = 'active'
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (destination) {
      query += ` AND d.slug = $${paramIndex}`;
      params.push(destination);
      paramIndex++;
    }
    
    if (category) {
      query += ` AND t.category_id = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    
    query += ` ORDER BY t.featured DESC, t.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({ message: 'Error fetching tours' });
  }
});

// Get single tour
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT t.*, d.name as destination_name, d.slug as destination_slug,
             c.name as country_name, ci.name as city_name,
             u.first_name as guide_first_name, u.last_name as guide_last_name
      FROM tours t
      LEFT JOIN destinations d ON t.destination_id = d.id
      LEFT JOIN countries c ON d.country_id = c.id
      LEFT JOIN cities ci ON d.city_id = ci.id
      LEFT JOIN users u ON t.guide_id = u.id
      WHERE t.id = $1 AND t.status = 'active'
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching tour:', error);
    res.status(500).json({ message: 'Error fetching tour' });
  }
});

// Create new tour (admin only)
router.post('/', async (req, res) => {
  try {
    const {
      title, slug, description, short_description, category_id, destination_id,
      location_id, guide_id, duration_hours, max_participants, min_participants,
      price_adult, price_child, price_currency, difficulty_level, age_limit,
      featured, includes, excludes, requirements, cancellation_policy
    } = req.body;
    
    const result = await pool.query(`
      INSERT INTO tours (
        title, slug, description, short_description, category_id, destination_id,
        location_id, guide_id, status, duration_hours, max_participants, min_participants,
        price_adult, price_child, price_currency, difficulty_level, age_limit,
        featured, includes, excludes, requirements, cancellation_policy
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, 'draft', $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
      ) RETURNING *
    `, [
      title, slug, description, short_description, category_id, destination_id,
      location_id, guide_id, duration_hours, max_participants, min_participants,
      price_adult, price_child, price_currency, difficulty_level, age_limit,
      featured, includes, excludes, requirements, cancellation_policy
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating tour:', error);
    res.status(500).json({ message: 'Error creating tour' });
  }
});

// Update tour
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;
    
    const keys = Object.keys(updateFields);
    const values = Object.values(updateFields);
    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
    
    const result = await pool.query(
      `UPDATE tours SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating tour:', error);
    res.status(500).json({ message: 'Error updating tour' });
  }
});

// Delete tour
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM tours WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    
    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    res.status(500).json({ message: 'Error deleting tour' });
  }
});

export default router;
