import express from 'express';
import { pool } from '../config/database.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    // Get various stats
    const [usersResult, toursResult, reservationsResult, revenueResult] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM users WHERE role = $1', ['user']),
      pool.query('SELECT COUNT(*) as count FROM tours WHERE is_active = true'),
      pool.query('SELECT COUNT(*) as count FROM reservations'),
      pool.query('SELECT SUM(payment_amount) as total FROM reservations WHERE payment_status = $1', ['paid'])
    ]);

    res.json({
      users: parseInt(usersResult.rows[0].count),
      tours: parseInt(toursResult.rows[0].count),
      reservations: parseInt(reservationsResult.rows[0].count),
      revenue: parseFloat(revenueResult.rows[0].total || 0)
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});

// Get all reservations for admin
router.get('/reservations', async (req, res) => {
  try {
    const { limit = 50, offset = 0, status } = req.query;
    
    let query = `
      SELECT r.*, t.title as tour_title, u.first_name, u.last_name, u.email,
             d.name as destination_name
      FROM reservations r
      LEFT JOIN tours t ON r.tour_id = t.id
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN destinations d ON t.destination_id = d.id
    `;
    
    const params = [];
    if (status) {
      query += ' WHERE r.booking_status = $1';
      params.push(status);
    }
    
    query += ` ORDER BY r.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching admin reservations:', error);
    res.status(500).json({ message: 'Error fetching reservations' });
  }
});

// Update reservation status
router.patch('/reservations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingStatus, paymentStatus } = req.body;
    
    const result = await pool.query(`
      UPDATE reservations 
      SET booking_status = COALESCE($1, booking_status),
          payment_status = COALESCE($2, payment_status),
          updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `, [bookingStatus, paymentStatus, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    res.json({
      message: 'Reservation updated successfully',
      reservation: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ message: 'Error updating reservation' });
  }
});

// Get all tours for admin
router.get('/tours', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, d.name as destination_name, 
             COUNT(r.id) as reservation_count
      FROM tours t
      LEFT JOIN destinations d ON t.destination_id = d.id
      LEFT JOIN reservations r ON t.id = r.tour_id
      GROUP BY t.id, d.name
      ORDER BY t.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching admin tours:', error);
    res.status(500).json({ message: 'Error fetching tours' });
  }
});

// Admin: Create a new destination
router.post('/destinations', async (req, res) => {
  try {
    const { name, description, image_url, country, city, is_active, coords, best_time, activities, google_maps_url, gallery_images, extra_info } = req.body;
    const result = await pool.query(`
      INSERT INTO destinations (name, description, image_url, country, city, is_active, coords, best_time, activities, google_maps_url, gallery_images, extra_info)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [name, description, image_url, country, city, is_active, coords, best_time, activities, google_maps_url, gallery_images, extra_info]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating destination:', error);
    res.status(500).json({ message: 'Error creating destination' });
  }
});

// Admin: Update a destination
router.put('/destinations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, country, city, is_active, coords, best_time, activities, google_maps_url, gallery_images, extra_info } = req.body;
    const result = await pool.query(`
      UPDATE destinations
      SET name = $1, description = $2, image_url = $3, country = $4, city = $5, is_active = $6, coords = $7, best_time = $8, activities = $9, google_maps_url = $10, gallery_images = $11, extra_info = $12, updated_at = NOW()
      WHERE id = $13
      RETURNING *
    `, [name, description, image_url, country, city, is_active, coords, best_time, activities, google_maps_url, gallery_images, extra_info, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating destination:', error);
    res.status(500).json({ message: 'Error updating destination' });
  }
});

// Admin: Delete a destination
router.delete('/destinations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM destinations WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting destination:', error);
    res.status(500).json({ message: 'Error deleting destination' });
  }
});

// Admin: Get all users
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, first_name, last_name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Admin: Update user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const result = await pool.query('UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, role', [role, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
});

