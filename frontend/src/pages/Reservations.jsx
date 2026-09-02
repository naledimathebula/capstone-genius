/**
 * Reservations page — shows all bookings made by the currently logged-in user.
 * Redirects to /login if the user is not authenticated.
 * Allows cancellation of individual reservations.
 */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Reservations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Redirect unauthenticated visitors to login
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Fetch the current user's reservations on mount
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api
      .get('/reservations/user')
      .then((res) => setReservations(res.data))
      .catch(() => setError('Could not load reservations. Please try again.'))
      .finally(() => setLoading(false));
  }, [user]);

  /** Cancel (delete) a reservation by ID and remove it from local state. */
  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation? This cannot be undone.')) return;
    setCancellingId(id);
    try {
      await api.delete(`/reservations/${id}`);
      setReservations((prev) => prev.filter((r) => r._id !== id));
      setSuccessMsg('Reservation cancelled.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not cancel reservation.');
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) return null;

  return (
    <div className="reservations-page">
      <div className="reservations-header">
        <h1>Your Reservations</h1>
        <Link to="/" className="res-back-link">← Back to home</Link>
      </div>

      {loading && <p className="res-loading">Loading your reservations…</p>}
      {error   && <p className="form-error">{error}</p>}
      {successMsg && <p className="res-success">{successMsg}</p>}

      {!loading && reservations.length === 0 && !error && (
        <div className="res-empty">
          <p>You don't have any reservations yet.</p>
          <Link to="/" className="res-cta-btn">Start exploring</Link>
        </div>
      )}

      {reservations.length > 0 && (
        <div className="res-list">
          {reservations.map((r) => {
            const listing  = r.accommodation;
            const checkIn  = new Date(r.checkIn).toLocaleDateString();
            const checkOut = new Date(r.checkOut).toLocaleDateString();

            return (
              <div key={r._id} className="res-card">
                {/* Thumbnail */}
                <div className="res-image">
                  {listing?.images?.[0]
                    ? <img src={listing.images[0]} alt={listing?.title} />
                    : <div className="res-image-placeholder" />}
                </div>

                {/* Info */}
                <div className="res-info">
                  <h3>
                    {listing
                      ? <Link to={`/listings/${listing._id}`}>{listing.title}</Link>
                      : <span>Listing no longer available</span>}
                  </h3>
                  {listing && (
                    <p className="res-location">{listing.type} · {listing.location}</p>
                  )}
                  <div className="res-dates">
                    <span><strong>Check-in:</strong> {checkIn}</span>
                    <span><strong>Check-out:</strong> {checkOut}</span>
                    <span><strong>Guests:</strong> {r.guests}</span>
                    <span><strong>Nights:</strong> {r.nights}</span>
                  </div>
                </div>

                {/* Cost + cancel */}
                <div className="res-cost">
                  <p className="res-total">${r.totalCost.toFixed(2)}</p>
                  <span className={`res-status ${r.status}`}>{r.status}</span>
                  <button
                    className="res-cancel-btn"
                    onClick={() => handleCancel(r._id)}
                    disabled={cancellingId === r._id}
                  >
                    {cancellingId === r._id ? 'Cancelling…' : 'Cancel'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
