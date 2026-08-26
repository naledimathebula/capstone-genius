import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Location Details page — full listing view with:
 *  - Image gallery (1 large + 2×2 thumbnails)
 *  - Accommodation details & amenities
 *  - Static info sections (sleep, offers, reviews, host, rules)
 *  - Specific ratings breakdown
 *  - Sticky cost calculator with dynamic pricing
 *  - Reserve button (requires login)
 */
export default function LocationDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loadingListing, setLoadingListing] = useState(true);
  const [checkIn, setCheckIn]   = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests]     = useState(1);
  const [message, setMessage]   = useState('');
  const [msgType, setMsgType]   = useState(''); // 'success' | 'error'
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    setLoadingListing(true);
    api
      .get(`/accommodations/${id}`)
      .then((res) => setListing(res.data))
      .catch(() => setMessage('Could not load listing.'))
      .finally(() => setLoadingListing(false));
  }, [id]);

  if (loadingListing) {
    return (
      <div className="location-details-page">
        <div className="details-loading">
          <div className="skeleton-image" style={{ height: 360, borderRadius: 12 }} />
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="skeleton-line wide" style={{ height: 28 }} />
            <div className="skeleton-line" style={{ height: 16 }} />
            <div className="skeleton-line narrow" style={{ height: 16 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="location-details-page">
        <p className="form-error">Listing not found.</p>
      </div>
    );
  }

  // ── Cost calculation ───────────────────────────────────────────────
  const today = new Date().toISOString().split('T')[0];
  const nights =
    checkIn && checkOut && checkOut > checkIn
      ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)
      : 0;
  const subtotal        = listing.price * nights;
  const discountAmount  = Math.round((subtotal * (listing.weeklyDiscount || 0)) / 100);
  const total = nights
    ? subtotal - discountAmount + listing.cleaningFee + listing.serviceFee + listing.occupancyTaxes
    : 0;

  // ── Specific ratings helper ────────────────────────────────────────
  const sr = listing.specificRatings || {};
  const ratingRows = [
    { label: 'Cleanliness',   value: sr.cleanliness },
    { label: 'Communication', value: sr.communication },
    { label: 'Check-in',      value: sr.checkIn },
    { label: 'Accuracy',      value: sr.accuracy },
    { label: 'Location',      value: sr.location },
    { label: 'Value',         value: sr.value },
  ].filter((r) => r.value);

  // ── Reserve handler ────────────────────────────────────────────────
  const handleReserve = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
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
      setMessage(`This listing accommodates a maximum of ${listing.guests} guests.`);
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
      // Reset form after success
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

  return (
    <div className="location-details-page">

      {/* ── Heading ─────────────────────────────────────────────── */}
      <h1>{listing.type} in {listing.location}</h1>
      <p className="details-subheading">
        ★ <strong>{listing.rating}</strong>
        {listing.reviews > 0 && <> · <span className="reviews-link">{listing.reviews} reviews</span></>}
        {' · '}{listing.location}
        {listing.selfCheckIn && ' · Self check-in'}
        {listing.enhancedCleaning && ' · Enhanced cleaning'}
      </p>

      {/* ── Image gallery ───────────────────────────────────────── */}
      <div className="image-gallery">
        <img
          className="main-image"
          src={listing.images?.[0] || 'https://via.placeholder.com/800x600?text=No+Image'}
          alt={listing.title}
        />
        <div className="thumb-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <img
              key={i}
              src={listing.images?.[i + 1] || listing.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
              alt={`${listing.title} view ${i + 2}`}
            />
          ))}
        </div>
      </div>

      {/* ── Two-column layout ───────────────────────────────────── */}
      <div className="details-columns">

        {/* ── Left column ─────────────────────────────────────── */}
        <div className="details-left">

          {/* Accommodation summary */}
          <h2>{listing.title}</h2>
          <p className="details-meta">
            {listing.guests} guests · {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''}
            {' · '}{listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}
          </p>
          <hr className="details-divider" />

          {/* Host intro */}
          <div className="host-row">
            <div className="host-avatar">{hostName.charAt(0).toUpperCase()}</div>
            <div>
              <p className="host-name">Hosted by {hostName}</p>
              <p className="host-sub">Superhost · 3 years hosting</p>
            </div>
          </div>
          <hr className="details-divider" />

          {/* Highlights */}
          <div className="highlights">
            {listing.selfCheckIn && (
              <div className="highlight-item">
                <span className="highlight-icon">🔑</span>
                <div>
                  <strong>Self check-in</strong>
                  <p>Check yourself in with the lockbox.</p>
                </div>
              </div>
            )}
            {listing.enhancedCleaning && (
              <div className="highlight-item">
                <span className="highlight-icon">🧹</span>
                <div>
                  <strong>Enhanced Clean</strong>
                  <p>This host committed to Airbnb's 5-step enhanced cleaning process.</p>
                </div>
              </div>
            )}
            <div className="highlight-item">
              <span className="highlight-icon">📍</span>
              <div>
                <strong>Great location</strong>
                <p>100% of recent guests gave the location a 5-star rating.</p>
              </div>
            </div>
          </div>
          <hr className="details-divider" />

          {/* Description */}
          <p className="details-description">{listing.description}</p>
          <hr className="details-divider" />

          {/* Where you'll sleep */}
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
          <hr className="details-divider" />

          {/* What this place offers */}
          <section className="static-section">
            <h3>What this place offers</h3>
            <ul className="amenities-list">
              {listing.amenities?.map((a) => (
                <li key={a} className="amenity-item">
                  <span className="amenity-icon">✓</span> {a}
                </li>
              ))}
            </ul>
          </section>
          <hr className="details-divider" />

          {/* Reviews + specific ratings */}
          {(listing.reviews > 0 || ratingRows.length > 0) && (
            <section className="static-section">
              <h3>★ {listing.rating} · {listing.reviews} reviews</h3>
              {ratingRows.length > 0 && (
                <div className="specific-ratings">
                  {ratingRows.map((row) => (
                    <div key={row.label} className="rating-row">
                      <span className="rating-label">{row.label}</span>
                      <div className="rating-bar-track">
                        <div
                          className="rating-bar-fill"
                          style={{ width: `${(row.value / 5) * 100}%` }}
                        />
                      </div>
                      <span className="rating-value">{row.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
          <hr className="details-divider" />

          {/* Host details */}
          <section className="static-section host-details">
            <div className="host-avatar large">{hostName.charAt(0).toUpperCase()}</div>
            <h3>Hosted by {hostName}</h3>
            <p>Superhost · Joined 2021</p>
            <p className="host-bio">
              Hi! I love sharing my space with travellers from around the world.
              Feel free to reach out with any questions — I usually respond within an hour.
            </p>
          </section>
          <hr className="details-divider" />

          {/* House rules */}
          <section className="static-section">
            <h3>House rules</h3>
            <ul className="rules-list">
              <li>Check-in: after 3:00 PM</li>
              <li>Checkout: 11:00 AM</li>
              <li>No smoking</li>
              <li>No parties or events</li>
              <li>Pets allowed — ask before booking</li>
            </ul>
          </section>

        </div>

        {/* ── Right column: Cost calculator ───────────────────── */}
        <aside className="cost-calculator">
          <p><strong>${listing.price}</strong> <span className="per-night">/ night</span></p>

          {listing.rating > 0 && (
            <p className="calc-rating">★ {listing.rating} · {listing.reviews} reviews</p>
          )}

          {/* Date inputs — side-by-side */}
          <div className="date-inputs">
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

          {/* Guests */}
          <label className="guests-label">
            Guests
            <input
              type="number"
              min="1"
              max={listing.guests}
              value={guests}
              onChange={(e) => setGuests(Math.min(Number(e.target.value), listing.guests))}
            />
            <span className="guests-max">max {listing.guests}</span>
          </label>

          {/* Cost breakdown */}
          {nights > 0 && (
            <div className="cost-breakdown">
              <div>
                <span>${listing.price} × {nights} night{nights !== 1 ? 's' : ''}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="discount-row">
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
            className="btn-reserve"
            onClick={handleReserve}
            disabled={reserving}
            aria-label="Reserve this listing"
          >
            {reserving ? 'Reserving…' : nights > 0 ? 'Reserve' : 'Check availability'}
          </button>

          {!user && (
            <p className="calc-note">You'll be asked to log in before confirming.</p>
          )}

          {message && (
            <p className={`reserve-message ${msgType}`}>{message}</p>
          )}
        </aside>
      </div>
    </div>
  );
}
