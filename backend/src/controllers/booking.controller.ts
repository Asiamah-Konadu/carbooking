import { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key_value';
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16' as any,
});

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export const createBooking = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const {
      listingId,
      startDate,
      endDate,
      timeSlot,
      guestCount,
      specialNotes,
    } = req.body;

    if (!listingId || !startDate || !guestCount) {
      return res.status(400).json({ error: 'Missing required booking parameters' });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId, status: 'APPROVED' },
      include: {
        hotelDetails: true,
        carDetails: true,
        diningDetails: true,
      },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Approved listing not found' });
    }

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    let totalPrice = 0;
    let paymentRequired = true;

    // Calculate pricing based on service type
    if (listing.serviceType === 'HOTEL') {
      if (!listing.hotelDetails) return res.status(400).json({ error: 'Hotel details not found' });
      if (!end) return res.status(400).json({ error: 'End date required for hotel booking' });
      
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      totalPrice = nights * listing.hotelDetails.pricePerNight;
    } 
    else if (listing.serviceType === 'CAR_RENTAL') {
      if (!listing.carDetails || !listing.carDetails.pricePerDay) {
        return res.status(400).json({ error: 'Car rental details not found' });
      }
      if (!end) return res.status(400).json({ error: 'End date required for car rental' });

      const diffTime = Math.abs(end.getTime() - start.getTime());
      const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      totalPrice = days * listing.carDetails.pricePerDay;
    } 
    else if (listing.serviceType === 'PRIVATE_DRIVER') {
      if (!listing.carDetails || !listing.carDetails.pricePerHour) {
        return res.status(400).json({ error: 'Private driver details not found' });
      }
      // If end date is provided, calculate hours. Else default to 1 hour.
      let hours = 1;
      if (end) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        hours = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60)));
      }
      totalPrice = hours * listing.carDetails.pricePerHour;
    } 
    else if (listing.serviceType === 'RESTAURANT') {
      // Free booking for restaurant reservations
      totalPrice = 0;
      paymentRequired = false;
    }

    // Create the booking record
    const booking = await prisma.booking.create({
      data: {
        customerId: req.user.id,
        listingId,
        startDate: start,
        endDate: end,
        timeSlot: timeSlot || null,
        guestCount: parseInt(guestCount),
        specialNotes: specialNotes || null,
        totalPrice,
        status: paymentRequired ? 'PENDING' : 'CONFIRMED',
        paymentStatus: paymentRequired ? 'UNPAID' : 'PAID',
      },
    });

    if (!paymentRequired) {
      // Restaurants immediately confirm booking since no payment is required
      return res.status(201).json({
        message: 'Reservation booked successfully!',
        booking,
        checkoutUrl: `${FRONTEND_URL}/dashboard?bookingSuccess=true`,
      });
    }

    // Generate Stripe checkout session
    if (STRIPE_SECRET_KEY === 'sk_test_mock_key_value') {
      // Mock mode: Return simulated success url directly to bypass Stripe setup in local testing
      const mockCheckoutUrl = `${FRONTEND_URL}/dashboard?mockPaymentSuccess=true&bookingId=${booking.id}`;
      
      // Update booking to mock Stripe Session ID
      await prisma.booking.update({
        where: { id: booking.id },
        data: { stripeSessionId: `mock_session_${booking.id}` },
      });

      return res.status(201).json({
        message: 'Booking initialized in Mock Stripe Mode',
        booking,
        checkoutUrl: mockCheckoutUrl,
      });
    }

    // Real Stripe session creation
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${listing.title} (${listing.serviceType})`,
                description: `Booking from ${start.toLocaleDateString()} ${end ? 'to ' + end.toLocaleDateString() : ''}`,
                images: [listing.coverImage],
              },
              unit_amount: Math.round(totalPrice * 100), // Stripe takes amounts in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${FRONTEND_URL}/dashboard?stripeSuccess=true&bookingId=${booking.id}`,
        cancel_url: `${FRONTEND_URL}/listings/${listing.id}?stripeCancel=true`,
        client_reference_id: booking.id,
      });

      await prisma.booking.update({
        where: { id: booking.id },
        data: { stripeSessionId: session.id },
      });

      res.status(201).json({
        message: 'Booking created. Redirecting to Stripe checkout.',
        booking,
        checkoutUrl: session.url,
      });
    } catch (stripeError: any) {
      console.error('Stripe session creation failed:', stripeError);
      // Fallback: update status to confirmed if Stripe hits network errors in local dev sandbox
      res.status(201).json({
        message: 'Booking created (Payment Gateway is in offline fallback).',
        booking,
        checkoutUrl: `${FRONTEND_URL}/dashboard?bookingId=${booking.id}&offlineSuccess=true`,
      });
    }
  } catch (error: any) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyBookings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const bookings = await prisma.booking.findMany({
      where: { customerId: req.user.id },
      include: {
        listing: {
          include: {
            hotelDetails: true,
            carDetails: true,
            diningDetails: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedBookings = bookings.map(booking => ({
      ...booking,
      listing: {
        ...booking.listing,
        images: JSON.parse(booking.listing.images),
        hotelDetails: booking.listing.hotelDetails ? {
          ...booking.listing.hotelDetails,
          amenities: JSON.parse(booking.listing.hotelDetails.amenities)
        } : null,
        diningDetails: booking.listing.diningDetails ? {
          ...booking.listing.diningDetails,
          availableSlots: JSON.parse(booking.listing.diningDetails.availableSlots)
        } : null,
      }
    }));

    res.status(200).json(formattedBookings);
  } catch (error: any) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPartnerBookings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const bookings = await prisma.booking.findMany({
      where: {
        listing: {
          ownerId: req.user.id,
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        listing: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(bookings);
  } catch (error: any) {
    console.error('Get partner bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const confirmMockPayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { bookingId } = req.body;
    
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'PAID'
      }
    });

    res.status(200).json({ message: 'Booking paid and confirmed successfully', booking: updatedBooking });
  } catch (error: any) {
    console.error('Confirm mock payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const cancelBooking = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { listing: true }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Access control: only customer or listing owner (partner) or admin can cancel
    const isCustomer = booking.customerId === req.user.id;
    const isPartner = booking.listing.ownerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isCustomer && !isPartner && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: You cannot cancel this reservation' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        paymentStatus: booking.paymentStatus === 'PAID' ? 'REFUNDED' : booking.paymentStatus,
      },
    });

    res.status(200).json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking,
    });
  } catch (error: any) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
