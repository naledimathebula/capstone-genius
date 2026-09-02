/**
 * LocationDetails.jsx — full listing detail page.
 *
 * Sections (left column):
 *   - Heading: accommodation type + location
 *   - Subheading: rating, reviews, location
 *   - Image gallery: 1 large + 2×2 thumbnails
 *   - Host intro row
 *   - "Where you'll sleep" bedroom cards
 *   - "What this place offers" amenities
 *   - Reviews section with star breakdown
 *   - Host details card
 *   - House Rules
 *   - Health & Safety
 *   - Cancellation Policy
 *
 * Right column (sticky):
 *   - Cost calculator with dynamic pricing, date pickers, guest count
 *   - Reserve button (redirects to /login if unauthenticated)
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function LocationDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing]     = useState(null);
  const [checkIn, setCheckIn]     = useState('');
  const [checkOut, setCheckOut]   = useState('');
  const [guests, setGuests]       = useState(1);
  const [message, setMessage]     = useState('');
  const [msgType, setMsgType]     = useState(''); // 'success' | 'error'
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    api.get(`/accommodations/${id}`).then((res) => setListing(res.data));
  }, [id]);

  if (!listing) return <p className="details-loading">Loading…</p>;

  // ── Cost calculation ──────────────────────────────────────────────
  const today  = new Date().toISOString().split('T')[0];
  const nights =
    checkIn && checkOut && checkOut > checkIn
      ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)
      : 0;
  const subtotal       = listing.price * nights;
  const discountAmount = Math.round((subtotal * (listing.weeklyDiscount || 0)) / 100);
  const total = nights
    ? subtotal - discountAmount + listing.cleaningFee + listing.serviceFee + listing.occupancyTaxes
    : 0;

  // ── Reserve handler ───────────────────────────────────────────────
  const handleReserve = async () => {
    if (!user) { navigate('/login'); return; }
    if (!checkIn || !checkOut) {
      setMessage('Please select check-in and check-out dates.');
      setMsgType('error');
      return;
    }
    if (checkOut <= checkIn) {
      setMessage('Check-out must be after check-in.');
      setMsgType('error');
      return;
    }
    if (guests > listing.guests) {
      setMessage(`Maximum ${listing.guests} guests allowed.`);
      setMsgType('error');
      return;
    }
    setReserving(true);
    setMessage('');
    try {
      await api.post('/reservations', {
        accommodation: listing._id,
        checkIn,
        checkOut,
        guests,
      });
      setMessage('Reservation confirmed! View it in your reservations.');
      setMsgType('success');
      setCheckIn('');
      setCheckOut('');
      setGuests(1);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Reservation failed. Please try again.');
      setMsgType('error');
    } finally {
      setReserving(false);
    }
  };

  const hostName = listing.host?.username || 'Your host';
  const sr       = listing.specificRatings || {};
  const ratingRows = [
    { label: 'Cleanliness',   val: sr.cleanliness },
    { label: 'Communication', val: sr.communication },
    { label: 'Check-in',      val: sr.checkIn },
    { label: 'Accuracy',      val: sr.accuracy },
    { label: 'Location',      val: sr.location },
    { label: 'Value',         val: sr.value },
  ].filter((r) => r.val);

  // Approximate "7 nights" label based on current check-in or default
  const nightLabel = nights > 0 ? `${nights} night${nights !== 1 ? 's' : ''}` : '7 nights';

  return (
    <div className="location-details-page">

      {/* ── Heading ──────────────────────────────────────────────── */}
      <h1>{listing.type} in {listing.location}</h1>
      <p className="details-sub">
        ★ <strong>{listing.rating}</strong>
        {listing.reviews > 0 && (
          <> · <span className="details-reviews-link">{listing.reviews} reviews</span></>
        )}
        {' · '}{listing.location}
      </p>

      {/* ── Image gallery ─────────────────────────────────────────── */}
      <div className="image-gallery">
        <img
          className="main-image"
          src={listing.images?.[0] || 'https://via.placeholder.com/800x600?text=No+Image'}
          alt={listing.title}
        />
        <div className="thumb-grid">
          {[1, 2, 3, 4].map((i) => (
            <img
              key={i}
              src={
                listing.images?.[i] ||
                listing.images?.[0] ||
                'https://via.placeholder.com/400x300?text=No+Image'
              }
              alt={`${listing.title} view ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── Two-column layout ─────────────────────────────────────── */}
      <div className="details-columns">

        {/* ════ LEFT COLUMN ════════════════════════════════════════ */}
        <div className="details-left">

          {/* Accommodation title + meta */}
          <h2>{listing.title}</h2>
          <p className="details-meta">
            {listing.guests} guests · {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''}
            {' · '}{listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}
          </p>
          <hr className="details-hr" />

          {/* Host intro row */}
          <div className="host-row">
            <div className="host-avatar-sm">{hostName.charAt(0).toUpperCase()}</div>
            <div>
              <p className="host-name-label">Hosted by {hostName}</p>
              <p className="host-sub-label">Superhost · 3 years hosting</p>
            </div>
          </div>
          <hr className="details-hr" />

          {/* Description */}
          <p className="details-description">{listing.description}</p>
          <hr className="details-hr" />

          {/* ── Where you'll sleep ─────────────────────────────── */}
          <section className="static-section">
            <h3>Where you'll sleep</h3>
            <div className="sleep-cards">
              {Array.from({ length: Math.max(1, listing.bedrooms) }).map((_, i) => (
                <div key={i} className="sleep-card">
                  <span className="sleep-icon">🛏</span>
                  <strong>Bedroom {i + 1}</strong>
                  <p>1 queen bed</p>
                </div>
              ))}
            </div>
          </section>
          <hr className="details-hr" />

          {/* ── What this place offers ────────────────────────── */}
          <section className="static-section">
            <h3>What this place offers</h3>
            <ul className="amenities-grid">
              {listing.amenities?.map((a) => (
                <li key={a} className="amenity-item">
                  <span className="amenity-check">✓</span> {a}
                </li>
              ))}
            </ul>
          </section>
          <hr className="details-hr" />

          {/* ── {nightLabel} in {location} ──────────────────────── */}
          <section className="static-section">
            <h3>{nightLabel} in {listing.location}</h3>
            <div className="nights-grid">
              <div className="nights-cell">
                <strong>Check-in</strong>
                <p>{checkIn || 'Add date'}</p>
              </div>
              <div className="nights-cell">
                <strong>Check-out</strong>
                <p>{checkOut || 'Add date'}</p>
              </div>
            </div>
          </section>
          <hr className="details-hr" />

          {/* ── Reviews ──────────────────────────────────────────── */}
          {listing.rating > 0 && (
            <section className="static-section">
              <h3>★ {listing.rating} · {listing.reviews} reviews</h3>
              {ratingRows.length > 0 && (
                <div className="rating-rows">
                  {ratingRows.map((row) => (
                    <div key={row.label} className="rating-row">
                      <span className="rating-label">{row.label}</span>
                      <div className="rating-track">
                        <div className="rating-fill" style={{ width: `${(row.val / 5) * 100}%` }} />
                      </div>
                      <span className="rating-val">{row.val}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
          <hr className="details-hr" />

          {/* ── Host details ─────────────────────────────────────── */}
          <section className="static-section host-details-section">
            <div className="host-avatar-lg">{hostName.charAt(0).toUpperCase()}</div>
            <div>
              <h3>{hostName}</h3>
              <p>Superhost · Joined 2021</p>
              <p className="host-bio">
                Hi! I love sharing my space with travellers from around the world.
                Feel free to reach out with any questions — I usually respond within an hour.
              </p>
            </div>
          </section>
          <hr className="details-hr" />

          {/* ── House Rules ──────────────────────────────────────── */}
          <section className="static-section">
            <h3>House rules</h3>
            <ul className="rules-list">
              <li>Check-in after 3:00 PM</li>
              <li>Checkout before 11:00 AM</li>
              <li>No smoking</li>
              <li>No parties or events</li>
              <li>Pets allowed — ask before booking</li>
            </ul>
          </section>
          <hr className="details-hr" />

          {/* ── Health & Safety ──────────────────────────────────── */}
          <section className="static-section">
            <h3>Health &amp; safety</h3>
            <ul className="rules-list">
              <li>Committed to Airbnb's enhanced cleaning process</li>
              <li>Carbon monoxide alarm installed</li>
              <li>Smoke alarm installed</li>
              <li>Security deposit required</li>
            </ul>
          </section>
          <hr className="details-hr" />

          {/* ── Cancellation Policy ──────────────────────────────── */}
          <section className="static-section">
            <h3>Cancellation policy</h3>
            <p className="policy-text">
              <strong>Free cancellation before 48 hours of check-in.</strong> After that, the first
              night and the service fee are non-refundable.
            </p>
          </section>

        </div>{/* end details-left */}

        {/* ════ RIGHT COLUMN — cost calculator ══════════════════════ */}
        <aside className="cost-calculator">
          <p className="calc-price"><strong>${listing.price}</strong> <span>/ night</span></p>
          {listing.rating > 0 && (
            <p className="calc-rating">★ {listing.rating} · {listing.reviews} reviews</p>
          )}

          {/* Date inputs */}
          <div className="calc-dates">
            <label>
              Check-in
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  if (checkOut && checkOut <= e.target.value) setCheckOut('');
                }}
              />
            </label>
            <label>
              Check-out
              <input
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </label>
          </div>

          {/* Guest count */}
          <label className="calc-guests-label">
            Guests
            <input
              type="number"
              min="1"
              max={listing.guests}
              value={guests}
              onChange={(e) => setGuests(Math.min(Number(e.target.value), listing.guests))}
            />
            <span className="calc-guests-max">max {listing.guests}</span>
          </label>

          {/* Cost breakdown */}
          {nights > 0 && (
            <div className="cost-breakdown">
              <div>
                <span>${listing.price} × {nights} night{nights !== 1 ? 's' : ''}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="breakdown-discount">
                  <span>Weekly discount ({listing.weeklyDiscount}%)</span>
                  <span>−${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div>
                <span>Cleaning fee</span>
                <span>${listing.cleaningFee}</span>
              </div>
              <div>
                <span>Service fee</span>
                <span>${listing.serviceFee}</span>
              </div>
              <div>
                <span>Occupancy taxes</span>
                <span>${listing.occupancyTaxes}</span>
              </div>
              <div className="cost-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <button
            className="reserve-btn"
            onClick={handleReserve}
            disabled={reserving}
          >
            {reserving ? 'Reserving…' : nights > 0 ? 'Reserve' : 'Check availability'}
          </button>

          {!user && (
            <p className="calc-note">You'll be asked to log in to confirm.</p>
          )}

          {message && (
            <p className={`reserve-message ${msgType}`}>{message}</p>
          )}
        </aside>

      </div>{/* end details-columns */}
    </div>
  );
}
