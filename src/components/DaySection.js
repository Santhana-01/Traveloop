import React from 'react';
import '../styles/DaySection.css';

function DaySection({ day, onAddActivity, onDeleteActivity, onEditActivity, onDeleteDay }) {
  return (
    <div className="day-section">
      <div className="day-header">
        <div className="day-title">
          <h3>Day {day.dayNumber}</h3>
        </div>
        <button
          className="btn-icon-delete"
          onClick={() => onDeleteDay(day.id)}
          title="Delete day"
        >
          ×
        </button>
      </div>

      <div className="activities-list">
        {day.activities && day.activities.length > 0 ? (
          day.activities.map((activity, index) => (
            <div key={activity.id || index} className="activity-card simplified">
              <div className="activity-main-info">
                <div className="activity-top-row">
                  <h4>📍 {activity.name}</h4>
                  {activity.time && <span className="activity-time-badge">{activity.time}</span>}
                </div>
                {activity.notes && <p className="activity-notes">{activity.notes}</p>}
              </div>

              <div className="activity-actions">
                <button 
                  className="act-btn edit" 
                  onClick={() => onEditActivity(day.id, activity)}
                >
                  Edit
                </button>
                <button 
                  className="act-btn delete" 
                  onClick={() => onDeleteActivity(day.id, activity.id || activity._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-activities">
            <p>No places added yet.</p>
          </div>
        )}
      </div>

      <button
        className="btn-add-activity"
        onClick={() => onAddActivity(day.id)}
      >
        + Add Place
      </button>
    </div>
  );
}

export default DaySection;
