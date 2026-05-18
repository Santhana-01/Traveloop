import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MagneticEffect from '../components/common/MagneticEffect';
import '../styles/aurora-landing.css';

function LandingPage() {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featuredDestinations = [
    { name: 'Paris', country: 'France', image: '🗼', color: 'blue' },
    { name: 'Tokyo', country: 'Japan', image: '⛩️', color: 'purple' },
    { name: 'New York', country: 'USA', image: '🗽', color: 'cyan' },
    { name: 'Bali', country: 'Indonesia', image: '🏖️', color: 'teal' }
  ];

  return (
    <div className="aurora-landing">
      {/* Navigation Bar */}
      <nav className={`navbar ${scrollPosition > 50 ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-content">
            <MagneticEffect strength={5}>
              <div className="logo-fluid">Traveloop</div>
            </MagneticEffect>
            <div className="nav-links">
              <MagneticEffect strength={3} range={40}><a href="#explore">Explore</a></MagneticEffect>
              <MagneticEffect strength={3} range={40}><a href="#public-trips" onClick={(e) => { e.preventDefault(); navigate('/public-trips'); }}>Public Trips</a></MagneticEffect>
            </div>
            <div className="nav-actions">
              <MagneticEffect strength={4} range={60}><button className="btn-secondary-fluid" onClick={() => navigate('/login')}>Login</button></MagneticEffect>
              <MagneticEffect strength={5} range={60}>
                <button className="btn-primary-fluid" onClick={() => navigate('/register')}>Sign Up</button>
              </MagneticEffect>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="aurora-canvas"></div>
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="container">
            <motion.div 
              className="hero-text"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <MagneticEffect strength={8} range={150}>
                <h1 className="hero-title">
                  Plan Your <span className="text-gradient">Dream Trip</span> Made Easy
                </h1>
              </MagneticEffect>
              <MagneticEffect strength={4} range={100}>
                <p className="hero-subtitle">
                  The ultimate cinematic travel planner. Organize itineraries, manage budgets, and explore the world with Traveloop.
                </p>
              </MagneticEffect>
              <div className="hero-actions">
                <MagneticEffect strength={8} range={100}>
                  <button className="btn-primary-fluid large" onClick={() => navigate('/register')}>
                    Plan Your Dream Trip
                  </button>
                </MagneticEffect>
                <MagneticEffect strength={6} range={100}>
                  <button className="btn-secondary-fluid large" onClick={() => navigate('/public-trips')}>
                    Explore Public Trips
                  </button>
                </MagneticEffect>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section id="explore" className="section">
        <div className="container">
          <div className="section-header">
            <MagneticEffect strength={5}>
              <h2>Featured Destinations</h2>
            </MagneticEffect>
            <p>Handpicked inspirations for your next adventure.</p>
          </div>
          <div className="dest-grid">
            {featuredDestinations.map((dest, i) => (
              <div key={i} className="dest-card-fluid borderless">
                <MagneticEffect strength={6} range={100}>
                  <div className="dest-image">{dest.image}</div>
                </MagneticEffect>
                <MagneticEffect strength={4} range={80}>
                  <h3>{dest.name}</h3>
                </MagneticEffect>
                <p>{dest.country}</p>
                <MagneticEffect strength={3}>
                  <button className="btn-link" onClick={() => navigate('/register')}>Plan Now →</button>
                </MagneticEffect>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-fluid">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <MagneticEffect strength={5}>
                <h3>Traveloop</h3>
              </MagneticEffect>
              <p>Personalized Travel Planning Made Easy</p>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <MagneticEffect strength={3}><h4>Product</h4></MagneticEffect>
                <a href="#">Explore</a>
                <a href="#">Public Trips</a>
              </div>
              <div className="link-group">
                <MagneticEffect strength={3}><h4>Support</h4></MagneticEffect>
                <a href="#">Contact</a>
                <a href="#">Terms</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Traveloop. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .navbar.scrolled { background: rgba(3, 13, 19, 0.8); backdrop-filter: blur(20px); }
        .logo-fluid { font-size: 1.8rem; font-weight: 900; color: #fff; letter-spacing: -0.04em; }
        .dest-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 2rem; margin-top: 2rem; }
        .dest-card-fluid.borderless { background: none; padding: 0; text-align: left; border-left: 1px solid rgba(255, 255, 255, 0.05); padding-left: 1.5rem; }
        .dest-image { font-size: 4rem; margin-bottom: 1.5rem; width: fit-content; }
        .btn-link { background: none; border: none; color: #47B5FF; font-weight: 700; cursor: pointer; margin-top: 0.5rem; padding: 0; min-height: auto; }
        .footer-fluid { padding: 4rem 0 2rem; border-top: 1px solid rgba(255, 255, 255, 0.03); margin-top: 2rem; }
        .footer-content { display: flex; justify-content: space-between; margin-bottom: 3rem; }
        .link-group { display: flex; flex-direction: column; gap: 0.8rem; }
        .link-group a { color: rgba(255, 255, 255, 0.4); text-decoration: none; }
      `}</style>
    </div>
  );
}

export default LandingPage;
