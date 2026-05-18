import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { tripApi } from '../api/client';
import { storageUtils } from '../utils/storage';
import MagneticEffect from '../components/common/MagneticEffect';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Dashboard-v2.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

function Dashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tripApi.getUserTrips();
      if (response.success) {
        setTrips(response.trips);
      }
    } catch (err) {
      const localTrips = storageUtils.getAllTrips();
      setTrips(localTrips);
      if (localTrips.length === 0) {
        setError('Unable to load trips. Create a new trip to get started.');
      }
    } finally {
      setLoading(false);
    }
  };

  const upcomingTrips = trips.filter(trip => new Date(trip.startDate) > new Date()).slice(0, 2);
  const recentTrips = trips.slice(0, 3);
  const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget?.total || 0), 0);
  const spent = trips.reduce((sum, trip) => sum + (trip.budget?.spent || 0), 0);

  return (
    <div className="dashboard-immersive">
      <motion.main 
        className="dashboard-content content-flow"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Welcome Section */}
        <motion.section className="hero-section" variants={itemVariants}>
          <MagneticEffect strength={8}>
            <h1 className="welcome-title">
              Welcome back, <span className="user-name">{user?.name}</span> 👋
            </h1>
          </MagneticEffect>
          <p className="hero-subtitle">Ready to plan your next dream adventure?</p>
          <div className="hero-actions-fluid">
            <MagneticEffect strength={5}>
              <button className="btn-primary-fluid" onClick={() => navigate('/create-trip')}>
                + Create New Trip
              </button>
            </MagneticEffect>
          </div>
        </motion.section>

        {/* Budget Summary Cards */}
        <motion.section className="budget-summary-section" variants={itemVariants}>
          <h2 className="section-title-fluid">Budget Overview</h2>
          <div className="budget-cards-grid">
            <div className="budget-card-fluid">
              <span className="card-label">Total Allocated</span>
              <span className="card-value">₹{totalBudget.toLocaleString()}</span>
              <div className="card-indicator blue"></div>
            </div>
            <div className="budget-card-fluid">
              <span className="card-label">Total Spent</span>
              <span className="card-value">₹{spent.toLocaleString()}</span>
              <div className="card-indicator coral"></div>
            </div>
            <div className="budget-card-fluid">
              <span className="card-label">Remaining</span>
              <span className="card-value">₹{(totalBudget - spent).toLocaleString()}</span>
              <div className="card-indicator teal"></div>
            </div>
          </div>
        </motion.section>

        {/* Upcoming Trips */}
        {upcomingTrips.length > 0 && (
          <motion.section className="upcoming-section" variants={itemVariants}>
            <h2 className="section-title-fluid">Upcoming Adventures</h2>
            <div className="upcoming-grid">
              {upcomingTrips.map(trip => (
                <div key={trip._id} className="upcoming-item-fluid" onClick={() => navigate(`/trip/${trip._id}`)}>
                  <div className="upcoming-info">
                    <h3>{trip.name}</h3>
                    <p>{new Date(trip.startDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <span className="days-left">
                    In {Math.ceil((new Date(trip.startDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Recent Activity */}
        <motion.section className="activity-section" variants={itemVariants}>
          <div className="section-header-fluid">
            <h2>Recent Journeys</h2>
            <button className="btn-link-fluid" onClick={() => navigate('/trips')}>View All →</button>
          </div>

          <div className="trips-fluid-list">
            {recentTrips.map((trip) => (
              <motion.div 
                key={trip._id} 
                className="trip-item-fluid"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => navigate(`/trip/${trip._id}`)}
              >
                <div className="trip-main-info">
                  <h3 className="trip-name-fluid">{trip.name}</h3>
                  <p className="trip-date-fluid">
                    {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="trip-meta-fluid">
                  <span className="status-badge">{trip.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Recommended Destinations */}
        <motion.section className="recommendations-immersive" variants={itemVariants}>
          <h2 className="section-title-fluid">Recommended for You</h2>
          <div className="rec-fluid-grid">
            {[
              { name: 'Santorini', country: 'Greece', emoji: '🏛️' },
              { name: 'Kyoto', country: 'Japan', emoji: '⛩️' },
              { name: 'Amalfi Coast', country: 'Italy', emoji: '🍋' },
              { name: 'Maldives', country: 'Maldives', emoji: '🏝️' }
            ].map((dest, i) => (
              <motion.div 
                key={i} 
                className="rec-item-fluid"
                whileHover={{ scale: 1.05 }}
              >
                <div className="rec-glow-bg"></div>
                <div className="rec-content-fluid">
                  <span className="rec-emoji-fluid">{dest.emoji}</span>
                  <div className="rec-text-fluid">
                    <h4>{dest.name}</h4>
                    <p>{dest.country}</p>
                  </div>
                  <button className="btn-select-fluid" onClick={() => navigate('/create-trip')}>Plan</button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.main>

      <style jsx>{`
        .hero-actions-fluid { margin-top: 2rem; }
        .budget-cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-top: 2rem; }
        .budget-card-fluid { background: rgba(255, 255, 255, 0.02); padding: 2rem; border-radius: 24px; position: relative; overflow: hidden; }
        .card-label { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255, 255, 255, 0.4); font-weight: 700; }
        .card-value { display: block; font-size: 2rem; font-weight: 800; margin-top: 0.5rem; color: #fff; }
        .card-indicator { position: absolute; bottom: 0; left: 0; width: 100%; height: 4px; }
        .card-indicator.blue { background: #1363DF; }
        .card-indicator.coral { background: #FF8E72; }
        .card-indicator.teal { background: #47B5FF; }
        .upcoming-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
        .upcoming-item-fluid { background: linear-gradient(135deg, rgba(71, 181, 255, 0.05), rgba(19, 99, 223, 0.05)); padding: 2rem; border-radius: 24px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.3s ease; }
        .upcoming-item-fluid:hover { transform: translateY(-5px); background: rgba(71, 181, 255, 0.1); }
        .upcoming-info h3 { font-size: 1.4rem; margin-bottom: 0.3rem; }
        .upcoming-info p { color: rgba(255, 255, 255, 0.4); font-size: 0.9rem; }
        .days-left { font-weight: 800; color: #47B5FF; font-size: 0.9rem; text-transform: uppercase; }
        .btn-link-fluid { background: none; border: none; color: #47B5FF; font-weight: 700; cursor: pointer; }
        .status-badge { background: rgba(255, 255, 255, 0.05); padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.75rem; text-transform: uppercase; font-weight: 800; }
      `}</style>
    </div>
  );
}

export default Dashboard;
