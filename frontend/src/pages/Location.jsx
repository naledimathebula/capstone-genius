import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api.js';
import LocationCard from '../components/LocationCard.jsx';

export default function Location() {
  const { locationName } = useParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .get('/accommodations', { params: { location: locationName } })
      .then((res) => setListings(res.data))
      .catch(() => setError('Could not load listings. Please try again.'))
      .finally(() => setLoading(false));
  }, [locationName]);

  return (
    <div className="location-page">
      <h2>{listings.length} stays in {locationName}</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="location-cards-grid">
        {listings.map((listing) => (
          <LocationCard key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
