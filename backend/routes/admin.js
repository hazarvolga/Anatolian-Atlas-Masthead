import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// GET /api/admin/dashboard - Get dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [userCount, tourCount, reservationCount, revenue] = await prisma.$transaction([
      prisma.user.count({ where: { role: 'user' } }),
      prisma.tour.count({ where: { status: 'active' } }),
      prisma.reservation.count({ where: { status: { not: 'cancelled' } } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'succeeded' },
      }),
    ]);

    res.json({
      users: userCount,
      tours: tourCount,
      reservations: reservationCount,
      revenue: revenue._sum.amount || 0,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});

// GET /api/admin/reservations - Get all reservations
router.get('/reservations', async (req, res) => {
    const { limit = 10, offset = 0, status } = req.query;
    try {
        const reservations = await prisma.reservation.findMany({
            where: {
                status: status ? status : undefined
            },
            include: {
                tour: { select: { title: true } },
                user: { select: { first_name: true, last_name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit),
            skip: parseInt(offset)
        });
        res.json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ message: 'Error fetching reservations' });
    }
});

// GET /api/admin/tours - Get all tours for admin view
router.get('/tours', async (req, res) => {
    try {
        const tours = await prisma.tour.findMany({
            include: {
                destination: { select: { name: true } },
                _count: { select: { reservations: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        const formattedTours = tours.map(({_count, ...tour}) => ({...tour, reservation_count: _count.reservations}));
        res.json(formattedTours);
    } catch (error) {
        console.error('Error fetching admin tours:', error);
        res.status(500).json({ message: 'Error fetching admin tours' });
    }
});

// GET /api/admin/users - Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, first_name: true, last_name: true, email: true, role: true, createdAt: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// PUT /api/admin/users/:id/role - Update a user's role
router.put('/users/:id/role', async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, role: true }
        });
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Error updating user role' });
    }
});

// GET /api/admin/settings/site - Get site settings
router.get('/settings/site', async (req, res) => {
    try {
        const siteSettings = await prisma.siteSettings.findFirst({
            orderBy: { createdAt: 'desc' }
        });
        res.json(siteSettings || {});
    } catch (error) {
        console.error('Error fetching site settings:', error);
        res.status(500).json({ message: 'Error fetching site settings' });
    }
});

// POST /api/admin/settings/site - Save site settings
router.post('/settings/site', async (req, res) => {
    try {
        const settingsData = req.body;
        const existingSettings = await prisma.siteSettings.findFirst();
        let savedSettings;
        if (existingSettings) {
            savedSettings = await prisma.siteSettings.update({
                where: { id: existingSettings.id },
                data: settingsData,
            });
        } else {
            savedSettings = await prisma.siteSettings.create({
                data: settingsData,
            });
        }
        res.status(200).json({ message: 'Site settings saved successfully', settings: savedSettings });
    } catch (error) {
        console.error('Error saving site settings:', error);
        res.status(500).json({ message: 'Error saving site settings' });
    }
});

export default router;

