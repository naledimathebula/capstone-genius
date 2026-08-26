import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Top header — Airbnb logo, location search filter pill, and profile section.
 * When logged in: shows username dropdown with "View reservations" and "Log out".
 * When logged out: shows "Become a host" link.
 */
export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const term = search.trim();
    if (term) {
      navigate(`/locations/${encodeURIComponent(term)}`);
      setSearch('');
    }
  };

  return (
    <header className="site-header">
      {/* Logo */}
      <Link to="/" className="logo" aria-label="Home">
        <svg viewBox="0 0 32 32" className="logo-icon" aria-hidden="true">
          <path d="M16 1C10.48 1 6 8.36 6 14c0 7.73 10 17 10 17s10-9.27 10-17C26 8.36 21.52 1 16 1zm0 18a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" fill="currentColor"/>
        </svg>
        <span>airbnb</span>
      </Link>

      {/* Location search filter pill */}
      <form className="header-filter-form" onSubmit={handleSearch} role="search">
        <input
          className="header-filter-input"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Anywhere · Any week · Add guests"
          aria-label="Search destinations"
        />
        <button type="submit" className="header-filter-btn" aria-label="Search">
          <svg viewBox="0 0 32 32" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="4">
            <circle cx="13" cy="13" r="10" />
            <line x1="21" y1="21" x2="28" y2="28" />
          </svg>
        </button>
      </form>

      {/* Profile section */}
      <div className="header-profile">
        {user ? (
          <div className="profile-menu">
            <button
              className="profile-btn"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <span className="profile-avatar">{user.username.charAt(0).toUpperCase()}</span>
              {user.username}
              <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor" aria-hidden="true">
                <path d="M8 10.5 2 4.5h12z" />
              </svg>
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
          <div className="header-auth">
            <Link to="/login" className="become-host">Become a host</Link>
            <Link to="/login" className="btn-login">Log in</Link>
          </div>
        )}
      </div>
    </header>
  );
}
