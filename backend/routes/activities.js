const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  addActivity,
  getActivities,
  updateActivity,
  deleteActivity,
  getSuggestions
} = require('../controllers/activityController');

// Add activity to destination
router.post('/destinations/:destId/activities', auth, addActivity);

// Get activities for destination
router.get('/destinations/:destId/activities', getActivities);

// Update activity
router.put('/activities/:actId', auth, updateActivity);

// Delete activity
router.delete('/activities/:actId', auth, deleteActivity);

// Get activity suggestions (public)
router.get('/activities/suggestions/:city', getSuggestions);

module.exports = router;
