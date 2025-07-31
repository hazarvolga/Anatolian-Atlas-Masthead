import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

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
            orderBy: { created_at: 'desc' },
            take: parseInt(limit),
            skip: parseInt(offset)
        });
        res.json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ message: 'Error fetching reservations' });
    }
});

// GET /api/admin/users - Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, first_name: true, last_name: true, email: true, role: true, created_at: true },
            orderBy: { created_at: 'desc' }
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
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

// POST /api/admin/tours - Create a new tour
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

// PUT /api/admin/tours/:id - Update an existing tour
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

        // Re-fetch the updated tour with relations to send back the correct format
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

// DELETE /api/admin/tours/:id - Delete a tour and its related data
router.delete('/tours/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Use a transaction to ensure all or nothing is deleted
        await prisma.$transaction(async (tx) => {
            // Delete related reviews
            await tx.review.deleteMany({ where: { tourId: id } });
            
            // Find related reservations to delete their payments
            const reservations = await tx.reservation.findMany({ where: { tourId: id }, select: { id: true } });
            const reservationIds = reservations.map(r => r.id);

            if (reservationIds.length > 0) {
                // Delete related payments
                await tx.payment.deleteMany({ where: { reservationId: { in: reservationIds } } });
                // Delete related reservations
                await tx.reservation.deleteMany({ where: { id: { in: reservationIds } } });
            }

            // Finally, delete the tour itself
            await tx.tour.delete({ where: { id } });
        });

        res.status(204).send(); // No content, successful deletion
    } catch (error) {
        console.error(`Error deleting tour ${id}:`, error);
        res.status(500).json({ message: 'Error deleting tour' });
    }
});

export default router;


