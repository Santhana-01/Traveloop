import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { tripApi } from '../api/client';
import Header from '../components/Header';
import MagneticEffect from '../components/common/MagneticEffect';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/MyTrips.css';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

function MyTrips() {
  const { logout } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => { loadTrips(); }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const response = await tripApi.getUserTrips();
      if (response.success) setTrips(response.trips);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleDelete = async (tripId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await tripApi.deleteTrip(tripId);
      loadTrips();
    } catch (err) { alert('Error deleting'); }
  };

  const filteredTrips = trips.filter((trip) => {
    if (filter === 'public') return trip.isPublic;
    if (filter === 'completed') return trip.status === 'completed';
    if (filter === 'upcoming') return new Date(trip.startDate) > new Date();
    return true;
  });

  return (
    <div className="trips-immersive">
      <motion.main 
        className="trips-content content-flow"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      >
        <motion.section className="trips-hero" variants={itemVariants}>
          <h1 className="trips-title-fluid">All My <span className="highlight">Journeys</span></h1>
          <div className="trips-filter-row">
            {['all', 'upcoming', 'completed', 'public'].map((f) => (
              <MagneticEffect key={f} strength={3}>
                <button className={`filter-tab-fluid ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                  {f}
                </button>
              </MagneticEffect>
            ))}
          </div>
        </motion.section>

        <motion.section className="trips-list-fluid" variants={itemVariants}>
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="fluid-loader">Navigating the currents...</div>
            ) : filteredTrips.length === 0 ? (
              <p className="empty-msg">The ocean is calm. No trips found.</p>
            ) : (
              <div className="trips-fluid-grid">
                {filteredTrips.map((trip) => (
                  <motion.div key={trip._id} className="trip-item-fluid" layout variants={itemVariants} whileHover={{ x: 10 }}>
                    <div className="trip-main-info" onClick={() => navigate(`/trip/${trip._id}`)}>
                      <h3 className="trip-name-fluid">{trip.name}</h3>
                      <div className="trip-meta-fluid">
                        <span>{new Date(trip.startDate).toLocaleDateString()}</span>
                        <div className="dot-separator"></div>
                        <span>{trip.destinations.length} Stops</span>
                        <div className="dot-separator"></div>
                        <span className={`status-text ${trip.status}`}>{trip.status}</span>
                      </div>
                    </div>
                    <div className="trip-actions-fluid">
                      <MagneticEffect strength={3}><button className="fluid-action" onClick={() => navigate(`/trip/${trip._id}`)}>View</button></MagneticEffect>
                      <MagneticEffect strength={3}><button className="fluid-action" onClick={() => navigate(`/create-trip`, { state: { tripId: trip._id } })}>Edit</button></MagneticEffect>
                      <MagneticEffect strength={3}><button className="fluid-action delete" onClick={() => handleDelete(trip._id)}>Delete</button></MagneticEffect>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.section>

        <motion.section className="trips-footer-fluid" variants={itemVariants}>
          <MagneticEffect strength={6}>
            <button className="btn-primary-fluid" onClick={() => navigate('/create-trip')}>
              Start New Journey
            </button>
          </MagneticEffect>
        </motion.section>
      </motion.main>
    </div>
  );
}

export default MyTrips;
