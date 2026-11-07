import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js'; // Assuming you have auth middleware

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/reservations - Get all reservations for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId: req.user.id },
      include: {
        tour: {
          select: {
            title: true,
            slug: true,
            images: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    res.json(reservations);
  } catch (error) {
    console.error('Failed to get reservations:', error);
    res.status(500).json({ message: 'Failed to retrieve reservations.' });
  }
});

// POST /api/reservations - Create a new reservation
router.post('/', authMiddleware, async (req, res) => {
  const {
    tourId,
    reservationDate,
    bookingDate,
    numAdults,
    adults,
    numChildren,
    children,
    totalPrice,
    total_price,
    notes,
  } = req.body;

  const dateInput = reservationDate || bookingDate;
  const reservationDateValue = dateInput ? new Date(dateInput) : null;
  const adultCount = Number(numAdults ?? adults);
  const childCount = Number(numChildren ?? children ?? 0);
  const price = Number(totalPrice ?? total_price ?? 0);

  if (
    !tourId ||
    !reservationDateValue ||
    Number.isNaN(reservationDateValue.getTime()) ||
    !Number.isFinite(adultCount) ||
    adultCount < 1
  ) {
    return res.status(400).json({ message: 'Missing or invalid required fields for reservation.' });
  }

  try {
    const newReservation = await prisma.reservation.create({
      data: {
        userId: req.user.id,
        tourId,
        reservationDate: reservationDateValue,
        numAdults: adultCount,
        numChildren: Number.isFinite(childCount) ? childCount : 0,
        totalPrice: Number.isFinite(price) ? price : 0,
        status: 'pending', // Default status
        notes,
      },
    });
    res.status(201).json(newReservation);
  } catch (error) {
    console.error('Failed to create reservation:', error);
    res.status(500).json({ message: 'Failed to create reservation.' });
  }
});

// GET /api/reservations/:id - Get a single reservation by ID
router.get('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await prisma.reservation.findFirst({
      where: {
        id: id,
        userId: req.user.id, // Ensure users can only access their own reservations
      },
      include: {
        tour: true, // Include all tour details
        payment: true, // Include payment details
        user: { select: { first_name: true, last_name: true, email: true } },
      },
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found.' });
    }

    res.json(reservation);
  } catch (error) {
    console.error('Failed to get reservation:', error);
    res.status(500).json({ message: 'Failed to retrieve reservation.' });
  }
});

export default router;
