
const INITIAL_PARTNER_SEED = [
  {
    id: 'usr-3',
    firstName: 'Marco',
    lastName: 'Rossi',
    email: 'partner2@booking.com',
    role: 'PARTNER',
    status: 'PENDING',
    createdAt: '2026-09-21T14:30:00Z',
    application: {
      companyName: 'Rossi Supercars & Riva Yachting Group Ltd.',
      registrationNumber: 'MC-984420-VAT',
      taxId: 'MC-TX-88219',
      incorporationCountry: 'Monaco',
      city: 'Monaco',
      address: 'Quai Antoine 1er, Port Hercule, 98000 Monaco',
      phone: '+377 98 98 22 00',
      website: 'https://rossi-marine.mc',
      category: 'Supercars, Yachts & Private Drivers',
      portfolioScale: '14 Exotic Supercars & 4 Sunseeker / Riva Yachts',
      assetValuation: 38500000,
      coverageZones: ['Monaco', 'Nice Côte d\'Azur', 'Cannes', 'Saint-Tropez'],
      proposalPitch: 'We provide bespoke yacht charters across the French Riviera and VIP tarmac supercar deliveries with dedicated chauffeurs.',
      commercialLicense: {
        number: 'MON-LUX-2024-8874',
        status: 'VERIFIED_ACTIVE',
        authority: 'Monaco Maritime & Transport Directorate',
        expiry: '2028-12-31'
      },
      insurance: {
        carrier: 'Lloyd\'s of London Marine & Luxury Auto',
        policyNumber: 'LLD-882194-X',
        coverageAmount: 50000000,
        expiry: '2027-06-30',
        status: 'VALID_ACTIVE'
      },
      safetyAuditScore: 96,
      riskAssessment: 'LOW RISK (TIER-1 LUXURY ACCREDITED)',
      tierGranted: 'Tier-1 Certified Luxury Partner',
      documents: [
        { id: 'doc-mc-reg', title: 'Monaco Corporate Registry & Trade License', type: 'PDF', size: '2.4 MB', date: '2026-09-20', verified: true },
        { id: 'doc-mc-ins', title: 'Lloyd\'s 50M USD Marine & Fleet Liability Binder', type: 'PDF', size: '4.1 MB', date: '2026-09-21', verified: true },
        { id: 'doc-mc-id', title: 'Managing Director Passport & Biometric KYC', type: 'DOC', size: '1.8 MB', date: '2026-09-20', verified: true }
      ]
    }
  },
  {
    id: 'usr-5',
    firstName: 'Lady Victoria',
    lastName: 'Hamilton',
    email: 'aviation@booking.com',
    role: 'PARTNER',
    status: 'PENDING',
    createdAt: '2026-09-22T09:15:00Z',
    application: {
      companyName: 'Mayfair Private Aviation & Helicopter Group Ltd.',
      registrationNumber: 'GB-88410293',
      taxId: 'GB-VAT-992144',
      incorporationCountry: 'United Kingdom',
      city: 'London (Farnborough)',
      address: '14 Berkeley Square, Mayfair, London W1J 6BL',
      phone: '+44 20 7946 0991',
      website: 'https://mayfair-aviation.co.uk',
      category: 'Private Aviation & Helicopter Transfers',
      portfolioScale: '6 Gulfstream G650 Jets & 4 Airbus ACH130 Helicopters',
      assetValuation: 120000000,
      coverageZones: ['London', 'Geneva', 'Paris Le Bourget', 'Nice Cote d\'Azur', 'Zurich'],
      proposalPitch: 'Direct private jet charters and scenic helicopter transfers connecting London, Geneva, and the Alps with Michelin-starred catering on board.',
      commercialLicense: {
        number: 'CAA-AOC-UK-9921',
        status: 'VERIFIED_ACTIVE',
        authority: 'Civil Aviation Authority & EASA',
        expiry: '2029-03-31'
      },
      insurance: {
        carrier: 'Allianz Global Corporate Aviation',
        policyNumber: 'AV-9812-AZ',
        coverageAmount: 250000000,
        expiry: '2028-09-30',
        status: 'VALID_ACTIVE'
      },
      safetyAuditScore: 99,
      riskAssessment: 'LOW RISK (TIER-1 LUXURY ACCREDITED)',
      tierGranted: 'Tier-1 Certified Luxury Partner',
      documents: [
        { id: 'doc-uk-aoc', title: 'Air Operator Certificate (AOC-UK-9921)', type: 'PDF', size: '3.8 MB', date: '2026-09-22', verified: true },
        { id: 'doc-uk-ins', title: 'Allianz 250M USD Aircraft Hull & Liability Binder', type: 'PDF', size: '5.2 MB', date: '2026-09-22', verified: true }
      ]
    }
  }
];

import React, { useState, useEffect } from 'react';
import { 
  Calendar, User as UserIcon, FileText, Eye, ShieldCheck, HelpCircle, Fingerprint, 
  CheckCircle, XCircle, Clock, Trash2, CreditCard, PlusCircle, 
  TrendingUp, FolderKanban, Building2, Car, UtensilsCrossed, 
  Crown, MapPin, Users, CheckCircle2, AlertCircle, 
  Sparkles, Check, UploadCloud
} from 'lucide-react';
import { User } from '../App.tsx';

