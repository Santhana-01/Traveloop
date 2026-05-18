import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { tripApi } from '../../api/client';
import MagneticEffect from '../../components/common/MagneticEffect';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/Dashboard-v2.css';

function Dashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const response = await tripApi.getUserTrips();
        if (response.success) setTrips(response.trips);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    loadTrips();
  }, []);

  const totalBudget = trips.reduce((sum, t) => sum + (t.budget?.total || 0), 0);
  const totalSpent = trips.reduce((sum, t) => sum + (t.budget?.spent || 0), 0);
  const upcomingTrips = trips.filter(t => new Date(t.startDate) > new Date()).slice(0, 2);

  return (
    <div className="dashboard-immersive">
      <motion.main className="dashboard-content content-flow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        
        <section className="hero-section float-slow">
          <MagneticEffect strength={8} range={120}>
            <h1 className="welcome-title">Welcome back, <span className="user-name">{user?.name}</span></h1>
          </MagneticEffect>
          <MagneticEffect strength={4} range={100}>
            <p className="hero-subtitle">You have {trips.length} active journeys. Where to next?</p>
          </MagneticEffect>
          <div style={{ marginTop: '2rem' }}>
            <MagneticEffect strength={6}>
              <button className="btn-primary-fluid" onClick={() => navigate('/create-trip')}>+ Create New Trip</button>
            </MagneticEffect>
          </div>
        </section>

        <section className="budget-summary-section">
          <MagneticEffect strength={5}>
            <h2 className="section-title-fluid">Financial Overview</h2>
          </MagneticEffect>
          <div className="budget-cards-grid">
            <div className="budget-card-fluid no-box">
              <span className="card-label">Total Allocated</span>
              <MagneticEffect strength={6}>
                <span className="card-value">₹{totalBudget.toLocaleString()}</span>
              </MagneticEffect>
              <div className="card-indicator blue"></div>
            </div>
            <div className="budget-card-fluid no-box">
              <span className="card-label">Total Spent</span>
              <MagneticEffect strength={6}>
                <span className="card-value">₹{totalSpent.toLocaleString()}</span>
              </MagneticEffect>
              <div className="card-indicator coral"></div>
            </div>
          </div>
        </section>

        {upcomingTrips.length > 0 && (
          <section className="upcoming-section">
            <MagneticEffect strength={5}>
              <h2 className="section-title-fluid">Next Stops</h2>
            </MagneticEffect>
            <div className="upcoming-grid">
              {upcomingTrips.map(trip => (
                <div key={trip._id} className="upcoming-item-fluid no-box" onClick={() => navigate(`/trip/${trip._id}`)}>
                  <MagneticEffect strength={5}>
                    <h3>{trip.name}</h3>
                  </MagneticEffect>
                  <MagneticEffect strength={4}>
                    <span className="days-left">In {Math.ceil((new Date(trip.startDate) - new Date()) / (1000 * 60 * 60 * 24))} Days</span>
                  </MagneticEffect>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="activity-section">
          <div className="section-header-fluid">
            <MagneticEffect strength={5}>
              <h2>Recent Trips</h2>
            </MagneticEffect>
            <MagneticEffect strength={4}>
              <button className="btn-link-fluid" onClick={() => navigate('/trips')}>All Trips →</button>
            </MagneticEffect>
          </div>
          <div className="trips-fluid-list">
            {trips.slice(0, 3).map(trip => (
              <div key={trip._id} className="trip-item-fluid borderless" onClick={() => navigate(`/trip/${trip._id}`)}>
                <div className="trip-main-info">
                  <MagneticEffect strength={5}>
                    <h3 className="trip-name-fluid">{trip.name}</h3>
                  </MagneticEffect>
                  <MagneticEffect strength={3}>
                    <p className="trip-date-fluid">{new Date(trip.startDate).toLocaleDateString()}</p>
                  </MagneticEffect>
                </div>
                <MagneticEffect strength={3}>
                  <span className="status-badge">{trip.status}</span>
                </MagneticEffect>
              </div>
            ))}
          </div>
        </section>
      </motion.main>
    </div>
  );
}

export default Dashboard;
