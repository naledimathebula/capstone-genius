import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/api.js';
import LocationCard from '../components/LocationCard.jsx';

/**
 * Location page — fetches and displays all listings for a given location.
 * Shows a loading skeleton, a no-results state, and proper heading count.
 */
export default function Location() {
  const { locationName } = useParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    setListings([]);
    api
      .get('/accommodations', { params: { location: locationName } })
      .then((res) => setListings(res.data))
      .catch(() => setError('Could not load listings. Please check your connection and try again.'))
      .finally(() => setLoading(false));
  }, [locationName]);

  return (
    <div className="location-page">
      {/* Heading — only show count once data has loaded */}
      {!loading && !error && (
        <h2>
          {listings.length > 0
            ? `${listings.length} stay${listings.length === 1 ? '' : 's'} in ${locationName}`
            : `No stays found in ${locationName}`}
        </h2>
      )}
      {loading && <h2 className="heading-placeholder">Searching stays in {locationName}…</h2>}

      {/* Error state */}
      {error && <p className="form-error">{error}</p>}

      {/* Loading skeleton */}
      {loading && (
        <div className="location-cards-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="location-card-skeleton" aria-hidden="true">
              <div className="skeleton-image" />
              <div className="skeleton-line wide" />
              <div className="skeleton-line" />
              <div className="skeleton-line narrow" />
            </div>
          ))}
        </div>
      )}

      {/* Results grid */}
      {!loading && listings.length > 0 && (
        <div className="location-cards-grid">
          {listings.map((listing) => (
            <LocationCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && listings.length === 0 && (
        <div className="empty-state">
          <p>Try a different destination or browse our featured cities.</p>
          <Link to="/" className="btn-primary-link">Back to home</Link>
        </div>
      )}
    </div>
  );
}
