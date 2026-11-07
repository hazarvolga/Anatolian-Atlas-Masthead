import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const readText = (value) => String(value ?? '').trim();

// Public: message sent from the website contact form.
router.post('/', async (req, res) => {
  const name = readText(req.body?.name);
  const email = readText(req.body?.email).toLowerCase();
  const phone = readText(req.body?.phone) || null;
  const subject = readText(req.body?.subject);
  const message = readText(req.body?.message);
  const source = readText(req.body?.source).slice(0, 100) || 'contact-page';

  if (name.length < 2 || name.length > 120) {
    return res.status(400).json({ message: 'Name must be between 2 and 120 characters.' });
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 200) {
    return res.status(400).json({ message: 'A valid email address is required.' });
  }
  if (phone && phone.length > 40) {
    return res.status(400).json({ message: 'Phone number is too long.' });
  }
  if (subject.length < 2 || subject.length > 200) {
    return res.status(400).json({ message: 'Subject must be between 2 and 200 characters.' });
  }
  if (message.length < 10 || message.length > 5000) {
    return res.status(400).json({ message: 'Message must be between 10 and 5000 characters.' });
  }

  try {
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        source,
        ip_address: req.ip,
        user_agent: req.get('user-agent') || null,
      },
      select: { id: true, status: true, created_at: true },
    });

    res.status(201).json(contactMessage);
  } catch (error) {
    console.error('Failed to create contact message:', error);
    res.status(500).json({ message: 'Failed to send your message.' });
  }
});

export default router;