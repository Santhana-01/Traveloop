import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { tripApi, destinationApi } from '../api/client';
import Header from '../components/Header';
import '../styles/CreateTrip.css';

function CreateTrip() {
  const location = useLocation();
  const navigate = useNavigate();
  const editTripId = location.state?.tripId;
  const preFilledDestination = location.state?.destinationName;
  const isEditMode = Boolean(editTripId);
  
  const [formData, setFormData] = useState({
    tripName: preFilledDestination ? preFilledDestination : '',
    startDate: '',
    endDate: '',
    budget: 0,
    description: preFilledDestination ? `Exploring ${preFilledDestination}` : '',
  });
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdTripId, setCreatedTripId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-calculate Total Days
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
    setFormData({
      ...formData,
      [name]: name === 'budget' ? parseFloat(value) || 0 : value
    });
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
          total: formData.budget,
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
        const tripId = response.trip._id || response.trip.id;
        setCreatedTripId(tripId);
        
        if (isEditMode) {
          navigate(`/trip/${tripId}`);
        } else {
          setIsSuccess(true);
        }
      } else {
        setError(response.message || 'Unable to save trip');
      }
    } catch (err) {
      setError(err.message || 'Unable to save trip');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItinerary = async () => {
    try {
      setLoading(true);
      // Auto-create days based on dates
      const dayPromises = [];
      for (let i = 1; i <= totalDays; i++) {
        dayPromises.push(destinationApi.addDestination(createdTripId, { 
          name: `Day ${i}`,
          country: formData.tripName,
          startDate: formData.startDate,
          endDate: formData.endDate
        }));
      }
      await Promise.all(dayPromises);
      navigate(`/trip/${createdTripId}`);
    } catch (err) {
      setError('Trip created, but failed to auto-plan days. You can add them manually.');
      navigate(`/trip/${createdTripId}`);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="aurora-page-wrapper">
        <Header title="Success" />
        <div className="create-trip-container">
          <div className="success-card">
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
              <button className="btn-primary" onClick={handleAddItinerary} disabled={loading}>
                {loading ? 'Setting up...' : '+ Add Itinerary (Optional)'}
              </button>
              <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="aurora-page-wrapper">
      <Header 
        title={isEditMode ? "Edit Trip Details" : "Plan Your Adventure"}
        showBackButton
        onBack={() => navigate('/dashboard')}
      />
      <div className="create-trip-container">
        <div className="create-trip-card">
          <h2>{isEditMode ? 'Update Your Trip' : 'Start Your New Journey'}</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Destination *</label>
              <input
                type="text"
                name="tripName"
                placeholder="e.g., Paris, France"
                value={formData.tripName}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Starting Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Ending Date *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Total Number of Days</label>
                <div className="read-only-input">
                  {totalDays} Days
                </div>
              </div>

              <div className="form-group">
                <label>Estimated Budget (₹) *</label>
                <input
                  type="number"
                  name="budget"
                  min="0"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.number"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes (Optional)</label>
              <textarea
                name="description"
                placeholder="Briefly describe your trip goals..."
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Processing...' : (isEditMode ? 'Save Details' : 'Create Trip')}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTrip;
