import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api.js';

/**
 * View Listings page — displays all accommodation listings in a table
 * with edit and delete actions. Shows loading state during the initial
 * fetch and a per-row loading indicator during delete.
 */
export default function ViewListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchListings = () => {
    setLoading(true);
    setError('');
    api
      .get('/accommodations')
      .then((res) => setListings(res.data))
      .catch(() => setError('Could not load listings. Please try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchListings, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api.delete(`/accommodations/${id}`);
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="view-listings-page">
      <div className="page-header">
        <h1>Listings</h1>
        <Link to="/listings/new" className="btn-primary">+ Add listing</Link>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="loading-text">Loading listings…</p>
      ) : (
        <>
          <table className="listings-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Price / night</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing._id} className={deletingId === listing._id ? 'row-deleting' : ''}>
                  <td>
                    {listing.images?.[0] ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        width="80"
                        height="54"
                        style={{ objectFit: 'cover', borderRadius: 6 }}
                      />
                    ) : (
                      <div className="img-placeholder" />
                    )}
                  </td>
                  <td>{listing.title}</td>
                  <td>{listing.location}</td>
                  <td>{listing.type}</td>
                  <td>${listing.price}</td>
                  <td className="row-actions">
                    <Link to={`/listings/${listing._id}/edit`} className="action-edit">Edit</Link>
                    <button
                      className="action-delete"
                      onClick={() => handleDelete(listing._id)}
                      disabled={deletingId === listing._id}
                      aria-label={`Delete ${listing.title}`}
                    >
                      {deletingId === listing._id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {listings.length === 0 && (
            <p className="empty-note">No listings yet. <Link to="/listings/new">Create your first listing</Link>.</p>
          )}
        </>
      )}
    </div>
  );
}
