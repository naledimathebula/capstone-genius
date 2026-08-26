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
      <Link to="/" className="logo">airbnb <span>admin</span></Link>

      <nav className="admin-nav">
        {user && (
          <>
            <Link to="/listings">Listings</Link>
            <Link to="/listings/new">Add listing</Link>
          </>
        )}
      </nav>

      <div className="header-profile">
        {user ? (
          <div className="profile-menu">
            <button onClick={() => setMenuOpen((o) => !o)}>Hi, {user.username} ▾</button>
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
          <Link to="/login">Log in</Link>
        )}
      </div>
    </header>
  );
}
