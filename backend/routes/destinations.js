import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/destinations - Get all destinations with their tour counts
router.get('/', async (req, res) => {
  try {
    const destinations = await prisma.destination.findMany({
      include: {
        _count: { // Use Prisma's built-in count aggregation
          select: { tours: { where: { status: 'active' } } },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { name: 'asc' },
      ],
    });

    // Rename _count.tours to tour_count to match frontend expectations
    const formattedDestinations = destinations.map(({ _count, ...dest }) => ({
      ...dest,
      tour_count: _count.tours,
    }));

    res.json(formattedDestinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ message: 'Error fetching destinations' });
  }
});

// GET /api/destinations/:id - Get a single destination with its active tours
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const destination = await prisma.destination.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id },
        ],
      },
      include: {
        tours: {
          where: { status: 'active' },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.json(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({ message: 'Error fetching destination' });
  }
});

export default router;
