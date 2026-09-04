/**
 * Header.jsx — sticky navigation bar for the Admin Dashboard.
 *
 * Contains:
 *   - Logo ("airbnb admin") linking to /
 *   - Navigation links (Listings, Add listing) — only visible when logged in
 *   - Profile section:
 *     - Logged in:  "Hi, {username}" button with dropdown (View reservations, Log out)
 *     - Logged out: plain "Log in" link
 *
 * Calls AuthContext.logout() which clears localStorage and redirects
 * to /login on sign-out.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="admin-header">
      {/* Logo */}
      <Link to="/" className="logo" aria-label="Admin home">
        Genius airbnb <span>admin</span>
      </Link>

      {/* Navigation links — only rendered when a session is active */}
      {user && (
        <nav className="admin-nav" aria-label="Admin navigation">
          <Link to="/listings">Listings</Link>
          <Link to="/listings/new">Add listing</Link>
          <Link to="/reservations">Reservations</Link>
        </nav>
      )}

      {/* Profile / auth section */}
      <div className="header-profile">
        {user ? (
          <div className="profile-menu">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              Hi, {user.username} ▾
            </button>
            {menuOpen && (
              <div className="dropdown" role="menu">
                <Link
                  to="/reservations"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  View reservations
                </Link>
                <button role="menuitem" onClick={handleLogout}>Log out</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">Log in</Link>
        )}
      </div>
    </header>
  );
}
