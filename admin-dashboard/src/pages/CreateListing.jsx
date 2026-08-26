import { useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import ListingForm from '../components/ListingForm.jsx';

export default function CreateListing() {
  const navigate = useNavigate();

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
