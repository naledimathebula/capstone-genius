/**
 * Reservations.jsx — admin page showing all reservations for the
 * currently logged-in host/admin's listings.
 *
 * Fetches from GET /api/reservations/host which returns reservations
 * where host === req.user._id (populated with accommodation + guest details).
 * Shows listing title, guest username, dates, total cost, and status.
 */
import { useEffect, useState } from 'react';
import api from '../api/api.js';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  /** Fetch all host reservations on mount. */
  useEffect(() => {
    api
      .get('/reservations/host')
      .then((res) => setReservations(res.data))
      .catch(() => setError('Could not load reservations. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="reservations-page">
      <h1>Reservations</h1>

      {loading && <p>Loading reservations…</p>}
      {error   && <p className="error">{error}</p>}

      {!loading && reservations.length === 0 && !error && (
        <p style={{ color: 'var(--color-text-secondary)' }}>No reservations yet.</p>
      )}

      {reservations.length > 0 && (
        <table className="listings-table">
          <thead>
            <tr>
              <th>Listing</th>
              <th>Guest</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Nights</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r._id}>
                <td>{r.accommodation?.title ?? <em>Deleted</em>}</td>
                <td>{r.user?.username ?? '—'}</td>
                <td>{new Date(r.checkIn).toLocaleDateString()}</td>
                <td>{new Date(r.checkOut).toLocaleDateString()}</td>
                <td>{r.nights}</td>
                <td>${r.totalCost.toFixed(2)}</td>
                <td><span className="status-badge">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
