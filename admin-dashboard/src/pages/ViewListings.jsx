import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api.js';

export default function ViewListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchListings = () => {
    setLoading(true);
    api
      .get('/accommodations')
      .then((res) => setListings(res.data))
      .catch(() => setError('Could not load listings.'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchListings, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await api.delete(`/accommodations/${id}`);
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <div className="view-listings-page">
      <div className="page-header">
        <h1>Listings</h1>
        <Link to="/listings/new" className="btn-primary">+ Add listing</Link>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <table className="listings-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Location</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing._id}>
              <td><img src={listing.images?.[0]} alt="" width="80" /></td>
              <td>{listing.title}</td>
              <td>{listing.location}</td>
              <td>${listing.price}</td>
              <td className="row-actions">
                <Link to={`/listings/${listing._id}/edit`} className="btn-primary btn-sm">Edit</Link>
                <button className="btn-delete btn-sm" onClick={() => handleDelete(listing._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!loading && listings.length === 0 && <p>No listings yet.</p>}
    </div>
  );
}
