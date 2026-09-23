import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clean old database entries
  await prisma.review.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.hotelDetails.deleteMany({});
  await prisma.carDetails.deleteMany({});
  await prisma.diningDetails.deleteMany({});
  await prisma.listing.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Passwords
  const adminPasswordHash = await bcrypt.hash('adminpassword', 10);
  const partnerPasswordHash = await bcrypt.hash('partnerpassword', 10);
  const customerPasswordHash = await bcrypt.hash('customerpassword', 10);

  // 3. Create Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@booking.com',
      passwordHash: adminPasswordHash,
      firstName: 'Alex',
      lastName: 'Admin',
      role: 'ADMIN',
      status: 'APPROVED',
    },
  });

  const approvedPartner = await prisma.user.create({
    data: {
      email: 'partner1@booking.com',
      passwordHash: partnerPasswordHash,
      firstName: 'Jean',
      lastName: 'Partner',
      role: 'PARTNER',
      status: 'APPROVED',
      phoneNumber: '+33 6 1234 5678',
    },
  });

  const pendingPartner = await prisma.user.create({
    data: {
      email: 'partner2@booking.com',
      passwordHash: partnerPasswordHash,
      firstName: 'Marco',
      lastName: 'Pending',
      role: 'PARTNER',
      status: 'PENDING',
      phoneNumber: '+39 333 123456',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@booking.com',
      passwordHash: customerPasswordHash,
      firstName: 'Emily',
      lastName: 'Customer',
      role: 'CUSTOMER',
      status: 'APPROVED',
      phoneNumber: '+1 555 123 4567',
    },
  });

  console.log('Users created:', {
    admin: admin.email,
    approvedPartner: approvedPartner.email,
    pendingPartner: pendingPartner.email,
    customer: customer.email,
  });

  // 4. Create APPROVED Listings (by approvedPartner)
  
  // Hotel Listing
  const hotelListing = await prisma.listing.create({
    data: {
      title: 'Hôtel Splendide Glassmorphic',
      description: 'Experience pure architectural bliss inside Paris. Featuring premium design, floating glass balconies, and absolute luxury.',
      serviceType: 'HOTEL',
      status: 'APPROVED',
      address: '15 Rue de la Paix',
      city: 'Paris',
      country: 'France',
      latitude: 48.8689,
      longitude: 2.3302,
      coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800'
      ]),
      ownerId: approvedPartner.id,
      hotelDetails: {
        create: {
          roomType: 'Deluxe Penthouse Suite',
          amenities: JSON.stringify(['WiFi', 'Infinity Pool', 'Champagne Bar', '24/7 Room Service', 'Spa Access']),
          pricePerNight: 550.0,
          capacity: 2,
          totalRooms: 5,
        },
      },
    },
  });

  // Car Rental Listing
  const carRentalListing = await prisma.listing.create({
    data: {
      title: 'Tesla Model S Plaid (Self-Drive)',
      description: 'Zero emissions, near-zero friction. Rent this 1020-horsepower electric machine for a futuristic cruise in Southern California.',
      serviceType: 'CAR_RENTAL',
      status: 'APPROVED',
      address: 'LAX Terminal 1',
      city: 'Los Angeles',
      country: 'USA',
      latitude: 33.9416,
      longitude: -118.4085,
      coverImage: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=800',
        'https://images.unsplash.com/photo-1536700503339-1e4b06520771?q=80&w=800'
      ]),
      ownerId: approvedPartner.id,
      carDetails: {
        create: {
          carType: 'Tesla Model S Plaid',
          isRental: true,
          pricePerDay: 250.0,
          capacity: 5,
          transmission: 'Automatic',
          fuelType: 'Electric',
        },
      },
    },
  });

  // Private Driver Listing
  const privateDriverListing = await prisma.listing.create({
    data: {
      title: 'Mercedes-Benz S-Class with Private Chauffeur',
      description: 'Relax in the backseat. A professional multilingual chauffeur will pick you up and navigate the streets of Paris with executive comfort.',
      serviceType: 'PRIVATE_DRIVER',
      status: 'APPROVED',
      address: 'Champs-Élysées',
      city: 'Paris',
      country: 'France',
      latitude: 48.8698,
      longitude: 2.3078,
      coverImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800'
      ]),
      ownerId: approvedPartner.id,
      carDetails: {
        create: {
          carType: 'Mercedes-Benz S500',
          isRental: false,
          driverName: 'Jean-Pierre Laurent',
          driverLicense: 'TX-90210-983',
          pricePerHour: 95.0,
          capacity: 4,
          transmission: 'Automatic',
          fuelType: 'Hybrid',
        },
      },
    },
  });

  // Restaurant Listing
  const restaurantListing = await prisma.listing.create({
    data: {
      title: 'L’Étoile Michelin Restaurant',
      description: 'A botanical culinary flight. Discover curated tasting menus by executive chef Pierre Savoy in a sleek glasshouse environment.',
      serviceType: 'RESTAURANT',
      status: 'APPROVED',
      address: '4 Avenue Gustave Eiffel',
      city: 'Paris',
      country: 'France',
      latitude: 48.8584,
      longitude: 2.2945,
      coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800',
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800'
      ]),
      ownerId: approvedPartner.id,
      diningDetails: {
        create: {
          cuisineType: 'Modern French Fine Dining',
          averageCost: 240.0,
          availableSlots: JSON.stringify(['12:00', '13:30', '18:00', '19:30', '21:00', '22:30']),
          seatingCapacity: 40,
        },
      },
    },
  });

  // 5. Create a PENDING Listing (for approval workflow testing)
  const pendingListing = await prisma.listing.create({
    data: {
      title: 'Chateau Bordeaux Vineyard Estate',
      description: 'Exclusive 18th-century chateau in Bordeaux with access to the wine cellars and private tastings. Currently awaiting administrator approval.',
      serviceType: 'HOTEL',
      status: 'PENDING',
      address: 'Route des Châteaux',
      city: 'Bordeaux',
      country: 'France',
      latitude: 44.8378,
      longitude: -0.5792,
      coverImage: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800'
      ]),
      ownerId: approvedPartner.id,
      hotelDetails: {
        create: {
          roomType: 'Vineyard Master Suite',
          amenities: JSON.stringify(['WiFi', 'Wine Tasting Tour', 'Private Chef', 'Helipad']),
          pricePerNight: 850.0,
          capacity: 4,
          totalRooms: 2,
        },
      },
    },
  });

  console.log('Listings seeded successfully:', {
    hotel: hotelListing.title,
    carRental: carRentalListing.title,
    privateDriver: privateDriverListing.title,
    restaurant: restaurantListing.title,
    pendingHotel: pendingListing.title,
  });

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
