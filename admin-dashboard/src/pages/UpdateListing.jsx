/**
 * UpdateListing.jsx — admin page for editing an existing listing.
 *
 * Fetches the current listing data from GET /api/accommodations/:id on
 * mount and passes it as initialValues to the shared ListingForm.
 * On submit, PUTs the updated payload and navigates back to /listings.
 * Any API errors are surfaced inside ListingForm via its serverError state.
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import ListingForm from '../components/ListingForm.jsx';

export default function UpdateListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [error, setError]     = useState('');

  /** Fetch the listing to pre-fill the form. */
  useEffect(() => {
    api
      .get(`/accommodations/${id}`)
      .then((res) => setListing(res.data))
      .catch(() => setError('Could not load listing. Please go back and try again.'));
  }, [id]);

  /**
   * Save the updated listing.
   * @param {object} payload — validated, typed form data from ListingForm
   */
  const handleUpdate = async (payload) => {
    await api.put(`/accommodations/${id}`, payload);
    navigate('/listings');
  };

  if (error)    return <p className="error" style={{ padding: '32px 40px' }}>{error}</p>;
  if (!listing) return <p style={{ padding: '32px 40px' }}>Loading listing…</p>;

  return (
    <div className="listing-page">
      <h1>Update listing</h1>
      <ListingForm
        initialValues={listing}
        onSubmit={handleUpdate}
        submitLabel="Save changes"
      />
    </div>
  );
}
