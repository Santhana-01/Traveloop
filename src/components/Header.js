import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header({ title, onLogout, showBackButton, onBack }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    setShowMenu(false);
    onLogout();
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          {showBackButton && (
            <button 
              className="back-btn"
              onClick={onBack}
              title="Go back"
            >
              ← Back
            </button>
          )}
          <Link to="/dashboard" className="logo">
            Traveloop
          </Link>
        </div>

        <h1 className="header-title">{title}</h1>

        <div className="header-right">
          <nav className="nav-menu">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/trips" className="nav-link">My Trips</Link>
            <Link to="/explore-destinations" className="nav-link">Explore</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
          </nav>

          <div className="header-actions">
            <button 
              className="menu-toggle"
              onClick={() => setShowMenu(!showMenu)}
              title="Menu"
            >
              ☰
            </button>
            {showMenu && onLogout && (
              <div className="menu-dropdown">
                <Link 
                  to="/dashboard"
                  className="menu-item"
                  onClick={() => setShowMenu(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/trips"
                  className="menu-item"
                  onClick={() => setShowMenu(false)}
                >
                  My Trips
                </Link>
                <Link 
                  to="/explore-destinations"
                  className="menu-item"
                  onClick={() => setShowMenu(false)}
                >
                  Explore Destinations
                </Link>
                <Link 
                  to="/profile"
                  className="menu-item"
                  onClick={() => setShowMenu(false)}
                >
                  Profile
                </Link>
                <div className="menu-divider"></div>
                <button 
                  className="menu-item logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
