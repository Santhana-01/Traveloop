import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripApi, destinationApi, activityApi } from '../api/client';
import Header from '../components/Header';
import ActivityForm from '../components/ActivityForm';
import BudgetForm from '../components/BudgetForm';
import DaySection from '../components/DaySection';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Itinerary.css';
import { storageUtils } from '../utils/storage';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

function Itinerary() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
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
        setIsPublic(response.trip.isPublic || false);
      } else {
        setError('Trip not found');
      }
    } catch (err) {
      console.log('Failed to load trip from API:', err.message);
      const localTrips = storageUtils.getAllTrips();
      const localTrip = localTrips.find(t => t.id === tripId || t._id === tripId);
      if (localTrip) {
        setTrip({
          ...localTrip,
          tripName: localTrip.name,
          itinerary: (localTrip.itinerary || []).map((day, index) => ({ ...day, dayNumber: index + 1 }))
        });
        setError('Loaded from local storage.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadTrip();
  }, [loadTrip]);

  const handleAddDay = async () => {
    try {
      if (!trip || !trip.itinerary) return;
      await destinationApi.addDestination(tripId, { 
        name: `Day ${trip.itinerary.length + 1}`,
        country: trip.name || 'Planned Location',
        startDate: trip.startDate,
        endDate: trip.endDate
      });
      loadTrip();
    } catch (err) {
      setError('Failed to add day.');
    }
  };

  const handleTogglePublic = async () => {
    try {
      setToggleLoading(true);
      if (isPublic) {
        await tripApi.makePrivate(tripId);
        setIsPublic(false);
      } else {
        await tripApi.makePublic(tripId);
        setIsPublic(true);
      }
      loadTrip();
    } catch (err) {
      setError(`Failed to change trip privacy: ${err.message}`);
    } finally {
      setToggleLoading(false);
    }
  };

  const handleDeleteDay = async (dayId) => {
    if (window.confirm('Delete this day?')) {
      try {
        await destinationApi.deleteDestination(dayId);
        loadTrip();
      } catch (err) {
        setError('Failed to delete day.');
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
      const day = trip.itinerary.find(d => d.id === selectedDayId);
      const dayNum = day ? day.dayNumber : 1;
      const tripStart = new Date(trip.startDate);
      const activityDate = new Date(tripStart.getTime() + (dayNum - 1) * 24 * 60 * 60 * 1000);

      const payload = { ...activityData, date: activityDate.toISOString() };

      // Optimistic update
      const tempId = editingActivity ? (editingActivity._id || editingActivity.id) : Date.now().toString();
      const newActivity = { ...payload, id: tempId, _id: tempId };
      setTrip(prevTrip => {
        const newItin = prevTrip.itinerary.map(d => {
          if (d.id === selectedDayId) {
            let newActs = [...(d.activities || [])];
            if (editingActivity) {
              newActs = newActs.map(a => (a.id === tempId || a._id === tempId) ? newActivity : a);
            } else {
              newActs.push(newActivity);
            }
            return { ...d, activities: newActs };
          }
          return d;
        });
        return { ...prevTrip, itinerary: newItin };
      });
      
      setShowActivityForm(false);
      setEditingActivity(null);
      setSelectedDayId(null);

      if (editingActivity) {
        await activityApi.updateActivity(tempId, payload);
      } else {
        await activityApi.addActivity(selectedDayId, payload);
      }
      
      loadTrip();
    } catch (err) {
      alert('Error saving place: ' + err.message);
      loadTrip(); // Revert on failure
    }
  };

  const handleDeleteActivity = async (dayId, activityId) => {
    if (window.confirm('Remove this place?')) {
      // Optimistic update
      setTrip(prevTrip => {
        const newItin = prevTrip.itinerary.map(d => {
          if (d.id === dayId) {
            return { ...d, activities: (d.activities || []).filter(a => a.id !== activityId && a._id !== activityId) };
          }
          return d;
        });
        return { ...prevTrip, itinerary: newItin };
      });

      try {
        await activityApi.deleteActivity(activityId);
        loadTrip();
      } catch (err) {
        alert('Failed to remove place.');
        loadTrip(); // Revert
      }
    }
  };

  const handleSaveBudget = async (budget) => {
    try {
      await tripApi.updateBudget(tripId, budget);
      loadTrip();
    } catch (err) {
      setError('Failed to update budget.');
    }
  };

  if (loading) {
    return (
      <div className="aurora-page-wrapper">
        <div className="loading-screen">
          <div className="loading-text">Loading Itinerary</div>
          <div className="loading-bar"></div>
        </div>
      </div>
    );
  }

  const budget = trip.budget || { total: 0 };
  const totalBudget = parseFloat(budget.total || 0);

  return (
    <div className="aurora-page-wrapper">
      <Header title={trip.tripName} showBackButton onBack={() => navigate('/dashboard')} />
      <motion.div 
        className="itinerary-container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="trip-info glass-panel" variants={itemVariants}>
          <div className="trip-info-header">
            <h2>{trip.tripName}</h2>
            <div className="trip-badges">
              <span className="trip-date-badge">🗓️ {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
              <motion.button 
                className={`privacy-badge ${isPublic ? 'public' : 'private'}`}
                onClick={handleTogglePublic}
                disabled={toggleLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPublic ? '🌐 Public' : '🔒 Private'}
              </motion.button>
            </div>
          </div>
          {trip.description && <p className="trip-description">{trip.description}</p>}
          <div className="trip-stats-row">
            <div className="trip-stat-item">
              <span className="label">Total Days</span>
              <span className="value">{(trip.itinerary || []).length}</span>
            </div>
            <div className="trip-stat-item">
              <span className="label">Budget</span>
              <span className="value">₹{totalBudget.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        <motion.div className="tabs-container" variants={itemVariants}>
          <div className="tabs">
            <button className={`tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`} onClick={() => setActiveTab('itinerary')}>Itinerary Plan</button>
            <button className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`} onClick={() => setActiveTab('budget')}>Expense Tracker</button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="tab-content"
          >
            {activeTab === 'itinerary' && (
              <div className="itinerary-section">
                {trip.itinerary && trip.itinerary.length === 0 ? (
                  <motion.div className="empty-section glass-panel" variants={itemVariants}>
                    <p>Your itinerary is empty. Let's start planning!</p>
                    <button className="btn-primary" onClick={handleAddDay}>+ Add Day 1</button>
                  </motion.div>
                ) : (
                  <>
                    <motion.div className="days-list" variants={containerVariants}>
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
                    </motion.div>
                    <motion.button 
                      className="btn-primary btn-add-day" 
                      onClick={handleAddDay}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      + Add Next Day
                    </motion.button>
                  </>
                )}
              </div>
            )}

            {activeTab === 'budget' && (
              <motion.div className="budget-section glass-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <BudgetForm budget={trip.budget} onSave={handleSaveBudget} totalBudget={totalBudget} />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {showActivityForm && (
            <ActivityForm
              onSave={handleSaveActivity}
              initialData={editingActivity}
              onCancel={() => { setShowActivityForm(false); setSelectedDayId(null); setEditingActivity(null); }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Itinerary;
