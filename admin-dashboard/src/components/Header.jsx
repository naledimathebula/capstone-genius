import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Admin dashboard header — logo, navigation with active-link highlighting,
 * and a profile dropdown with "View reservations" and "Log out".
 */
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
        airbnb <span>admin</span>
      </Link>

      {/* Navigation — only visible when logged in */}
      {user && (
        <nav className="admin-nav" aria-label="Main navigation">
          <NavLink
            to="/listings"
            className={({ isActive }) => isActive ? 'active' : undefined}
            end={false}
          >
            Listings
          </NavLink>
          <NavLink
            to="/listings/new"
            className={({ isActive }) => isActive ? 'active' : undefined}
          >
            Add listing
          </NavLink>
          <NavLink
            to="/reservations"
            className={({ isActive }) => isActive ? 'active' : undefined}
          >
            Reservations
          </NavLink>
        </nav>
      )}

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
              Hi, {user.username}
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
