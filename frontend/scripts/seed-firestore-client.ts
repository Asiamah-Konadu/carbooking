/**
 * seed-firestore-client.ts (Firebase Web Client SDK)
 * --------------------------------------------------
 * Populates the Firestore database using the Client SDK.
 * Requires Firestore Security Rules to allow writes (e.g. Test Mode):
 *
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /{document=**} {
 *       allow read, write: if true;
 *     }
 *   }
 * }
 */

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  writeBatch,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnzUPneU1bcZUK0POYSpy7j0F48hdW1Hk",
  authDomain: "carbooking-ad206.firebaseapp.com",
  projectId: "carbooking-ad206",
  storageBucket: "carbooking-ad206.firebasestorage.app",
  messagingSenderId: "929502672873",
  appId: "1:929502672873:web:9f0767e664b7f5099d3d78",
  measurementId: "G-Y4XR524TV3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const now = () => Timestamp.now();

const USERS = [
  {
    id: "user_master_admin",
    email: "master@aether.com",
    displayName: "Aether Master Admin",
    firstName: "Aether",
    lastName: "Admin",
    role: "MASTER_ADMIN",
    status: "APPROVED",
    phoneNumber: null,
    avatarUrl: null,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "user_admin_01",
    email: "admin@booking.com",
    displayName: "Alex Admin",
    firstName: "Alex",
    lastName: "Admin",
    role: "ADMIN",
    status: "APPROVED",
    phoneNumber: null,
    avatarUrl: null,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "user_partner_01",
    email: "partner1@booking.com",
    displayName: "Jean Partner",
    firstName: "Jean",
    lastName: "Partner",
    role: "PARTNER",
    status: "APPROVED",
    phoneNumber: "+33 6 1234 5678",
    avatarUrl: null,
    businessName: "Prestige Hospitality Group",
    businessRegistrationNo: "FR-2018-112233",
    vatNumber: "FR82123456789",
    nationality: "French",
    idDocumentType: "Passport",
    idDocumentNumber: "FR9012345",
    submittedAt: now(),
    reviewedAt: now(),
    reviewedBy: "user_master_admin",
    reviewNotes: "All documents verified. Clean KYC record.",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "user_partner_02",
    email: "partner2@booking.com",
    displayName: "Marco Pending",
    firstName: "Marco",
    lastName: "Pending",
    role: "PARTNER",
    status: "PENDING",
    phoneNumber: "+39 333 123456",
    avatarUrl: null,
    businessName: "Venezia Luxe Rentals",
    businessRegistrationNo: "IT-2022-445566",
    vatNumber: "IT04478910277",
    nationality: "Italian",
    idDocumentType: "National ID",
    idDocumentNumber: "IT8877665",
    submittedAt: now(),
    reviewedAt: null,
    reviewedBy: null,
    reviewNotes: null,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "user_customer_01",
    email: "customer@booking.com",
    displayName: "Emily Customer",
    firstName: "Emily",
    lastName: "Customer",
    role: "CUSTOMER",
    status: "APPROVED",
    phoneNumber: "+1 555 123 4567",
    avatarUrl: null,
    createdAt: now(),
    updatedAt: now(),
  },
];

