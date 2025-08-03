import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

// Apply authentication and admin middleware to all routes in this file
router.use(authMiddleware);
router.use(adminMiddleware);

// --- DASHBOARD --- //
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

// --- TOUR MANAGEMENT --- //
router.get('/tours', async (req, res) => {
    try {
        const tours = await prisma.tour.findMany({
            include: {
                destination: { select: { name: true } },
                _count: { select: { reservations: true } }
            },
            orderBy: { created_at: 'desc' } 
        });
        const formattedTours = tours.map(({_count, destination, ...tour}) => ({
            ...tour,
            destination_name: destination ? destination.name : 'N/A',
            reservation_count: _count.reservations
        }));
        res.json(formattedTours);
    } catch (error) {
        console.error('Error fetching admin tours:', error);
        res.status(500).json({ message: 'Error fetching admin tours' });
    }
});

router.post('/tours', async (req, res) => {
    try {
        const { title, slug, description, category_id, destination_id, status, duration_hours, max_participants, price_adult } = req.body;
        const newTour = await prisma.tour.create({ 
            data: { title, slug, description, category_id, destination_id, status, duration_hours, max_participants, price_adult }
        });
        res.status(201).json(newTour);
    } catch (error) {
        console.error('Error creating tour:', error);
        res.status(500).json({ message: 'Error creating tour' });
    }
});

router.put('/tours/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { 
            title, slug, description, short_description, category_id, destination_id, 
            guide_id, status, duration_hours, max_participants, min_participants, 
            price_adult, price_child, price_currency, difficulty_level, age_limit, 
            featured, includes, excludes, requirements, cancellation_policy, 
            images, metadata, seo_title, seo_description 
        } = req.body;

        const dataToUpdate = { 
            title, slug, description, short_description, category_id, destination_id, 
            guide_id, status, duration_hours, max_participants, min_participants, 
            price_adult, price_child, price_currency, difficulty_level, age_limit, 
            featured, includes, excludes, requirements, cancellation_policy, 
            images, metadata, seo_title, seo_description 
        };

        await prisma.tour.update({ where: { id }, data: dataToUpdate });

        const updatedTour = await prisma.tour.findUnique({
            where: { id },
            include: {
                destination: { select: { name: true } },
                _count: { select: { reservations: true } }
            }
        });

        const formattedTour = {
            ...updatedTour,
            destination_name: updatedTour.destination ? updatedTour.destination.name : 'N/A',
            reservation_count: updatedTour._count.reservations
        };

        res.json(formattedTour);
    } catch (error) {
        console.error(`Error updating tour ${id}:`, error);
        res.status(500).json({ message: 'Error updating tour' });
    }
});

router.delete('/tours/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.$transaction(async (tx) => {
            await tx.review.deleteMany({ where: { tourId: id } });
            const reservations = await tx.reservation.findMany({ where: { tourId: id }, select: { id: true } });
            const reservationIds = reservations.map(r => r.id);
            if (reservationIds.length > 0) {
                await tx.payment.deleteMany({ where: { reservationId: { in: reservationIds } } });
                await tx.reservation.deleteMany({ where: { id: { in: reservationIds } } });
            }
            await tx.tour.delete({ where: { id } });
        });
        res.status(204).send();
    } catch (error) {
        console.error(`Error deleting tour ${id}:`, error);
        res.status(500).json({ message: 'Error deleting tour' });
    }
});

// --- USER MANAGEMENT --- //
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        reservations: {
          select: {
            id: true,
            total_price: true,
          }
        },
        reviews: {
          select: {
            id: true,
          }
        },
        user_roles: {
          include: {
            role: true,
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      email_verified: user.email_verified,
      image: user.image,
      created_at: user.created_at,
      role: user.user_roles[0]?.role?.name || 'user',
      total_spent: user.reservations.reduce((acc, r) => acc + (r.total_price || 0), 0),
      reservation_count: user.reservations.length,
      review_count: user.reviews.length,
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

router.put('/users/:id/role', adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { roleName } = req.body; // e.g., 'admin', 'guide'

    if (!roleName) {
        return res.status(400).json({ message: 'Role name is required' });
    }

    try {
        const role = await prisma.role.findUnique({ where: { name: roleName } });
        if (!role) {
            return res.status(404).json({ message: `Role '${roleName}' not found` });
        }

        // Find if a user_role entry exists
        const userRole = await prisma.user_role.findFirst({
            where: { user_id: id },
        });

        if (userRole) {
            // Update existing role
            await prisma.user_role.update({
                where: { id: userRole.id },
                data: { role_id: role.id },
            });
        } else {
            // Create new role assignment
            await prisma.user_role.create({
                data: {
                    user_id: id,
                    role_id: role.id,
                },
            });
        }
        
        res.json({ message: `User role updated to ${roleName}` });
    } catch (error) {
        console.error(`Error updating user role for ${id}:`, error);
        res.status(500).json({ message: 'Error updating user role' });
    }
});


// --- SITE SETTINGS --- //
router.get('/site-settings', adminMiddleware, async (req, res) => {
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      // If no settings exist, create a default entry
      const defaultSettings = await prisma.siteSettings.create({
        data: {
          site_title: 'NextStopTurkey',
          // Add other default values as needed
        },
      });
      return res.json(defaultSettings);
    }
    res.json(settings);
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    res.status(500).json({ message: 'Failed to fetch site settings', error: error.message });
  }
});

router.put('/site-settings', adminMiddleware, async (req, res) => {
  const settingsData = req.body;
  try {
    const currentSettings = await prisma.siteSettings.findFirst();
    if (!currentSettings) {
        return res.status(404).json({ message: 'Site settings not found. Cannot update.' });
    }
    
    const updatedSettings = await prisma.siteSettings.update({
      where: { id: currentSettings.id },
      data: settingsData,
    });
    res.json(updatedSettings);
  } catch (error) {
    console.error('Failed to update site settings:', error);
    res.status(500).json({ message: 'Failed to update site settings', error: error.message });
  }
});


export default router;