/**
 * CreateListing.jsx — admin page for adding a new property listing.
 *
 * Renders the shared ListingForm component with an empty initial state.
 * On submit, POSTs the payload to POST /api/accommodations and navigates
 * back to the listings table on success.
 * Any API errors are surfaced inside ListingForm via its serverError state.
 */
import { useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import ListingForm from '../components/ListingForm.jsx';

export default function CreateListing() {
  const navigate = useNavigate();

  /**
   * Create a new listing.
   * @param {object} payload — validated, typed form data from ListingForm
   */
  const handleCreate = async (payload) => {
    await api.post('/accommodations', payload);
    navigate('/listings');
  };

  return (
    <div className="listing-page">
      <h1>Add a new listing</h1>
      <ListingForm onSubmit={handleCreate} submitLabel="Create listing" />
    </div>
  );
}
