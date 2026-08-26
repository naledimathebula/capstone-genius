import { Link } from 'react-router-dom';

/**
 * 404 page — shown when no admin route matches.
 */
export default function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>This page doesn't exist.</p>
      <Link to="/listings" className="btn-primary">Back to listings</Link>
    </div>
  );
}
