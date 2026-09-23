import React, { useState, useEffect } from 'react';
import { 
  LogIn, LogOut, User as UserIcon, ShieldAlert, Award, CalendarDays, 
  Compass, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle, 
  Info, Lock, Mail, Phone, UserCheck, Briefcase, ArrowRight, X
} from 'lucide-react';
import Home from './pages/Home.tsx';
import Listings from './pages/Listings.tsx';
import Detail from './pages/Detail.tsx';
import Dashboard from './pages/Dashboard.tsx';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
}

export interface SearchParams {
  serviceType: string;
  city: string;
  startDate: string;
  endDate: string;
  guests: number;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const BACKEND_URL = 'http://localhost:5000/api';

export default function App() {
  const [page, setPage] = useState<string>('home');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    serviceType: 'ALL',
    city: '',
    startDate: '',
    endDate: '',
    guests: 1
  });

  // Auth States
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Auth Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Global Toast Notification State
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Hydrate Auth from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setPage('home');
    addToast('Signed out successfully.', 'info');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setAuthLoading(true);

    const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register';
    const payload = authMode === 'login' 
      ? { email, password } 
      : { email, password, firstName, lastName, phoneNumber, role };

    try {
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (authMode === 'login') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        setShowAuthModal(false);
        addToast(`Welcome back, ${data.user.firstName}!`, 'success');
        
        // Reset form
        setEmail('');
        setPassword('');
      } else {
        setAuthSuccess(data.message || 'Registration successful! You may now sign in.');
        addToast('Account created! Please sign in.', 'success');
        setAuthMode('login');
        
        // Clear fields except email
        setPassword('');
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
      }
    } catch (err: any) {
      setAuthError(err.message || 'An error occurred');
    } finally {
      setAuthLoading(false);
    }
  };

  const navigateToListings = (params: SearchParams) => {
    setSearchParams(params);
    setPage('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToDetail = (id: string) => {
    setSelectedListingId(id);
    setPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      
      {/* Navigation */}
      <nav className="navbar">
        <a className="navbar-brand" onClick={() => setPage('home')} style={{ color: 'var(--text-white)' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(139, 92, 246, 0.2))',
            padding: '0.45rem',
            borderRadius: '12px',
            border: '1px solid var(--border-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Compass size={22} style={{ color: 'var(--accent-gold)' }} />
          </div>
          <span>Aether<span className="gradient-gold-text" style={{ fontWeight: 900 }}>Booking</span></span>
        </a>

        <div className="navbar-links">
          <a className={`nav-link ${page === 'home' ? 'active' : ''}`} onClick={() => setPage('home')}>
            <Sparkles size={16} style={{ color: 'var(--accent-gold)' }} />
            <span>Explore</span>
          </a>
          <a className={`nav-link ${page === 'listings' ? 'active' : ''}`} onClick={() => setPage('listings')}>
            <Compass size={16} />
            <span>Reservations</span>
          </a>
          
          {user ? (
            <>
              <a className={`nav-link ${page === 'dashboard' ? 'active' : ''}`} onClick={() => setPage('dashboard')}>
                {user.role === 'ADMIN' ? (
                  <ShieldAlert size={16} style={{ color: 'var(--accent-cyan)' }} />
                ) : user.role === 'PARTNER' ? (
                  <Award size={16} style={{ color: 'var(--accent-gold)' }} />
                ) : (
                  <CalendarDays size={16} style={{ color: 'var(--accent-violet)' }} />
                )}
                <span>{user.firstName}'s Portal</span>
              </a>
              <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} style={{ padding: '0.55rem 1.2rem', fontSize: '0.88rem' }}>
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {page === 'home' && (
          <Home 
            navigateToListings={navigateToListings} 
            navigateToDetail={navigateToDetail}
          />
        )}
        
        {page === 'listings' && (
          <Listings 
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            navigateToDetail={navigateToDetail}
            addToast={addToast}
          />
        )}

        {page === 'detail' && selectedListingId && (
          <Detail 
            listingId={selectedListingId}
            user={user}
            token={token}
            setPage={setPage}
            triggerAuthModal={() => { setAuthMode('login'); setShowAuthModal(true); }}
            addToast={addToast}
          />
        )}

        {page === 'dashboard' && user && token && (
          <Dashboard 
            user={user}
            token={token}
            navigateToDetail={navigateToDetail}
            addToast={addToast}
          />
        )}
      </main>

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast-message toast-${toast.type}`}>
            {toast.type === 'success' && <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0 }} />}
            {toast.type === 'error' && <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />}
            {toast.type === 'info' && <Info size={18} style={{ color: '#f59e0b', flexShrink: 0 }} />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Premium Footer */}
      <footer style={{
        background: '#040407',
        padding: '3.5rem 4rem',
        borderTop: '1px solid var(--border-glass)',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2.5rem',
        zIndex: 10
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <Compass size={20} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>AetherBooking</span>
          </div>
          <p style={{ color: 'var(--text-gray)', fontSize: '0.88rem', maxWidth: '340px', lineHeight: 1.6 }}>
            Ghana's #1 luxury booking platform. Reserve premium hotels in Accra &amp; Kumasi, ride in a BMW xDrive or Toyota Land Cruiser V8, and discover the finest dining across Ghana.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
          <div>
            <h5 style={{ fontWeight: 700, color: 'var(--text-white)', marginBottom: '1rem', fontSize: '0.92rem' }}>Explore Agenda</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              <li><a onClick={() => { setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: 'var(--text-gray)', cursor: 'pointer', transition: 'color 0.2s' }}>Curated Collection</a></li>
              <li><a onClick={() => { setPage('listings'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: 'var(--text-gray)', cursor: 'pointer', transition: 'color 0.2s' }}>Live HUD Map Search</a></li>
            </ul>
          </div>
          
          <div>
            <h5 style={{ fontWeight: 700, color: 'var(--text-white)', marginBottom: '1rem', fontSize: '0.92rem' }}>Trust & Protection</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-gray)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={14} style={{ color: 'var(--accent-emerald)' }} /> Stripe Verified Processing
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={14} style={{ color: 'var(--accent-gold)' }} /> Admin-Audited Luxury Hosts
              </li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Modernized Authentication Modal */}
      {showAuthModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.82)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem',
          animation: 'fadeIn 0.25s ease'
        }}>
          <div className="glass" style={{
            width: '100%',
            maxWidth: '520px',
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            position: 'relative',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(245, 158, 11, 0.1)',
            border: '1px solid var(--border-gold)',
            animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <button 
              onClick={() => { setShowAuthModal(false); setAuthError(''); setAuthSuccess(''); }}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-gray)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              <X size={18} />
            </button>

            {/* Segmented Mode Switcher */}
            <div style={{
              display: 'flex',
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '0.35rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.8rem',
              border: '1px solid var(--border-glass)'
            }}>
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: authMode === 'login' ? 'var(--accent-gold)' : 'transparent',
                  color: authMode === 'login' ? '#000' : 'var(--text-gray)',
                  transition: 'var(--transition-fast)'
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(''); setAuthSuccess(''); }}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: authMode === 'register' ? 'var(--accent-gold)' : 'transparent',
                  color: authMode === 'register' ? '#000' : 'var(--text-gray)',
                  transition: 'var(--transition-fast)'
                }}
              >
                Create Account
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.3rem' }} className="gradient-text">
                {authMode === 'login' ? 'Welcome to Luxury' : 'Begin Your Journey'}
              </h2>
              <p style={{ color: 'var(--text-gray)', fontSize: '0.88rem' }}>
                {authMode === 'login' 
                  ? 'Access your reservations, partner dashboard, or admin controls.' 
                  : 'Join our exclusive network of elite travelers and premier service providers.'}
              </p>
            </div>

            {authError && (
              <div className="badge badge-rejected" style={{ width: '100%', padding: '0.8rem 1rem', marginBottom: '1.2rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'none', fontSize: '0.85rem' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{authError}</span>
              </div>
            )}
            
            {authSuccess && (
              <div className="badge badge-approved" style={{ width: '100%', padding: '0.8rem 1rem', marginBottom: '1.2rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'none', fontSize: '0.85rem' }}>
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                <span>{authSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit}>
              {authMode === 'register' && (
                <>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                      <label className="form-label">
                        <UserIcon size={13} style={{ color: 'var(--accent-gold)' }} /> First Name
                      </label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Alexandre"
                        className="input-field" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                      <label className="form-label">Last Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Laurent"
                        className="input-field" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">
                      <Phone size={13} style={{ color: 'var(--accent-gold)' }} /> Phone Number
                    </label>
                    <input 
                      type="tel" 
                      placeholder="+233 24 000 0000"
                      className="input-field" 
                      value={phoneNumber} 
                      onChange={(e) => setPhoneNumber(e.target.value)} 
                    />
                  </div>

                  {/* Role Selector Card */}
                  <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                    <label className="form-label">
                      <UserCheck size={13} style={{ color: 'var(--accent-gold)' }} /> Account Type
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                      <div 
                        onClick={() => setRole('CUSTOMER')}
                        style={{
                          padding: '0.9rem',
                          borderRadius: 'var(--radius-sm)',
                          border: role === 'CUSTOMER' ? '1px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                          background: role === 'CUSTOMER' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(0, 0, 0, 0.3)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.3rem',
                          transition: 'var(--transition-fast)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.88rem', color: role === 'CUSTOMER' ? 'var(--accent-gold)' : 'var(--text-white)' }}>
                          <UserIcon size={14} /> Traveler / Guest
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-gray)' }}>Reserve hotels, chauffeured cars & dining in Ghana</span>
                      </div>

                      <div 
                        onClick={() => setRole('PARTNER')}
                        style={{
                          padding: '0.9rem',
                          borderRadius: 'var(--radius-sm)',
                          border: role === 'PARTNER' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                          background: role === 'PARTNER' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(0, 0, 0, 0.3)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.3rem',
                          transition: 'var(--transition-fast)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.88rem', color: role === 'PARTNER' ? 'var(--accent-cyan)' : 'var(--text-white)' }}>
                          <Briefcase size={14} /> Luxury Partner
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-gray)' }}>List Ghana hotels, car fleets & gastronomy</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">
                  <Mail size={13} style={{ color: 'var(--accent-gold)' }} /> Email Address
                </label>
                <input 
                  type="email" 
                  required 
                  placeholder="name@company.com.gh"
                  className="input-field" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.8rem' }}>
                <label className="form-label">
                  <Lock size={13} style={{ color: 'var(--accent-gold)' }} /> Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required 
                    placeholder="••••••••••••"
                    className="input-field" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    style={{ paddingRight: '2.8rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.8rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-gray)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={authLoading}
                className="btn btn-primary" 
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
              >
                <span>{authLoading ? 'Verifying Credentials...' : authMode === 'login' ? 'Authenticate & Enter' : 'Complete Registration'}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {authMode === 'register' && role === 'PARTNER' && (
              <div className="badge badge-pending" style={{ width: '100%', marginTop: '1.2rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', padding: '0.6rem', textTransform: 'none', fontSize: '0.78rem' }}>
                <ShieldAlert size={14} /> Partner applications undergo administrator vetting before publishing.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