// Admin: Get AI settings
router.get('/settings/ai', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ai_settings WHERE user_id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.json({}); // No settings found, return empty object
    }
    // Security: Don't send back the API key
    const settings = { ...result.rows[0], api_key: !!result.rows[0].api_key };
    res.json(settings);
  } catch (error) {
    console.error('Error fetching AI settings:', error);
    res.status(500).json({ message: 'Error fetching AI settings' });
  }
});

// Admin: Save AI settings
router.post('/settings/ai', async (req, res) => {
  try {
    const { provider, model, apiKey, customEndpoint, customModel } = req.body;
    // Use a transaction to perform upsert
    await pool.query('BEGIN');
    const existingSettings = await pool.query('SELECT id FROM ai_settings WHERE user_id = $1', [req.user.id]);
    if (existingSettings.rows.length > 0) {
      // Update existing settings
      await pool.query(
        'UPDATE ai_settings SET provider = $1, model = $2, api_key = COALESCE($3, api_key), custom_endpoint = $4, custom_model = $5, updated_at = NOW() WHERE user_id = $6',
        [provider, model, apiKey, customEndpoint, customModel, req.user.id]
      );
    } else {
      // Insert new settings
      await pool.query(
        'INSERT INTO ai_settings (user_id, provider, model, api_key, custom_endpoint, custom_model) VALUES ($1, $2, $3, $4, $5, $6)',
        [req.user.id, provider, model, apiKey, customEndpoint, customModel]
      );
    }
    await pool.query('COMMIT');
    res.status(200).json({ message: 'AI settings saved successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error saving AI settings:', error);
    res.status(500).json({ message: 'Error saving AI settings' });
  }
});

// Admin: Get site settings
router.get('/settings/site', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM site_settings ORDER BY created_at DESC LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({ message: 'Error fetching site settings' });
  }
});

// Admin: Save site settings
router.post('/settings/site', async (req, res) => {
  try {
    const settings = req.body;
    // Use a transaction to perform upsert
    await pool.query('BEGIN');
    const existingSettings = await pool.query('SELECT id FROM site_settings');
    if (existingSettings.rows.length > 0) {
      // Update existing settings
      const settingId = existingSettings.rows[0].id;
      const fields = Object.keys(settings);
      const values = Object.values(settings);
      const setClause = fields.map((field, index) => `${field} = ${index + 1}`).join(', ');
      const query = `UPDATE site_settings SET ${setClause}, updated_at = NOW() WHERE id = ${fields.length + 1}`;
      await pool.query(query, [...values, settingId]);
    } else {
      // Insert new settings
      const fields = Object.keys(settings);
      const values = Object.values(settings);
      const placeholders = fields.map((_, index) => `${index + 1}`).join(', ');
      const query = `INSERT INTO site_settings (${fields.join(', ')}) VALUES (${placeholders})`
      await pool.query(query, values);
    }
    await pool.query('COMMIT');
    res.status(200).json({ message: 'Site settings saved successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error saving site settings:', error);
    res.status(500).json({ message: 'Error saving site settings' });
  }
});

// Admin: Get calendar data (tours, availability, bookings)
router.get('/calendar-data', async (req, res) => {
  try {
    const { startDate, endDate, tourId } = req.query;

    let toursQuery = 'SELECT id, name, max_group_size FROM tours WHERE is_active = true';
    let toursParams = [];
    if (tourId && tourId !== 'all') {
      toursQuery += ' AND id = $1';
      toursParams.push(tourId);
    }
    const toursResult = await pool.query(toursQuery, toursParams);
    const tours = toursResult.rows;

    let availabilityQuery = `
      SELECT ta.*, t.name as tour_name, t.max_group_size
      FROM tour_availability ta
      JOIN tours t ON ta.tour_id = t.id
      WHERE ta.available_date >= $1 AND ta.available_date <= $2
    `;
    let availabilityParams = [startDate, endDate];
    if (tourId && tourId !== 'all') {
      availabilityQuery += ' AND ta.tour_id = $3';
      availabilityParams.push(tourId);
    }
    const availabilityResult = await pool.query(availabilityQuery, availabilityParams);
    const availability = availabilityResult.rows;

    let bookingsQuery = `
      SELECT r.*, t.title as tour_title
      FROM reservations r
      JOIN tours t ON r.tour_id = t.id
      WHERE r.booking_date >= $1 AND r.booking_date <= $2 AND r.booking_status != 'cancelled'
    `;
    let bookingsParams = [startDate, endDate];
    if (tourId && tourId !== 'all') {
      bookingsQuery += ' AND r.tour_id = $3';
      bookingsParams.push(tourId);
    }
    const bookingsResult = await pool.query(bookingsQuery, bookingsParams);
    const bookings = bookingsResult.rows;

    res.json({ tours, availability, bookings });
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    res.status(500).json({ message: 'Error fetching calendar data' });
  }
});

// Admin: Bulk update availability
router.post('/availability/bulk-update', async (req, res) => {
  try {
    const updates = req.body;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const update of updates) {
        const { tour_id, available_date, available_spots, price_override } = update;
        await client.query(
          `INSERT INTO tour_availability (tour_id, available_date, available_spots, price_override)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (tour_id, available_date) DO UPDATE SET
             available_spots = EXCLUDED.available_spots,
             price_override = EXCLUDED.price_override,
             updated_at = NOW()`,
          [tour_id, available_date, available_spots, price_override]
        );
      }
      await client.query('COMMIT');
      res.status(200).json({ message: 'Availability updated successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error bulk updating availability:', error);
    res.status(500).json({ message: 'Error bulk updating availability' });
  }
});

// Admin: Get all reviews
router.get('/reviews', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, t.name as tour_name, t.image_url as tour_image, u.first_name, u.last_name, u.email
      FROM reviews r
      LEFT JOIN tours t ON r.tour_id = t.id
      LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Admin: Update review status
router.put('/reviews/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;
    const result = await pool.query('UPDATE reviews SET is_verified = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [isVerified, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({ message: 'Error updating review status' });
  }
});

// Admin: Delete review
router.delete('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM reviews WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
});

