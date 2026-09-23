import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, SlidersHorizontal, Grid, 
  Star, Building2, Car, UtensilsCrossed, Globe, Crown, 
  Heart, X, Sparkles
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
  latitude?: number;
  longitude?: number;
  hotelDetails?: { pricePerNight: number };
  carDetails?: { pricePerDay?: number; pricePerHour?: number; isRental: boolean; carType: string };
  diningDetails?: { cuisineType: string; averageCost: number };
}

interface ListingsProps {
  searchParams: SearchParams;
  setSearchParams?: React.Dispatch<React.SetStateAction<SearchParams>>;
  navigateToDetail: (id: string) => void;
  addToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function Listings({ searchParams, navigateToDetail, addToast }: ListingsProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<'rating' | 'priceAsc' | 'priceDesc'>('rating');

  // Filters State
  const [selectedType, setSelectedType] = useState<string>(searchParams.serviceType);
  const [cityFilter, setCityFilter] = useState<string>(searchParams.city);
  const [priceRange, setPriceRange] = useState<number>(6000);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleFavorite = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    const newFav = !favorites[id];
    setFavorites(prev => ({ ...prev, [id]: newFav }));
    if (addToast) {
      addToast(newFav ? `Saved "${title}" to your curated wishlist.` : `Removed "${title}" from wishlist.`, 'info');
    }
  };

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:5000/api/listings';
        const params: string[] = [];

        if (selectedType !== 'ALL') {
          if (selectedType === 'CAR') {
            params.push(`serviceType=CAR_RENTAL`);
          } else {
            params.push(`serviceType=${selectedType}`);
          }
        }
        if (cityFilter) {
          params.push(`city=${encodeURIComponent(cityFilter)}`);
        }
        if (searchQuery) {
          params.push(`search=${encodeURIComponent(searchQuery)}`);
        }

        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        
        if (Array.isArray(data)) {
          let filtered = data;
          
          if (selectedType === 'CAR') {
            filtered = data.filter(item => item.serviceType === 'CAR_RENTAL' || item.serviceType === 'PRIVATE_DRIVER');
          }

          filtered = filtered.filter(item => {
            if (item.serviceType === 'HOTEL' && item.hotelDetails) {
              return item.hotelDetails.pricePerNight <= priceRange;
            }
            if ((item.serviceType === 'CAR_RENTAL' || item.serviceType === 'PRIVATE_DRIVER') && item.carDetails) {
              const price = item.carDetails.isRental ? item.carDetails.pricePerDay : item.carDetails.pricePerHour;
              return (price || 0) <= priceRange;
            }
            if (item.serviceType === 'RESTAURANT' && item.diningDetails) {
              return item.diningDetails.averageCost <= priceRange;
            }
            return true;
          });

          // Apply sorting
          if (sortBy === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
          } else if (sortBy === 'priceAsc') {
            filtered.sort((a, b) => (getNumericPrice(a) - getNumericPrice(b)));
          } else if (sortBy === 'priceDesc') {
            filtered.sort((a, b) => (getNumericPrice(b) - getNumericPrice(a)));
          }

          setListings(filtered);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [selectedType, cityFilter, priceRange, searchQuery, sortBy]);

  const getNumericPrice = (listing: Listing): number => {
    if (listing.serviceType === 'HOTEL' && listing.hotelDetails) return listing.hotelDetails.pricePerNight;
    if (listing.carDetails) return listing.carDetails.pricePerDay || listing.carDetails.pricePerHour || 0;
    if (listing.diningDetails) return listing.diningDetails.averageCost;
    return 0;
  };

