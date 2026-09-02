/**
 * Header.jsx — sticky top navigation bar for the Airbnb clone frontend.
 *
 * Contains:
 *   - Logo linking to the home page
 *   - Multi-field search bar (Location, Check-in, Check-out, Guests)
 *     that navigates to /locations/:searchTerm on submit
 *   - Profile section:
 *     - Logged in:  avatar initial + dropdown (View reservations, Log out)
 *     - Logged out: "Become a host" link
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch]     = useState({ location: '', checkIn: '', checkOut: '', guests: '' });
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  /**
   * Handle search form submission.
   * Navigates to /locations/:location if a location was entered.
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.location.trim()) {
      navigate(`/locations/${encodeURIComponent(search.location.trim())}`);
    }
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        {/* Logo */}
        <Link to="/" className="logo">Genius airbnb</Link>

        {/* Search bar — 4 fields: location, check-in, check-out, guests */}
        <form className="header-search-bar" onSubmit={handleSearch} role="search">
          <div className="search-field">
            <label>Location</label>
            <input
              placeholder="Where are you going?"
              value={search.location}
              onChange={(e) => setSearch({ ...search, location: e.target.value })}
              aria-label="Destination"
            />
          </div>
          <span className="search-divider" aria-hidden="true" />
          <div className="search-field">
            <label>Check in</label>
            <input
              type="date"
              value={search.checkIn}
              onChange={(e) => setSearch({ ...search, checkIn: e.target.value })}
              aria-label="Check-in date"
            />
          </div>
          <span className="search-divider" aria-hidden="true" />
          <div className="search-field">
            <label>Check out</label>
            <input
              type="date"
              value={search.checkOut}
              onChange={(e) => setSearch({ ...search, checkOut: e.target.value })}
              aria-label="Check-out date"
            />
          </div>
          <span className="search-divider" aria-hidden="true" />
          <div className="search-field">
            <label>Guests</label>
            <input
              type="number"
              min="1"
              placeholder="Add guests"
              value={search.guests}
              onChange={(e) => setSearch({ ...search, guests: e.target.value })}
              aria-label="Number of guests"
            />
          </div>
          <button type="submit" className="search-submit" aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2.5" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </form>

        {/* Profile / auth section */}
        <div className="header-profile">
          {user ? (
            <div className="profile-menu">
              <button
                className="profile-btn"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <span className="hamburger" aria-hidden="true" />
                <span className="avatar" aria-hidden="true">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </button>

              {menuOpen && (
                <div className="dropdown" role="menu">
                  <span className="dropdown-greeting">Hi, {user.username}</span>
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
            <Link to="/login" className="become-host">Become a host</Link>
          )}
        </div>
      </div>
    </header>
  );
}
