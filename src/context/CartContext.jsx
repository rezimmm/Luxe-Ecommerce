// Frontend/src/context/CartContext.jsx  (UPDATED — syncs with MongoDB)
// Replace your existing CartContext with this version

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getCart, addToCart as apiAdd, updateCartItem,
  removeFromCart as apiRemove, clearCart as apiClear,
  syncGuestCart,
} from '../services/shop.service';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0, totalItems: 0 });
  const [cartLoading, setCartLoading] = useState(false);

  // ── Load cart from DB when user logs in ────────────────
  useEffect(() => {
    if (!isAuthenticated) return;
    setCartLoading(true);
    getCart()
      .then(setCart)
      .catch(console.error)
      .finally(() => setCartLoading(false));
  }, [isAuthenticated]);

  // ── Add to cart ────────────────────────────────────────
  const addToCart = useCallback(async (product, size, color, qty = 1) => {
    if (!isAuthenticated) {
      // Guest fallback — keep in local state only
      setCart(prev => {
        const existing = prev.items.find(
          i => i.id === product.id && i.size === size && i.color === color
        );
        const items = existing
          ? prev.items.map(i =>
            i.id === product.id && i.size === size && i.color === color
              ? { ...i, qty: i.qty + qty } : i
          )
          : [...prev.items, {
            id: product.id || product._id,
            name: product.name,
            image: product.images?.[0]?.url || product.image,
            price: product.price,
            size, color, qty,
          }];
        return { ...prev, items, totalItems: items.reduce((s, i) => s + i.qty, 0) };
      });
      return;
    }

    try {
      const updated = await apiAdd(product._id || product.id, size, color, qty);
      setCart(updated);
    } catch (err) {
      console.error('Add to cart error:', err);
    }
  }, [isAuthenticated]);

  // ── Increment ──────────────────────────────────────────
  const incrementQty = useCallback(async (id, size, color) => {
    if (!isAuthenticated) {
      setCart(prev => ({
        ...prev,
        items: prev.items.map(i =>
          (i.id === id || i.product === id) && i.size === size && i.color === color
            ? { ...i, qty: i.qty + 1 } : i
        ),
      }));
      return;
    }
    const item = cart.items.find(
      i => (i.product === id || i.product?._id === id) && i.size === size && i.color === color
    );
    if (!item) return;
    const updated = await updateCartItem(id, size, color, item.qty + 1);
    setCart(updated);
  }, [isAuthenticated, cart.items]);

  // ── Decrement ──────────────────────────────────────────
  const decrementQty = useCallback(async (id, size, color) => {
    if (!isAuthenticated) {
      setCart(prev => ({
        ...prev,
        items: prev.items
          .map(i => (i.id === id || i.product === id) && i.size === size && i.color === color
            ? { ...i, qty: i.qty - 1 } : i
          )
          .filter(i => i.qty > 0),
      }));
      return;
    }
    const item = cart.items.find(
      i => (i.product === id || i.product?._id === id) && i.size === size && i.color === color
    );
    if (!item) return;
    const newQty = item.qty - 1;
    if (newQty <= 0) {
      const updated = await apiRemove(id, size, color);
      setCart(updated);
    } else {
      const updated = await updateCartItem(id, size, color, newQty);
      setCart(updated);
    }
  }, [isAuthenticated, cart.items]);

  // ── Remove ─────────────────────────────────────────────
  const removeFromCart = useCallback(async (id, size, color) => {
    if (!isAuthenticated) {
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(
          i => !((i.id === id || i.product === id) && i.size === size && i.color === color)
        ),
      }));
      return;
    }
    const updated = await apiRemove(id, size, color);
    setCart(updated);
  }, [isAuthenticated]);

  // ── Clear cart ─────────────────────────────────────────
  const clearCartState = useCallback(async () => {
    if (isAuthenticated) await apiClear();
    setCart({ items: [], subtotal: 0, totalItems: 0 });
  }, [isAuthenticated]);

  // ── Sync guest cart after login ────────────────────────
  const syncAfterLogin = useCallback(async (guestItems) => {
    if (!guestItems?.length) return;
    try {
      const updated = await syncGuestCart(guestItems);
      setCart(updated);
    } catch (err) {
      console.error('Cart sync error:', err);
    }
  }, []);

  // ── Sync guest cart after login ────────────────────────

  const totalItems = cart.totalItems ??
    cart.items?.reduce((s, i) => s + i.qty, 0) ?? 0;

  return (
    <CartContext.Provider value={{
      cart: cart.items || [],
      subtotal: cart.subtotal || 0,
      totalItems,
      cartLoading,
      addToCart,
      incrementQty,
      decrementQty,
      removeFromCart,
      clearCart: clearCartState,
      syncAfterLogin,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
