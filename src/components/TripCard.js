import React from 'react';
import { storageUtils } from '../utils/storage';
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
  const activitiesCount = trip.itinerary.reduce((count, day) => count + day.activities.length, 0);

  return (
    <div className="trip-card">
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
          <span className="stat-value">{trip.itinerary.length}</span>
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
        <button className="btn-edit" onClick={() => onEdit(trip.id)}>
          Edit
        </button>
        <button className="btn-delete" onClick={() => onDelete(trip.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TripCard;
