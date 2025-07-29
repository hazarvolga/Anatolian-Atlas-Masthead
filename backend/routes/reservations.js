import express from 'express';
import { pool } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Create reservation and payment session
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      tourId,
      bookingDate,
      adults,
      children,
      totalPrice,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
    } = req.body;

    // 1. Create reservation in database
    const reservationResult = await pool.query(`
      INSERT INTO reservations (
        user_id, tour_id, booking_date, adults, children, total_price, contact_email, guest_name, payment_status, contact_phone, special_requests
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9, $10)
      RETURNING *
    `, [req.user.id, tourId, bookingDate, adults, children, totalPrice, guestEmail, guestName, guestPhone, specialRequests]);

    const reservation = reservationResult.rows[0];

    // 2. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Reservation for tour ${tourId}`,
            },
            unit_amount: totalPrice * 100, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/booking-cancel`,
      metadata: {
        reservation_id: reservation.id,
      },
    });

    res.status(201).json({ sessionId: session.id });

  } catch (error) {
    console.error('Error creating reservation and payment session:', error);
    res.status(500).json({ message: 'Error creating reservation' });
  }
});

// Get user's reservations
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, t.title as tour_title, t.image_url as tour_image, 
             d.name as destination_name, d.country
      FROM reservations r
      JOIN tours t ON r.tour_id = t.id
      LEFT JOIN destinations d ON t.destination_id = d.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `, [req.user.userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Error fetching reservations' });
  }
});

// Get single reservation
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT r.*, t.title as tour_title, t.description as tour_description,
             t.image_url as tour_image, d.name as destination_name, d.country
      FROM reservations r
      JOIN tours t ON r.tour_id = t.id
      LEFT JOIN destinations d ON t.destination_id = d.id
      WHERE r.id = $1 AND r.user_id = $2
    `, [id, req.user.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({ message: 'Error fetching reservation' });
  }
});

// Update reservation status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query('UPDATE reservations SET booking_status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [status, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating reservation status:', error);
    res.status(500).json({ message: 'Error updating reservation status' });
  }
});

export default router;
