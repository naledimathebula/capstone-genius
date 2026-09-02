/**
 * AuthContext.jsx — global authentication state for the frontend.
 *
 * Provides:
 *   user    – the currently logged-in user object, or null
 *   login   – async function: POST /api/users/login, stores JWT + user
 *   logout  – clears localStorage and resets user state
 *
 * The JWT is stored under the key 'token' and the user object under 'user'
 * in localStorage, keeping them separate from the admin dashboard's keys
 * ('adminToken' / 'adminUser').
 */
import { createContext, useContext, useState } from 'react';
import api from '../api/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  /** Initialise from localStorage so sessions survive a page refresh. */
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  /**
   * Authenticate the user.
   * Stores the JWT and user object in localStorage on success.
   * @param {string} email
   * @param {string} password
   * @returns {object} The logged-in user object
   */
  const login = async (email, password) => {
    const { data } = await api.post('/users/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  /** Clear the session from localStorage and reset state. */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Convenience hook — throws if used outside AuthProvider. */
export const useAuth = () => useContext(AuthContext);
