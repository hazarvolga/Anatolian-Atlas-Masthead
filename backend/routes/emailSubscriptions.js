import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

const SUBSCRIPTION_TYPES = ['transactional', 'marketing', 'newsletter', 'promotional'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOKEN_TTL = '7d';

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();
const getTokenSecret = () => process.env.EMAIL_TOKEN_SECRET || process.env.JWT_SECRET;
const buildToken = (email, type, purpose) =>
  jwt.sign({ email, type: type || null, purpose }, getTokenSecret(), { expiresIn: TOKEN_TTL });

const readToken = (token, purpose) => {
  const payload = jwt.verify(token, getTokenSecret());
  if (payload.purpose !== purpose || typeof payload.email !== 'string') {
    throw new Error('Invalid token purpose');
  }
  return payload;
};

const canManageEmail = async (req, email) => {
  if (req.user.role === 'admin') return true;
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { email: true },
  });
  return normalizeEmail(user?.email) === email;
};

// Public: consent lookup used by the client-side email service.
// Returns null when the email has no record so callers can fall back to defaults.
router.get('/:email/:type', async (req, res) => {
  const email = normalizeEmail(req.params.email);
  const { type } = req.params;

  if (!EMAIL_PATTERN.test(email) || !SUBSCRIPTION_TYPES.includes(type)) {
    return res.status(400).json({ message: 'Invalid email or subscription type.' });
  }

  try {
    const subscription = await prisma.emailSubscription.findUnique({
      where: { email_subscription_type: { email, subscription_type: type } },
      select: {
        email: true,
        subscription_type: true,
        is_subscribed: true,
        double_optin_confirmed: true,
      },
    });
    res.json(subscription ?? null);
  } catch (error) {
    console.error('Failed to get email subscription:', error);
    res.status(500).json({ message: 'Failed to retrieve email subscription.' });
  }
});

// Authenticated owner or admin: all consent records for an email.
router.get('/:email', authMiddleware, async (req, res) => {
  const email = normalizeEmail(req.params.email);

  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }

  try {
    if (!(await canManageEmail(req, email))) {
      return res.status(403).json({ message: 'You can only access your own email subscriptions.' });
    }

    const subscriptions = await prisma.emailSubscription.findMany({
      where: { email },
      orderBy: { subscription_type: 'asc' },
    });
    res.json(subscriptions);
  } catch (error) {
    console.error('Failed to list email subscriptions:', error);
    res.status(500).json({ message: 'Failed to retrieve email subscriptions.' });
  }
});

// Authenticated owner or admin: update a consent record.
router.put('/:email/:type', authMiddleware, async (req, res) => {
  const email = normalizeEmail(req.params.email);
  const { type } = req.params;
  const { is_subscribed: isSubscribed, source } = req.body;

  if (!EMAIL_PATTERN.test(email) || !SUBSCRIPTION_TYPES.includes(type)) {
    return res.status(400).json({ message: 'Invalid email or subscription type.' });
  }
  if (typeof isSubscribed !== 'boolean') {
    return res.status(400).json({ message: 'is_subscribed must be a boolean.' });
  }
  if (type === 'transactional' && !isSubscribed) {
    return res.status(400).json({ message: 'Transactional emails cannot be disabled.' });
  }

  try {
    if (!(await canManageEmail(req, email))) {
      return res.status(403).json({ message: 'You can only change your own email subscriptions.' });
    }

    const subscription = await prisma.emailSubscription.upsert({
      where: { email_subscription_type: { email, subscription_type: type } },
      update: {
        is_subscribed: isSubscribed,
        double_optin_confirmed: isSubscribed,
        consent_given_at: isSubscribed ? new Date() : undefined,
        ...(source ? { source } : {}),
      },
      create: {
        email,
        subscription_type: type,
        is_subscribed: isSubscribed,
        double_optin_confirmed: isSubscribed,
        source: source || 'manual',
      },
    });

    res.json(subscription);
  } catch (error) {
    console.error('Failed to update email subscription:', error);
    res.status(500).json({ message: 'Failed to update email subscription.' });
  }
});

