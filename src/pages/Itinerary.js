import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripApi, destinationApi, activityApi } from '../api/client';
import Header from '../components/Header';
import ActivityForm from '../components/ActivityForm';
import BudgetForm from '../components/BudgetForm';
import DaySection from '../components/DaySection';
import '../styles/Itinerary.css';

function Itinerary() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadTrip = useCallback(async () => {
    try {
      setLoading(true);
      const response = await tripApi.getTripById(tripId);
      if (response.success) {
        const transformedTrip = {
          ...response.trip,
          tripName: response.trip.name, 
          itinerary: (response.trip.destinations || []).map((dest, index) => ({
            id: dest._id || dest.id,
            dayNumber: index + 1,
            name: dest.name,
            activities: dest.activities || []
          }))
        };
        setTrip(transformedTrip);
      } else {
        setError('Trip not found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadTrip();
  }, [loadTrip]);

  const handleAddDay = async () => {
    try {
      const destName = `Day ${trip.itinerary.length + 1}`;
      await destinationApi.addDestination(tripId, { 
        name: destName,
        country: trip.name || 'Planned Location',
        startDate: trip.startDate,
        endDate: trip.endDate
      });
      loadTrip();
    } catch (err) {
      alert('Error adding day: ' + err.message);
    }
  };

  const handleDeleteDay = async (dayId) => {
    if (window.confirm('Delete this day?')) {
      try {
        await destinationApi.deleteDestination(dayId);
        loadTrip();
      } catch (err) {
        alert('Error deleting day: ' + err.message);
      }
    }
  };

  const handleAddActivity = (dayId) => {
    setSelectedDayId(dayId);
    setEditingActivity(null);
    setShowActivityForm(true);
  };

  const handleEditActivity = (dayId, activity) => {
    setSelectedDayId(dayId);
    setEditingActivity(activity);
    setShowActivityForm(true);
  };

  const handleSaveActivity = async (activityData) => {
    try {
      // Find the day to get its dayNumber for date calculation
      const day = trip.itinerary.find(d => d.id === selectedDayId);
      const dayNum = day ? day.dayNumber : 1;
      
      // Calculate a valid date for the activity to satisfy backend validation
      const tripStart = new Date(trip.startDate);
      const activityDate = new Date(tripStart.getTime() + (dayNum - 1) * 24 * 60 * 60 * 1000);

      const payload = {
        ...activityData,
        date: activityDate.toISOString() // This fixed the validation error
      };

      if (editingActivity) {
        await activityApi.updateActivity(editingActivity._id || editingActivity.id, payload);
      } else {
        await activityApi.addActivity(selectedDayId, payload);
      }
      
      loadTrip();
      setShowActivityForm(false);
      setEditingActivity(null);
      setSelectedDayId(null);
    } catch (err) {
      alert('Error saving place: ' + err.message);
    }
  };

  const handleDeleteActivity = async (dayId, activityId) => {
    if (window.confirm('Remove this place?')) {
      try {
        await activityApi.deleteActivity(activityId);
        loadTrip();
      } catch (err) {
        alert('Error deleting activity: ' + err.message);
      }
    }
  };

  const handleSaveBudget = async (budget) => {
    try {
      await tripApi.updateBudget(tripId, budget);
      loadTrip();
    } catch (err) {
      alert('Error updating budget: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="aurora-page-wrapper">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading your itinerary...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aurora-page-wrapper">
        <div className="error-container">
          <p>Error: {error}</p>
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const budget = trip.budget || { total: 0, transport: 0, stay: 0, food: 0, activity: 0 };
  const totalBudget = parseFloat(budget.total || 0);

  return (
    <div className="aurora-page-wrapper">
      <Header 
        title={trip.tripName}
        showBackButton
        onBack={() => navigate('/dashboard')}
      />
      <div className="itinerary-container">
        <div className="trip-info">
          <div>
            <h2>{trip.tripName}</h2>
            <p className="trip-dates">
              🗓️ {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </p>
            {trip.description && <p className="trip-description">{trip.description}</p>}
          </div>
          <div className="trip-stats-inline">
            <div className="mini-stat">
              <span className="label">Total Budget</span>
              <span className="value">₹{totalBudget.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
            onClick={() => setActiveTab('itinerary')}
          >
            Itinerary Plan
          </button>
          <button
            className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('budget')}
          >
            Expense Tracker
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'itinerary' && (
            <div className="itinerary-section">
              {trip.itinerary && trip.itinerary.length === 0 ? (
                <div className="empty-section">
                  <p>Your itinerary is empty.</p>
                  <button className="btn-primary" onClick={handleAddDay}>
                    + Add Day 1
                  </button>
                </div>
              ) : (
                <>
                  <div className="days-list">
                    {trip.itinerary.map((day) => (
                      <DaySection
                        key={day.id}
                        day={day}
                        onAddActivity={handleAddActivity}
                        onEditActivity={handleEditActivity}
                        onDeleteActivity={handleDeleteActivity}
                        onDeleteDay={handleDeleteDay}
                      />
                    ))}
                  </div>
                  <button className="btn-primary btn-add-day" onClick={handleAddDay}>
                    + Add Next Day
                  </button>
                </>
              )}

              {showActivityForm && (
                <ActivityForm
                  onSave={handleSaveActivity}
                  initialData={editingActivity}
                  onCancel={() => {
                    setShowActivityForm(false);
                    setSelectedDayId(null);
                    setEditingActivity(null);
                  }}
                />
              )}
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="budget-section">
              <BudgetForm
                budget={trip.budget}
                onSave={handleSaveBudget}
                totalBudget={totalBudget}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Itinerary;
