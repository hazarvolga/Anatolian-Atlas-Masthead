import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/reviews/tour/:tourId - Get all reviews for a specific tour
router.get('/tour/:tourId', async (req, res) => {
  const { tourId } = req.params;
  try {
    const reviews = await prisma.review.findMany({
      where: { tourId: tourId },
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            avatar_url: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    res.json(reviews);
  } catch (error) {
    console.error(`Failed to get reviews for tour ${tourId}:`, error);
    res.status(500).json({ message: 'Failed to retrieve reviews.' });
  }
});

// POST /api/reviews - Create a new review for a tour
router.post('/', authMiddleware, async (req, res) => {
  const { tourId, rating, comment } = req.body;

  if (!tourId || !rating) {
    return res.status(400).json({ message: 'Tour ID and rating are required.' });
  }

  try {
    // Optional: Check if the user has actually booked the tour before allowing a review
    const reservation = await prisma.reservation.findFirst({
      where: {
        tourId: tourId,
        userId: req.user.id,
        status: 'confirmed', // Only allow reviews for confirmed bookings
      },
    });

    if (!reservation) {
      return res.status(403).json({ message: 'You can only review tours you have booked.' });
    }

    const newReview = await prisma.review.create({
      data: {
        userId: req.user.id,
        tourId,
        rating,
        comment,
      },
    });
    res.status(201).json(newReview);
  } catch (error) {
    // Handle potential unique constraint violation if a user tries to review twice
    if (error.code === 'P2002') {
        return res.status(409).json({ message: 'You have already submitted a review for this tour.' });
    }
    console.error('Failed to create review:', error);
    res.status(500).json({ message: 'Failed to create review.' });
  }
});

export default router;