const LISTINGS = [
  {
    id: "listing_hotel_01",
    title: "Hotel Splendide Glassmorphic",
    description:
      "Experience pure architectural bliss inside Paris. Featuring premium design, floating glass balconies, and absolute luxury.",
    serviceType: "HOTEL",
    status: "APPROVED",
    address: "15 Rue de la Paix",
    city: "Paris",
    country: "France",
    latitude: 48.8689,
    longitude: 2.3302,
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800",
    ],
    ownerId: "user_partner_01",
    hotelDetails: {
      roomType: "Deluxe Penthouse Suite",
      amenities: ["WiFi", "Infinity Pool", "Champagne Bar", "24/7 Room Service", "Spa Access"],
      pricePerNight: 550.0,
      capacity: 2,
      totalRooms: 5,
    },
    carDetails: null,
    diningDetails: null,
    rating: 4.9,
    reviewCount: 128,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "listing_car_01",
    title: "Tesla Model S Plaid (Self-Drive)",
    description:
      "Zero emissions, near-zero friction. Rent this 1020-horsepower electric machine for a futuristic cruise in Southern California.",
    serviceType: "CAR_RENTAL",
    status: "APPROVED",
    address: "LAX Terminal 1",
    city: "Los Angeles",
    country: "USA",
    latitude: 33.9416,
    longitude: -118.4085,
    coverImage: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=800",
      "https://images.unsplash.com/photo-1536700503339-1e4b06520771?q=80&w=800",
    ],
    ownerId: "user_partner_01",
    hotelDetails: null,
    carDetails: {
      carType: "Tesla Model S Plaid",
      isRental: true,
      pricePerDay: 250.0,
      pricePerHour: null,
      capacity: 5,
      transmission: "Automatic",
      fuelType: "Electric",
      driverName: null,
      driverLicense: null,
    },
    diningDetails: null,
    rating: 4.8,
    reviewCount: 74,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "listing_driver_01",
    title: "Mercedes-Benz S-Class with Private Chauffeur",
    description:
      "Relax in the backseat. A professional multilingual chauffeur will pick you up and navigate the streets of Paris with executive comfort.",
    serviceType: "PRIVATE_DRIVER",
    status: "APPROVED",
    address: "Champs-Elysees",
    city: "Paris",
    country: "France",
    latitude: 48.8698,
    longitude: 2.3078,
    coverImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800",
    images: ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800"],
    ownerId: "user_partner_01",
    hotelDetails: null,
    carDetails: {
      carType: "Mercedes-Benz S500",
      isRental: false,
      pricePerHour: 95.0,
      pricePerDay: null,
      capacity: 4,
      transmission: "Automatic",
      fuelType: "Hybrid",
      driverName: "Jean-Pierre Laurent",
      driverLicense: "TX-90210-983",
    },
    diningDetails: null,
    rating: 5.0,
    reviewCount: 212,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "listing_restaurant_01",
    title: "L'Etoile Michelin Restaurant",
    description:
      "A botanical culinary flight. Discover curated tasting menus by executive chef Pierre Savoy in a sleek glasshouse environment.",
    serviceType: "RESTAURANT",
    status: "APPROVED",
    address: "4 Avenue Gustave Eiffel",
    city: "Paris",
    country: "France",
    latitude: 48.8584,
    longitude: 2.2945,
    coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800",
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800",
    ],
    ownerId: "user_partner_01",
    hotelDetails: null,
    carDetails: null,
    diningDetails: {
      cuisineType: "Modern French Fine Dining",
      averageCost: 240.0,
      availableSlots: ["12:00", "13:30", "18:00", "19:30", "21:00", "22:30"],
      seatingCapacity: 40,
    },
    rating: 4.7,
    reviewCount: 89,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "listing_hotel_pending_01",
    title: "Chateau Bordeaux Vineyard Estate",
    description:
      "Exclusive 18th-century chateau in Bordeaux with access to the wine cellars and private tastings. Currently awaiting administrator approval.",
    serviceType: "HOTEL",
    status: "PENDING",
    address: "Route des Chateaux",
    city: "Bordeaux",
    country: "France",
    latitude: 44.8378,
    longitude: -0.5792,
    coverImage: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800",
    images: ["https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800"],
    ownerId: "user_partner_01",
    hotelDetails: {
      roomType: "Vineyard Master Suite",
      amenities: ["WiFi", "Wine Tasting Tour", "Private Chef", "Helipad"],
      pricePerNight: 850.0,
      capacity: 4,
      totalRooms: 2,
    },
    carDetails: null,
    diningDetails: null,
    rating: null,
    reviewCount: 0,
    createdAt: now(),
    updatedAt: now(),
  },
];

