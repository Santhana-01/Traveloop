import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/DaySection.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const activityVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  },
  exit: { opacity: 0, x: 10, transition: { duration: 0.2 } }
};

function DaySection({ day, onAddActivity, onDeleteActivity, onEditActivity, onDeleteDay }) {
  return (
    <motion.div 
      className="day-section glass-panel"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="day-header">
        <div className="day-title">
          <h3>Day {day.dayNumber}</h3>
          <span className="day-subtitle">{day.name || 'Itinerary'}</span>
        </div>
        <motion.button
          className="btn-icon-delete"
          onClick={() => onDeleteDay(day.id)}
          title="Delete day"
          whileHover={{ scale: 1.2, color: '#FF8E72' }}
          whileTap={{ scale: 0.8 }}
        >
          ×
        </motion.button>
      </div>

      <motion.div 
        className="activities-list"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {day.activities && day.activities.length > 0 ? (
            day.activities.map((activity, index) => (
              <motion.div 
                key={activity.id || activity._id || index} 
                className="activity-card"
                variants={activityVariants}
                layout
                whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <div className="activity-main-info">
                  <div className="activity-top-row">
                    <h4>📍 {activity.name}</h4>
                    <div className="activity-badges">
                      {activity.category && <span className="activity-badge category">{activity.category}</span>}
                      {activity.time && <span className="activity-badge time">{activity.time}</span>}
                      {activity.cost && <span className="activity-badge cost">₹{activity.cost}</span>}
                    </div>
                  </div>
                  {activity.notes && <p className="activity-notes">{activity.notes}</p>}
                </div>

                <div className="activity-actions">
                  <motion.button 
                    className="act-btn edit" 
                    onClick={() => onEditActivity(day.id, activity)}
                    whileHover={{ scale: 1.1 }}
                  >
                    Edit
                  </motion.button>
                  <motion.button 
                    className="act-btn delete" 
                    onClick={() => onDeleteActivity(day.id, activity.id || activity._id)}
                    whileHover={{ scale: 1.1 }}
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div className="empty-activities" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p>No places added yet. Explore and add some!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.button
        className="btn-add-activity"
        onClick={() => onAddActivity(day.id)}
        whileHover={{ scale: 1.02, backgroundColor: 'rgba(71, 181, 255, 0.1)' }}
        whileTap={{ scale: 0.98 }}
      >
        + Add Place
      </motion.button>
    </motion.div>
  );
}

export default DaySection;