// Authenticated owner or admin: mint a signed unsubscribe link token.
router.post('/:email/token', authMiddleware, async (req, res) => {
  const email = normalizeEmail(req.params.email);
  const { subscriptionType } = req.body;

  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }
  if (subscriptionType && !SUBSCRIPTION_TYPES.includes(subscriptionType)) {
    return res.status(400).json({ message: 'Invalid subscription type.' });
  }

  try {
    if (!(await canManageEmail(req, email))) {
      return res.status(403).json({ message: 'You can only manage your own email subscriptions.' });
    }

    res.json({ token: buildToken(email, subscriptionType, 'unsubscribe') });
  } catch (error) {
    console.error('Failed to create unsubscribe token:', error);
    res.status(500).json({ message: 'Failed to create unsubscribe token.' });
  }
});

// Public: one-click unsubscribe from a signed email link.
router.post('/unsubscribe', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Missing unsubscribe token.' });
  }

  let payload;
  try {
    payload = readToken(token, 'unsubscribe');
  } catch {
    return res.status(400).json({ message: 'Invalid or expired unsubscribe link.' });
  }

  const email = normalizeEmail(payload.email);

  try {
    if (payload.type) {
      const subscription = await prisma.emailSubscription.findUnique({
        where: { email_subscription_type: { email, subscription_type: payload.type } },
      });

      if (!subscription) {
        return res.status(404).json({ message: 'Subscription not found.' });
      }

      const updated = await prisma.emailSubscription.update({
        where: { id: subscription.id },
        data: { is_subscribed: false, double_optin_confirmed: false },
      });
      return res.json(updated);
    }

    // Without a type, opt out of every optional list while keeping transactional mail.
    const result = await prisma.emailSubscription.updateMany({
      where: { email, subscription_type: { not: 'transactional' } },
      data: { is_subscribed: false, double_optin_confirmed: false },
    });

    if (result.count === 0) {
      return res.status(404).json({ message: 'Subscription not found.' });
    }

    res.json({ email, updated: result.count });
  } catch (error) {
    console.error('Failed to unsubscribe:', error);
    res.status(500).json({ message: 'Failed to unsubscribe.' });
  }
});

// Public: double opt-in confirmation from a signed email link.
router.post('/confirm', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Missing confirmation token.' });
  }

  let payload;
  try {
    payload = readToken(token, 'confirm');
  } catch {
    return res.status(400).json({ message: 'Invalid or expired confirmation link.' });
  }

  if (!payload.type || payload.type === 'transactional') {
    return res.status(400).json({ message: 'Invalid confirmation token.' });
  }

  const email = normalizeEmail(payload.email);

  try {
    const subscription = await prisma.emailSubscription.findUnique({
      where: { email_subscription_type: { email, subscription_type: payload.type } },
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found.' });
    }

    const updated = await prisma.emailSubscription.update({
      where: { id: subscription.id },
      data: { is_subscribed: true, double_optin_confirmed: true, consent_given_at: new Date() },
    });

    res.json(updated);
  } catch (error) {
    console.error('Failed to confirm subscription:', error);
    res.status(500).json({ message: 'Failed to confirm subscription.' });
  }
});

// Authenticated owner or admin: mint a double opt-in token.
// Exposed now so signup/newsletter flows can send the link once SMTP is wired.
router.post('/:email/confirm-token', authMiddleware, async (req, res) => {
  const email = normalizeEmail(req.params.email);
  const { subscriptionType } = req.body;

  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }
  if (!subscriptionType || !SUBSCRIPTION_TYPES.includes(subscriptionType) || subscriptionType === 'transactional') {
    return res.status(400).json({ message: 'A non-transactional subscription type is required.' });
  }

  try {
    if (!(await canManageEmail(req, email))) {
      return res.status(403).json({ message: 'You can only manage your own email subscriptions.' });
    }

    res.json({ token: buildToken(email, subscriptionType, 'confirm') });
  } catch (error) {
    console.error('Failed to create confirmation token:', error);
    res.status(500).json({ message: 'Failed to create confirmation token.' });
  }
});

export default router;
