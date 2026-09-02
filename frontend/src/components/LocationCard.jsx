/**
 * LocationCard.jsx — a single listing card on the Location results page.
 *
 * Layout: image on the LEFT, details on the RIGHT (per the brief spec).
 * Displays: accommodation type, listing name, amenities (first 3),
 * average star rating, total reviews, and price per night.
 * Includes a heart wishlist toggle button.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LocationCard({ listing }) {
  const [saved, setSaved] = useState(false);

  /** Toggle the wishlist heart without triggering card navigation. */
  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved((s) => !s);
  };

  return (
    <Link to={`/listings/${listing._id}`} className="location-card">
      {/* ── Left: image ───────────────────────────────────────── */}
      <div className="location-card-image-wrap">
        <img
          src={listing.images?.[0] || 'https://via.placeholder.com/300x240?text=No+Image'}
          alt={listing.title}
        />
        <button
          className={`wishlist-btn${saved ? ' saved' : ''}`}
          onClick={toggleSave}
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? '#FF385C' : 'rgba(0,0,0,0.5)'}>
            <path d="M12 21s-6.7-4.35-9.3-8.1C1.1 10.6 1 8 2.7 6.2 4.4 4.4 7.2 4.5 9 6.3L12 9.3l3-3c1.8-1.8 4.6-1.9 6.3-0.1 1.7 1.8 1.6 4.4-0 6.7C18.7 16.65 12 21 12 21z" stroke="white" strokeWidth="1.2"/>
          </svg>
        </button>
      </div>

      {/* ── Right: details ────────────────────────────────────── */}
      <div className="location-card-body">
        {/* Type header */}
        <p className="card-type">{listing.type}</p>
        {/* Listing name */}
        <h3 className="card-title">{listing.title}</h3>
        {/* Quick specs */}
        <p className="card-specs">
          {listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''}
          {' · '}{listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}
          {' · '}{listing.guests} guest{listing.guests !== 1 ? 's' : ''}
        </p>
        {/* Amenities (first 3) */}
        <p className="card-amenities">
          {listing.amenities?.slice(0, 3).join(' · ')}
        </p>
        {/* Rating + reviews + price */}
        <div className="card-footer">
          <span className="card-rating">
            ★ {listing.rating}
            {listing.reviews > 0 && (
              <span className="card-reviews"> ({listing.reviews})</span>
            )}
          </span>
          <p className="card-price"><strong>${listing.price}</strong> / night</p>
        </div>
      </div>
    </Link>
  );
}
