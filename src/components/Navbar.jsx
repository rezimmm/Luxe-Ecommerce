import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { isAuthenticated } = useAuth();

  const handleProfileClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <>
      <style>{`
        .luxe-nav-link {
          color: #111827;
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: opacity 0.2s;
        }
        .luxe-nav-link:hover {
          opacity: 0.6;
        }
        .luxe-logo {
          letter-spacing: 0.15em;
          font-weight: 800;
        }
      `}</style>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={`fixed-top w-100 z-3 bg-white transition-luxury ${scrolled ? 'shadow-sm py-3' : 'py-4 border-bottom'}`}
      >
        <div className="container d-flex align-items-center justify-content-between">

          {/* Mobile Menu Toggle */}
          <button
            className="btn btn-link p-0 text-dark d-lg-none border-0"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          {/* Desktop Links Left */}
          <div className="d-none d-lg-flex gap-5 align-items-center flex-grow-1">
            <a href="#" onClick={(e) => handleNavClick(e, 'collection-section')} className="luxe-nav-link">Shop</a>
            <a href="#" onClick={(e) => handleNavClick(e, 'collection-section')} className="luxe-nav-link">Collections</a>
          </div>

          {/* Logo Central */}
          <div className="mx-auto">
            <Link to="/" className="text-decoration-none d-flex align-items-center gap-2 text-dark">
              <div className="d-flex align-items-center justify-content-center text-primary" style={{ gap: '2px' }}>
                <div style={{ width: 4, height: 16, backgroundColor: '#2563eb', borderRadius: 2 }}></div>
                <div style={{ width: 4, height: 22, backgroundColor: '#2563eb', borderRadius: 2 }}></div>
                <div style={{ width: 4, height: 16, backgroundColor: '#2563eb', borderRadius: 2 }}></div>
              </div>
              <h1 className="h4 mb-0 luxe-logo text-dark">LUXE</h1>
            </Link>
          </div>

          {/* Icons Right */}
          <div className="d-flex gap-4 align-items-center flex-grow-1 justify-content-end">
            <a href="#" onClick={(e) => handleNavClick(e, 'about-section')} className="luxe-nav-link d-none d-lg-block">About</a>

            {/* Search Icon */}
            <button
              className="btn btn-link p-0 text-dark border-0 hover-opacity"
              onClick={() => setIsSearchOpen(s => !s)}
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* Search Dropdown */}
            {isSearchOpen && (
              <div className="position-fixed top-0 start-0 w-100 bg-white shadow-sm"
                style={{ zIndex: 2000, padding: '16px 24px' }}>
                <form onSubmit={handleSearch} className="d-flex align-items-center gap-3 container">
                  <Search size={18} className="text-muted flex-shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    className="form-control border-0 shadow-none fs-5 p-0"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <button type="button" className="btn p-0 border-0"
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}>
                    <X size={20} className="text-muted" />
                  </button>
                </form>
              </div>
            )}

            <button
              className="btn btn-link p-0 text-dark border-0 position-relative hover-opacity focus-none"
              onClick={() => isAuthenticated ? navigate('/profile?tab=wishlist') : navigate('/login')}
            >
              <Heart size={20} strokeWidth={1.5} fill={wishlist.length > 0 ? "#ff4757" : "transparent"} color={wishlist.length > 0 ? "#ff4757" : "#111"} />
              {wishlist.length > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>{wishlist.length}</span>}
            </button>

            <button className="btn btn-link p-0 text-dark border-0 position-relative hover-opacity" onClick={() => isAuthenticated ? setCartOpen(true) : navigate('/login')}>
              <ShoppingBag size={20} strokeWidth={1.5} />
              {totalItems > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" style={{ fontSize: '0.6rem' }}>{totalItems}</span>}
            </button>

            <a href="#" onClick={handleProfileClick} className="d-none d-sm-block hover-opacity">
              <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#f0e6e6', overflow: 'hidden', border: '1px solid #ddd' }}>
                <User size={26} strokeWidth={1} color="#666" style={{ marginTop: '2px' }} />
              </div>
            </a>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="position-absolute top-0 start-0 w-100 h-100 bg-white d-flex align-items-center px-4"
              style={{ zIndex: 10 }}
            >
              <div className="container d-flex align-items-center gap-3">
                <Search size={24} className="text-muted" />
                <input
                  type="text"
                  autoFocus
                  placeholder="What are you looking for?"
                  className="form-control border-0 fs-5 shadow-none p-0"
                  style={{ fontWeight: 500 }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsSearchOpen(false)}
                />
                <button className="btn btn-link p-0 text-dark" onClick={() => setIsSearchOpen(false)}>
                  <X size={24} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="position-fixed inset-0 bg-black bg-opacity-50" style={{ zIndex: 1040 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="position-fixed top-0 start-0 h-100 bg-white shadow-lg p-4"
              style={{ width: '80%', maxWidth: '300px', zIndex: 1050 }}
            >
              <div className="d-flex justify-content-between align-items-center mb-5">
                <span className="fw-bold uppercase ls-widest h5 mb-0" style={{ letterSpacing: '0.15em' }}>LUXE</span>
                <button className="btn p-0" onClick={() => setMobileMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="d-flex flex-column gap-4">
                <a href="#" onClick={(e) => handleNavClick(e, 'collection-section')} className="luxe-nav-link fs-6">Shop</a>
                <a href="#" onClick={(e) => handleNavClick(e, 'collection-section')} className="luxe-nav-link fs-6">Collections</a>
                <a href="#" onClick={(e) => handleNavClick(e, 'about-section')} className="luxe-nav-link fs-6">About</a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
