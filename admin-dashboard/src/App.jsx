/**
 * App.jsx — root router for the Admin Dashboard.
 * All pages except Login are wrapped in ProtectedRoute which redirects
 * unauthenticated visitors to /login.
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import ViewListings from './pages/ViewListings.jsx';
import CreateListing from './pages/CreateListing.jsx';
import UpdateListing from './pages/UpdateListing.jsx';
import Reservations from './pages/Reservations.jsx';

/** Simple 404 page for the admin dashboard. */
function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>This page doesn't exist.</p>
      <a href="/listings" className="nf-admin-link">Back to listings</a>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/"                    element={<Navigate to="/listings" replace />} />
          <Route path="/login"               element={<Login />} />
          <Route path="/listings"            element={<ProtectedRoute><ViewListings /></ProtectedRoute>} />
          <Route path="/listings/new"        element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
          <Route path="/listings/:id/edit"   element={<ProtectedRoute><UpdateListing /></ProtectedRoute>} />
          <Route path="/reservations"        element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
          {/* 404 catch-all */}
          <Route path="*"                    element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