interface DashboardProps {
  user: User;
  token: string;
  navigateToDetail: (id: string) => void;
  addToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function Dashboard({ user, token, navigateToDetail, addToast }: DashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<string>('');

  // ----------------------------------------------------
  // CUSTOMER STATE
  // ----------------------------------------------------
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // ----------------------------------------------------
  // PARTNER STATE
  // ----------------------------------------------------
  const [partnerListings, setPartnerListings] = useState<any[]>([]);
  const [partnerBookings, setPartnerBookings] = useState<any[]>([]);
  
  // Listing Upload Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [serviceType, setServiceType] = useState('HOTEL');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [images, setImages] = useState(''); // comma-separated strings
  
  // Service-specific subforms
  const [hotelRoomType, setHotelRoomType] = useState('Deluxe King Suite');
  const [hotelAmenities, setHotelAmenities] = useState('High-Speed WiFi, Infinity Pool, Spa, Valet Parking');
  const [hotelPrice, setHotelPrice] = useState('350');
  const [hotelCapacity, setHotelCapacity] = useState('2');
  const [hotelRoomsCount, setHotelRoomsCount] = useState('5');

  const [carType, setCarType] = useState('Porsche 911 GT3');
  const [driverName, setDriverName] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [carPriceDay, setCarPriceDay] = useState('450');
  const [carPriceHour, setCarPriceHour] = useState('95');
  const [carCapacity, setCarCapacity] = useState('2');
  const [carTransmission, setCarTransmission] = useState('PDK Automatic');
  const [carFuelType, setCarFuelType] = useState('Gasoline');

  const [diningCuisine, setDiningCuisine] = useState('Contemporary French');
  const [diningCost, setDiningCost] = useState('180');
  const [diningSlots, setDiningSlots] = useState('18:00, 19:30, 21:00');
  const [diningCapacity, setDiningCapacity] = useState('24');

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  // ----------------------------------------------------
  // ADMIN STATE
  // ----------------------------------------------------
  const [pendingPartners, setPendingPartners] = useState<any[]>(INITIAL_PARTNER_SEED);

  // ----------------------------------------------------
  // MASTER ADMIN KYC REVIEW STATE
  // ----------------------------------------------------
  const [selectedReviewPartner, setSelectedReviewPartner] = useState<any | null>(null);
  const [selectedDocPreview, setSelectedDocPreview] = useState<any | null>(null);
  const [adminPartnerFilter, setAdminPartnerFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [adminReviewNotes, setAdminReviewNotes] = useState('');
  const [adminTierGranted, setAdminTierGranted] = useState('Tier-1 Certified Luxury Partner');

  const [pendingListings, setPendingListings] = useState<any[]>([]);

  // ----------------------------------------------------
  // API REFRESH TRIGGERS
  // ----------------------------------------------------
  const fetchCustomerBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/bookings/my-bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchPartnerData = async () => {
    try {
      const resListings = await fetch('http://localhost:5000/api/listings/my-listings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dataListings = await resListings.json();
      if (Array.isArray(dataListings)) setPartnerListings(dataListings);

      const resBookings = await fetch('http://localhost:5000/api/bookings/partner-bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dataBookings = await resBookings.json();
      if (Array.isArray(dataBookings)) setPartnerBookings(dataBookings);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAdminApprovals = async () => {
    try {
      const resPartners = await fetch('http://localhost:5000/api/admin/pending-partners', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dataPartners = await resPartners.json();
      if (Array.isArray(dataPartners)) setPendingPartners(dataPartners);

      const resListings = await fetch('http://localhost:5000/api/admin/pending-listings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dataListings = await resListings.json();
      if (Array.isArray(dataListings)) setPendingListings(dataListings);
    } catch (e) {
      console.error(e);
    }
  };

  // Run on mount
  useEffect(() => {
    if (user.role === 'CUSTOMER') {
      setActiveSubTab('bookings');
      fetchCustomerBookings();
    } else if (user.role === 'PARTNER') {
      setActiveSubTab('my-listings');
      fetchPartnerData();
    } else if (user.role === 'ADMIN') {
      setActiveSubTab('admin-partners');
      fetchAdminApprovals();
    }

    // Check if redirect contains mock payment params
    const query = new URLSearchParams(window.location.search);
    if (query.get('mockPaymentSuccess') === 'true' && query.get('bookingId')) {
      const bId = query.get('bookingId');
      fetch('http://localhost:5000/api/bookings/confirm-mock-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookingId: bId })
      }).then(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
        if (addToast) addToast('Payment confirmed! Your reservation is active.', 'success');
        fetchCustomerBookings();
      });
    }
  }, [user, token]);

  // Handle Cancel Booking
  const handleCancelBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        if (addToast) addToast('Booking cancelled successfully.', 'info');
        fetchCustomerBookings();
        if (user.role === 'PARTNER') fetchPartnerData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle Mock Stripe Checkout confirmation directly inside dashboard
  const handleTriggerMockPayment = async (bookingId: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/bookings/confirm-mock-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookingId })
      });
      if (res.ok) {
        if (addToast) addToast('Transaction verified! Status updated to Confirmed.', 'success');
        fetchCustomerBookings();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Upload Listing Submit
  const handleUploadListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setUploadLoading(true);

    const imagesArr = images.split(',').map(img => img.trim()).filter(Boolean);
    if (imagesArr.length === 0 && coverImage) {
      imagesArr.push(coverImage);
    }

    const payload: any = {
      title,
      description,
      serviceType,
      address,
      city,
      country,
      coverImage,
      images: imagesArr,
    };

    if (serviceType === 'HOTEL') {
      payload.hotel = {
        roomType: hotelRoomType,
        amenities: hotelAmenities.split(',').map(a => a.trim()).filter(Boolean),
        pricePerNight: Number(hotelPrice),
        capacity: Number(hotelCapacity),
        totalRooms: Number(hotelRoomsCount),
      };
    } else if (serviceType === 'CAR_RENTAL' || serviceType === 'PRIVATE_DRIVER') {
      payload.car = {
        carType,
        isRental: serviceType === 'CAR_RENTAL',
        driverName: serviceType === 'PRIVATE_DRIVER' ? driverName : undefined,
        driverLicense: serviceType === 'PRIVATE_DRIVER' ? driverLicense : undefined,
        pricePerDay: serviceType === 'CAR_RENTAL' ? Number(carPriceDay) : undefined,
        pricePerHour: serviceType === 'PRIVATE_DRIVER' ? Number(carPriceHour) : undefined,
        capacity: Number(carCapacity),
        transmission: carTransmission,
        fuelType: carFuelType,
      };
    } else if (serviceType === 'RESTAURANT') {
      payload.dining = {
        cuisineType: diningCuisine,
        averageCost: Number(diningCost),
        availableSlots: diningSlots.split(',').map(s => s.trim()).filter(Boolean),
        seatingCapacity: Number(diningCapacity),
      };
    }

    try {
      const res = await fetch('http://localhost:5000/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload listing');
      }

      setFormSuccess('Listing submitted! It is now pending administrative safety review.');
      if (addToast) addToast('New listing uploaded for admin review.', 'success');
      fetchPartnerData();

      // Reset form
      setTitle('');
      setDescription('');
      setAddress('');
      setCity('');
      setCountry('');
      setCoverImage('');
      setImages('');
    } catch (err: any) {
      setFormError(err.message || 'Error occurred during listing creation');
    } finally {
      setUploadLoading(false);
    }
  };

  // Admin Actions
  const handleApprovePartner = async (partnerId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/partners/${partnerId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        if (addToast) addToast(`Partner application marked as ${status}.`, 'info');
        fetchAdminApprovals();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApproveListing = async (listingId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/listings/${listingId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        if (addToast) addToast(`Listing status updated to ${status}.`, 'info');
        fetchAdminApprovals();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease', flex: 1, padding: '3rem 4rem 6rem 4rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Top Banner Card */}
      <div className="glass" style={{
        padding: '2.2rem 2.8rem',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.8rem',
        borderLeft: '5px solid var(--accent-gold)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              AUTHENTICATED MANAGEMENT PORTAL
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.6rem' }}>
            Welcome back, {user.firstName}
          </h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--text-gray)' }}>
            <span>Email: <strong style={{ color: 'var(--text-white)' }}>{user.email}</strong></span>
            <span>•</span>
            <span>Role: <span className="badge badge-hotel">{user.role}</span></span>
            <span>•</span>
            <span>Status: <span className={`badge ${user.status === 'APPROVED' ? 'badge-approved' : 'badge-pending'}`}>{user.status}</span></span>
          </div>
        </div>
        
        {/* Quick Statistics details */}
        <div style={{ display: 'flex', gap: '2.5rem' }}>
          {user.role === 'CUSTOMER' && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--text-gray)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase' }}>Active Bookings</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-gold)' }}>{bookings.length}</div>
            </div>
          )}
          {user.role === 'PARTNER' && (
            <>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--text-gray)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase' }}>Published Spaces</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>
                  {partnerListings.filter(l => l.status === 'APPROVED').length}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--text-gray)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase' }}>In Audit Review</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-gold)' }}>
                  {partnerListings.filter(l => l.status === 'PENDING').length}
                </div>
              </div>
            </>
          )}
          {user.role === 'ADMIN' && (
            <>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--text-gray)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase' }}>Pending Listings</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-gold)' }}>{pendingListings.length}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--text-gray)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase' }}>Partner Audits</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-violet)' }}>{pendingPartners.length}</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sub Tabs Navigation Bar */}
      <div style={{ display: 'flex', gap: '0.8rem', borderBottom: '1px solid var(--border-glass)', marginBottom: '2.2rem', paddingBottom: '0.8rem', flexWrap: 'wrap' }}>
        
        {/* CUSTOMER TABS */}
        {user.role === 'CUSTOMER' && (
          <button 
            className={`btn ${activeSubTab === 'bookings' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveSubTab('bookings'); fetchCustomerBookings(); }}
            style={{ fontSize: '0.9rem' }}
          >
            <Calendar size={15} />
            <span>My Bookings Schedule</span>
          </button>
        )}

        {/* PARTNER TABS */}
        {user.role === 'PARTNER' && (
          <>
            <button 
              className={`btn ${activeSubTab === 'my-listings' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setActiveSubTab('my-listings'); fetchPartnerData(); }}
              style={{ fontSize: '0.9rem' }}
            >
              <FolderKanban size={15} />
              <span>Managed Inventory</span>
            </button>
            <button 
              className={`btn ${activeSubTab === 'upload-listing' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveSubTab('upload-listing')}
              style={{ fontSize: '0.9rem' }}
            >
              <PlusCircle size={15} />
              <span>Register New Service</span>
            </button>
            <button 
              className={`btn ${activeSubTab === 'partner-sales' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setActiveSubTab('partner-sales'); fetchPartnerData(); }}
              style={{ fontSize: '0.9rem' }}
            >
              <TrendingUp size={15} />
              <span>Client Reservations</span>
            </button>
          </>
        )}

        {/* ADMIN TABS */}
        {user.role === 'ADMIN' && (
          <>
            <button 
              className={`btn ${activeSubTab === 'admin-partners' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setActiveSubTab('admin-partners'); fetchAdminApprovals(); }}
              style={{ fontSize: '0.9rem' }}
            >
              <UserIcon size={15} />
              <span>Pending Partner Applications ({pendingPartners.length})</span>
            </button>
            <button 
              className={`btn ${activeSubTab === 'admin-listings' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setActiveSubTab('admin-listings'); fetchAdminApprovals(); }}
              style={{ fontSize: '0.9rem' }}
            >
              <Building2 size={15} />
              <span>Pending Listing Audits ({pendingListings.length})</span>
            </button>
          </>
        )}
      </div>

      {/* Tab Panels */}
      <div>
        
        {/* ======================================================== */}
        {/* PANEL: CUSTOMER BOOKINGS                                 */}
        {/* ======================================================== */}
        {activeSubTab === 'bookings' && (
          <div>
            {bookingsLoading ? (
              <p style={{ color: 'var(--text-gray)' }}>Synchronizing itinerary calendar...</p>
            ) : bookings.length === 0 ? (
              <div className="glass" style={{ padding: '4.5rem', textAlign: 'center', borderRadius: 'var(--radius-xl)' }}>
                <Calendar size={40} style={{ color: 'var(--accent-gold)', margin: '0 auto 1.2rem auto' }} />
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No reservation schedules active</h3>
                <p style={{ color: 'var(--text-gray)', marginBottom: '1.8rem', fontSize: '0.95rem' }}>Explore our curated suites, sports rentals, private drivers, and Michelin fine dining.</p>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>
                  <Sparkles size={16} />
                  <span>Explore Luxury Collection</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '980px' }}>
                {bookings.map((booking) => (
                  <div key={booking.id} className="glass" style={{
                    display: 'flex',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    borderLeft: booking.status === 'CONFIRMED' ? '5px solid #10b981' : booking.status === 'PENDING' ? '5px solid #f59e0b' : '5px solid #ef4444'
                  }}>
                    <div style={{ width: '200px', minWidth: '200px', height: '160px' }}>
                      <img src={booking.listing.coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{ padding: '1.4rem', flex: 1, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{booking.listing.title}</h3>
                            <span className={`badge ${
                              booking.status === 'CONFIRMED' ? 'badge-approved' : 
                              booking.status === 'PENDING' ? 'badge-pending' : 'badge-rejected'
                            }`}>
                              {booking.status === 'CONFIRMED' && <CheckCircle size={12} />}
                              {booking.status === 'PENDING' && <Clock size={12} />}
                              {booking.status === 'CANCELLED' && <XCircle size={12} />}
                              <span>{booking.status}</span>
                            </span>
                          </div>
                          <div style={{ color: 'var(--text-gray)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Calendar size={13} style={{ color: 'var(--accent-gold)' }} />
                            <span>Starts: <strong>{new Date(booking.startDate).toLocaleDateString()}</strong></span>
                            {booking.endDate && <span>• Ends: <strong>{new Date(booking.endDate).toLocaleDateString()}</strong></span>}
                            {booking.timeSlot && <span>• Slot: <strong>{booking.timeSlot}</strong></span>}
                          </div>
                          <div style={{ color: 'var(--text-gray)', fontSize: '0.85rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Users size={13} style={{ color: 'var(--accent-cyan)' }} />
                            <span>Party size: {booking.guestCount} guests</span>
                          </div>
                        </div>
                        
                        <div style={{ fontSize: '0.92rem', color: 'var(--text-gray)', marginTop: '0.8rem' }}>
                          Total: <strong style={{ color: 'var(--accent-gold)', fontSize: '1.1rem' }}>${booking.totalPrice}</strong> ({booking.paymentStatus})
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.8rem' }}>
                        {booking.status === 'PENDING' && (
                          <button 
                            className="btn btn-accent" 
                            onClick={() => handleTriggerMockPayment(booking.id)}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
                          >
                            <CreditCard size={14} />
                            <span>Confirm Mock Payment</span>
                          </button>
                        )}
                        {booking.status !== 'CANCELLED' && (
                          <button 
                            className="btn btn-secondary" 
                            onClick={() => handleCancelBooking(booking.id)}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', color: '#f87171' }}
                          >
                            <Trash2 size={14} />
                            <span>Cancel Reservation</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* PANEL: PARTNER LISTINGS LIST                             */}
        {/* ======================================================== */}
        {activeSubTab === 'my-listings' && (
          <div>
            {partnerListings.length === 0 ? (
              <div className="glass" style={{ padding: '4rem', textAlign: 'center', borderRadius: 'var(--radius-xl)' }}>
                <FolderKanban size={36} style={{ color: 'var(--accent-cyan)', margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No services published yet</h3>
                <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Start by registering a luxury hotel suite, car rental, private driver, or gastronomy table.</p>
                <button className="btn btn-primary" onClick={() => setActiveSubTab('upload-listing')}>
                  <PlusCircle size={16} />
                  <span>Create First Listing</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                {partnerListings.map((listing) => (
                  <div key={listing.id} className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <div style={{ height: '190px', position: 'relative' }}>
                      <img src={listing.coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                        <span className={`badge ${
                          listing.status === 'APPROVED' ? 'badge-approved' : 
                          listing.status === 'PENDING' ? 'badge-pending' : 'badge-rejected'
                        }`}>
                          {listing.status === 'APPROVED' && <CheckCircle size={12} />}
                          {listing.status === 'PENDING' && <Clock size={12} />}
                          <span>{listing.status}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ padding: '1.4rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>{listing.title}</h3>
                      <p style={{ color: 'var(--text-gray)', fontSize: '0.85rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={13} style={{ color: 'var(--accent-cyan)' }} /> {listing.address}, {listing.city}
                      </p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
                        <span className="badge badge-hotel" style={{ fontSize: '0.72rem' }}>{listing.serviceType}</span>
                        <button className="btn btn-secondary" onClick={() => navigateToDetail(listing.id)} style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}>
                          <span>View Public Page</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* PANEL: UPLOAD NEW LISTING                                */}
        {/* ======================================================== */}
        {activeSubTab === 'upload-listing' && (
          <div className="glass" style={{ padding: '2.8rem', borderRadius: 'var(--radius-xl)', maxWidth: '850px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <PlusCircle size={20} style={{ color: 'var(--accent-gold)' }} />
              <h2 style={{ fontWeight: 800, fontSize: '1.6rem' }} className="gradient-text">Register Service Listing</h2>
            </div>
            <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem', marginBottom: '1.8rem' }}>
              Submissions undergo immediate administrative quality and safety compliance verification.
            </p>

            {formError && (
              <div className="badge badge-rejected" style={{ width: '100%', padding: '0.8rem 1rem', marginBottom: '1.2rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'none', fontSize: '0.85rem' }}>
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}
            
            {formSuccess && (
              <div className="badge badge-approved" style={{ width: '100%', padding: '0.8rem 1rem', marginBottom: '1.2rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'none', fontSize: '0.85rem' }}>
                <CheckCircle2 size={16} />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUploadListing}>
              
              {/* Category Selector Grid */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Service Type Category</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.8rem' }}>
                  {[
                    { type: 'HOTEL', label: 'Hotel Suite', icon: <Building2 size={16} /> },
                    { type: 'CAR_RENTAL', label: 'Supercar Rental', icon: <Car size={16} /> },
                    { type: 'PRIVATE_DRIVER', label: 'VIP Chauffeur', icon: <Crown size={16} /> },
                    { type: 'RESTAURANT', label: 'Gastro Dining', icon: <UtensilsCrossed size={16} /> }
                  ].map(cat => (
                    <div
                      key={cat.type}
                      onClick={() => setServiceType(cat.type)}
                      style={{
                        padding: '0.9rem',
                        borderRadius: 'var(--radius-md)',
                        border: serviceType === cat.type ? '1px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        background: serviceType === cat.type ? 'rgba(245, 158, 11, 0.12)' : 'rgba(0,0,0,0.3)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        color: serviceType === cat.type ? 'var(--accent-gold)' : 'var(--text-gray)',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      {cat.icon}
                      <span>{cat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Service Title</label>
                <input type="text" required placeholder="E.g. Ritz-Carlton Presidential Panorama Suite" className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Space & Feature Description</label>
                <textarea required placeholder="Highlight panoramic views, private driver qualifications, Michelin chef specialties..." className="input-field" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem' }}>
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input type="text" required placeholder="15 Place Vendôme" className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input type="text" required placeholder="Paris" className="input-field" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input type="text" required placeholder="France" className="input-field" value={country} onChange={(e) => setCountry(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Cover Image Link (URL)</label>
                  <input type="url" required placeholder="https://images.unsplash.com/..." className="input-field" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Additional Photos (Comma-separated)</label>
                  <input type="text" placeholder="https://image1.jpg, https://image2.jpg" className="input-field" value={images} onChange={(e) => setImages(e.target.value)} />
                </div>
              </div>

              {/* HOTEL SPECIFIC SUBFORM */}
              {serviceType === 'HOTEL' && (
                <div style={{ borderTop: '1px solid var(--border-glass)', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold)', fontWeight: 800, marginBottom: '1.2rem', fontSize: '1rem' }}>
                    <Building2 size={16} /> Room Configuration Details
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Room / Bed Configuration</label>
                      <input type="text" className="input-field" value={hotelRoomType} onChange={(e) => setHotelRoomType(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Price Per Night ($)</label>
                      <input type="number" className="input-field" value={hotelPrice} onChange={(e) => setHotelPrice(e.target.value)} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem' }}>
                    <div className="form-group">
                      <label className="form-label">Guest Capacity</label>
                      <input type="number" className="input-field" value={hotelCapacity} onChange={(e) => setHotelCapacity(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Available Suites Count</label>
                      <input type="number" className="input-field" value={hotelRoomsCount} onChange={(e) => setHotelRoomsCount(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Amenities (Comma separated)</label>
                      <input type="text" className="input-field" value={hotelAmenities} onChange={(e) => setHotelAmenities(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* CAR / CHAUFFEUR SUBFORM */}
              {(serviceType === 'CAR_RENTAL' || serviceType === 'PRIVATE_DRIVER') && (
                <div style={{ borderTop: '1px solid var(--border-glass)', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontWeight: 800, marginBottom: '1.2rem', fontSize: '1rem' }}>
                    <Car size={16} /> Transportation Fleet Details
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Vehicle Model & Make</label>
                      <input type="text" className="input-field" value={carType} onChange={(e) => setCarType(e.target.value)} />
                    </div>
                    
                    {serviceType === 'CAR_RENTAL' ? (
                      <div className="form-group">
                        <label className="form-label">Daily Rental Rate ($)</label>
                        <input type="number" className="input-field" value={carPriceDay} onChange={(e) => setCarPriceDay(e.target.value)} />
                      </div>
                    ) : (
                      <div className="form-group">
                        <label className="form-label">Hourly Chauffeur Rate ($)</label>
                        <input type="number" className="input-field" value={carPriceHour} onChange={(e) => setCarPriceHour(e.target.value)} />
                      </div>
                    )}
                  </div>

                  {serviceType === 'PRIVATE_DRIVER' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div className="form-group">
                        <label className="form-label">Chauffeur Full Legal Name</label>
                        <input type="text" required placeholder="Jean-Luc Moreau" className="input-field" value={driverName} onChange={(e) => setDriverName(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Professional Chauffeur License ID</label>
                        <input type="text" required placeholder="VTC-987214" className="input-field" value={driverLicense} onChange={(e) => setDriverLicense(e.target.value)} />
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem' }}>
                    <div className="form-group">
                      <label className="form-label">Passenger Capacity</label>
                      <input type="number" className="input-field" value={carCapacity} onChange={(e) => setCarCapacity(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Transmission</label>
                      <select className="input-field" value={carTransmission} onChange={(e) => setCarTransmission(e.target.value)}>
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Powertrain</label>
                      <select className="input-field" value={carFuelType} onChange={(e) => setCarFuelType(e.target.value)}>
                        <option value="Gasoline">Gasoline</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* RESTAURANT SUBFORM */}
              {serviceType === 'RESTAURANT' && (
                <div style={{ borderTop: '1px solid var(--border-glass)', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fb7185', fontWeight: 800, marginBottom: '1.2rem', fontSize: '1rem' }}>
                    <UtensilsCrossed size={16} /> Gastronomy Specifications
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Cuisine Specialization</label>
                      <input type="text" className="input-field" value={diningCuisine} onChange={(e) => setDiningCuisine(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Average Cost For Two ($)</label>
                      <input type="number" className="input-field" value={diningCost} onChange={(e) => setDiningCost(e.target.value)} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Available Seating Per Slot</label>
                      <input type="number" className="input-field" value={diningCapacity} onChange={(e) => setDiningCapacity(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Booking Time Slots (Comma-separated)</label>
                      <input type="text" className="input-field" value={diningSlots} onChange={(e) => setDiningSlots(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* Form submit CTA */}
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '1rem', marginTop: '2rem', fontSize: '1rem' }}
                disabled={user.status !== 'APPROVED' || uploadLoading}
              >
                <UploadCloud size={18} />
                <span>{uploadLoading ? 'Uploading & Encrypting...' : user.status === 'APPROVED' ? 'Submit for Safety Audit Approval' : 'Account Awaiting Admin Approval'}</span>
              </button>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* PANEL: PARTNER CLIENT RESERVATIONS                       */}
        {/* ======================================================== */}
        {activeSubTab === 'partner-sales' && (
          <div>
            {partnerBookings.length === 0 ? (
              <div className="glass" style={{ padding: '3.5rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                <TrendingUp size={36} style={{ color: 'var(--accent-gold)', margin: '0 auto 1rem auto' }} />
                <p style={{ color: 'var(--text-gray)' }}>No guest reservations received yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '950px' }}>
                {partnerBookings.map((b) => (
                  <div key={b.id} className="glass" style={{ padding: '1.4rem', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.3rem' }}>{b.listing.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)' }}>
                        Client: <strong style={{ color: 'var(--text-white)' }}>{b.customer.firstName} {b.customer.lastName}</strong> ({b.customer.email})
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', marginTop: '0.2rem' }}>
                        Dates: {new Date(b.startDate).toLocaleDateString()} {b.endDate ? `to ${new Date(b.endDate).toLocaleDateString()}` : ''}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', marginTop: '0.2rem' }}>
                        Party: {b.guestCount} guests | Subtotal: <strong style={{ color: 'var(--accent-gold)' }}>${b.totalPrice}</strong>
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'flex-end' }}>
                      <span className={`badge ${b.status === 'CONFIRMED' ? 'badge-approved' : b.status === 'PENDING' ? 'badge-pending' : 'badge-rejected'}`}>
                        {b.status}
                      </span>
                      {b.status !== 'CANCELLED' && (
                        <button className="btn btn-secondary" onClick={() => handleCancelBooking(b.id)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', color: '#f87171' }}>
                          <Trash2 size={13} /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* PANEL: ADMIN PARTNER APPLICATIONS                         */}
        {/* ======================================================== */}
        {activeSubTab === 'admin-partners' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 className="gradient-text" style={{ fontSize: '1.6rem', fontWeight: 800 }}>Partner Verification & Compliance Desk</h3>
                  <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                    Review complete luxury partner compliance dossiers, inspect $50M+ liability insurance, and assign accreditation.
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setAdminPartnerFilter(tab)}
                      className={`btn ${adminPartnerFilter === tab ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
                    >
                      {tab === 'ALL' && `All (${pendingPartners.length})`}
                      {tab === 'PENDING' && `Pending KYC (${pendingPartners.filter(p => p.status === 'PENDING').length})`}
                      {tab === 'APPROVED' && `Approved (${pendingPartners.filter(p => p.status === 'APPROVED').length})`}
                      {tab === 'REJECTED' && `Rejected (${pendingPartners.filter(p => p.status === 'REJECTED').length})`}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Search partner by company name, executive, or category..." 
                  value={adminSearchQuery} 
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  style={{ maxWidth: '500px' }}
                />
              </div>
            </div>

            {pendingPartners.filter(p => {
              if (adminPartnerFilter === 'PENDING') return p.status === 'PENDING';
              if (adminPartnerFilter === 'APPROVED') return p.status === 'APPROVED';
              if (adminPartnerFilter === 'REJECTED') return p.status === 'REJECTED';
              return true;
            }).filter(p => {
              if (!adminSearchQuery.trim()) return true;
              const q = adminSearchQuery.toLowerCase();
              const comp = (p.application?.companyName || '').toLowerCase();
              const name = `${p.firstName} ${p.lastName}`.toLowerCase();
              const email = p.email.toLowerCase();
              return comp.includes(q) || name.includes(q) || email.includes(q);
            }).length === 0 ? (
              <div className="glass" style={{ padding: '3.5rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                <CheckCircle2 size={36} style={{ color: '#10b981', margin: '0 auto 1rem auto' }} />
                <p style={{ color: 'var(--text-gray)' }}>No partner applications matching current filter.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                {pendingPartners.filter(p => {
                  if (adminPartnerFilter === 'PENDING') return p.status === 'PENDING';
                  if (adminPartnerFilter === 'APPROVED') return p.status === 'APPROVED';
                  if (adminPartnerFilter === 'REJECTED') return p.status === 'REJECTED';
                  return true;
                }).filter(p => {
                  if (!adminSearchQuery.trim()) return true;
                  const q = adminSearchQuery.toLowerCase();
                  const comp = (p.application?.companyName || '').toLowerCase();
                  const name = `${p.firstName} ${p.lastName}`.toLowerCase();
                  const email = p.email.toLowerCase();
                  return comp.includes(q) || name.includes(q) || email.includes(q);
                }).map((partner) => {
                  const app = partner.application || {
                    companyName: partner.companyName || `${partner.firstName} Luxury Principal`,
                    category: 'Supercars, Yachts & Private Drivers',
                    portfolioScale: 'Multi-Asset Collection',
                    assetValuation: 38500000,
                    city: 'Monaco',
                    incorporationCountry: 'Monaco',
                    safetyAuditScore: 96,
                    insurance: { carrier: "Lloyd's of London", coverageAmount: 50000000 }
                  };

                  return (
                    <div 
                      key={partner.id} 
                      className="glass" 
                      style={{ 
                        padding: '1.8rem', 
                        borderRadius: 'var(--radius-lg)', 
                        borderLeft: `4px solid ${partner.status === 'APPROVED' ? '#4ade80' : partner.status === 'PENDING' ? '#f59e0b' : '#f43f5e'}`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.2rem', marginBottom: '1.2rem' }}>
                        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                          <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #f59e0b, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 800, color: '#000' }}>
                            {partner.firstName[0]}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                              <h4 style={{ fontWeight: 800, fontSize: '1.25rem' }}>{partner.firstName} {partner.lastName}</h4>
                              <span className={`badge ${partner.status === 'APPROVED' ? 'badge-approved' : partner.status === 'PENDING' ? 'badge-pending' : 'badge-rejected'}`}>
                                {partner.status}
                              </span>
                              <span className="badge badge-hotel" style={{ fontSize: '0.72rem' }}>{app.category}</span>
                            </div>
                            <p style={{ color: 'var(--accent-gold)', fontWeight: 600, fontSize: '0.95rem' }}>{app.companyName}</p>
                            <p style={{ color: 'var(--text-gray)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                              Email: <strong>{partner.email}</strong> • HQ: <strong>{app.city}, {app.incorporationCountry}</strong>
                            </p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                          <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                            🛡️ Audit Score: {app.safetyAuditScore || 96}/100
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Est. Valuation: <strong style={{ color: '#fff' }}>${((app.assetValuation || 38500000) / 1000000).toFixed(1)}M</strong>
                          </span>
                        </div>
                      </div>

                      <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.8rem 1.2rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.2rem', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-gray)' }}>Portfolio: <strong style={{ color: '#fff' }}>{app.portfolioScale}</strong></span>
                        <span style={{ color: 'var(--text-gray)' }}>Underwriter: <strong style={{ color: '#4ade80' }}>{app.insurance?.carrier || "Lloyd's"} (${((app.insurance?.coverageAmount || 50000000) / 1000000).toFixed(0)}M Liability)</strong></span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {app.tierGranted ? `Accreditation: ${app.tierGranted}` : 'Awaiting Master Admin Dossier Audit'}
                        </span>

                        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                          <button 
                            className="btn btn-primary" 
                            onClick={() => {
                              setSelectedReviewPartner(partner);
                              setAdminReviewNotes(app.adminNotes || '');
                              setAdminTierGranted(app.tierGranted || 'Tier-1 Certified Luxury Partner');
                            }}
                            style={{ padding: '0.5rem 1.1rem', fontSize: '0.82rem', boxShadow: '0 0 15px rgba(245,158,11,0.25)' }}
                          >
                            <FileText size={14} />
                            <span>Review Application Dossier</span>
                          </button>
                          
                          {partner.status === 'PENDING' && (
                            <>
                              <button 
                                className="btn btn-secondary" 
                                onClick={() => handleApprovePartner(partner.id, 'APPROVED')} 
                                style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem', color: '#4ade80' }}
                              >
                                <Check size={14} /> Approve
                              </button>
                              <button 
                                className="btn btn-secondary" 
                                onClick={() => handleApprovePartner(partner.id, 'REJECTED')} 
                                style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem', color: '#f87171' }}
                              >
                                <XCircle size={14} /> Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* MASTER ADMIN APPLICATION REVIEW DOSSIER MODAL */}
            {selectedReviewPartner && (
              <div className="modal-overlay" style={{ display: 'flex', zIndex: 1050 }}>
                <div className="modal-content glass-heavy" style={{ maxWidth: '950px', maxHeight: '92vh', overflowY: 'auto', padding: '2.5rem', textAlign: 'left' }}>
                  <button className="close-btn" onClick={() => setSelectedReviewPartner(null)}>&times;</button>
                  
                  {/* Modal Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.5rem', flexWrap: 'wrap', gap: '1.2rem' }}>
                    <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                      <div style={{ width: '58px', height: '58px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #f59e0b, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#000' }}>
                        {selectedReviewPartner.firstName[0]}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                          <h2 className="font-serif" style={{ fontSize: '1.6rem', fontWeight: 800 }}>{selectedReviewPartner.firstName} {selectedReviewPartner.lastName}</h2>
                          <span className={`badge ${selectedReviewPartner.status === 'APPROVED' ? 'badge-approved' : selectedReviewPartner.status === 'PENDING' ? 'badge-pending' : 'badge-rejected'}`}>
                            {selectedReviewPartner.status}
                          </span>
                        </div>
                        <p style={{ color: 'var(--accent-gold)', fontSize: '0.95rem', fontWeight: 600 }}>{selectedReviewPartner.application?.companyName || 'Rossi Supercars & Riva Yachting Group Ltd.'}</p>
                        <p style={{ color: 'var(--text-gray)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                          HQ: {selectedReviewPartner.application?.city || 'Monaco'}, {selectedReviewPartner.application?.incorporationCountry || 'Monaco'}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                      <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        🛡️ Compliance Score: {selectedReviewPartner.application?.safetyAuditScore || 96}/100 (Low Risk)
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tier-1 Escrow Protocol Eligible</span>
                    </div>
                  </div>

                  {/* Section 1: Entity Info */}
                  <div style={{ marginBottom: '1.8rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Building2 size={16} style={{ color: 'var(--accent-gold)' }} /> 1. Corporate Entity & Representative Information
                    </h3>
                    <div className="glass" style={{ padding: '1.4rem', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', fontSize: '0.9rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-gray)', fontSize: '0.78rem', display: 'block' }}>Legal Company Name</span>
                        <strong style={{ color: '#fff' }}>{selectedReviewPartner.application?.companyName || 'Rossi Marine Charters Ltd.'}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-gray)', fontSize: '0.78rem', display: 'block' }}>Registration / VAT</span>
                        <strong style={{ color: '#fff' }}>{selectedReviewPartner.application?.registrationNumber || 'MC-984420-VAT'}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-gray)', fontSize: '0.78rem', display: 'block' }}>Direct Phone</span>
                        <strong style={{ color: 'var(--accent-gold)' }}>{selectedReviewPartner.application?.phone || '+377 98 98 22 00'}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-gray)', fontSize: '0.78rem', display: 'block' }}>Official Domain</span>
                        <a href={selectedReviewPartner.application?.website || '#'} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}>
                          {selectedReviewPartner.application?.website || 'https://rossi-marine.mc'}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Operations & Proposal */}
                  <div style={{ marginBottom: '1.8rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={16} style={{ color: 'var(--accent-cyan)' }} /> 2. Operational Scope & Partnership Proposal
                    </h3>
                    <div className="glass" style={{ padding: '1.4rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-gray)', fontSize: '0.78rem', display: 'block', marginBottom: '0.4rem' }}>Coverage Zones</span>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {(selectedReviewPartner.application?.coverageZones || ['Monaco', 'Nice', 'Cannes', 'Saint-Tropez']).map((z: string) => (
                            <span key={z} className="badge badge-hotel" style={{ fontSize: '0.75rem' }}>{z}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-gray)', fontSize: '0.78rem', display: 'block', marginBottom: '0.4rem' }}>Partnership Pitch</span>
                        <p style={{ color: 'var(--text-gray)', fontSize: '0.88rem', lineHeight: 1.6, background: 'rgba(0,0,0,0.3)', padding: '0.9rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-gold)' }}>
                          "{selectedReviewPartner.application?.proposalPitch || 'We provide bespoke yacht charters and chauffeured exotic supercars for Aether VIP travelers.'}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Regulatory Compliance & Insurance */}
                  <div style={{ marginBottom: '1.8rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ShieldCheck size={16} style={{ color: '#4ade80' }} /> 3. Regulatory Compliance & 5-Point KYC Verification
                    </h3>
                    <div className="glass" style={{ padding: '1.4rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.9rem', borderRadius: 'var(--radius-sm)' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-gray)' }}>Commercial License</span>
                          <p style={{ fontWeight: 700, color: '#fff', marginTop: '0.2rem' }}>{selectedReviewPartner.application?.commercialLicense?.number || 'MON-LUX-2024-8874'}</p>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified & Active</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.9rem', borderRadius: 'var(--radius-sm)' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-gray)' }}>Liability Insurance</span>
                          <p style={{ fontWeight: 700, color: '#fff', marginTop: '0.2rem' }}>{selectedReviewPartner.application?.insurance?.carrier || "Lloyd's of London"}</p>
                          <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>$50M Coverage Active</span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem' }}>
                        {['Director Biometric ID Verified', 'Corporate Registry Verified', 'Commercial Insurance Active', 'Bank Escrow Payout Vetted', 'Sanctions List Clear'].map((check) => (
                          <div key={check} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#4ade80' }}>
                            <CheckCircle2 size={14} />
                            <span>{check}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Document Inspector */}
                  <div style={{ marginBottom: '1.8rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={16} style={{ color: 'var(--accent-gold)' }} /> 4. Verified Document Dossier & Evidence
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                      {(selectedReviewPartner.application?.documents || [
                        { id: 'doc-reg', title: 'Corporate Registration Certificate', type: 'PDF', size: '2.4 MB' },
                        { id: 'doc-ins', title: "Lloyd's $50M Liability Policy Binder", type: 'PDF', size: '4.1 MB' }
                      ]).map((doc: any) => (
                        <div key={doc.id} className="glass" style={{ padding: '0.9rem 1.2rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <FileText size={16} style={{ color: 'var(--accent-gold)' }} />
                            <div>
                              <strong style={{ fontSize: '0.82rem', color: '#fff', display: 'block' }}>{doc.title}</strong>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.type} • {doc.size}</span>
                            </div>
                          </div>
                          <button 
                            className="btn btn-secondary" 
                            onClick={() => setSelectedDocPreview({ doc, partner: selectedReviewPartner })}
                            style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
                          >
                            <Eye size={12} /> Inspect
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 5: Decision Console */}
                  <div className="glass" style={{ padding: '1.6rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.03)' }}>
                    <h3 className="gradient-text" style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>Master Admin Decision Console</h3>
                    <p style={{ color: 'var(--text-gray)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
                      Assign luxury accreditation tier, record internal audit notes, and execute administrative disposition.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
                      <div className="form-group">
                        <label className="form-label">Accreditation Privilege Tier</label>
                        <select className="input-field" value={adminTierGranted} onChange={(e) => setAdminTierGranted(e.target.value)}>
                          <option value="Tier-1 Certified Luxury Partner">Tier-1 Certified Luxury Partner</option>
                          <option value="VIP Asset Provider">VIP Asset Provider</option>
                          <option value="Standard Verified Partner">Standard Verified Partner</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Internal Audit Notes</label>
                        <input type="text" className="input-field" placeholder="Auditor notes / verification details..." value={adminReviewNotes} onChange={(e) => setAdminReviewNotes(e.target.value)} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button className="btn btn-secondary" onClick={() => {
                        if (addToast) addToast(`Formal KYC Information Request dispatched to ${selectedReviewPartner.email}`, 'info');
                        setSelectedReviewPartner(null);
                      }} style={{ color: '#fbbf24' }}>
                        <HelpCircle size={14} /> Request Info
                      </button>
                      <button className="btn btn-secondary" onClick={() => {
                        handleApprovePartner(selectedReviewPartner.id, 'REJECTED');
                        setSelectedReviewPartner(null);
                      }} style={{ color: '#f87171' }}>
                        <XCircle size={14} /> Reject Application
                      </button>
                      <button className="btn btn-primary" onClick={() => {
                        handleApprovePartner(selectedReviewPartner.id, 'APPROVED');
                        setSelectedReviewPartner(null);
                      }}>
                        <ShieldCheck size={16} /> Approve & Grant Accreditation
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* DOCUMENT PROOF PREVIEW MODAL */}
            {selectedDocPreview && (
              <div className="modal-overlay" style={{ display: 'flex', zIndex: 1200 }}>
                <div className="modal-content glass-heavy" style={{ maxWidth: '650px', padding: '2.5rem', textAlign: 'left' }}>
                  <button className="close-btn" onClick={() => setSelectedDocPreview(null)}>&times;</button>
                  
                  <div style={{ border: '2px solid var(--accent-gold)', padding: '2rem', borderRadius: 'var(--radius-md)', background: 'radial-gradient(circle at 50% 30%, #151522 0%, #08080f 100%)', boxShadow: '0 0 30px rgba(245,158,11,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(245,158,11,0.3)', paddingBottom: '1rem', marginBottom: '1.2rem' }}>
                      <div>
                        <span style={{ color: 'var(--accent-gold)', fontSize: '0.72rem', letterSpacing: '2px', fontWeight: 800 }}>AETHER TRUST & AUDIT LEDGER</span>
                        <h3 className="gradient-text" style={{ fontSize: '1.4rem', marginTop: '0.2rem' }}>Official Regulatory Certificate</h3>
                      </div>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px dashed var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', fontSize: '0.7rem', fontWeight: 800, textAlign: 'center' }}>
                        AETHER<br/>AUDIT
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Entity Name</span>
                        <strong style={{ color: '#fff' }}>{selectedDocPreview.partner?.application?.companyName || 'Rossi Supercars Group Ltd.'}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Registration Reference</span>
                        <strong style={{ color: 'var(--accent-gold)', fontFamily: 'monospace' }}>{selectedDocPreview.partner?.application?.registrationNumber || 'MC-984420-VAT'}</strong>
                      </div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--text-gray)', lineHeight: 1.6 }}>
                      <div>HASH: <span style={{ color: 'var(--accent-cyan)' }}>9f8a3c42b8e7190d65a2f01488c991e0a2d547f891b8429188e02d847192ca10</span></div>
                      <div>TIMESTAMP: 2026-09-23T01:48:00Z • AUDITOR: Alex Admin (Master ID: usr-1)</div>
                      <div>STATUS: <span style={{ color: '#4ade80', fontWeight: 800 }}>CONFIRMED VALID & ACTIVE</span></div>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Fingerprint size={14} /> SHA-256 Verified
                    </span>
                    <button className="btn btn-primary btn-sm" onClick={() => setSelectedDocPreview(null)}>
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* PANEL: ADMIN LISTINGS AUDITS                             */}
        {/* ======================================================== */}
        {activeSubTab === 'admin-listings' && (
          <div>
            {pendingListings.length === 0 ? (
              <div className="glass" style={{ padding: '3.5rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                <CheckCircle2 size={36} style={{ color: '#10b981', margin: '0 auto 1rem auto' }} />
                <p style={{ color: 'var(--text-gray)' }}>No pending listings awaiting safety audit review.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '950px' }}>
                {pendingListings.map((listing) => (
                  <div key={listing.id} className="glass" style={{ display: 'flex', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <div style={{ width: '180px', minWidth: '180px', height: '140px' }}>
                      <img src={listing.coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    
                    <div style={{ padding: '1.4rem', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                          <h4 style={{ fontWeight: 800, fontSize: '1.15rem' }}>{listing.title}</h4>
                          <span className="badge badge-hotel" style={{ fontSize: '0.7rem' }}>{listing.serviceType}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <MapPin size={12} style={{ color: 'var(--accent-cyan)' }} /> {listing.address}, {listing.city}
                        </p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)' }}>
                          Owner: <strong>{listing.owner.firstName} {listing.owner.lastName}</strong> ({listing.owner.email})
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <button className="btn btn-primary" onClick={() => handleApproveListing(listing.id, 'APPROVED')} style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
                          <Check size={14} /> Approve Listing
                        </button>
                        <button className="btn btn-secondary" onClick={() => handleApproveListing(listing.id, 'REJECTED')} style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', color: '#f87171' }}>
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
