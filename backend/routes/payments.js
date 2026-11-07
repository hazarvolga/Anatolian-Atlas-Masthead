import express from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

const CURRENCY = 'eur';
const DEPOSIT_RATE = 0.2;

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  return secretKey ? new Stripe(secretKey) : null;
};

const getFrontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:5173';

const toCents = (amount) => Math.round(Number(amount) * 100);

const getReservationId = (session) =>
  session.metadata?.reservationId || session.client_reference_id || null;

const sessionSummary = (session) => ({
  id: session.id,
  status: session.status,
  payment_status: session.payment_status,
  amount_total: session.amount_total,
  currency: session.currency,
  customer_email: session.customer_email,
});

const buildBooking = (reservation) => ({
  id: reservation.id,
  guest_name:
    [reservation.user?.first_name, reservation.user?.last_name].filter(Boolean).join(' ') || 'N/A',
  guest_email: reservation.user?.email || '',
  booking_date: reservation.reservationDate,
  adults: reservation.numAdults,
  children: reservation.numChildren,
  total_price: reservation.totalPrice,
  price_currency: reservation.priceCurrency,
  status: reservation.status,
});

const confirmPaidSession = async (session) => {
  if (session.payment_status !== 'paid') {
    return null;
  }

  const reservationId = getReservationId(session);
  if (!reservationId) {
    return null;
  }

  const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });
  if (!reservation || reservation.status === 'cancelled') {
    return null;
  }

  const amount = (session.amount_total ?? 0) / 100;

  await prisma.$transaction([
    prisma.payment.upsert({
      where: { reservationId },
      create: {
        reservationId,
        amount,
        currency: (session.currency || CURRENCY).toUpperCase(),
        status: 'succeeded',
        payment_method: 'stripe',
        transaction_id: session.id,
        provider_response: sessionSummary(session),
      },
      update: {
        amount,
        currency: (session.currency || CURRENCY).toUpperCase(),
        status: 'succeeded',
        payment_method: 'stripe',
        transaction_id: session.id,
        provider_response: sessionSummary(session),
      },
    }),
    prisma.reservation.update({
      where: { id: reservationId },
      data: { status: 'confirmed' },
    }),
  ]);

  return reservationId;
};

