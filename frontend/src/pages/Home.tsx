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

const GHANA_CARS: any[] = [
  {
    id: 'sc-1',
    title: 'BMW X5 xDrive40i',
    description: 'Premium luxury SUV with xDrive all-wheel drive, panoramic roof, and Harman Kardon sound system. Perfect for Accra business travel and long-haul comfort.',
    serviceType: 'CAR_RENTAL',
    coverImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800',
    city: 'Accra',
    country: 'Ghana',
    rating: 4.9,
    carDetails: { pricePerDay: 850, isRental: true },
  },
  {
    id: 'sc-2',
    title: 'Mercedes-Benz GLE 450',
    description: 'Executive-class SUV with AMG styling, air suspension, and Burmester surround sound. Ideal for VIP transfers across Greater Accra and Kumasi.',
    serviceType: 'CAR_RENTAL',
    coverImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800',
    city: 'Accra',
    country: 'Ghana',
    rating: 4.8,
    carDetails: { pricePerDay: 780, isRental: true },
  },
  {
    id: 'sc-3',
    title: 'Toyota Land Cruiser V8',
    description: "Ghana's most iconic VIP 4x4. Unmatched power and prestige for cross-country trips, corporate convoys, and tough terrain — the ultimate road presence.",
    serviceType: 'PRIVATE_DRIVER',
    coverImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800',
    city: 'Kumasi',
    country: 'Ghana',
    rating: 4.9,
    carDetails: { pricePerHour: 280, isRental: false },
  },
];

const HERO_IMG = 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=1800';

