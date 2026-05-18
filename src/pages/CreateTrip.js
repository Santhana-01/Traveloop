import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { tripApi, destinationApi } from '../api/client';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/CreateTrip.css';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

function CreateTrip() {
  const location = useLocation();
  const navigate = useNavigate();
  const editTripId = location.state?.tripId;
  const preFilledDestination = location.state?.destinationName;
  const isEditMode = Boolean(editTripId);
  const [formData, setFormData] = useState({
    tripName: '',
    startDate: '',
    endDate: '',
    budget: '',
    description: preFilledDestination ? `Exploring ${preFilledDestination}` : '',
    createItinerary: true
  });
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdTripId, setCreatedTripId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const totalDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  }, [formData.startDate, formData.endDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'budget') {
      // Allow empty string or numbers only
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  useEffect(() => {
    if (!isEditMode) return;

    const loadTrip = async () => {
      try {
        setLoading(true);
        const response = await tripApi.getTripById(editTripId);
        if (response.success && response.trip) {
          setFormData({
            tripName: response.trip.name || '',
            description: response.trip.description || '',
            startDate: response.trip.startDate ? response.trip.startDate.slice(0, 10) : '',
            endDate: response.trip.endDate ? response.trip.endDate.slice(0, 10) : '',
            budget: response.trip.budget?.total || 0
          });
        }
      } catch (err) {
        setError('Unable to load trip details');
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [editTripId, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.tripName.trim()) { setError('Destination/Trip name is required'); return; }
    if (!formData.startDate) { setError('Start date is required'); return; }
    if (!formData.endDate) { setError('End date is required'); return; }
    if (new Date(formData.startDate) > new Date(formData.endDate)) { setError('End date must be after start date'); return; }

    try {
      setLoading(true);
      const payload = {
        name: formData.tripName,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: {
          total: parseFloat(formData.budget) || 0,
          transport: 0,
          stay: 0,
          food: 0,
          activity: 0
        }
      };

      let response;
      if (isEditMode) {
        response = await tripApi.updateTrip(editTripId, payload);
      } else {
        response = await tripApi.createTrip(payload);
      }

      if (response.success) {
        const tripId = response.trip?._id || response.trip?.id || response.id;
        if (!tripId) throw new Error('Trip created but ID not returned from server.');
        setCreatedTripId(tripId);
        
        if (isEditMode) {
          navigate(`/trip/${tripId}`);
        } else if (formData.createItinerary) {
          setIsSuccess(true);
          try {
            for (let i = 1; i <= totalDays; i++) {
              await destinationApi.addDestination(tripId, { 
                name: `Day ${i}`,
                country: formData.tripName || 'Planned Destination',
                startDate: formData.startDate,
                endDate: formData.endDate
              });
              await new Promise(resolve => setTimeout(resolve, 200));
            }
            setTimeout(() => navigate(`/trip/${tripId}`), 1000);
          } catch (itineraryErr) {
            setError('Trip created, but itinerary auto-plan failed. You can add it manually.');
          }
        } else {
          setIsSuccess(true);
        }
      } else {
        setError(response.message || 'Unable to save trip');
      }
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setError('Cannot connect to the server. Please check your database connection or ensure the backend is running.');
      } else {
        setError(err.message || 'Unable to save trip');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddItinerary = async () => {
    if (!createdTripId) return;
    try {
      setLoading(true);
      for (let i = 1; i <= totalDays; i++) {
        await destinationApi.addDestination(createdTripId, { 
          name: `Day ${i}`,
          country: formData.tripName || 'Planned Destination',
          startDate: formData.startDate,
          endDate: formData.endDate
        });
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      navigate(`/trip/${createdTripId}`);
    } catch (err) {
      setError(`Failed to auto-plan: ${err.message}. Redirecting...`);
      setTimeout(() => navigate(`/trip/${createdTripId}`), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aurora-page-wrapper">
      <div className="create-trip-container">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div 
              key="success"
              className="success-card glass-panel"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="success-icon">✨</div>
              <h2>Your Trip is Ready ✨</h2>
              <p>Your adventure to <strong>{formData.tripName}</strong> has been created successfully.</p>
              
              <div className="summary-info">
                <div className="summary-item">
                  <span className="label">Duration</span>
                  <span className="value">{totalDays} Days</span>
                </div>
                <div className="summary-item">
                  <span className="label">Budget</span>
                  <span className="value">₹{formData.budget.toLocaleString()}</span>
                </div>
              </div>

              <div className="success-actions">
                <motion.button className="btn-primary" onClick={handleAddItinerary} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Go to Itinerary
                </motion.button>
                <motion.button className="btn-secondary" onClick={() => navigate('/dashboard')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Back to Dashboard
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              className="create-trip-card glass-panel"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <h2>{isEditMode ? 'Update Your Trip' : 'Start Your New Journey'}</h2>
              
              <form onSubmit={handleSubmit} className="form-grid">
                <motion.div className="form-group span-2" variants={itemVariants}>
                  <label>Destination *</label>
                  <input
                    type="text"
                    name="tripName"
                    placeholder="e.g., Paris, France"
                    value={formData.tripName}
                    onChange={handleChange}
                    required
                  />
                </motion.div>

                <motion.div className="form-group" variants={itemVariants}>
                  <label>Starting Date *</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                </motion.div>
                
                <motion.div className="form-group" variants={itemVariants}>
                  <label>Ending Date *</label>
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
                </motion.div>

                <motion.div className="form-group" variants={itemVariants}>
                  <label>Total Number of Days</label>
                  <div className="read-only-input">{totalDays} Days</div>
                </motion.div>
                
                <motion.div className="form-group" variants={itemVariants}>
                  <label>Estimated Budget (₹) *</label>
                  <input 
                    type="text" 
                    name="budget" 
                    value={formData.budget} 
                    onChange={handleChange} 
                    placeholder="Enter estimated budget" 
                    required 
                  />
                </motion.div>

                <motion.div className="form-group span-2" variants={itemVariants}>
                  <label>Notes (Optional)</label>
                  <textarea name="description" placeholder="Briefly describe your trip goals..." value={formData.description} onChange={handleChange} rows="3" />
                </motion.div>

                {error && <motion.div className="error-message span-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.div>}

                <motion.div className="form-group checkbox-group span-2" variants={itemVariants}>
                  <input type="checkbox" id="createItinerary" name="createItinerary" checked={formData.createItinerary} onChange={(e) => setFormData({...formData, createItinerary: e.target.checked})} />
                  <label htmlFor="createItinerary">Generate Smart Itinerary (Day-by-Day Plan)</label>
                </motion.div>

                <div className="form-actions span-2">
                  <motion.button type="submit" className="btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}>
                    {loading ? 'Processing...' : (isEditMode ? 'Save Details' : 'Create Trip')}
                  </motion.button>
                  <motion.button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}>
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CreateTrip;
