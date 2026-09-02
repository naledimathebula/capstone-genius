/**
 * ProtectedRoute.jsx — route guard for admin-only pages.
 *
 * Redirects unauthenticated visitors to /login.
 * Renders the wrapped child component when a valid session exists.
 *
 * Usage:
 *   <ProtectedRoute><MyAdminPage /></ProtectedRoute>
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
