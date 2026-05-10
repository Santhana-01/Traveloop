import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageUtils } from '../utils/storage';
import TripCard from '../components/TripCard';
import Header from '../components/Header';
import '../styles/Dashboard.css';

function Dashboard({ onLogout }) {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = () => {
    const allTrips = storageUtils.getAllTrips();
    setTrips(allTrips);
  };

  const handleCreateTrip = () => {
    navigate('/create-trip');
  };

  const handleDeleteTrip = (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      storageUtils.deleteTrip(tripId);
      loadTrips();
    }
  };

  const handleEditTrip = (tripId) => {
    navigate(`/trip/${tripId}`);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <>
      <Header title="Dashboard" onLogout={handleLogout} />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>My Trips</h2>
          <button className="btn-primary" onClick={handleCreateTrip}>
            + Create New Trip
          </button>
        </div>

        {trips.length === 0 ? (
          <div className="empty-state">
            <p>No trips yet. Create your first trip!</p>
            <button className="btn-primary" onClick={handleCreateTrip}>
              Create Trip
            </button>
          </div>
        ) : (
          <div className="trips-grid">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onEdit={handleEditTrip}
                onDelete={handleDeleteTrip}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
