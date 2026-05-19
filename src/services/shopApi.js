import axios from "axios";

const shopApi = axios.create({
  baseURL: import.meta.env.VITE_SHOP_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT access token to every request (same as api.js)
shopApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('luxe_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default shopApi;