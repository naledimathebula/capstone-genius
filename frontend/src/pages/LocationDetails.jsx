import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function LocationDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/accommodations/${id}`).then((res) => setListing(res.data));
  }, [id]);

  if (!listing) return <p>Loading...</p>;

  const nights =
    checkIn && checkOut
      ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000))
      : 0;
  const subtotal = listing.price * nights;
  const discount = (subtotal * (listing.weeklyDiscount || 0)) / 100;
  const total = nights
    ? subtotal - discount + listing.cleaningFee + listing.serviceFee + listing.occupancyTaxes
    : 0;

  const handleReserve = async () => {
    if (!user) {
      setMessage('Please log in to reserve.');
      return;
    }
    if (!checkIn || !checkOut) {
      setMessage('Please select check-in and check-out dates.');
      return;
    }
    try {
      await api.post('/reservations', {
        accommodation: listing._id,
        checkIn,
        checkOut,
        guests,
      });
      setMessage('Reservation confirmed!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Reservation failed.');
    }
  };

  return (
    <div className="location-details-page">
      <h1>{listing.type} in {listing.location}</h1>
      <p>★ {listing.rating} · {listing.location}</p>

      <div className="image-gallery">
        <img className="main-image" src={listing.images?.[0]} alt={listing.title} />
        <div className="thumb-grid">
          {listing.images?.slice(1, 5).map((img, i) => (
            <img key={i} src={img} alt="" />
          ))}
        </div>
      </div>

      <div className="details-columns">
        <div className="details-left">
          <h2>{listing.title}</h2>
          <p>{listing.description}</p>
          <h3>What this place offers</h3>
          <ul>
            {listing.amenities?.map((a) => <li key={a}>{a}</li>)}
          </ul>
        </div>

        <aside className="cost-calculator">
          <p><strong>${listing.price}</strong> / night</p>
          <label>
            Check-in
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          </label>
          <label>
            Check-out
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          </label>
          <label>
            Guests
            <input type="number" min="1" value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
          </label>

          {nights > 0 && (
            <div className="cost-breakdown">
              <div><span>${listing.price} x {nights} nights</span><span>${subtotal.toFixed(2)}</span></div>
              {listing.weeklyDiscount > 0 && (
                <div><span>Weekly discount</span><span>-${discount.toFixed(2)}</span></div>
              )}
              <div><span>Cleaning fee</span><span>${listing.cleaningFee}</span></div>
              <div><span>Service fee</span><span>${listing.serviceFee}</span></div>
              <div><span>Occupancy taxes</span><span>${listing.occupancyTaxes}</span></div>
              <div className="cost-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          )}

          <button onClick={handleReserve}>Reserve</button>
          {message && <p className="reserve-message">{message}</p>}
        </aside>
      </div>
    </div>
  );
}
