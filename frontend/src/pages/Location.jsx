/**
 * Location.jsx — listing results page for a given destination.
 *
 * Reads the `locationName` URL param and fetches all matching
 * accommodations from the backend via a case-insensitive regex filter.
 * Renders results as horizontal LocationCard components.
 * Shows a loading indicator while fetching and a helpful empty state
 * when no listings are found.
 */
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/api.js';
import LocationCard from '../components/LocationCard.jsx';

export default function Location() {
  const { locationName } = useParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    setListings([]);
    api
      .get('/accommodations', { params: { location: locationName } })
      .then((res) => setListings(res.data))
      .catch(() => setError('Could not load listings. Please try again.'))
      .finally(() => setLoading(false));
  }, [locationName]);

  return (
    <div className="location-page">
      {/* Heading — only shown once data has loaded to avoid a flash of "0 stays" */}
      {!loading && !error && (
        <h2>
          {listings.length > 0
            ? `${listings.length} stay${listings.length === 1 ? '' : 's'} in ${locationName}`
            : `No stays found in "${locationName}"`}
        </h2>
      )}
      {loading && <h2 style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}>
        Searching stays in {locationName}…
      </h2>}

      {/* Error state */}
      {error && <p className="error">{error}</p>}

      {/* Results */}
      {!loading && listings.length > 0 && (
        <div className="location-cards-grid">
          {listings.map((listing) => (
            <LocationCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && listings.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 20px' }}>
          <p style={{ fontSize: 16, marginBottom: 24 }}>
            Try a different destination or explore our featured cities.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              background: 'var(--color-primary)',
              color: '#fff',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Back to home
          </Link>
        </div>
      )}
    </div>
  );
}
