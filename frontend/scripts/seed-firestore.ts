/**
 * seed-firestore.ts  (Admin SDK version)
 * ----------------------------------------
 * Populates the Firestore database with initial platform data.
 *
 * Setup:
 *   1. Go to Firebase Console → Project Settings → Service Accounts
 *   2. Click "Generate new private key" → save as:
 *        frontend/scripts/serviceAccountKey.json
 *   3. Run:  npm run seed
 *
 * Collections seeded:
 *   - users      (5 docs)
 *   - listings   (5 docs)
 *   - bookings   (3 docs)
 *   - platform   (1 config doc)
 */

import { initializeApp, cert, getApps, getApp, App } from "firebase-admin/app";
import { getFirestore, Timestamp, WriteBatch } from "firebase-admin/firestore";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

// ── Resolve service account ───────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const keyPath = path.join(__dirname, "serviceAccountKey.json");

if (!fs.existsSync(keyPath)) {
  console.error(`
  ERROR: Service account key not found at:
    ${keyPath}

  To fix this:
    1. Open https://console.firebase.google.com/project/carbooking-ad206/settings/serviceaccounts/adminsdk
    2. Click "Generate new private key"
    3. Save the downloaded JSON as:
         frontend/scripts/serviceAccountKey.json
    4. Run: npm run seed
`);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf-8"));

// ── Initialize Admin app ──────────────────────────────────────────────────────
const adminApp: App = !getApps().length
  ? initializeApp({ credential: cert(serviceAccount) })
  : getApp();

const db = getFirestore(adminApp);

// ── Helpers ───────────────────────────────────────────────────────────────────
const now = () => Timestamp.now();

// ── Seed Data ─────────────────────────────────────────────────────────────────

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

// ── Seed Runner ───────────────────────────────────────────────────────────────
async function seedFirestore() {
  console.log("\n======================================");
  console.log("   Aether Booking - Firestore Seed   ");
  console.log("======================================\n");

  // Users
  console.log(`[1/4] Writing ${USERS.length} users...`);
  const usersBatch: WriteBatch = db.batch();
  for (const user of USERS) {
    const { id, ...data } = user;
    usersBatch.set(db.collection("users").doc(id), data);
  }
  await usersBatch.commit();
  console.log(`      Done - ${USERS.length} users written\n`);

  // Listings
  console.log(`[2/4] Writing ${LISTINGS.length} listings...`);
  const listingsBatch: WriteBatch = db.batch();
  for (const listing of LISTINGS) {
    const { id, ...data } = listing;
    listingsBatch.set(db.collection("listings").doc(id), data);
  }
  await listingsBatch.commit();
  console.log(`      Done - ${LISTINGS.length} listings written\n`);

  // Bookings
  console.log(`[3/4] Writing ${BOOKINGS.length} bookings...`);
  const bookingsBatch: WriteBatch = db.batch();
  for (const booking of BOOKINGS) {
    const { id, ...data } = booking;
    bookingsBatch.set(db.collection("bookings").doc(id), data);
  }
  await bookingsBatch.commit();
  console.log(`      Done - ${BOOKINGS.length} bookings written\n`);

  // Platform config
  console.log("[4/4] Writing platform config...");
  await db.collection("platform").doc("config").set(PLATFORM_CONFIG);
  console.log("      Done - platform config written\n");

  console.log("======================================");
  console.log("  Firestore seeded successfully!");
  console.log("======================================");
  console.log("");
  console.log("Collections:");
  console.log(`  users     -> ${USERS.length} docs`);
  console.log(`  listings  -> ${LISTINGS.length} docs`);
  console.log(`  bookings  -> ${BOOKINGS.length} docs`);
  console.log("  platform  -> 1 doc (config)");
  console.log("");
  process.exit(0);
}

seedFirestore().catch((err) => {
  console.error("\nSeed failed:", err.message || err);
  process.exit(1);
});
