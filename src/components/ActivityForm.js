import React, { useState } from 'react';
import '../styles/ActivityForm.css';

function ActivityForm({ onSave, onCancel, initialData }) {
  const [activity, setActivity] = useState(initialData || {
    name: '',
    time: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivity({
      ...activity,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activity.name.trim()) {
      onSave(activity);
    }
  };

  return (
    <div className="activity-form-overlay">
      <div className="activity-form">
        <h3>{initialData ? 'Edit Place' : 'Add New Place'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Place Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Eiffel Tower"
              value={activity.name}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Timing (Optional)</label>
            <input
              type="text"
              name="time"
              placeholder="e.g., 10:00 AM or Evening"
              value={activity.time}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea
              name="notes"
              placeholder="Add tips or reminders..."
              value={activity.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {initialData ? 'Update Details' : 'Save to Itinerary'}
            </button>
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ActivityForm;