export default function Home({ navigateToListings, navigateToDetail }: HomeProps) {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [city, setCity] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [guests, setGuests] = useState<number>(1);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/listings');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setListings(data.slice(0, 3));
        } else {
          setListings(GHANA_CARS);
        }
      } catch {
        setListings(GHANA_CARS);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateToListings({ serviceType: activeTab, city, startDate, endDate, guests });
  };

  const getPriceDisplay = (listing: Listing) => {
    if (listing.serviceType === 'HOTEL' && listing.hotelDetails) {
      return (
        <span>
          <span style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '1.25rem' }}>
            GH&#8373;{listing.hotelDetails.pricePerNight}
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
            GH&#8373;{price}
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
            Avg. GH&#8373;{listing.diningDetails.averageCost} for two
          </span>
        </span>
      );
    }
    return null;
  };

  const getServiceBadge = (type: string) => {
    if (type === 'HOTEL') return <span className="badge badge-hotel"><Building2 size={12} /> Hotel</span>;
    if (type === 'CAR_RENTAL') return <span className="badge badge-car"><Car size={12} /> Rental</span>;
    if (type === 'PRIVATE_DRIVER') return <span className="badge badge-driver"><Crown size={12} /> Chauffeur</span>;
    if (type === 'RESTAURANT') return <span className="badge badge-dining"><UtensilsCrossed size={12} /> Dining</span>;
    return null;
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease', width: '100%' }}>

      {/* ─── HERO — Ghana Skyline ─── */}
      <header style={{
        position: 'relative',
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem 8rem 2rem',
        backgroundImage: `linear-gradient(to bottom, rgba(7,7,12,0.38) 0%, rgba(7,7,12,0.96) 100%), url("${HERO_IMG}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '920px', marginBottom: '1.5rem', animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(255,255,255,0.07)', border: '1px solid var(--border-gold)',
            padding: '0.45rem 1.1rem', borderRadius: '40px', marginBottom: '1.5rem',
            color: 'var(--accent-gold)', boxShadow: '0 0 20px rgba(245,158,11,0.15)',
          }}>
            <Sparkles size={15} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px' }}>
              Ghana's Premier Luxury Travel Platform
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', fontWeight: 900, lineHeight: 1.12, marginBottom: '1.3rem', letterSpacing: '-1.5px' }}>
            Experience Ghana in{' '}
            <span className="gradient-gold-text">Absolute Luxury</span>: Stays, Chauffeurs &amp;{' '}
            <span className="gradient-cyan-text">Fine Dining</span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-gray)', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto' }}>
            Ghana's #1 luxury booking platform. Reserve 5-star hotels in Accra and Kumasi, cruise in a
            BMW xDrive, Mercedes GLE or Toyota Land Cruiser V8, and savour the finest Ghanaian and
            international dining experiences.
          </p>
        </div>

        {/* Search Widget */}
        <div className="glass" style={{
          width: '92%', maxWidth: '1050px', borderRadius: 'var(--radius-xl)',
          padding: '1.8rem 2.2rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(245,158,11,0.12)',
          border: '1px solid var(--border-gold)', position: 'relative', zIndex: 10, marginTop: '1.5rem',
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem', flexWrap: 'wrap' }}>
            {[
              { k: 'ALL',        label: 'All Services',      icon: <Globe size={15} /> },
              { k: 'HOTEL',      label: 'Hotels & Suites',   icon: <Building2 size={15} /> },
              { k: 'CAR',        label: 'Cars & Chauffeurs', icon: <Car size={15} /> },
              { k: 'RESTAURANT', label: 'Fine Dining',       icon: <UtensilsCrossed size={15} /> },
            ].map(tab => (
              <button
                key={tab.k}
                type="button"
                className={`btn ${activeTab === tab.k || (tab.k === 'CAR' && activeTab === 'CAR_RENTAL') ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab(tab.k)}
                style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Form fields */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) auto', gap: '1.2rem', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label"><MapPin size={13} style={{ color: 'var(--accent-gold)' }} /> City / District</label>
              <input type="text" placeholder="Accra, Kumasi, Takoradi..." className="input-field" value={city} onChange={e => setCity(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label"><Calendar size={13} style={{ color: 'var(--accent-gold)' }} /> Start / Arrival Date</label>
              <input type="date" className="input-field" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label"><Calendar size={13} style={{ color: 'var(--accent-gold)' }} /> Departure / End Date</label>
              <input type="date" className="input-field" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0, minWidth: '110px' }}>
              <label className="form-label"><Users size={13} style={{ color: 'var(--accent-gold)' }} /> Guests</label>
              <input type="number" min={1} max={20} className="input-field" value={guests} onChange={e => setGuests(parseInt(e.target.value) || 1)} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.8rem', height: '46px' }}>
              <Search size={17} /><span>Search</span>
            </button>
          </form>
        </div>
      </header>

      {/* ─── METRICS STRIP ─── */}
      <section style={{ background: 'rgba(10,10,18,0.85)', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)', padding: '2rem 4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900 }} className="gradient-gold-text">120+</span>
            <span style={{ color: 'var(--text-gray)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>Luxury Hotels &amp; Suites</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900 }} className="gradient-cyan-text">80+</span>
            <span style={{ color: 'var(--text-gray)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>Luxury Cars &amp; Chauffeurs</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900 }} className="gradient-violet-text">50+</span>
            <span style={{ color: 'var(--text-gray)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>Premium Dining Spots</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#34d399' }}>99.8%</span>
            <span style={{ color: 'var(--text-gray)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>Client Satisfaction</span>
          </div>
        </div>
      </section>

      {/* ─── GHANA CARS SHOWCASE ─── */}
      <section style={{ background: 'linear-gradient(180deg, rgba(7,7,12,1) 0%, rgba(10,10,18,0.85) 100%)', padding: '4.5rem 4rem 2rem 4rem', borderBottom: '1px solid var(--border-glass)' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.6rem' }}>
              <Car size={15} /> Ghana's Most Wanted Fleet
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }} className="gradient-text">Drive Ghana's Finest Wheels</h2>
            <p style={{ color: 'var(--text-gray)', marginTop: '0.6rem', fontSize: '0.95rem' }}>
              From the streets of Osu to the hills of Kumasi — iconic luxury and pure style
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.2rem' }}>
            {[
              { model: 'BMW X5 xDrive', badge: 'Most Popular', bc: 'var(--accent-gold)', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=600', desc: 'Ultimate Driving Machine' },
              { model: 'Mercedes GLE 450', badge: 'Executive Pick', bc: 'var(--accent-cyan)', img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=600', desc: 'Corporate Class' },
              { model: 'Toyota Land Cruiser V8', badge: 'Icon of Ghana', bc: '#34d399', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600', desc: 'Unstoppable on any road' },
              { model: 'Toyota Vitz / Yaris', badge: 'City Cruiser', bc: 'var(--accent-violet)', img: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=600', desc: 'Smart & Elegant' },
            ].map(car => (
              <div
                key={car.model}
                className="glass glass-interactive"
                onClick={() => navigateToListings({ serviceType: 'CAR', city: '', startDate: '', endDate: '', guests: 1 })}
                style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', cursor: 'pointer' }}
              >
                <div style={{ height: '165px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={car.img} alt={car.model}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  <div style={{ position: 'absolute', top: '0.7rem', left: '0.7rem', background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', border: `1px solid ${car.bc}`, borderRadius: '20px', padding: '0.25rem 0.65rem', fontSize: '0.68rem', fontWeight: 800, color: car.bc, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {car.badge}
                  </div>
                </div>
                <div style={{ padding: '1rem 1.2rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '0.2rem' }}>{car.model}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-gray)' }}>{car.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED COLLECTION ─── */}
      <section style={{ maxWidth: '1300px', margin: '0 auto', padding: '5rem 4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
              <Crown size={15} /> Hand-Selected in Ghana
            </div>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 800 }} className="gradient-text">Featured Luxury Experiences</h2>
          </div>
          <button className="btn btn-secondary" onClick={() => navigateToListings({ serviceType: 'ALL', city: '', startDate: '', endDate: '', guests: 1 })}>
            <span>Explore Complete Collection</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <div className="gradient-gold-text" style={{ fontSize: '1.1rem', fontWeight: 600 }}>Curating Ghana's finest...</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.2rem' }}>
            {listings.map(item => (
              <div
                key={item.id}
                className="glass glass-interactive"
                onClick={() =>
                  (item.id as string).startsWith('sc-')
                    ? navigateToListings({ serviceType: 'CAR', city: '', startDate: '', endDate: '', guests: 1 })
                    : navigateToDetail(item.id)
                }
                style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ height: '230px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={item.coverImage} alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>{getServiceBadge(item.serviceType)}</div>
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '0.35rem 0.7rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.3rem', border: '1px solid var(--border-glass)', fontSize: '0.82rem', fontWeight: 800 }}>
                    <Star size={13} fill="var(--accent-gold)" style={{ color: 'var(--accent-gold)' }} />
                    <span>{item.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div style={{ padding: '1.6rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ color: 'var(--text-gray)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
                      <MapPin size={13} style={{ color: 'var(--accent-cyan)' }} /> {item.city}, {item.country}
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--text-white)' }}>{item.title}</h3>
                    <p style={{ color: 'var(--text-gray)', fontSize: '0.88rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
                    <div>{getPriceDisplay(item)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-gold)', fontWeight: 600, fontSize: '0.85rem' }}>
                      <span>Details</span><ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── GHANA HOTEL LANDSCAPES ─── */}
      <section style={{ padding: '0 4rem 5rem 4rem', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.6rem' }}>
            <Building2 size={15} /> Ghana's Finest Addresses
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }} className="gradient-text">Iconic Ghana Destinations</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {[
            { name: 'Kempinski Hotel Gold Coast City', city: 'Accra', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800', tag: '5-Star Landmark' },
            { name: 'Labadi Beach Hotel', city: 'Accra', img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800', tag: 'Beachfront Resort' },
            { name: 'The Georgian Royal Golf Resort', city: 'Kumasi', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800', tag: 'Golf & Luxury' },
          ].map(hotel => (
            <div
              key={hotel.name}
              className="glass glass-interactive"
              onClick={() => navigateToListings({ serviceType: 'HOTEL', city: hotel.city, startDate: '', endDate: '', guests: 1 })}
              style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', cursor: 'pointer' }}
            >
              <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={hotel.img} alt={hotel.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,7,12,0.88) 0%, transparent 55%)' }} />
                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.3rem' }}>{hotel.tag}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>{hotel.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-gray)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                    <MapPin size={12} style={{ color: 'var(--accent-cyan)' }} /> {hotel.city}, Ghana
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── LUXURY PILLARS ─── */}
      <section style={{ background: 'linear-gradient(180deg, rgba(10,10,18,0.6) 0%, rgba(7,7,12,1) 100%)', padding: '5rem 4rem', borderTop: '1px solid var(--border-glass)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem auto' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem' }} className="gradient-text">The Aether Ghana Standard</h2>
            <p style={{ color: 'var(--text-gray)', fontSize: '1rem', lineHeight: 1.6 }}>
              Built exclusively for discerning Ghanaians and visitors requiring seamless premium
              experiences across Accra, Kumasi, Takoradi, and beyond.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            <div className="glass" style={{ padding: '2.2rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245,158,11,0.12)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Admin Verified Quality</h3>
              <p style={{ color: 'var(--text-gray)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Every partner hotel, vehicle fleet, and dining venue is manually audited for five-star standards and premium service delivery across Ghana.
              </p>
            </div>
            <div className="glass" style={{ padding: '2.2rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(6,182,212,0.12)', border: '1px solid var(--border-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Synchronized Agenda</h3>
              <p style={{ color: 'var(--text-gray)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Book your airport pickup in a Land Cruiser V8, your suite at Kempinski Accra, and an evening dinner — all in one synchronized itinerary.
              </p>
            </div>
            <div className="glass" style={{ padding: '2.2rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-violet)' }}>
                <HeartHandshake size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>24/7 VIP Concierge</h3>
              <p style={{ color: 'var(--text-gray)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Dedicated Ghanaian concierge specialists assist with bespoke vehicle requests, hotel preferences, and restaurant bookings around the clock.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
