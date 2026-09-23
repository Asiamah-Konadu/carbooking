import React, { useState, useEffect } from 'react';
import { 
  Search, Building2, Car, UtensilsCrossed, Sparkles, MapPin, 
  Calendar, Users, Star, Globe, ArrowRight, ShieldCheck, 
  Zap, HeartHandshake, ChevronRight, Crown
} from 'lucide-react';
import { SearchParams } from '../App.tsx';

interface Listing {
  id: string;
  title: string;
  description: string;
  serviceType: string;
  coverImage: string;
  city: string;
  country: string;
  rating: number;
  hotelDetails?: { pricePerNight: number };
  carDetails?: { pricePerDay?: number; pricePerHour?: number; isRental: boolean };
  diningDetails?: { cuisineType: string; averageCost: number };
}

interface HomeProps {
  navigateToListings: (params: SearchParams) => void;
  navigateToDetail: (id: string) => void;
}

export default function Home({ navigateToListings, navigateToDetail }: HomeProps) {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [city, setCity] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [guests, setGuests] = useState<number>(1);

  // Featured listings state
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/listings');
        const data = await res.json();
        if (Array.isArray(data)) {
          // Take first 3 for featured section
          setListings(data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching featured listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateToListings({
      serviceType: activeTab,
      city,
      startDate,
      endDate,
      guests
    });
  };

  const getPriceDisplay = (listing: Listing) => {
    if (listing.serviceType === 'HOTEL' && listing.hotelDetails) {
      return (
        <span>
          <span style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '1.25rem' }}>
            ${listing.hotelDetails.pricePerNight}
          </span>
          <span style={{ color: 'var(--text-gray)', fontSize: '0.82rem' }}> / night</span>
        </span>
      );
    }
    if ((listing.serviceType === 'CAR_RENTAL' || listing.serviceType === 'PRIVATE_DRIVER') && listing.carDetails) {
      const isRental = listing.carDetails.isRental;
      const price = isRental ? listing.carDetails.pricePerDay : listing.carDetails.pricePerHour;
      const unit = isRental ? 'day' : 'hour';
      return (
        <span>
          <span style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '1.25rem' }}>
            ${price}
          </span>
          <span style={{ color: 'var(--text-gray)', fontSize: '0.82rem' }}> / {unit}</span>
        </span>
      );
    }
    if (listing.serviceType === 'RESTAURANT' && listing.diningDetails) {
      return (
        <span>
          <span style={{ color: 'var(--text-white)', fontWeight: 700, fontSize: '1.05rem' }}>
            {listing.diningDetails.cuisineType}
          </span>
          <span style={{ color: 'var(--text-gray)', fontSize: '0.8rem', display: 'block' }}>
            Avg. ${listing.diningDetails.averageCost} for two
          </span>
        </span>
      );
    }
    return null;
  };

  const getServiceBadge = (type: string) => {
    switch (type) {
      case 'HOTEL':
        return (
          <span className="badge badge-hotel">
            <Building2 size={12} /> Hotel
          </span>
        );
      case 'CAR_RENTAL':
        return (
          <span className="badge badge-car">
            <Car size={12} /> Rental
          </span>
        );
      case 'PRIVATE_DRIVER':
        return (
          <span className="badge badge-driver">
            <Crown size={12} /> Chauffeur
          </span>
        );
      case 'RESTAURANT':
        return (
          <span className="badge badge-dining">
            <UtensilsCrossed size={12} /> Dining
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease', width: '100%' }}>
      {/* Immersive Hero Section */}
      <header style={{
        position: 'relative',
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem 8rem 2rem',
        backgroundImage: 'linear-gradient(to bottom, rgba(7, 7, 12, 0.45) 0%, rgba(7, 7, 12, 0.96) 100%), url("https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1800")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '900px', marginBottom: '1.5rem', animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'rgba(255, 255, 255, 0.07)', 
            border: '1px solid var(--border-gold)', 
            padding: '0.45rem 1.1rem', 
            borderRadius: '40px', 
            marginBottom: '1.5rem', 
            color: 'var(--accent-gold)',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.15)'
          }}>
            <Sparkles size={15} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px' }}>
              The Luxury Travel Experience
            </span>
          </div>
          
          <h1 style={{ fontSize: '3.6rem', fontWeight: 900, lineHeight: 1.12, marginBottom: '1.3rem', letterSpacing: '-1.5px' }}>
            Elevate Your Journey: <span className="gradient-gold-text">Accommodations</span>, Chauffeurs & <span className="gradient-cyan-text">Fine Dining</span>
          </h1>
          
          <p style={{ fontSize: '1.15rem', color: 'var(--text-gray)', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto' }}>
            Consolidate your elite travel agenda into a single unified dashboard. Reserve vetted presidential suites, luxury sports cars, personal chauffeurs, and Michelin-starred culinary reservations.
          </p>
        </div>

        {/* Unified Search Widget */}
        <div className="glass" style={{
          width: '92%',
          maxWidth: '1050px',
          borderRadius: 'var(--radius-xl)',
          padding: '1.8rem 2.2rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(245, 158, 11, 0.12)',
          border: '1px solid var(--border-gold)',
          position: 'relative',
          zIndex: 10,
          marginTop: '1.5rem'
        }}>
          {/* Tab Selector */}
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem', flexWrap: 'wrap' }}>
            <button 
              type="button"
              className={`btn ${activeTab === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('ALL')}
              style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}
            >
              <Globe size={15} />
              <span>All Services</span>
            </button>
            <button 
              type="button"
              className={`btn ${activeTab === 'HOTEL' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('HOTEL')}
              style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}
            >
              <Building2 size={15} />
              <span>Hotels & Suites</span>
            </button>
            <button 
              type="button"
              className={`btn ${activeTab === 'CAR_RENTAL' || activeTab === 'CAR' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('CAR')}
              style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}
            >
              <Car size={15} />
              <span>Cars & Chauffeurs</span>
            </button>
            <button 
              type="button"
              className={`btn ${activeTab === 'RESTAURANT' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('RESTAURANT')}
              style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}
            >
              <UtensilsCrossed size={15} />
              <span>Fine Dining</span>
            </button>
          </div>

          {/* Search Fields Grid */}
          <form onSubmit={handleSearchSubmit} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) auto',
            gap: '1.2rem',
            alignItems: 'end'
          }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                <MapPin size={13} style={{ color: 'var(--accent-gold)' }} /> Destination City
              </label>
              <input 
                type="text" 
                placeholder="e.g. Paris, Tokyo, New York..." 
                className="input-field" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                <Calendar size={13} style={{ color: 'var(--accent-gold)' }} /> Start / Arrival Date
              </label>
              <input 
                type="date" 
                className="input-field" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                <Calendar size={13} style={{ color: 'var(--accent-gold)' }} /> Departure / End Date
              </label>
              <input 
                type="date" 
                className="input-field" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0, minWidth: '110px' }}>
              <label className="form-label">
                <Users size={13} style={{ color: 'var(--accent-gold)' }} /> Guests
              </label>
              <input 
                type="number" 
                min={1} 
                max={20}
                className="input-field" 
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.8rem', height: '46px' }}>
              <Search size={17} />
              <span>Search</span>
            </button>
          </form>
        </div>
      </header>

      {/* Animated Live Metric Stats Strip */}
      <section style={{
        background: 'rgba(10, 10, 18, 0.85)',
        borderTop: '1px solid var(--border-glass)',
        borderBottom: '1px solid var(--border-glass)',
        padding: '2rem 4rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900 }} className="gradient-gold-text">500+</span>
            <span style={{ color: 'var(--text-gray)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>Luxury Suites & Villas</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900 }} className="gradient-cyan-text">150+</span>
            <span style={{ color: 'var(--text-gray)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>Chauffeurs & Supercars</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900 }} className="gradient-violet-text">80+</span>
            <span style={{ color: 'var(--text-gray)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>Michelin Star Tables</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#34d399' }}>99.8%</span>
            <span style={{ color: 'var(--text-gray)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>Client Satisfaction</span>
          </div>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section style={{ maxWidth: '1300px', margin: '0 auto', padding: '5rem 4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
              <Crown size={15} /> Hand-Selected Inventory
            </div>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 800 }} className="gradient-text">
              Featured Luxury Experiences
            </h2>
          </div>
          
          <button 
            className="btn btn-secondary" 
            onClick={() => navigateToListings({ serviceType: 'ALL', city: '', startDate: '', endDate: '', guests: 1 })}
          >
            <span>Explore Complete Collection</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <div className="gradient-gold-text" style={{ fontSize: '1.1rem', fontWeight: 600 }}>Curating exceptional spaces...</div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2.2rem'
          }}>
            {listings.map((item) => (
              <div 
                key={item.id}
                className="glass glass-interactive"
                onClick={() => navigateToDetail(item.id)}
                style={{
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ height: '230px', position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src={item.coverImage} 
                    alt={item.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                    {getServiceBadge(item.serviceType)}
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(8px)',
                    padding: '0.35rem 0.7rem',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    border: '1px solid var(--border-glass)',
                    fontSize: '0.82rem',
                    fontWeight: 800
                  }}>
                    <Star size={13} fill="var(--accent-gold)" style={{ color: 'var(--accent-gold)' }} />
                    <span>{item.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div style={{ padding: '1.6rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ color: 'var(--text-gray)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
                      <MapPin size={13} style={{ color: 'var(--accent-cyan)' }} /> {item.city}, {item.country}
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--text-white)' }}>
                      {item.title}
                    </h3>
                    <p style={{ color: 'var(--text-gray)', fontSize: '0.88rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
                    <div>
                      {getPriceDisplay(item)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-gold)', fontWeight: 600, fontSize: '0.85rem' }}>
                      <span>Details</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Curated Luxury Pillars */}
      <section style={{
        background: 'linear-gradient(180deg, rgba(10, 10, 18, 0.6) 0%, rgba(7, 7, 12, 1) 100%)',
        padding: '5rem 4rem',
        borderTop: '1px solid var(--border-glass)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem auto' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem' }} className="gradient-text">
              The Aether Standard
            </h2>
            <p style={{ color: 'var(--text-gray)', fontSize: '1rem', lineHeight: 1.6 }}>
              Crafted exclusively for discerning travelers requiring seamless luxury across all touchpoints of their itinerary.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            <div className="glass" style={{ padding: '2.2rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Admin Verified Quality</h3>
              <p style={{ color: 'var(--text-gray)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Every partner host, fleet vehicle, and dining space is manually audited for five-star sanitation and premium service delivery.
              </p>
            </div>

            <div className="glass" style={{ padding: '2.2rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(6, 182, 212, 0.12)', border: '1px solid var(--border-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Synchronized Agenda</h3>
              <p style={{ color: 'var(--text-gray)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Book your airport pickup, penthouse suite, and evening tasting menu within one synchronized itinerary.
              </p>
            </div>

            <div className="glass" style={{ padding: '2.2rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-violet)' }}>
                <HeartHandshake size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>24/7 VIP Concierge</h3>
              <p style={{ color: 'var(--text-gray)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Dedicated reservation specialists assist with custom flight timing, bespoke culinary requests, and vehicle requests.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
