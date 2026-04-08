// Frontend/src/services/shop.service.js
// All shop API calls — uses the same axios instance from api.js

import api from './api';

const SHOP = import.meta.env.VITE_SHOP_API_URL || 'http://localhost:5001/api/';

// ── Products ─────────────────────────────────────────────

export const getProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const { data } = await api.get(`${SHOP}/products?${query}`);
  return data; // { success, total, page, totalPages, products }
};

export const getProduct = async (id) => {
  const { data } = await api.get(`${SHOP}/products/${id}`);
  return data.product;
};

export const getCategories = async () => {
  const { data } = await api.get(`${SHOP}/products/categories`);
  return data.categories;
};

export const addReview = async (productId, { rating, title, comment }) => {
  const { data } = await api.post(`${SHOP}/products/${productId}/reviews`, { rating, title, comment });
  return data;
};

export const deleteReview = async (productId, reviewId) => {
  const { data } = await api.delete(`${SHOP}/products/${productId}/reviews/${reviewId}`);
  return data;
};

// ── Cart ─────────────────────────────────────────────────

export const getCart = async () => {
  const { data } = await api.get(`${SHOP}/cart`);
  return data.cart; // { items, subtotal, totalItems }
};

export const addToCart = async (productId, size, color, qty = 1) => {
  const { data } = await api.post(`${SHOP}/cart`, { productId, size, color, qty });
  return data.cart;
};

export const updateCartItem = async (productId, size, color, qty) => {
  const { data } = await api.patch(`${SHOP}/cart`, { productId, size, color, qty });
  return data.cart;
};

export const removeFromCart = async (productId, size, color) => {
  const { data } = await api.delete(
    `${SHOP}/cart/${productId}?size=${encodeURIComponent(size)}&color=${encodeURIComponent(color)}`
  );
  return data.cart;
};

export const clearCart = async () => {
  await api.delete(`${SHOP}/cart`);
};

// Sync guest cart to DB after login
// Pass your CartContext items array directly
export const syncGuestCart = async (cartItems) => {
  const items = cartItems.map(i => ({
    productId: i.id,
    size: i.size,
    color: i.color,
    qty: i.qty,
  }));
  const { data } = await api.post(`${SHOP}/cart/sync`, { items });
  return data.cart;
};

// ── Wishlist ─────────────────────────────────────────────

export const getWishlist = async () => {
  const { data } = await api.get(`${SHOP}/wishlist`);
  return data.products; // array of product objects
};

export const toggleWishlist = async (productId) => {
  const { data } = await api.post(`${SHOP}/wishlist/${productId}`);
  return data; // { action: 'added'|'removed', productId, count }
};

export const clearWishlist = async () => {
  await api.delete(`${SHOP}/wishlist`);
};

// ── Orders ───────────────────────────────────────────────

export const checkout = async (shippingAddress, paymentMethod = 'razorpay') => {
  const { data } = await api.post(`${SHOP}/orders/checkout`, { shippingAddress, paymentMethod });
  return data; // { order, razorpayOrder } or { order } for COD
};

export const verifyPayment = async ({ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  const { data } = await api.post(`${SHOP}/orders/verify-payment`, {
    orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature,
  });
  return data.order;
};

export const getMyOrders = async (page = 1) => {
  const { data } = await api.get(`${SHOP}/orders?page=${page}`);
  return data; // { total, orders }
};

export const getOrder = async (orderId) => {
  const { data } = await api.get(`${SHOP}/orders/${orderId}`);
  return data.order;
};

export const cancelOrder = async (orderId) => {
  const { data } = await api.post(`${SHOP}/orders/${orderId}/cancel`);
  return data.order;
};

// ── Razorpay payment handler ─────────────────────────────
// Call this after checkout() returns razorpayOrder
export const initiateRazorpayPayment = ({ razorpayOrder, order, user, onSuccess, onFailure }) => {
  const options = {
    key: razorpayOrder.key,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    name: 'LUXE',
    description: `Order #${order._id}`,
    order_id: razorpayOrder.id,
    prefill: {
      name: user?.name || '',
      email: user?.email || '',
      contact: user?.phone || '',
    },
    theme: { color: '#2563eb' },
    handler: async (response) => {
      try {
        const verified = await verifyPayment({
          orderId: order._id,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });
        onSuccess(verified);
      } catch (err) {
        onFailure(err);
      }
    },
    modal: {
      ondismiss: () => onFailure(new Error('Payment cancelled.')),
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