// Admin: Bulk update reviews
router.put('/reviews/bulk-update', async (req, res) => {
  try {
    const { reviewIds, isVerified } = req.body;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const updatedReviews = [];
      for (const id of reviewIds) {
        const result = await client.query('UPDATE reviews SET is_verified = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [isVerified, id]);
        if (result.rows.length > 0) {
          updatedReviews.push(result.rows[0]);
        }
      }
      await client.query('COMMIT');
      res.json(updatedReviews);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error bulk updating reviews:', error);
    res.status(500).json({ message: 'Error bulk updating reviews' });
  }
});

// Admin: Get tour pricing data
router.get('/tours/:id/pricing-data', async (req, res) => {
  try {
    const { id } = req.params;
    const [pricingResult, timeSlotsResult, seasonalResult, discountResult] = await Promise.all([
      pool.query('SELECT * FROM tour_pricing WHERE tour_id = $1', [id]),
      pool.query('SELECT * FROM tour_time_slots WHERE tour_id = $1', [id]),
      pool.query('SELECT * FROM seasonal_pricing WHERE tour_id = $1', [id]),
      pool.query('SELECT * FROM group_size_discounts WHERE tour_id = $1', [id]),
    ]);

    res.json({
      tourPricing: pricingResult.rows,
      timeSlots: timeSlotsResult.rows,
      seasonalPricing: seasonalResult.rows.map(item => ({ ...item, adjustment_type: item.adjustment_type })),
      groupDiscounts: discountResult.rows.map(item => ({ ...item, discount_type: item.discount_type })),
    });
  } catch (error) {
    console.error('Error fetching tour pricing data:', error);
    res.status(500).json({ message: 'Error fetching tour pricing data' });
  }
});

// Admin: Update tour pricing data
router.put('/tours/:id/pricing-data', async (req, res) => {
  try {
    const { id } = req.params;
    const { tourPricing, timeSlots, seasonalPricing, groupDiscounts } = req.body;
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Delete existing data
      await client.query('DELETE FROM tour_pricing WHERE tour_id = $1', [id]);
      await client.query('DELETE FROM tour_time_slots WHERE tour_id = $1', [id]);
      await client.query('DELETE FROM seasonal_pricing WHERE tour_id = $1', [id]);
      await client.query('DELETE FROM group_size_discounts WHERE tour_id = $1', [id]);

      // Insert new data
      for (const pricing of tourPricing) {
        await client.query(
          'INSERT INTO tour_pricing (tour_id, min_pax, max_pax, price_per_person, single_supplement, currency) VALUES ($1, $2, $3, $4, $5, $6)',
          [id, pricing.min_pax, pricing.max_pax, pricing.price_per_person, pricing.single_supplement, pricing.currency]
        );
      }
      for (const slot of timeSlots) {
        await client.query(
          'INSERT INTO tour_time_slots (tour_id, start_time, end_time, max_capacity) VALUES ($1, $2, $3, $4)',
          [id, slot.start_time, slot.end_time, slot.max_capacity]
        );
      }
      for (const seasonal of seasonalPricing) {
        await client.query(
          'INSERT INTO seasonal_pricing (tour_id, start_date, end_date, adjustment_type, adjustment_value) VALUES ($1, $2, $3, $4, $5)',
          [id, seasonal.start_date, seasonal.end_date, seasonal.adjustment_type, seasonal.adjustment_value]
        );
      }
      for (const discount of groupDiscounts) {
        await client.query(
          'INSERT INTO group_size_discounts (tour_id, min_group_size, max_group_size, discount_type, discount_value) VALUES ($1, $2, $3, $4, $5)',
          [id, discount.min_group_size, discount.max_group_size, discount.discount_type, discount.discount_value]
        );
      }

      await client.query('COMMIT');
      res.status(200).json({ message: 'Tour pricing data saved successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error saving tour pricing data:', error);
    res.status(500).json({ message: 'Error saving tour pricing data' });
  }
});

// Admin: Get email delivery settings
router.get('/email-settings', async (req, res) => {
  try {
    const [settingsResult, quotaResult, statusResult] = await Promise.all([
      pool.query('SELECT value FROM site_settings WHERE key = $1', ['email_delivery_settings']),
      pool.query('SELECT value FROM site_settings WHERE key = $1', ['email_quota']),
      pool.query('SELECT value FROM site_settings WHERE key = $1', ['email_delivery_status']),
    ]);

    res.json({
      settings: settingsResult.rows[0]?.value ? JSON.parse(settingsResult.rows[0].value) : {},
      quota: quotaResult.rows[0]?.value ? JSON.parse(quotaResult.rows[0].value) : {},
      status: statusResult.rows[0]?.value ? JSON.parse(statusResult.rows[0].value) : {},
    });
  } catch (error) {
    console.error('Error fetching email settings:', error);
    res.status(500).json({ message: 'Error fetching email settings' });
  }
});

// Admin: Save email delivery settings
router.post('/email-settings', async (req, res) => {
  try {
    const { settings } = req.body;
    await pool.query(
      'INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()',
      ['email_delivery_settings', JSON.stringify(settings)]
    );
    res.status(200).json({ message: 'Email delivery settings saved successfully' });
  } catch (error) {
    console.error('Error saving email settings:', error);
    res.status(500).json({ message: 'Error saving email settings' });
  }
});

// Admin: Reset email quota
router.post('/email-settings/reset-quota', async (req, res) => {
  try {
    const { type, newQuota } = req.body;
    await pool.query(
      'INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()',
      ['email_quota', JSON.stringify(newQuota)]
    );
    res.status(200).json({ message: `Email quota ${type} reset successfully` });
  } catch (error) {
    console.error('Error resetting email quota:', error);
    res.status(500).json({ message: 'Error resetting email quota' });
  }
});

// Admin: Toggle email delivery status
router.put('/email-status/toggle', async (req, res) => {
  try {
    const { is_paused, pause_reason } = req.body;
    const newStatus = { is_paused, pause_reason };
    await pool.query(
      'INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()',
      ['email_delivery_status', JSON.stringify(newStatus)]
    );
    res.status(200).json(newStatus);
  } catch (error) {
    console.error('Error toggling email delivery status:', error);
    res.status(500).json({ message: 'Error toggling email delivery status' });
  }
});

export default router;
