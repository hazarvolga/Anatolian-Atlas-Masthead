import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentication failed: No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database to ensure they exist and are active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, is_active: true },
    });

    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Authentication failed: User not found or inactive.' });
    }

    // Attach the validated user information to the request object
    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.name);
    res.status(401).json({ message: 'Authentication failed: Invalid token.' });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admin access required.' });
  }
};
