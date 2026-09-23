import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load Environment Variables
dotenv.config();

import { register, login, getMe } from './controllers/auth.controller';
import { 
  getListings, 
  getMyListings, 
  getListingById, 
  createListing, 
  updateListing, 
  deleteListing 
} from './controllers/listing.controller';
import { 
  createBooking, 
  getMyBookings, 
  getPartnerBookings, 
  cancelBooking,
  confirmMockPayment
} from './controllers/booking.controller';
import { 
  getPendingPartners, 
  approvePartner, 
  getPendingListings, 
  approveListing 
} from './controllers/admin.controller';
import { handleStripeWebhook } from './controllers/payment.controller';
import { authenticateJWT, requireRole, requireApprovedPartner } from './middleware/auth.middleware';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Stripe webhook route needs raw body for signature verification.
// We declare it BEFORE express.json() middleware.
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);

// Standard JSON middleware for other endpoints
app.use(express.json());

// Public Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// ==========================================
// Authentication Routes
// ==========================================
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', authenticateJWT, getMe);

// ==========================================
// Listing Routes (Public, Partner, Admin)
// ==========================================
app.get('/api/listings', getListings);
app.get('/api/listings/my-listings', authenticateJWT, requireRole(['PARTNER', 'ADMIN']), getMyListings);
app.get('/api/listings/:id', getListingById);
app.post('/api/listings', authenticateJWT, requireRole(['PARTNER', 'ADMIN']), requireApprovedPartner, createListing);
app.put('/api/listings/:id', authenticateJWT, requireRole(['PARTNER', 'ADMIN']), requireApprovedPartner, updateListing);
app.delete('/api/listings/:id', authenticateJWT, requireRole(['PARTNER', 'ADMIN']), deleteListing);

// ==========================================
// Booking Routes (Customer & Partner)
// ==========================================
app.post('/api/bookings', authenticateJWT, requireRole(['CUSTOMER']), createBooking);
app.get('/api/bookings/my-bookings', authenticateJWT, requireRole(['CUSTOMER', 'ADMIN']), getMyBookings);
app.get('/api/bookings/partner-bookings', authenticateJWT, requireRole(['PARTNER', 'ADMIN']), getPartnerBookings);
app.post('/api/bookings/:id/cancel', authenticateJWT, cancelBooking);
app.post('/api/bookings/confirm-mock-payment', authenticateJWT, confirmMockPayment);

// ==========================================
// Admin & Approval Routes (Admin Only)
// ==========================================
app.get('/api/admin/pending-partners', authenticateJWT, requireRole(['ADMIN']), getPendingPartners);
app.put('/api/admin/partners/:id/approve', authenticateJWT, requireRole(['ADMIN']), approvePartner);
app.get('/api/admin/pending-listings', authenticateJWT, requireRole(['ADMIN']), getPendingListings);
app.put('/api/admin/listings/:id/approve', authenticateJWT, requireRole(['ADMIN']), approveListing);

// Start Express Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
