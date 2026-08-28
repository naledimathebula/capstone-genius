import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState({ location: '', checkIn: '', checkOut: '', guests: '' });
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.location.trim()) {
      navigate(`/locations/${encodeURIComponent(search.location.trim())}`);
    }
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="logo">Genius airbnb</Link>

        <form className="header-search-bar" onSubmit={handleSearch}>
          <div className="search-field">
            <label>Location</label>
            <input
              placeholder="Where are you going?"
              value={search.location}
              onChange={(e) => setSearch({ ...search, location: e.target.value })}
            />
          </div>
          <span className="search-divider" />
          <div className="search-field">
            <label>Check in</label>
            <input
              type="date"
              value={search.checkIn}
              onChange={(e) => setSearch({ ...search, checkIn: e.target.value })}
            />
          </div>
          <span className="search-divider" />
          <div className="search-field">
            <label>Check out</label>
            <input
              type="date"
              value={search.checkOut}
              onChange={(e) => setSearch({ ...search, checkOut: e.target.value })}
            />
          </div>
          <span className="search-divider" />
          <div className="search-field">
            <label>Guests</label>
            <input
              type="number"
              min="1"
              placeholder="Add guests"
              value={search.guests}
              onChange={(e) => setSearch({ ...search, guests: e.target.value })}
            />
          </div>
          <button type="submit" className="search-submit" aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2.5" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </form>

        <div className="header-profile">
          {user ? (
            <div className="profile-menu">
              <button onClick={() => setMenuOpen((o) => !o)} className="profile-btn">
                <span className="hamburger" />
                <span className="avatar">{user.username.charAt(0).toUpperCase()}</span>
              </button>
              {menuOpen && (
                <div className="dropdown">
                  <span className="dropdown-greeting">Hi, {user.username}</span>
                  <Link to="/reservations" onClick={() => setMenuOpen(false)}>
                    View reservations
                  </Link>
                  <button onClick={handleLogout}>Log out</button>
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
