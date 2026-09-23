import React, { useState, useEffect } from 'react';
import { 
  Calendar, User as UserIcon, 
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
  const [pendingPartners, setPendingPartners] = useState<any[]>([]);
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
            {pendingPartners.length === 0 ? (
              <div className="glass" style={{ padding: '3.5rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                <CheckCircle2 size={36} style={{ color: '#10b981', margin: '0 auto 1rem auto' }} />
                <p style={{ color: 'var(--text-gray)' }}>All partner applications have been audited and resolved.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '850px' }}>
                {pendingPartners.map((partner) => (
                  <div key={partner.id} className="glass" style={{ padding: '1.6rem', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.3rem' }}>{partner.firstName} {partner.lastName}</h4>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-gray)' }}>Email: <strong style={{ color: '#fff' }}>{partner.email}</strong> | Phone: {partner.phoneNumber || 'N/A'}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-gray)', marginTop: '0.2rem' }}>Applied: {new Date(partner.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                      <button className="btn btn-primary" onClick={() => handleApprovePartner(partner.id, 'APPROVED')} style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
                        <Check size={14} /> Approve Partner
                      </button>
                      <button className="btn btn-secondary" onClick={() => handleApprovePartner(partner.id, 'REJECTED')} style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', color: '#f87171' }}>
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
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
