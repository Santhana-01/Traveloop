import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { tripApi } from '../api/client';
import Header from '../components/Header';
import '../styles/Dashboard-v2.css';

function Dashboard() {
  const { user, logout } = useAuth();
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
      const response = await tripApi.getUserTrips();
      if (response.success) {
        setTrips(response.trips.slice(0, 3)); // Show last 3 trips
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTripId = (trip) => trip._id || trip.id || trip.id?.toString();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateTrip = () => {
    navigate('/create-trip');
  };

  const handleEditTrip = (tripId) => {
    navigate(`/create-trip`, { state: { tripId } });
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) {
      return;
    }

    try {
      setLoading(true);
      await tripApi.deleteTrip(tripId);
      await loadTrips();
    } catch (err) {
      setError(err.message || 'Unable to delete trip');
    } finally {
      setLoading(false);
    }
  };

  const upcomingTrip = trips.find(
    trip => new Date(trip.startDate) > new Date()
  );

  const totalBudget = trips.reduce(
    (sum, trip) => sum + (trip.budget.transport + trip.budget.stay + trip.budget.food + trip.budget.activity),
    0
  );

  return (
    <>
      <Header title="Dashboard" onLogout={handleLogout} />
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2>Welcome back, {user?.name}! 👋</h2>
          <p>Ready for your next adventure?</p>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card" title="Total number of trips you have planned">
            <span className="stat-icon">✈️</span>
            <div>
              <div className="stat-value">{trips.length}</div>
              <div className="stat-label">All Trips</div>
            </div>
          </div>
          <div className="stat-card" title="Total cities or locations you'll visit">
            <span className="stat-icon">📍</span>
            <div>
              <div className="stat-value">
                {trips.reduce((sum, trip) => sum + (trip.destinations?.length || 0), 0)}
              </div>
              <div className="stat-label">Total Cities</div>
            </div>
          </div>
          <div className="stat-card" title="Combined estimated budget for all trips">
            <span className="stat-icon">💰</span>
            <div>
              <div className="stat-value">₹{totalBudget.toFixed(2)}</div>
              <div className="stat-label">Total Budget</div>
            </div>
          </div>
          <div className="stat-card" title="Your next adventure arrival date">
            <span className="stat-icon">📅</span>
            <div>
              <div className="stat-value">
                {upcomingTrip ? new Date(upcomingTrip.startDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'None'}
              </div>
              <div className="stat-label">Upcoming</div>
            </div>
          </div>
        </div>

        {/* Upcoming Trip Alert */}
        {upcomingTrip && (
          <div className="upcoming-alert">
            <strong>🎉 Upcoming Trip:</strong> {upcomingTrip.name}{' '}
            on {new Date(upcomingTrip.startDate).toLocaleDateString()}
          </div>
        )}

        {/* Recent Trips */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>📋 Recent Trips (Budget ₹{totalBudget.toFixed(2)})</h3>
            <button className="btn-primary" onClick={handleCreateTrip}>
              + Create New Trip
            </button>
          </div>

          {loading ? (
            <p>Loading trips...</p>
          ) : error ? (
            <p className="error-text">Error: {error}</p>
          ) : trips.length === 0 ? (
            <div className="empty-state">
              <p>No trips yet. Start planning your first adventure!</p>
              <button className="btn-primary" onClick={handleCreateTrip}>
                Create Trip
              </button>
            </div>
          ) : (
            <div className="trips-grid">
              {trips.map((trip) => {
                const id = getTripId(trip);
                return (
                  <div
                    key={id}
                    className="trip-preview-card"
                  >
                    <div className="trip-header">
                      <h4 onClick={() => navigate(`/trip/${id}`)}>
                        {trip.name}
                      </h4>
                      <span className="trip-status">{trip.status}</span>
                    </div>
                    <p className="trip-dates">
                      {new Date(trip.startDate).toLocaleDateString()} →{' '}
                      {new Date(trip.endDate).toLocaleDateString()}
                    </p>
                    <p className="trip-meta">
                      {trip.destinations?.length || 0} destinations • {trip.isPublic ? '🌐 Public' : '🔒 Private'}
                    </p>
                    <div className="trip-actions">
                      <button
                        className="action-btn"
                        onClick={() => navigate(`/trip/${id}`)}
                        title="View itinerary"
                      >
                        📋 Itinerary
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => handleEditTrip(id)}
                        title="Edit trip"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => handleDeleteTrip(id)}
                        title="Delete trip"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recommended Destinations */}
        <div className="dashboard-section">
          <h3>⭐ Recommended Destinations</h3>
          <div className="recommendations-grid">
            {[
              { name: 'Paris', icon: '🗼', desc: 'City of Light' },
              { name: 'Tokyo', icon: '⛩️', desc: 'Modern Tradition' },
              { name: 'New York', icon: '🗽', desc: 'The Big Apple' },
              { name: 'Barcelona', icon: '🏖️', desc: 'Beach & Culture' }
            ].map((dest) => (
              <div key={dest.name} className="rec-card">
                <div className="rec-icon">{dest.icon}</div>
                <h4>{dest.name}</h4>
                <p>{dest.desc}</p>
                <button
                  className="btn-small"
                  onClick={handleCreateTrip}
                >
                  Plan Trip
                </button>
              </div>
            ))}
          </div>
        </div>


      </div>
    </>
  );
}

export default Dashboard;
