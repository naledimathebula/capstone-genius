/**
 * api.js — centralised Axios instance for the Admin Dashboard.
 *
 * Uses VITE_API_URL for the base URL so the same build works across
 * dev (localhost:5000) and production environments.
 *
 * The request interceptor attaches the admin JWT (stored under
 * 'adminToken' in localStorage) as a Bearer token on every request.
 * Using a different localStorage key from the frontend ('token') ensures
 * admin and user sessions never interfere with each other.
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

/**
 * Request interceptor — attach admin JWT to every outgoing request
 * when an active admin session exists.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
