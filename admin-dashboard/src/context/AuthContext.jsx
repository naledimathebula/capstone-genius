/**
 * AuthContext.jsx — global authentication state for the Admin Dashboard.
 *
 * Provides:
 *   user    – the currently logged-in admin/host object, or null
 *   login   – async function: POST /api/users/login + role guard
 *   logout  – clears localStorage keys and resets state
 *
 * Role guard: only users with role 'admin' or 'host' may access the
 * admin dashboard. Any other role triggers a thrown error that the
 * Login page catches and displays to the user.
 *
 * JWT is stored under 'adminToken' and user under 'adminUser' to keep
 * admin sessions separate from the customer-facing frontend sessions.
 */
import { createContext, useContext, useState } from 'react';
import api from '../api/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  /** Hydrate from localStorage so sessions survive a page refresh. */
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('adminUser');
    return stored ? JSON.parse(stored) : null;
  });

  /**
   * Authenticate an admin or host user.
   * Throws an error object compatible with axios error shape if the
   * user's role is not permitted.
   * @param {string} email
   * @param {string} password
   * @returns {object} The logged-in user object
   */
  const login = async (email, password) => {
    const { data } = await api.post('/users/login', { email, password });

    // Only allow admin and host roles into the dashboard
    if (!['admin', 'host'].includes(data.user.role)) {
      throw { response: { data: { message: 'This account does not have admin access.' } } };
    }

    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminUser', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  /** Clear admin session from localStorage and reset state. */
  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Convenience hook — must be used inside AuthProvider. */
export const useAuth = () => useContext(AuthContext);
