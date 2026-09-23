import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const getPendingPartners = async (req: Request, res: Response) => {
  try {
    const pendingPartners = await prisma.user.findMany({
      where: {
        role: 'PARTNER',
        status: 'PENDING',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(pendingPartners);
  } catch (error: any) {
    console.error('Get pending partners error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const approvePartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'APPROVED' or 'REJECTED'

    if (status !== 'APPROVED' && status !== 'REJECTED') {
      return res.status(400).json({ error: 'Invalid status. Must be APPROVED or REJECTED.' });
    }

    const partner = await prisma.user.findUnique({ where: { id } });
    if (!partner || partner.role !== 'PARTNER') {
      return res.status(404).json({ error: 'Partner account not found' });
    }

    const updatedPartner = await prisma.user.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
      },
    });

    res.status(200).json({
      message: `Partner account status successfully updated to ${status}`,
      partner: updatedPartner,
    });
  } catch (error: any) {
    console.error('Approve partner error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPendingListings = async (req: Request, res: Response) => {
  try {
    const pendingListings = await prisma.listing.findMany({
      where: { status: 'PENDING' },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        hotelDetails: true,
        carDetails: true,
        diningDetails: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Parse JSON string fields back to arrays
    const formattedListings = pendingListings.map(listing => ({
      ...listing,
      images: JSON.parse(listing.images),
      hotelDetails: listing.hotelDetails ? {
        ...listing.hotelDetails,
        amenities: JSON.parse(listing.hotelDetails.amenities)
      } : null,
      diningDetails: listing.diningDetails ? {
        ...listing.diningDetails,
        availableSlots: JSON.parse(listing.diningDetails.availableSlots)
      } : null,
    }));

    res.status(200).json(formattedListings);
  } catch (error: any) {
    console.error('Get pending listings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const approveListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'APPROVED' or 'REJECTED'

    if (status !== 'APPROVED' && status !== 'REJECTED') {
      return res.status(400).json({ error: 'Invalid status. Must be APPROVED or REJECTED.' });
    }

    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({
      message: `Listing status successfully updated to ${status}`,
      listing: {
        id: updatedListing.id,
        title: updatedListing.title,
        status: updatedListing.status,
      },
    });
  } catch (error: any) {
    console.error('Approve listing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
