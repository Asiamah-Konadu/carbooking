import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, MapPin, Star, Calendar, Users, Clock, 
  ShieldCheck, Heart, Share2, Sparkles, Building2, 
  Car, UtensilsCrossed, Crown, Check, AlertCircle, DollarSign,
  Maximize2, X, MessageSquare
} from 'lucide-react';
import { User } from '../App.tsx';

interface ListingDetail {
  id: string;
  title: string;
  description: string;
  serviceType: string;
  address: string;
  city: string;
  country: string;
  coverImage: string;
  images: string[];
  rating: number;
  ownerId: string;
  owner: { firstName: string; lastName: string; email: string };
  hotelDetails?: { roomType: string; amenities: string[]; pricePerNight: number; capacity: number };
  carDetails?: { carType: string; isRental: boolean; driverName?: string; pricePerDay?: number; pricePerHour?: number; capacity: number; transmission?: string; fuelType?: string };
  diningDetails?: { cuisineType: string; averageCost: number; availableSlots: string[]; seatingCapacity: number };
  reviews: any[];
}

interface DetailProps {
  listingId: string;
  user: User | null;
  token: string | null;
  setPage: (page: string) => void;
  triggerAuthModal: () => void;
  addToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function Detail({ listingId, user, token, setPage, triggerAuthModal, addToast }: DetailProps) {
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Booking Form State
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [guests, setGuests] = useState<number>(1);
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [includeVipProtection, setIncludeVipProtection] = useState<boolean>(true);
  
  // Checkout redirection state
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string>('');
  
  // Active photo carousel & Lightbox state
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [showLightbox, setShowLightbox] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError('');
      try {
        const headers: any = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(`http://localhost:5000/api/listings/${listingId}`, { headers });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to load details');
        }

        setListing(data);
        
        // Auto-select first slot for dining if available
        if (data.diningDetails && data.diningDetails.availableSlots?.length > 0) {
          setTimeSlot(data.diningDetails.availableSlots[0]);
        }
      } catch (err: any) {
        setError(err.message || 'Error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId, token]);

  const calculateDaysOrHours = () => {
    if (!startDate) return 0;
    if (listing?.serviceType === 'PRIVATE_DRIVER') {
      if (!endDate) return 2; // default 2 hours
      const diffHrs = Math.ceil(Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60));
      return Math.max(diffHrs, 1);
    }
    if (!endDate) return 1;
    const days = Math.ceil(Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(days, 1);
  };

  const calculateSubtotal = () => {
    if (!listing) return 0;
    const units = calculateDaysOrHours();
    
    if (listing.serviceType === 'HOTEL' && listing.hotelDetails) {
      if (!startDate || !endDate) return 0;
      return units * listing.hotelDetails.pricePerNight;
    }
    
    if (listing.serviceType === 'CAR_RENTAL' && listing.carDetails?.pricePerDay) {
      if (!startDate || !endDate) return 0;
      return units * listing.carDetails.pricePerDay;
    }

    if (listing.serviceType === 'PRIVATE_DRIVER' && listing.carDetails?.pricePerHour) {
      if (!startDate) return 0;
      return units * listing.carDetails.pricePerHour;
    }

    if (listing.serviceType === 'RESTAURANT') {
      return 0; // free reservation slot booking
    }

    return 0;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      triggerAuthModal();
      return;
    }

    if (user.role !== 'CUSTOMER') {
      setBookingError('Reservations are restricted to Customer accounts. Please switch to a customer profile.');
      return;
    }

    setBookingLoading(true);
    setBookingError('');

    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          listingId: listing!.id,
          startDate,
          endDate: endDate || null,
          timeSlot: timeSlot || null,
          guestCount: guests,
          specialNotes: includeVipProtection ? `[VIP Concierge Protected] ${specialNotes}` : specialNotes
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register booking session');
      }

      if (addToast) {
        addToast('Reservation session created! Redirecting to secure checkout...', 'success');
      }

      // Redirect user to Stripe Checkout session page (or mock payment success url)
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err: any) {
      setBookingError(err.message || 'Error creating booking');
      setBookingLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    if (addToast) {
      addToast('Listing URL copied to clipboard!', 'info');
    }
  };

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '500px' }}>
        <div className="gradient-gold-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          Loading visual inventory details...
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem' }}>
        <div className="badge badge-rejected" style={{ padding: '1rem 2rem', fontSize: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error || 'Listing details not found.'}</span>
        </div>
        <button className="btn btn-secondary" onClick={() => setPage('home')}>
          <ArrowLeft size={16} />
          <span>Back to Explore</span>
        </button>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const unitsCount = calculateDaysOrHours();
  const serviceFee = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;
  const vipFee = (subtotal > 0 && includeVipProtection) ? 250 : 0;
  const grandTotal = subtotal + serviceFee + vipFee;

  const allImages = listing.images && listing.images.length > 0 ? listing.images : [listing.coverImage];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: '1320px', margin: '0 auto', padding: '2rem 4rem 6rem 4rem', width: '100%' }}>
      
      {/* Top CTA Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button 
          onClick={() => setPage('listings')} 
          style={{ background: 'none', border: 'none', color: 'var(--text-gray)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.92rem', fontWeight: 600, transition: 'var(--transition-fast)' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Reservations Search</span>
        </button>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            onClick={handleShare}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <Share2 size={15} />
            <span>Share</span>
          </button>
          <button 
            onClick={() => {
              setIsFavorite(!isFavorite);
              if (addToast) addToast(!isFavorite ? 'Saved to curated wishlist' : 'Removed from wishlist', 'info');
            }}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: isFavorite ? '#f43f5e' : 'var(--text-white)' }}
          >
            <Heart size={15} fill={isFavorite ? '#f43f5e' : 'none'} />
            <span>{isFavorite ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div style={{ display: 'flex', gap: '3.5rem', flexWrap: 'wrap' }}>
        
        {/* Left Column: Gallery, Specs & Reviews */}
        <div style={{ flex: '1 1 680px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          <div>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.8rem' }}>
              {listing.serviceType === 'HOTEL' && <span className="badge badge-hotel"><Building2 size={12} /> Luxury Hotel</span>}
              {listing.serviceType === 'CAR_RENTAL' && <span className="badge badge-car"><Car size={12} /> Sports Rental</span>}
              {listing.serviceType === 'PRIVATE_DRIVER' && <span className="badge badge-driver"><Crown size={12} /> Private Chauffeur</span>}
              {listing.serviceType === 'RESTAURANT' && <span className="badge badge-dining"><UtensilsCrossed size={12} /> Fine Dining</span>}
            </div>

            <h1 style={{ fontSize: '2.6rem', fontWeight: 900, lineHeight: 1.15, marginBottom: '0.8rem', color: 'var(--text-white)' }}>
              {listing.title}
            </h1>
            
            <div style={{ display: 'flex', gap: '1.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-gold)', fontSize: '0.95rem', fontWeight: 800 }}>
                <Star size={16} fill="var(--accent-gold)" />
                <span>{listing.rating.toFixed(1)} verified client rating</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-gray)', fontSize: '0.9rem' }}>
                <MapPin size={15} style={{ color: 'var(--accent-cyan)' }} />
                <span>{listing.address}, {listing.city}, {listing.country}</span>
              </div>
            </div>
          </div>

          {/* Gallery Carousel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div 
              style={{ height: '420px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
              onClick={() => setShowLightbox(true)}
            >
              <img 
                src={allImages[activePhotoIdx] || listing.coverImage} 
                alt="Main View" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                background: 'rgba(7, 7, 14, 0.8)',
                backdropFilter: 'blur(8px)',
                padding: '0.4rem 0.8rem',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                border: '1px solid var(--border-glass)',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                <Maximize2 size={13} />
                <span>View Fullscreen ({activePhotoIdx + 1}/{allImages.length})</span>
              </div>
            </div>

            {allImages.length > 1 && (
              <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
                {allImages.map((imgUrl, index) => (
                  <div 
                    key={index}
                    onClick={() => setActivePhotoIdx(index)}
                    style={{
                      width: '110px',
                      height: '75px',
                      minWidth: '110px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: activePhotoIdx === index ? '2px solid var(--accent-gold)' : '2px solid transparent',
                      opacity: activePhotoIdx === index ? 1 : 0.6,
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    <img src={imgUrl} alt="Thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Space Description */}
          <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem' }} className="gradient-text">
              About this Space & Experience
            </h2>
            <p style={{ color: 'var(--text-gray)', lineHeight: 1.7, fontSize: '0.98rem' }}>
              {listing.description}
            </p>
          </div>

          {/* Specific Service Specs */}
          {listing.serviceType === 'HOTEL' && listing.hotelDetails && (
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.2rem' }} className="gradient-text">
                Suite Inclusions & Amenities
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                {listing.hotelDetails.amenities.map((item, index) => (
                  <div key={index} style={{ padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ color: 'var(--accent-gold)' }}><Check size={16} /></div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-white)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {listing.serviceType === 'RESTAURANT' && listing.diningDetails && (
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.2rem' }} className="gradient-text">
                Gastronomy Specifications
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                  <div style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.3rem' }}>
                    <UtensilsCrossed size={14} /> Cuisine Type
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{listing.diningDetails.cuisineType}</div>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                  <div style={{ color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.3rem' }}>
                    <DollarSign size={14} /> Average Cost
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>GH₵{listing.diningDetails.averageCost} for two</div>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                  <div style={{ color: '#c084fc', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.3rem' }}>
                    <Users size={14} /> Capacity
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Max {listing.diningDetails.seatingCapacity} seats</div>
                </div>
              </div>
            </div>
          )}

          {/* Verified Customer Reviews */}
          <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }} className="gradient-text">
                Verified Guest Reviews ({listing.reviews.length})
              </h2>
            </div>
            
            {listing.reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-gray)' }}>
                <MessageSquare size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 0.8rem auto' }} />
                <p style={{ fontSize: '0.92rem' }}>No reviews posted yet. Be the first guest to reserve and share your review!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {listing.reviews.map((r, i) => (
                  <div key={i} style={{ padding: '1.2rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-white)' }}>{r.user.firstName} {r.user.lastName}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-gold)', fontSize: '0.85rem' }}>
                        <Star size={13} fill="var(--accent-gold)" />
                        <span style={{ fontWeight: 800 }}>{r.rating} / 5</span>
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem', lineHeight: 1.5 }}>"{r.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Booking Card with Dynamic Cost Breakdown */}
        <div style={{ flex: '1 1 380px', position: 'sticky', top: '100px', height: 'fit-content' }}>
          <div className="glass" style={{
            borderRadius: 'var(--radius-xl)',
            padding: '2.2rem',
            border: '1px solid var(--border-gold)',
            boxShadow: 'var(--shadow-gold)'
          }}>
            {/* Header Pricing Tag */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.2rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.6px' }}>RESERVATION RATE</span>
              <div>
                {listing.serviceType === 'HOTEL' && (
                  <>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-white)' }}>GH₵{listing.hotelDetails?.pricePerNight}</span>
                    <span style={{ color: 'var(--text-gray)', fontSize: '0.88rem' }}> / night</span>
                  </>
                )}
                {listing.serviceType === 'CAR_RENTAL' && (
                  <>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-white)' }}>GH₵{listing.carDetails?.pricePerDay}</span>
                    <span style={{ color: 'var(--text-gray)', fontSize: '0.88rem' }}> / day</span>
                  </>
                )}
                {listing.serviceType === 'PRIVATE_DRIVER' && (
                  <>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-white)' }}>GH₵{listing.carDetails?.pricePerHour}</span>
                    <span style={{ color: 'var(--text-gray)', fontSize: '0.88rem' }}> / hour</span>
                  </>
                )}
                {listing.serviceType === 'RESTAURANT' && (
                  <>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>COMPLIMENTARY</span>
                    <span style={{ color: 'var(--text-gray)', fontSize: '0.88rem', display: 'block', textAlign: 'right' }}>table hold</span>
                  </>
                )}
              </div>
            </div>

            {/* Error notifications */}
            {bookingError && (
              <div className="badge badge-rejected" style={{ width: '100%', padding: '0.8rem', marginBottom: '1.2rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'none', fontSize: '0.82rem' }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{bookingError}</span>
              </div>
            )}

            {/* Reservation Form */}
            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <Calendar size={13} style={{ color: 'var(--accent-gold)' }} />
                  {listing.serviceType === 'HOTEL' ? 'Check-In Date' : 'Pickup / Start Date'}
                </label>
                <input 
                  type="date" 
                  required
                  className="input-field" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {listing.serviceType !== 'RESTAURANT' && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">
                    <Calendar size={13} style={{ color: 'var(--accent-gold)' }} />
                    {listing.serviceType === 'HOTEL' ? 'Check-Out Date' : 'Drop-off / End Date'}
                  </label>
                  <input 
                    type="date" 
                    required
                    className="input-field" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              )}

              {listing.serviceType === 'RESTAURANT' && listing.diningDetails && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">
                    <Clock size={13} style={{ color: 'var(--accent-gold)' }} /> Available Table Slots
                  </label>
                  <select 
                    className="input-field"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                  >
                    {listing.diningDetails.availableSlots.map((slot, index) => (
                      <option key={index} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <Users size={13} style={{ color: 'var(--accent-gold)' }} /> Party Size / Guests
                </label>
                <input 
                  type="number" 
                  min={1} 
                  required
                  max={listing.hotelDetails?.capacity || listing.carDetails?.capacity || 12}
                  className="input-field" 
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                <label className="form-label">Special Concierge Requests</label>
                <textarea 
                  placeholder="E.g. Champagne upon arrival, VIP high floor, airport tarmac meetup..." 
                  className="input-field" 
                  rows={2}
                  style={{ resize: 'none', fontSize: '0.88rem' }}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                />
              </div>

              {/* VIP Concierge Protection Toggle */}
              {subtotal > 0 && (
                <div 
                  onClick={() => setIncludeVipProtection(!includeVipProtection)}
                  style={{
                    padding: '0.8rem 1rem',
                    background: includeVipProtection ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255,255,255,0.02)',
                    border: includeVipProtection ? '1px solid var(--border-gold)' : '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={16} style={{ color: includeVipProtection ? 'var(--accent-gold)' : 'var(--text-gray)' }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>VIP Host Protection & Flex-Cancel</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-gold)' }}>+GH₵250</span>
                </div>
              )}

              {/* Transparent Cost Breakdown */}
              {subtotal > 0 && (
                <div style={{
                  padding: '1.2rem',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-gray)' }}>
                    <span>Base rate ({unitsCount} {listing.serviceType === 'PRIVATE_DRIVER' ? 'hours' : 'days'})</span>
                    <span style={{ color: 'var(--text-white)' }}>GH₵{subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-gray)' }}>
                    <span>Service & Security Auditing</span>
                    <span style={{ color: 'var(--text-white)' }}>GH₵{serviceFee.toFixed(2)}</span>
                  </div>
                  {includeVipProtection && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-gray)' }}>
                      <span>VIP Concierge Coverage</span>
                      <span style={{ color: 'var(--text-white)' }}>GH₵250.00</span>
                    </div>
                  )}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border-glass)',
                    paddingTop: '0.7rem',
                    marginTop: '0.3rem'
                  }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Total Est. Subtotal</span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-gold)' }}>GH₵{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Booking CTA Button */}
              {user ? (
                user.role === 'CUSTOMER' ? (
                  <button 
                    type="submit" 
                    disabled={bookingLoading}
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginTop: '0.5rem' }}
                  >
                    <Sparkles size={16} />
                    <span>{bookingLoading ? 'Initiating Stripe Session...' : 'Confirm & Reserve Space'}</span>
                  </button>
                ) : (
                  <div className="badge badge-pending" style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', textTransform: 'none', fontSize: '0.82rem' }}>
                    <ShieldCheck size={14} /> Signed in as {user.role}. Bookings require a Customer account.
                  </div>
                )
              ) : (
                <button 
                  type="button" 
                  className="btn btn-accent" 
                  onClick={triggerAuthModal}
                  style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginTop: '0.5rem' }}
                >
                  <span>Sign In to Reserve</span>
                </button>
              )}
            </form>

            <div style={{ marginTop: '1.2rem', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-gray)', lineHeight: 1.4 }}>
              <ShieldCheck size={16} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
              <span>Stripe Checkout certified. Guaranteed reservation with direct host verification.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Lightbox Fullscreen Modal */}
      {showLightbox && (
        <div 
          onClick={() => setShowLightbox(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.92)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <button 
            onClick={() => setShowLightbox(false)}
            style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
          >
            <X size={32} />
          </button>
          <img 
            src={allImages[activePhotoIdx] || listing.coverImage} 
            alt="Fullscreen Preview" 
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