router.post('/create-checkout-session', authMiddleware, async (req, res) => {
  const { tourId, bookingDate, adults, children = 0, paymentType = 'full' } = req.body || {};

  const adultCount = Number(adults);
  const childCount = Number(children);
  const reservationDate = bookingDate ? new Date(bookingDate) : null;

  if (!tourId || !reservationDate || Number.isNaN(reservationDate.getTime())) {
    return res.status(400).json({ message: 'tourId and a valid bookingDate are required.' });
  }
  if (!Number.isInteger(adultCount) || adultCount < 1) {
    return res.status(400).json({ message: 'adults must be an integer of at least 1.' });
  }
  if (!Number.isInteger(childCount) || childCount < 0) {
    return res.status(400).json({ message: 'children must be a non-negative integer.' });
  }
  if (!['full', 'deposit'].includes(paymentType)) {
    return res.status(400).json({ message: 'paymentType must be "full" or "deposit".' });
  }

  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  if (reservationDate < startOfToday) {
    return res.status(400).json({ message: 'Reservation date cannot be in the past.' });
  }

  try {
    const tour = await prisma.tour.findFirst({
      where: { id: tourId, deleted_at: null },
    });

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found.' });
    }
    if (tour.status !== 'active') {
      return res.status(400).json({ message: 'This tour is not available for booking.' });
    }
    if (tour.max_participants && adultCount + childCount > tour.max_participants) {
      return res.status(400).json({ message: 'Guest count exceeds the tour capacity.' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    const adultPrice = Number(tour.price_adult) || 0;
    const childPrice = tour.price_child != null ? Number(tour.price_child) : adultPrice;
    const total = Math.round((adultPrice * adultCount + childPrice * childCount) * 100) / 100;
    const totalCents = toCents(total);

    if (totalCents < 50) {
      return res.status(400).json({ message: 'Total amount is below the minimum charge.' });
    }

    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({
        message: 'Stripe is not configured. Add STRIPE_SECRET_KEY to the backend environment.',
      });
    }

    const chargeCents = paymentType === 'deposit' ? Math.round(totalCents * DEPOSIT_RATE) : totalCents;

    const reservation = await prisma.reservation.create({
      data: {
        userId: req.user.id,
        tourId: tour.id,
        reservationDate,
        numAdults: adultCount,
        numChildren: childCount,
        totalPrice: total,
        priceCurrency: 'EUR',
        status: 'pending',
      },
    });

    const lineItems =
      paymentType === 'deposit'
        ? [
            {
              quantity: 1,
              price_data: {
                currency: CURRENCY,
                unit_amount: chargeCents,
                product_data: { name: `${tour.title} — 20% deposit` },
              },
            },
          ]
        : [
            {
              quantity: adultCount,
              price_data: {
                currency: CURRENCY,
                unit_amount: toCents(adultPrice),
                product_data: { name: `${tour.title} — Adult` },
              },
            },
            ...(childCount > 0
              ? [
                  {
                    quantity: childCount,
                    price_data: {
                      currency: CURRENCY,
                      unit_amount: toCents(childPrice),
                      product_data: { name: `${tour.title} — Child` },
                    },
                  },
                ]
              : []),
          ];

    let session;
    try {
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: lineItems,
        customer_email: user.email,
        client_reference_id: reservation.id,
        metadata: {
          reservationId: reservation.id,
          tourId: tour.id,
          paymentType,
        },
        success_url: `${getFrontendUrl()}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${getFrontendUrl()}/booking-cancel`,
      });
    } catch (error) {
      await prisma.reservation.update({
        where: { id: reservation.id },
        data: { status: 'cancelled' },
      });
      throw error;
    }

    await prisma.payment.create({
      data: {
        reservationId: reservation.id,
        amount: chargeCents / 100,
        currency: 'EUR',
        status: 'pending',
        payment_method: 'stripe',
        transaction_id: session.id,
      },
    });

    res.status(201).json({
      url: session.url,
      sessionId: session.id,
      reservationId: reservation.id,
    });
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    res.status(502).json({ message: 'Failed to create the payment session.' });
  }
});

router.post('/verify-session', authMiddleware, async (req, res) => {
  const { sessionId } = req.body || {};

  if (!sessionId) {
    return res.status(400).json({ message: 'sessionId is required.' });
  }

  const stripe = getStripe();
  if (!stripe) {
    return res.status(503).json({ message: 'Stripe is not configured.' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const reservationId = getReservationId(session);

    if (!reservationId) {
      return res.status(404).json({ message: 'Payment session is not linked to a reservation.' });
    }

    const reservation = await prisma.reservation.findFirst({
      where: { id: reservationId, userId: req.user.id },
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found.' });
    }

    const paid = session.payment_status === 'paid';
    if (paid) {
      await confirmPaidSession(session);
    }

    const updatedReservation = await prisma.reservation.findUnique({
      where: { id: reservation.id },
      include: { user: { select: { first_name: true, last_name: true, email: true } } },
    });

    res.json({
      success: paid,
      booking: buildBooking(updatedReservation),
    });
  } catch (error) {
    console.error('Failed to verify payment session:', error);
    res.status(502).json({ message: 'Failed to verify the payment session.' });
  }
});

router.post('/webhook', async (req, res) => {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return res.status(503).json({ message: 'Stripe webhook is not configured.' });
  }

  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, signature, webhookSecret);
  } catch (error) {
    console.error('Invalid Stripe webhook signature:', error.message);
    return res.status(400).json({ message: `Webhook Error: ${error.message}` });
  }

  try {
    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      await confirmPaidSession(event.data.object);
    } else if (event.type === 'checkout.session.expired') {
      const reservationId = getReservationId(event.data.object);
      if (reservationId) {
        await prisma.$transaction([
          prisma.payment.updateMany({
            where: { reservationId, status: 'pending' },
            data: { status: 'failed' },
          }),
          prisma.reservation.updateMany({
            where: { id: reservationId, status: 'pending' },
            data: { status: 'cancelled' },
          }),
        ]);
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Failed to process Stripe webhook:', error);
    res.status(500).json({ message: 'Failed to process webhook event.' });
  }
});

export default router;
