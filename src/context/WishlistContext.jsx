import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as shopService from '../services/shop.service';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // ── Load Wishlist ──────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      shopService.getWishlist()
        .then(setWishlist)
        .catch(err => console.error('Wishlist fetch error:', err))
        .finally(() => setLoading(false));
    } else {
      const saved = localStorage.getItem('luxe_wishlist');
      if (saved) setWishlist(JSON.parse(saved));
    }
  }, [isAuthenticated]);

  // ── Save guest wishlist to local storage ───────────────
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('luxe_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isAuthenticated]);

  const toggleWishlist = useCallback(async (product) => {
    const productId = product._id || product.id;
    if (!productId) return;

    if (isAuthenticated) {
      try {
        const res = await shopService.toggleWishlist(productId);
        if (res.action === 'added') {
          setWishlist(prev => [...prev, product]);
          toast.success('Added to wishlist');
        } else {
          setWishlist(prev => prev.filter(p => (p._id || p.id) !== productId));
          toast.success('Removed from wishlist');
        }
      } catch (err) {
        toast.error('Failed to update wishlist');
      }
    } else {
      // Guest logic: Redirect to login
      toast.error('Please login to save favorite items');
      navigate('/login');
    }
  }, [isAuthenticated]);

  const isInWishlist = useCallback((productId) => {
    if (!productId) return false;
    return wishlist.some(p => (p._id || p.id) === productId);
  }, [wishlist]);

  const clearWishlist = useCallback(async () => {
    if (isAuthenticated) await shopService.clearWishlist();
    setWishlist([]);
  }, [isAuthenticated]);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, clearWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
