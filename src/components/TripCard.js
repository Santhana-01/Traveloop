import React from 'react';
import { storageUtils } from '../utils/storage';
import { motion } from 'framer-motion';
import '../styles/TripCard.css';

function TripCard({ trip, onEdit, onDelete }) {
  const startDate = new Date(trip.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  const endDate = new Date(trip.endDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  const totalBudget = storageUtils.calculateTotalBudget(trip.id);
  const activitiesCount = (trip.itinerary || []).reduce((count, day) => count + (day.activities || []).length, 0);

  return (
    <motion.div 
      className="trip-card"
      whileHover={{ 
        y: -10, 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(71, 181, 255, 0.2)"
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="trip-card-header">
        <h3>{trip.tripName}</h3>
        <span className="trip-dates-badge">{startDate} → {endDate}</span>
      </div>

      {trip.description && (
        <p className="trip-description">{trip.description}</p>
      )}

      <div className="trip-stats">
        <div className="stat">
          <span className="stat-label">Days</span>
          <span className="stat-value">{(trip.itinerary || []).length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Activities</span>
          <span className="stat-value">{activitiesCount}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Budget</span>
          <span className="stat-value">₹{totalBudget.toFixed(2)}</span>
        </div>
      </div>

      <div className="trip-card-actions">
        <motion.button 
          className="btn-edit" 
          onClick={() => onEdit(trip.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Edit
        </motion.button>
        <motion.button 
          className="btn-delete" 
          onClick={() => onDelete(trip.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Delete
        </motion.button>
      </div>
    </motion.div>
  );
}

export default TripCard;
