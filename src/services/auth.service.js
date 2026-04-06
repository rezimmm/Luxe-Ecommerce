// Frontend/src/services/auth.service.js
import api from './api';

export const register = async ({ firstName, lastName, email, phone, password }) => {
  const { data } = await api.post('/auth/register', { firstName, lastName, email, phone, password });
  return data;
};

export const login = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password });
  if (data.accessToken) localStorage.setItem('luxe_access_token', data.accessToken);
  return data;
};

export const googleAuth = async (credential) => {
  const { data } = await api.post('/auth/google', { credential });
  if (data.accessToken) localStorage.setItem('luxe_access_token', data.accessToken);
  return data;
};

export const logout = async () => {
  await api.post('/auth/logout');
  localStorage.removeItem('luxe_access_token');
};

export const verifyEmail = async (token) => {
  const { data } = await api.get(`/auth/verify-email?token=${token}`);
  return data;
};

export const resendVerification = async (email) => {
  const { data } = await api.post('/auth/resend-verification', { email });
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

export const verifyOtp = async (email, otp) => {
  const { data } = await api.post('/auth/verify-otp', { email, otp });
  return data;
};

export const resetPassword = async (email, password) => {
  const { data } = await api.post('/auth/reset-password', { email, password });
  return data;
};

// ── User Profiling & Settings ───────────────────────────

export const updateProfile = async (formData) => {
  const { data } = await api.patch('/user/me', formData);
  return data; // { success, user }
};

export const updateEmailPreferences = async (preferences) => {
  const { data } = await api.patch('/user/me/email-preferences', preferences);
  return data; // { success, user }
};

export const addPaymentMethod = async (paymentData) => {
  const { data } = await api.post('/user/me/payment-methods', paymentData);
  return data; // { success, paymentMethods }
};

export const removePaymentMethod = async (index) => {
  const { data } = await api.delete(`/user/me/payment-methods/${index}`);
  return data; // { success, paymentMethods }
};

export const addAddress = async (addressData) => {
  const { data } = await api.post('/user/me/addresses', addressData);
  return data; // { success, addresses }
};

export const removeAddress = async (index) => {
  const { data } = await api.delete(`/user/me/addresses/${index}`);
  return data; // { success, addresses }
};
