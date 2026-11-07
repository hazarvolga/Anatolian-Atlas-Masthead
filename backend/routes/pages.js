import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Public: only published pages are exposed.
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const page = await prisma.page.findFirst({
      where: {
        status: 'published',
        ...(UUID_PATTERN.test(slug) ? { OR: [{ slug }, { id: slug }] } : { slug }),
      },
    });

    if (!page) {
      return res.status(404).json({ message: 'Page not found.' });
    }

    res.json({
      ...page,
      sections: Array.isArray(page.content) ? page.content : [],
    });
  } catch (error) {
    console.error('Failed to get page:', error);
    res.status(500).json({ message: 'Failed to retrieve page.' });
  }
});

export default router;
