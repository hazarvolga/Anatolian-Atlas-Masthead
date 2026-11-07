import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';

// Route imports
import authRoutes from './routes/auth.js';
import toursRoutes from './routes/tours.js';
import reservationsRoutes from './routes/reservations.js';
import destinationsRoutes from './routes/destinations.js';
import categoriesRoutes from './routes/categories.js';
import adminRoutes from './routes/admin.js';
import usersRoutes from './routes/users.js';
import reviewsRoutes from './routes/reviews.js'; // Import new reviews routes
import pagesRoutes from './routes/pages.js';

// Database connection
const prisma = new PrismaClient();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:3000',
    'http://localhost:5174' // Vite alternative port
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Test database connection
app.get('/health', async (req, res) => {
  try {
    // Use Prisma's built-in health check
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Public site settings (read-only)
app.get('/api/site-settings', async (req, res) => {
  try {
    const settings = await prisma.siteSettings.findFirst();
    res.json(settings?.value || {});
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch site settings' });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', toursRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/destinations', destinationsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reviews', reviewsRoutes); // Use new reviews routes
app.use('/api/pages', pagesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
