import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Ghana Luxury Platform database...');

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
      email: 'admin@booking.com.gh',
      passwordHash: adminPasswordHash,
      firstName: 'Alex',
      lastName: 'Admin',
      role: 'ADMIN',
      status: 'APPROVED',
      phoneNumber: '+233 24 000 0001',
    },
  });

  const approvedPartner = await prisma.user.create({
    data: {
      email: 'partner1@asante-fleets.com.gh',
      passwordHash: partnerPasswordHash,
      firstName: 'Kwame',
      lastName: 'Asante',
      role: 'PARTNER',
      status: 'APPROVED',
      phoneNumber: '+233 24 456 7890',
    },
  });

  const pendingPartner = await prisma.user.create({
    data: {
      email: 'partner2@mensah-hotels.com.gh',
      passwordHash: partnerPasswordHash,
      firstName: 'Akosua',
      lastName: 'Mensah',
      role: 'PARTNER',
      status: 'PENDING',
      phoneNumber: '+233 20 890 1234',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@traveler.com.gh',
      passwordHash: customerPasswordHash,
      firstName: 'Kofi',
      lastName: 'Boateng',
      role: 'CUSTOMER',
      status: 'APPROVED',
      phoneNumber: '+233 55 123 4567',
    },
  });

  console.log('Users created:', {
    admin: admin.email,
    approvedPartner: approvedPartner.email,
    pendingPartner: pendingPartner.email,
    customer: customer.email,
  });

  // 4. Create APPROVED Listings (by approvedPartner)
  
  // Hotel Listing 1: Kempinski Hotel Gold Coast City Accra
  const kempinski = await prisma.listing.create({
    data: {
      title: 'Kempinski Hotel Gold Coast City Accra',
      description: 'Accra’s crowning 5-star hotel in the downtown diplomatic enclave. Unparalleled luxury suites, 25-meter infinity pool, Resense Spa, and VIP executive lounge access.',
      serviceType: 'HOTEL',
      status: 'APPROVED',
      address: 'Gammal Abdul Nasser Ave, Ministries',
      city: 'Accra',
      country: 'Ghana',
      latitude: 5.5502,
      longitude: -0.1985,
      coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000'
      ]),
      ownerId: approvedPartner.id,
      hotelDetails: {
        create: {
          roomType: 'Diplomatic Executive Suite',
          amenities: JSON.stringify(['High-Speed WiFi', 'Resort Infinity Pool', 'Kempinski Spa Access', '24/7 Butler Service', 'Airport Chauffeur Included', 'Executive Lounge Bar']),
          pricePerNight: 3500.0,
          capacity: 2,
          totalRooms: 8,
        },
      },
    },
  });

  // Car Rental 1: Toyota Land Cruiser V8 (Self-Drive / Escort)
  const landCruiser = await prisma.listing.create({
    data: {
      title: 'Toyota Land Cruiser V8 4.5D (Executive 4x4)',
      description: 'Ghana’s undisputed king of the road. Unrivaled road presence, bulletproof 4WD capability, perforated leather seating, privacy glass, and dual rear climate control.',
      serviceType: 'CAR_RENTAL',
      status: 'APPROVED',
      address: 'Airport Residential Area',
      city: 'Accra',
      country: 'Ghana',
      latitude: 5.6037,
      longitude: -0.1768,
      coverImage: 'https://images.unsplash.com/photo-1594976912810-8800cbe6085a?q=80&w=1000',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1594976912810-8800cbe6085a?q=80&w=1000',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000'
      ]),
      ownerId: approvedPartner.id,
      carDetails: {
        create: {
          carType: 'Toyota Land Cruiser V8',
          isRental: true,
          pricePerDay: 2800.0,
          capacity: 7,
          transmission: 'Automatic 4WD',
          fuelType: 'Diesel V8',
        },
      },
    },
  });

  // Private Driver: BMW X5 xDrive40i Chauffeur
  const bmwX5 = await prisma.listing.create({
    data: {
      title: 'BMW X5 xDrive40i (Private Executive Chauffeur)',
      description: 'Glide through Accra, Cantonments and Airport Hills in supreme Bavarian comfort. Includes a professional multilingual chauffeur, intelligent xDrive AWD, and bottled mineral refreshments.',
      serviceType: 'PRIVATE_DRIVER',
      status: 'APPROVED',
      address: 'Cantonments Embassy Road',
      city: 'Accra',
      country: 'Ghana',
      latitude: 5.5801,
      longitude: -0.1702,
      coverImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000'
      ]),
      ownerId: approvedPartner.id,
      carDetails: {
        create: {
          carType: 'BMW X5 xDrive40i',
          isRental: false,
          driverName: 'Kofi Mensah',
          driverLicense: 'DVLA-GH-2024-00812',
          pricePerHour: 350.0,
          capacity: 4,
          transmission: 'Automatic xDrive',
          fuelType: 'TwinPower Petrol',
        },
      },
    },
  });

  // Car Rental 2: Mercedes-Benz GLE 450
  const mercGLE = await prisma.listing.create({
    data: {
      title: 'Mercedes-Benz GLE 450 AMG Line (4MATIC)',
      description: 'The preferred luxury SUV for corporate leaders and high-net-worth travelers in Ghana. Panoramic sunroof, Burmester 3D Surround Sound, and air suspension.',
      serviceType: 'CAR_RENTAL',
      status: 'APPROVED',
      address: 'Airport City High Street',
      city: 'Accra',
      country: 'Ghana',
      latitude: 5.6022,
      longitude: -0.1714,
      coverImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=1000'
      ]),
      ownerId: approvedPartner.id,
      carDetails: {
        create: {
          carType: 'Mercedes-Benz GLE 450',
          isRental: true,
          pricePerDay: 2600.0,
          capacity: 5,
          transmission: '9G-TRONIC 4MATIC',
          fuelType: 'Mild Hybrid',
        },
      },
    },
  });

  // Car Rental 3: Toyota Vitz / Yaris
  const toyotaVitz = await prisma.listing.create({
    data: {
      title: 'Toyota Vitz / Yaris (Urban City Executive)',
      description: 'Ghana’s beloved urban favorite. Agile, ultra fuel-efficient, ice-cold air conditioning, and Bluetooth audio. Ideal for swift city meetings across Osu and East Legon.',
      serviceType: 'CAR_RENTAL',
      status: 'APPROVED',
      address: 'Lagos Avenue, East Legon',
      city: 'Accra',
      country: 'Ghana',
      latitude: 5.6375,
      longitude: -0.1601,
      coverImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000'
      ]),
      ownerId: approvedPartner.id,
      carDetails: {
        create: {
          carType: 'Toyota Vitz (Yaris)',
          isRental: true,
          pricePerDay: 650.0,
          capacity: 5,
          transmission: 'Automatic',
          fuelType: 'Petrol',
        },
      },
    },
  });

  // Restaurant: The Buka Restaurant & Lounge
  const restaurantListing = await prisma.listing.create({
    data: {
      title: 'The Buka Restaurant & Lounge',
      description: 'Accra’s premier upscale destination for authentic Ghanaian gastronomy and West African delicacies. Fresh charcoal-grilled tilapia, seasoned jollof rice, kelewele, and premium palm wine cocktails.',
      serviceType: 'RESTAURANT',
      status: 'APPROVED',
      address: '10th Street, Osu',
      city: 'Accra',
      country: 'Ghana',
      latitude: 5.5562,
      longitude: -0.1832,
      coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000',
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000'
      ]),
      ownerId: approvedPartner.id,
      diningDetails: {
        create: {
          cuisineType: 'Modern Ghanaian & West African Fine Dining',
          averageCost: 550.0,
          availableSlots: JSON.stringify(['12:00', '13:30', '18:00', '19:30', '21:00', '22:30']),
          seatingCapacity: 60,
        },
      },
    },
  });

  // Hotel Listing 2: Labadi Beach Hotel
  const labadi = await prisma.listing.create({
    data: {
      title: 'Labadi Beach Hotel & Ocean Landscapes',
      description: 'Ghana’s premier 5-star beachfront resort set amidst tropical landscaped gardens and ocean breezes. Lagoon-style swimming pool, tennis courts, and private beach cabanas.',
      serviceType: 'HOTEL',
      status: 'APPROVED',
      address: '1 La Bypass, Trade Fair',
      city: 'Accra',
      country: 'Ghana',
      latitude: 5.5684,
      longitude: -0.1448,
      coverImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1000'
      ]),
      ownerId: approvedPartner.id,
      hotelDetails: {
        create: {
          roomType: 'Ocean View Superior Suite',
          amenities: JSON.stringify(['Private Beachfront', 'Lagoon Pool', 'Spa & Wellness', 'Tennis Courts', 'Free WiFi', 'Akwaaba Breakfast Buffet']),
          pricePerNight: 2800.0,
          capacity: 2,
          totalRooms: 12,
        },
      },
    },
  });

  // 5. Create a PENDING Listing: The Royal Senchi Resort & Hotel Landscapes
  const pendingListing = await prisma.listing.create({
    data: {
      title: 'The Royal Senchi Resort & Riverfront Landscapes',
      description: 'Exclusive 4-star luxury resort nestled along the serene Volta River. Traditional thatched architecture, riverfront infinity pool, helipad, and private luxury boat cruises.',
      serviceType: 'HOTEL',
      status: 'PENDING',
      address: 'Senchi Ferry Road',
      city: 'Akosombo',
      country: 'Ghana',
      latitude: 6.2238,
      longitude: 0.0886,
      coverImage: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=1000',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=1000'
      ]),
      ownerId: approvedPartner.id,
      hotelDetails: {
        create: {
          roomType: 'Riverview Executive Villa',
          amenities: JSON.stringify(['WiFi', 'Volta River Boat Cruise', 'Tennis Court', 'Spa & Sauna', 'Helipad Access']),
          pricePerNight: 2900.0,
          capacity: 4,
          totalRooms: 4,
        },
      },
    },
  });

  console.log('Ghana Listings seeded successfully:', {
    hotel1: kempinski.title,
    hotel2: labadi.title,
    car1: landCruiser.title,
    car2: bmwX5.title,
    car3: mercGLE.title,
    car4: toyotaVitz.title,
    restaurant: restaurantListing.title,
    pendingHotel: pendingListing.title,
  });

  console.log('Ghana luxury database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