  const getPriceDisplay = (listing: Listing) => {
    if (listing.serviceType === 'HOTEL' && listing.hotelDetails) {
      return (
        <span>
          <span style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '1.15rem' }}>GH₵{listing.hotelDetails.pricePerNight}</span>
          <span style={{ color: 'var(--text-gray)', fontSize: '0.8rem' }}> / night</span>
        </span>
      );
    }
    if ((listing.serviceType === 'CAR_RENTAL' || listing.serviceType === 'PRIVATE_DRIVER') && listing.carDetails) {
      const isRental = listing.carDetails.isRental;
      const price = isRental ? listing.carDetails.pricePerDay : listing.carDetails.pricePerHour;
      const unit = isRental ? 'day' : 'hour';
      return (
        <span>
          <span style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '1.15rem' }}>GH₵{price}</span>
          <span style={{ color: 'var(--text-gray)', fontSize: '0.8rem' }}> / {unit}</span>
        </span>
      );
    }
    if (listing.serviceType === 'RESTAURANT' && listing.diningDetails) {
      return (
        <span>
          <span style={{ color: 'var(--text-white)', fontWeight: 700 }}>{listing.diningDetails.cuisineType}</span>
          <span style={{ color: 'var(--text-gray)', fontSize: '0.75rem', display: 'block' }}>Avg. GH₵{listing.diningDetails.averageCost} for 2</span>
        </span>
      );
    }
    return null;
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'HOTEL':
        return <Building2 size={14} style={{ color: '#c084fc' }} />;
      case 'CAR_RENTAL':
        return <Car size={14} style={{ color: '#22d3ee' }} />;
      case 'PRIVATE_DRIVER':
        return <Crown size={14} style={{ color: '#fbbf24' }} />;
      case 'RESTAURANT':
        return <UtensilsCrossed size={14} style={{ color: '#fb7185' }} />;
      default:
        return null;
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 80px)',
      animation: 'fadeIn 0.35s ease'
    }}>
      {/* Sub Header & Filter Bar */}
      <div style={{
        background: 'rgba(9, 9, 15, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-glass)',
        padding: '1rem 4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.2rem',
        zIndex: 10
      }}>
        {/* Category Pill Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${selectedType === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedType('ALL')}
            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
          >
            <Globe size={14} />
            <span>All</span>
          </button>
          <button 
            className={`btn ${selectedType === 'HOTEL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedType('HOTEL')}
            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
          >
            <Building2 size={14} />
            <span>Hotels</span>
          </button>
          <button 
            className={`btn ${selectedType === 'CAR' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedType('CAR')}
            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
          >
            <Car size={14} />
            <span>Cars & Chauffeurs</span>
          </button>
          <button 
            className={`btn ${selectedType === 'RESTAURANT' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedType('RESTAURANT')}
            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
          >
            <UtensilsCrossed size={14} />
            <span>Fine Dining</span>
          </button>
        </div>

        {/* Search Inputs & Sorter */}
        <div style={{ display: 'flex', gap: '0.8rem', flex: 1, maxWidth: '650px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={15} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-gray)' }} />
            <input 
              type="text" 
              placeholder="Search by keywords (e.g. Kempinski, Land Cruiser, Buka)..." 
              className="input-field" 
              style={{ paddingLeft: '2.4rem', height: '38px', fontSize: '0.88rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <X 
                size={14} 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-gray)', cursor: 'pointer' }} 
              />
            )}
          </div>

          <div style={{ position: 'relative', width: '180px' }}>
            <MapPin size={15} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-gray)' }} />
            <input 
              type="text" 
              placeholder="Filter City (Accra, Kumasi)..." 
              className="input-field" 
              style={{ paddingLeft: '2.4rem', height: '38px', fontSize: '0.88rem' }}
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            />
          </div>

          <div style={{ position: 'relative', width: '150px' }}>
            <select 
              className="input-field" 
              value={sortBy} 
              onChange={(e: any) => setSortBy(e.target.value)}
              style={{ height: '38px', fontSize: '0.85rem', padding: '0 0.8rem' }}
            >
              <option value="rating">Top Rated</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Results Split Screen View */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Side: Scrollable Listing Cards & Sliders */}
        <div style={{
          width: '56%',
          minWidth: '520px',
          overflowY: 'auto',
          padding: '1.8rem 3rem',
          borderRight: '1px solid var(--border-glass)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {/* Price Range Filter Slider Card */}
          <div className="glass" style={{ padding: '1.2rem 1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-gray)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <SlidersHorizontal size={14} style={{ color: 'var(--accent-gold)' }} /> Maximum Rate Filter
              </span>
              <span style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '1rem' }}>GH₵{priceRange.toLocaleString()} / item</span>
            </div>
            <input 
              type="range" 
              min={100} 
              max={10000} 
              step={100}
              style={{ accentColor: 'var(--accent-gold)', width: '100%', cursor: 'pointer', height: '6px' }}
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }} className="gradient-text">
                Available Reservations ({listings.length})
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                <Grid size={16} style={{ color: 'var(--text-white)' }} />
                <span>Synchronized HUD Map</span>
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                <div className="gradient-gold-text" style={{ fontWeight: 600 }}>Synchronizing live availability...</div>
              </div>
            ) : listings.length === 0 ? (
              <div className="glass" style={{ padding: '4rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                <Sparkles size={32} style={{ color: 'var(--accent-gold)', margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No matching luxury listings</h3>
                <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Try broadening your search keywords, city filter, or increasing the max price.</p>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => { setSelectedType('ALL'); setCityFilter(''); setSearchQuery(''); setPriceRange(10000); }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {listings.map((listing) => (
                  <div 
                    key={listing.id}
                    className="glass glass-interactive"
                    onClick={() => navigateToDetail(listing.id)}
                    onMouseEnter={() => setHoveredListingId(listing.id)}
                    onMouseLeave={() => setHoveredListingId(null)}
                    style={{
                      display: 'flex',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      height: '180px',
                      border: hoveredListingId === listing.id ? '1px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                      boxShadow: hoveredListingId === listing.id ? '0 12px 30px rgba(0,0,0,0.6), 0 0 20px rgba(245,158,11,0.12)' : 'none',
                      position: 'relative'
                    }}
                  >
                    {/* Thumbnail Image */}
                    <div style={{ width: '230px', minWidth: '230px', height: '100%', position: 'relative' }}>
                      <img 
                        src={listing.coverImage} 
                        alt={listing.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '0.7rem',
                        left: '0.7rem',
                        background: 'rgba(7, 7, 12, 0.75)',
                        backdropFilter: 'blur(6px)',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        border: '1px solid var(--border-glass)'
                      }}>
                        {getServiceIcon(listing.serviceType)}
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-white)', letterSpacing: '0.4px' }}>
                          {listing.serviceType.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Wishlist Heart button */}
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(e, listing.id, listing.title)}
                        style={{
                          position: 'absolute',
                          bottom: '0.7rem',
                          right: '0.7rem',
                          background: 'rgba(7, 7, 12, 0.75)',
                          backdropFilter: 'blur(6px)',
                          border: '1px solid var(--border-glass)',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: favorites[listing.id] ? '#f43f5e' : 'var(--text-white)',
                          cursor: 'pointer',
                          transition: 'var(--transition-fast)'
                        }}
                      >
                        <Heart size={15} fill={favorites[listing.id] ? '#f43f5e' : 'none'} />
                      </button>
                    </div>

                    {/* Content Details */}
                    <div style={{ padding: '1.2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-white)' }}>
                            {listing.title}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.82rem', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>
                            <Star size={12} fill="var(--accent-gold)" style={{ color: 'var(--accent-gold)' }} />
                            <span style={{ fontWeight: 800 }}>{listing.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        
                        <div style={{ color: 'var(--text-gray)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
                          <MapPin size={11} style={{ color: 'var(--accent-cyan)' }} /> {listing.city}, {listing.country}
                        </div>

                        <p style={{ color: 'var(--text-gray)', fontSize: '0.85rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {listing.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-glass)' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Verified Rate</span>
                        {getPriceDisplay(listing)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: High-End Interactive Vector HUD Map */}
        <div style={{
          width: '44%',
          background: '#040409',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {/* Custom HUD Map Grid Background */}
          <div style={{
            position: 'absolute',
            width: '200%',
            height: '200%',
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1.5px, transparent 1.5px)',
            backgroundSize: '36px 36px',
            opacity: 0.35,
            transform: 'rotate(8deg)'
          }}></div>

          {/* Dynamic Radar Sweep Effect */}
          <div style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            border: '1px solid rgba(6, 182, 212, 0.15)',
            boxShadow: '0 0 60px rgba(6, 182, 212, 0.05)',
            pointerEvents: 'none'
          }}></div>

          {/* HUD Status Header */}
          <div style={{ 
            position: 'absolute', 
            top: '1.5rem', 
            left: '1.5rem', 
            background: 'rgba(7, 7, 12, 0.85)', 
            border: '1px solid var(--border-cyan)', 
            padding: '0.5rem 1rem', 
            borderRadius: '30px', 
            fontSize: '0.78rem', 
            color: 'var(--accent-cyan)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            zIndex: 10,
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)', display: 'inline-block' }}></span>
            <span style={{ fontWeight: 800, letterSpacing: '0.6px' }}>HUD VECTOR RADAR ACTIVE</span>
          </div>

          {/* Render Interactive Map Pins */}
          {listings.map((item, idx) => {
            const topOffset = 22 + ((idx * 19) % 58);
            const leftOffset = 18 + ((idx * 27) % 64);
            const isHovered = hoveredListingId === item.id;

            return (
              <div 
                key={item.id}
                onClick={() => navigateToDetail(item.id)}
                onMouseEnter={() => setHoveredListingId(item.id)}
                onMouseLeave={() => setHoveredListingId(null)}
                style={{
                  position: 'absolute',
                  top: `${topOffset}%`,
                  left: `${leftOffset}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: isHovered ? 30 : 10,
                  transition: 'var(--transition-smooth)'
                }}
              >
                {/* Radar Ring Animation */}
                {isHovered && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: '2px solid var(--accent-gold)',
                    animation: 'pulseRing 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
                    zIndex: -1
                  }}></div>
                )}

                {/* Main Pin HUD Card */}
                <div className="glass" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '30px',
                  border: isHovered ? '1px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                  background: isHovered ? 'var(--bg-glass-active)' : 'rgba(7, 7, 14, 0.9)',
                  transform: isHovered ? 'scale(1.18) translateY(-6px)' : 'scale(1)',
                  transition: 'var(--transition-smooth)',
                  boxShadow: isHovered ? '0 12px 30px rgba(0,0,0,0.8), 0 0 20px rgba(245,158,11,0.25)' : '0 4px 15px rgba(0,0,0,0.4)'
                }}>
                  {getServiceIcon(item.serviceType)}
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: isHovered ? 'var(--accent-gold)' : 'var(--text-white)' }}>
                    {item.serviceType === 'HOTEL' && item.hotelDetails ? `GH₵${item.hotelDetails.pricePerNight}` :
                     (item.serviceType === 'CAR_RENTAL' || item.serviceType === 'PRIVATE_DRIVER') && item.carDetails ? `GH₵${item.carDetails.pricePerDay || item.carDetails.pricePerHour}` :
                     item.serviceType === 'RESTAURANT' && item.diningDetails ? `Table` : 'Spot'}
                  </span>
                </div>

                {/* Hover Tooltip Preview */}
                {isHovered && (
                  <div style={{
                    position: 'absolute',
                    bottom: '120%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(10, 10, 20, 0.95)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid var(--border-gold)',
                    padding: '0.7rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    width: '180px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.8)',
                    pointerEvents: 'none',
                    animation: 'scaleIn 0.2s ease',
                    zIndex: 40
                  }}>
                    <img 
                      src={item.coverImage} 
                      alt="" 
                      style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.4rem' }} 
                    />
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-gray)' }}>
                      {item.city}, {item.country}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
