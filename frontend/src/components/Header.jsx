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
    navigate('/');
  };

  return (
    <header className="site-header">
      <Link to="/" className="logo"> Genius airbnb</Link>

      {/* TODO: replace with real location filter (see Location page) */}
      <div className="header-filter">Anywhere · Any week · Add guests</div>

      <div className="header-profile">
        {user ? (
          <div className="profile-menu">
            <button onClick={() => setMenuOpen((o) => !o)}>{user.username} ▾</button>
            {menuOpen && (
              <div className="dropdown">
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
    </header>
  );
}
