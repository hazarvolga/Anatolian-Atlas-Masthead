import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// ... (other routes like dashboard, reservations, users, settings) ...

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
        const newTour = await prisma.tour.create({ data: req.body });
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
        const updatedTour = await prisma.tour.update({
            where: { id },
            data: req.body,
        });
        res.json(updatedTour);
    } catch (error) {
        console.error(`Error updating tour ${id}:`, error);
        res.status(500).json({ message: 'Error updating tour' });
    }
});

// DELETE /api/admin/tours/:id - Delete a tour
router.delete('/tours/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.tour.delete({ where: { id } });
        res.status(204).send(); // No content
    } catch (error) {
        console.error(`Error deleting tour ${id}:`, error);
        res.status(500).json({ message: 'Error deleting tour' });
    }
});

// GET /api/admin/tours/:id/pricing-data - Get pricing data for a specific tour
router.get('/tours/:id/pricing-data', async (req, res) => {
    const { id } = req.params;
    try {
        const pricingData = {}; // Placeholder
        res.json(pricingData);
    } catch (error) {
        console.error(`Error fetching pricing data for tour ${id}:`, error);
        res.status(500).json({ message: 'Error fetching pricing data' });
    }
});

// ... (other routes) ...

export default router;

