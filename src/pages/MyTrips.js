import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { tripApi } from '../api/client';
import Header from '../components/Header';
import '../styles/MyTrips.css';

function MyTrips() {
  const { logout } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const response = await tripApi.getUserTrips();
      if (response.success) {
        setTrips(response.trips);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await tripApi.deleteTrip(tripId);
        loadTrips();
      } catch (err) {
        alert('Error deleting trip');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredTrips = trips.filter((trip) => {
    if (filter === 'public') return trip.isPublic;
    if (filter === 'completed') return trip.status === 'completed';
    if (filter === 'upcoming') return new Date(trip.startDate) > new Date();
    return true;
  });

  return (
    <>
      <Header 
        title="My Trips" 
        onLogout={handleLogout}
        showBackButton
        onBack={() => navigate('/dashboard')}
      />
      <div className="my-trips-container">
        <div className="trips-header">
          <h2>All My Trips</h2>
          <button
            className="btn-primary"
            onClick={() => navigate('/create-trip')}
          >
            + New Trip
          </button>
        </div>

        <div className="filter-tabs">
          {['all', 'upcoming', 'completed', 'public'].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Loading trips...</p>
        ) : filteredTrips.length === 0 ? (
          <div className="empty-state">
            <p>No trips found</p>
          </div>
        ) : (
          <div className="trips-table">
            <div className="table-header">
              <div className="col-name">Trip Name</div>
              <div className="col-dates">Dates</div>
              <div className="col-dests">Destinations</div>
              <div className="col-status">Status</div>
              <div className="col-actions">Actions</div>
            </div>
            {filteredTrips.map((trip) => (
              <div key={trip._id} className="table-row">
                <div className="col-name">
                  <strong>{trip.name}</strong>
                </div>
                <div className="col-dates">
                  {new Date(trip.startDate).toLocaleDateString()} -{' '}
                  {new Date(trip.endDate).toLocaleDateString()}
                </div>
                <div className="col-dests">{trip.destinations.length}</div>
                <div className="col-status">
                  <span className={`status-badge ${trip.status}`}>
                    {trip.status}
                  </span>
                </div>
                <div className="col-actions">
                  <button
                    className="action-btn view"
                    onClick={() => navigate(`/trip/${trip._id}`)}
                  >
                    View
                  </button>
                  <button
                    className="action-btn edit"
                    onClick={() => navigate(`/trip/${trip._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(trip._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MyTrips;
