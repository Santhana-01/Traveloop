import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticEffect from './common/MagneticEffect';
import '../styles/Header.css';

function Header({ title, toggleSidebar, sidebarOpen }) {
  const navigate = useNavigate();

  return (
    <motion.header 
      className="header-fluid"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="header-container-fluid">
        <div className="header-left-fluid">
          <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
            {sidebarOpen ? '✕' : '☰'}
          </button>
          
          <Link to="/dashboard" className="logo-fluid">
            <span>Traveloop</span>
          </Link>
        </div>

        <div className="header-center-fluid">
          <h1 className="header-title-fluid">{title}</h1>
        </div>

        <div className="header-right-fluid">
          {/* Right side kept minimal as requested */}
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
