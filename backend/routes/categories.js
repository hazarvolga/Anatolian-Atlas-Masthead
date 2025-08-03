import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/categories - Get all categories with their tour counts
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { is_active: true },
      include: {
        _count: { 
          select: { tours: { where: { status: 'active' } } },
        },
      },
      orderBy: [
        { sort_order: 'asc' },
        { name: 'asc' },
      ],
    });

    // Rename _count.tours to tour_count to match frontend expectations
    const formattedCategories = categories.map(({ _count, ...category }) => ({
      ...category,
      tour_count: _count.tours,
    }));

    res.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// GET /api/categories/:id - Get a single category with its active tours
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findFirst({
      where: {
        AND: [
          { is_active: true },
          {
            OR: [
              { id: id },
              { slug: id },
            ],
          },
        ],
      },
      include: {
        tours: {
          where: { status: 'active' },
          include: {
            destination: { select: { name: true, slug: true } },
          },
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Error fetching category' });
  }
});

export default router;
