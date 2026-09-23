import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getListings = async (req: Request, res: Response) => {
  try {
    const { serviceType, city, country, search } = req.query;

    const whereClause: any = {
      status: 'APPROVED', // Public search only shows approved listings
    };

    if (serviceType) {
      whereClause.serviceType = serviceType as string;
    }
    if (city) {
      whereClause.city = { contains: city as string };
    }
    if (country) {
      whereClause.country = { contains: country as string };
    }
    if (search) {
      whereClause.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    const listings = await prisma.listing.findMany({
      where: whereClause,
      include: {
        hotelDetails: true,
        carDetails: true,
        diningDetails: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Parse serialized string fields back to arrays
    const formattedListings = listings.map(listing => ({
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
    console.error('Get listings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyListings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const listings = await prisma.listing.findMany({
      where: { ownerId: req.user.id },
      include: {
        hotelDetails: true,
        carDetails: true,
        diningDetails: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedListings = listings.map(listing => ({
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
    console.error('Get my listings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getListingById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        hotelDetails: true,
        carDetails: true,
        diningDetails: true,
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Access control: if listing is not approved, only owner or admin can view it
    if (listing.status !== 'APPROVED') {
      const isOwner = req.user && req.user.id === listing.ownerId;
      const isAdmin = req.user && req.user.role === 'ADMIN';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: 'Forbidden: Listing is awaiting approval' });
      }
    }

    const formattedListing = {
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
    };

    res.status(200).json(formattedListing);
  } catch (error: any) {
    console.error('Get listing by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createListing = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const {
      title,
      description,
      serviceType,
      address,
      city,
      country,
      latitude,
      longitude,
      coverImage,
      images, // array of strings
      
      // Service specific parameters
      hotel,
      car,
      dining,
    } = req.body;

    if (!title || !description || !serviceType || !address || !city || !country || !coverImage) {
      return res.status(400).json({ error: 'Missing core listing fields' });
    }

    // Setup listing structure
    const imagesJson = JSON.stringify(images || []);
    
    // Create transaction
    const listing = await prisma.$transaction(async (tx) => {
      const newListing = await tx.listing.create({
        data: {
          title,
          description,
          serviceType,
          status: 'PENDING', // All self-service listings default to pending
          address,
          city,
          country,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          coverImage,
          images: imagesJson,
          ownerId: req.user!.id,
        },
      });

      if (serviceType === 'HOTEL') {
        if (!hotel || !hotel.roomType || !hotel.pricePerNight || !hotel.capacity || !hotel.totalRooms) {
          throw new Error('Missing hotel-specific details');
        }
        await tx.hotelDetails.create({
          data: {
            listingId: newListing.id,
            roomType: hotel.roomType,
            amenities: JSON.stringify(hotel.amenities || []),
            pricePerNight: parseFloat(hotel.pricePerNight),
            capacity: parseInt(hotel.capacity),
            totalRooms: parseInt(hotel.totalRooms),
          },
        });
      } else if (serviceType === 'CAR_RENTAL' || serviceType === 'PRIVATE_DRIVER') {
        if (!car || !car.carType || !car.capacity) {
          throw new Error('Missing car-specific details');
        }
        const isRental = serviceType === 'CAR_RENTAL';
        await tx.carDetails.create({
          data: {
            listingId: newListing.id,
            carType: car.carType,
            isRental,
            driverName: car.driverName || null,
            driverLicense: car.driverLicense || null,
            pricePerDay: car.pricePerDay ? parseFloat(car.pricePerDay) : null,
            pricePerHour: car.pricePerHour ? parseFloat(car.pricePerHour) : null,
            capacity: parseInt(car.capacity),
            transmission: car.transmission || null,
            fuelType: car.fuelType || null,
          },
        });
      } else if (serviceType === 'RESTAURANT') {
        if (!dining || !dining.cuisineType || !dining.averageCost || !dining.availableSlots || !dining.seatingCapacity) {
          throw new Error('Missing dining-specific details');
        }
        await tx.diningDetails.create({
          data: {
            listingId: newListing.id,
            cuisineType: dining.cuisineType,
            averageCost: parseFloat(dining.averageCost),
            availableSlots: JSON.stringify(dining.availableSlots || []),
            seatingCapacity: parseInt(dining.seatingCapacity),
          },
        });
      }

      return newListing;
    });

    res.status(201).json({
      message: 'Listing uploaded successfully. It is currently PENDING review and admin approval before going public.',
      listingId: listing.id,
    });
  } catch (error: any) {
    console.error('Create listing error:', error);
    res.status(400).json({ error: error.message || 'Error creating listing' });
  }
};

export const updateListing = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params;

    const existingListing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!existingListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Check ownership
    if (existingListing.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: You do not own this listing' });
    }

    const {
      title,
      description,
      address,
      city,
      country,
      latitude,
      longitude,
      coverImage,
      images,
      hotel,
      car,
      dining,
    } = req.body;

    await prisma.$transaction(async (tx) => {
      // Update core listing details. Reset status to PENDING upon update.
      await tx.listing.update({
        where: { id },
        data: {
          title,
          description,
          address,
          city,
          country,
          latitude: latitude ? parseFloat(latitude) : undefined,
          longitude: longitude ? parseFloat(longitude) : undefined,
          coverImage,
          images: images ? JSON.stringify(images) : undefined,
          status: 'PENDING', // Reset approval on listing changes
        },
      });

      if (existingListing.serviceType === 'HOTEL' && hotel) {
        await tx.hotelDetails.update({
          where: { listingId: id },
          data: {
            roomType: hotel.roomType,
            amenities: hotel.amenities ? JSON.stringify(hotel.amenities) : undefined,
            pricePerNight: hotel.pricePerNight ? parseFloat(hotel.pricePerNight) : undefined,
            capacity: hotel.capacity ? parseInt(hotel.capacity) : undefined,
            totalRooms: hotel.totalRooms ? parseInt(hotel.totalRooms) : undefined,
          },
        });
      } else if ((existingListing.serviceType === 'CAR_RENTAL' || existingListing.serviceType === 'PRIVATE_DRIVER') && car) {
        await tx.carDetails.update({
          where: { listingId: id },
          data: {
            carType: car.carType,
            driverName: car.driverName,
            driverLicense: car.driverLicense,
            pricePerDay: car.pricePerDay ? parseFloat(car.pricePerDay) : undefined,
            pricePerHour: car.pricePerHour ? parseFloat(car.pricePerHour) : undefined,
            capacity: car.capacity ? parseInt(car.capacity) : undefined,
            transmission: car.transmission,
            fuelType: car.fuelType,
          },
        });
      } else if (existingListing.serviceType === 'RESTAURANT' && dining) {
        await tx.diningDetails.update({
          where: { listingId: id },
          data: {
            cuisineType: dining.cuisineType,
            averageCost: dining.averageCost ? parseFloat(dining.averageCost) : undefined,
            availableSlots: dining.availableSlots ? JSON.stringify(dining.availableSlots) : undefined,
            seatingCapacity: dining.seatingCapacity ? parseInt(dining.seatingCapacity) : undefined,
          },
        });
      }
    });

    res.status(200).json({
      message: 'Listing updated successfully. It has been reset to PENDING and will require approval again.',
    });
  } catch (error: any) {
    console.error('Update listing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteListing = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params;

    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: You do not own this listing' });
    }

    await prisma.listing.delete({ where: { id } });

    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error: any) {
    console.error('Delete listing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
