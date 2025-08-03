import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/tours - Get all active tours with filtering
router.get('/', async (req, res) => {
  const { limit = 10, offset = 0, destination, category } = req.query;

  try {
    const tours = await prisma.tour.findMany({
      where: {
        status: 'active',
        destination: destination ? { slug: destination } : undefined,
        category: category ? { slug: category } : undefined,
      },
      include: {
        destination: {
          select: { name: true, slug: true },
        },
        category: {
          select: { name: true, slug: true },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { created_at: 'desc' },
      ],
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    // Also get the total count for pagination
    const totalTours = await prisma.tour.count({
        where: {
            status: 'active',
            destination: destination ? { slug: destination } : undefined,
            category: category ? { slug: category } : undefined,
        }
    });

    // Map backend difficulty levels (integers) to frontend strings
    const getDifficultyString = (level) => {
        switch (level) {
            case 1: return 'easy';
            case 2: return 'moderate';
            case 3: return 'challenging';
            default: return null;
        }
    };

    // Format tours for frontend consumption
    const formattedTours = tours.map(tour => ({
        ...tour,
        difficulty: getDifficultyString(tour.difficulty_level),
    }));

    res.json({ 
        tours: formattedTours,
        total: totalTours,
        limit: parseInt(limit),
        offset: parseInt(offset)
     });

  } catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({ message: 'Error fetching tours' });
  }
});

// GET /api/tours/:id - Get a single tour by its ID or slug
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await prisma.tour.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id },
        ],
        status: 'active',
      },
      include: {
        destination: true,
        category: true,
        guide: {
          select: { first_name: true, last_name: true, avatar_url: true },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { first_name: true, last_name: true, avatar_url: true } },
          },
        },
      },
    });

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Map backend difficulty level (integer) to frontend string
    const getDifficultyString = (level) => {
        switch (level) {
            case 1: return 'easy';
            case 2: return 'moderate';
            case 3: return 'challenging';
            default: return null;
        }
    };

    // Format tour for frontend consumption
    const formattedTour = {
        ...tour,
        difficulty: getDifficultyString(tour.difficulty_level),
    };

    res.json(formattedTour);
  } catch (error) {
    console.error('Error fetching tour:', error);
    res.status(500).json({ message: 'Error fetching tour' });
  }
});

export default router;
