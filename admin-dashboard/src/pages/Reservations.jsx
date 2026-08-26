import { useEffect, useState } from 'react';
import api from '../api/api.js';

// Reservations for listings owned by the logged-in host/admin.
export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/reservations/host')
      .then((res) => setReservations(res.data))
      .catch(() => setError('Could not load reservations.'));
  }, []);

  return (
    <div className="reservations-page">
      <h1>Reservations</h1>
      {error && <p className="error">{error}</p>}
      <table className="listings-table">
        <thead>
          <tr>
            <th>Listing</th>
            <th>Guest</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r._id}>
              <td>{r.accommodation?.title}</td>
              <td>{r.user?.username}</td>
              <td>{new Date(r.checkIn).toLocaleDateString()}</td>
              <td>{new Date(r.checkOut).toLocaleDateString()}</td>
              <td>${r.totalCost}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {reservations.length === 0 && <p>No reservations yet.</p>}
    </div>
  );
}