const BOOKINGS = [
  {
    id: "booking_01",
    customerId: "user_customer_01",
    listingId: "listing_hotel_01",
    serviceType: "HOTEL",
    status: "CONFIRMED",
    checkIn: Timestamp.fromDate(new Date("2025-01-15")),
    checkOut: Timestamp.fromDate(new Date("2025-01-20")),
    guests: 2,
    totalPrice: 2750.0,
    currency: "EUR",
    specialRequests: "Late check-in after 22:00 please. Champagne welcome.",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "booking_02",
    customerId: "user_customer_01",
    listingId: "listing_car_01",
    serviceType: "CAR_RENTAL",
    status: "PENDING",
    pickupDate: Timestamp.fromDate(new Date("2025-02-10")),
    dropoffDate: Timestamp.fromDate(new Date("2025-02-13")),
    guests: 1,
    totalPrice: 750.0,
    currency: "USD",
    specialRequests: null,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "booking_03",
    customerId: "user_customer_01",
    listingId: "listing_restaurant_01",
    serviceType: "RESTAURANT",
    status: "CONFIRMED",
    reservationDate: Timestamp.fromDate(new Date("2025-01-22")),
    timeSlot: "19:30",
    guests: 4,
    totalPrice: 960.0,
    currency: "EUR",
    specialRequests: "Vegetarian option for one guest.",
    createdAt: now(),
    updatedAt: now(),
  },
];

const PLATFORM_CONFIG = {
  platformName: "Aether Booking",
  tagline: "Redefining Luxury Travel",
  primaryColor: "#00f0ff",
  accentColor: "#ffd700",
  defaultCurrency: "EUR",
  supportEmail: "support@aether.com",
  version: "3.0.0",
  maintenanceMode: false,
  masterAdminUid: "user_master_admin",
  partnerApplicationFeePercent: 10,
  updatedAt: now(),
};

async function seedFirestore() {
  console.log("\n==============================================");
  console.log("   Aether Booking - Firestore Client Seeder   ");
  console.log("==============================================\n");

  try {
    // 1. Users
    console.log(`[1/4] Writing ${USERS.length} users...`);
    const usersBatch = writeBatch(db);
    for (const user of USERS) {
      const { id, ...data } = user;
      usersBatch.set(doc(db, "users", id), data);
    }
    await usersBatch.commit();
    console.log(`      ✓ ${USERS.length} users committed\n`);

    // 2. Listings
    console.log(`[2/4] Writing ${LISTINGS.length} listings...`);
    const listingsBatch = writeBatch(db);
    for (const listing of LISTINGS) {
      const { id, ...data } = listing;
      listingsBatch.set(doc(db, "listings", id), data);
    }
    await listingsBatch.commit();
    console.log(`      ✓ ${LISTINGS.length} listings committed\n`);

    // 3. Bookings
    console.log(`[3/4] Writing ${BOOKINGS.length} bookings...`);
    const bookingsBatch = writeBatch(db);
    for (const booking of BOOKINGS) {
      const { id, ...data } = booking;
      bookingsBatch.set(doc(db, "bookings", id), data);
    }
    await bookingsBatch.commit();
    console.log(`      ✓ ${BOOKINGS.length} bookings committed\n`);

    // 4. Platform Config
    console.log("[4/4] Writing platform config...");
    const platformBatch = writeBatch(db);
    platformBatch.set(doc(db, "platform", "config"), PLATFORM_CONFIG);
    await platformBatch.commit();
    console.log("      ✓ Platform config committed\n");

    console.log("==============================================");
    console.log("  🎉 Firestore seeded successfully!           ");
    console.log("==============================================");
    console.log("Collections created:");
    console.log(`  • users     (${USERS.length} documents)`);
    console.log(`  • listings  (${LISTINGS.length} documents)`);
    console.log(`  • bookings  (${BOOKINGS.length} documents)`);
    console.log("  • platform  (1 config document)\n");

    process.exit(0);
  } catch (err: any) {
    console.error("\n❌ Seeding failed with error:");
    console.error(`Code: ${err.code}`);
    console.error(`Message: ${err.message}\n`);
    if (err.code === "permission-denied") {
      console.log("Tip: Your Firestore security rules are blocking writes.");
      console.log("To allow writes in development, update rules in Firebase Console:");
      console.log("https://console.firebase.google.com/project/carbooking-ad206/firestore/rules");
      console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
`);
    }
    process.exit(1);
  }
}

seedFirestore();
