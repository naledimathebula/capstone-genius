import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import ListingForm from '../components/ListingForm.jsx';

export default function UpdateListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/accommodations/${id}`)
      .then((res) => setListing(res.data))
      .catch(() => setError('Could not load listing.'));
  }, [id]);

  const handleUpdate = async (payload) => {
    await api.put(`/accommodations/${id}`, payload);
    navigate('/listings');
  };

  if (error) return <p className="error">{error}</p>;
  if (!listing) return <p>Loading...</p>;

  return (
    <div className="listing-page">
      <h1>Update listing</h1>
      <ListingForm initialValues={listing} onSubmit={handleUpdate} submitLabel="Save changes" />
    </div>
  );
}
