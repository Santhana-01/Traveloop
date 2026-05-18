import React, { useState } from 'react';
import '../styles/ActivityForm.css';

function ActivityForm({ onSave, onCancel, initialData }) {
  const [activity, setActivity] = useState(initialData || {
    name: '',
    time: '',
    cost: '',
    category: 'Sightseeing',
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
            <label>Place/Activity Name *</label>
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

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Timing (Optional)</label>
              <input
                type="text"
                name="time"
                placeholder="e.g., 10:00 AM"
                value={activity.time}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Cost (₹) (Optional)</label>
              <input
                type="number"
                name="cost"
                placeholder="e.g., 500"
                value={activity.cost}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={activity.category} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#fff' }}>
              <option value="Sightseeing">Sightseeing</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea
              name="notes"
              placeholder="Add tips or reminders..."
              value={activity.notes}
              onChange={handleChange}
              rows="2"
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
