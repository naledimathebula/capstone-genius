import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LocationCard({ listing }) {
  const [saved, setSaved] = useState(false);

  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved((s) => !s);
  };

  return (
    <Link to={`/listings/${listing._id}`} className="location-card">
      <div className="location-card-image-wrap">
        <img src={listing.images?.[0]} alt={listing.title} />
        <button
          className={`wishlist-btn ${saved ? 'saved' : ''}`}
          onClick={toggleSave}
          aria-label="Save listing"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? '#FF385C' : 'rgba(0,0,0,0.5)'}>
            <path d="M12 21s-6.7-4.35-9.3-8.1C1.1 10.6 1 8 2.7 6.2 4.4 4.4 7.2 4.5 9 6.3L12 9.3l3-3c1.8-1.8 4.6-1.9 6.3-0.1 1.7 1.8 1.6 4.4-0 6.7C18.7 16.65 12 21 12 21z" stroke="white" strokeWidth="1.2" />
          </svg>
        </button>
      </div>
      <div className="location-card-body">
        <div className="location-card-top">
          <h3>{listing.type} in {listing.location}</h3>
          <span className="card-rating">★ {listing.rating}</span>
        </div>
        <p className="card-amenities">{listing.amenities?.slice(0, 3).join(', ')}</p>
        <p className="card-price"><strong>${listing.price}</strong> night</p>
      </div>
    </Link>
  );
}
