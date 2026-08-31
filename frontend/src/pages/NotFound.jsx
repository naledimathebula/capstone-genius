import { Link } from 'react-router-dom';

/**
 * 404 page — shown when no route matches.
 */
export default function NotFound() {
  return (
    <div className="not-found-page">
      <h1>ERROR 404</h1>
      <p>Sorry, we couldn't find that page.</p>
      <Link to="/" className="btn-primary-link">Go back home</Link>
    </div>
  );
}
