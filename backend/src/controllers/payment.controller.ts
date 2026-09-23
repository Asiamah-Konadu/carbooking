import { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../prisma/client';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key_value';
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16' as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  let event: Stripe.Event;

  if (!sig || !endpointSecret) {
    return res.status(400).send('Webhook Error: Missing signature or webhook secret');
  }

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.client_reference_id;

    if (bookingId) {
      try {
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: 'CONFIRMED',
            paymentStatus: 'PAID',
          },
        });
        console.log(`Booking ${bookingId} successfully confirmed via Stripe webhook.`);
      } catch (error) {
        console.error(`Error updating booking ${bookingId} on webhook:`, error);
      }
    }
  }

  res.json({ received: true });
};
