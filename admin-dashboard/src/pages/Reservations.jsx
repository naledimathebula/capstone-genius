import { useEffect, useState } from 'react';
import api from '../api/api.js';

/**
 * Admin Reservations page — lists all reservations for the logged-in host/admin.
 * Supports cancellation (delete) of individual reservations.
 */
export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .get('/reservations/host')
      .then((res) => setReservations(res.data))
      .catch(() => setError('Could not load reservations. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  /**
   * Cancel (delete) a reservation and remove it from local state.
   */
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

  return (
    <div className="reservations-page">
      <h1>Reservations</h1>

      {loading && <p className="loading-text">Loading reservations…</p>}
      {error   && <p className="error">{error}</p>}
      {successMsg && <p className="success-msg">{successMsg}</p>}

      {!loading && !error && reservations.length === 0 && (
        <p className="empty-note">No reservations yet.</p>
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r._id}>
                <td>{r.accommodation?.title ?? <em>Deleted listing</em>}</td>
                <td>{r.user?.username ?? '—'}</td>
                <td>{new Date(r.checkIn).toLocaleDateString()}</td>
                <td>{new Date(r.checkOut).toLocaleDateString()}</td>
                <td>{r.nights}</td>
                <td>${r.totalCost.toFixed(2)}</td>
                <td><span className="status-badge">{r.status}</span></td>
                <td>
                  <button
                    className="btn-danger-sm"
                    onClick={() => handleCancel(r._id)}
                    disabled={cancellingId === r._id}
                    aria-label="Cancel reservation"
                  >
                    {cancellingId === r._id ? '…' : 'Cancel'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
