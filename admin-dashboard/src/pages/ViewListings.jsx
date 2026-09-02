/**
 * ViewListings.jsx — admin page that lists all accommodation listings.
 *
 * Fetches all listings from GET /api/accommodations on mount.
 * Provides Edit (link to /listings/:id/edit) and Delete actions per row.
 * Delete shows a confirmation dialog before making the API call and
 * removes the item from local state on success.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api.js';

export default function ViewListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  /** Fetch all listings from the backend. */
  const fetchListings = () => {
    setLoading(true);
    api
      .get('/accommodations')
      .then((res) => setListings(res.data))
      .catch(() => setError('Could not load listings.'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchListings, []);

  /**
   * Delete a listing by ID after user confirmation.
   * Removes the item from local state optimistically on success.
   */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await api.delete(`/accommodations/${id}`);
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed. Please try again.');
    }
  };

  return (
    <div className="view-listings-page">
      <div className="page-header">
        <h1>Listings</h1>
        <Link to="/listings/new" className="btn-primary">+ Add listing</Link>
      </div>

      {loading && <p>Loading listings…</p>}
      {error   && <p className="error">{error}</p>}

      {!loading && (
        <>
          <table className="listings-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Location</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing._id}>
                  <td>
                    {listing.images?.[0]
                      ? <img src={listing.images[0]} alt={listing.title} width="80" height="60" style={{ objectFit: 'cover', borderRadius: 6 }} />
                      : <div style={{ width: 80, height: 60, background: 'var(--color-bg-alt)', borderRadius: 6 }} />}
                  </td>
                  <td>{listing.title}</td>
                  <td>{listing.location}</td>
                  <td>${listing.price}/night</td>
                  <td className="row-actions">
                    <Link to={`/listings/${listing._id}/edit`} className="btn-primary btn-sm">Edit</Link>
                    <button
                      className="btn-delete btn-sm"
                      onClick={() => handleDelete(listing._id)}
                      aria-label={`Delete ${listing.title}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {listings.length === 0 && (
            <p style={{ marginTop: 24, color: 'var(--color-text-secondary)' }}>
              No listings yet.{' '}
              <Link to="/listings/new" style={{ color: 'var(--color-primary)' }}>
                Create your first listing.
              </Link>
            </p>
          )}
        </>
      )}
    </div>
  );
}
