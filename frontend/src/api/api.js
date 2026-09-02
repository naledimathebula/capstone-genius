/**
 * api.js — centralised Axios instance for the frontend.
 *
 * Base URL is read from the VITE_API_URL environment variable so that
 * the same build can point to different backends across environments
 * (dev → localhost:5000, production → deployed API URL).
 *
 * The request interceptor automatically attaches the user's JWT from
 * localStorage as a Bearer token on every outgoing request.
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

/**
 * Request interceptor — attach JWT token to every request if the user
 * is currently logged in.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
