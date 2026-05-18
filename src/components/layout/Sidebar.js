import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import MagneticEffect from '../common/MagneticEffect';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'My Trips', path: '/trips', icon: '✈️' },
    { name: 'Explore Cities', path: '/explore-destinations', icon: '🌍' },
    { name: 'Budget Planner', path: '/budget', icon: '💰' },
    { name: 'Packing Checklist', path: '/checklist', icon: '🎒' },
    { name: 'Notes', path: '/notes', icon: '📝' },
    { name: 'Public Trips', path: '/public-trips', icon: '🌐' },
    { name: 'Profile Settings', path: '/profile', icon: '👤' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside 
          className="sidebar-fluid"
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="sidebar-brand">
            <MagneticEffect strength={5}>
              <NavLink to="/dashboard" className="brand-logo">Traveloop</NavLink>
            </MagneticEffect>
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <MagneticEffect key={item.name} strength={4} range={60} className="w-full">
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="link-icon">{item.icon}</span>
                  <span className="link-text">{item.name}</span>
                </NavLink>
              </MagneticEffect>
            ))}
          </nav>

          <div className="sidebar-footer">
            <MagneticEffect strength={4} range={60} className="w-full">
              <button className="btn-logout-sidebar" onClick={handleLogout}>
                <span className="link-icon">🚪</span>
                <span className="link-text">Logout</span>
              </button>
            </MagneticEffect>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
