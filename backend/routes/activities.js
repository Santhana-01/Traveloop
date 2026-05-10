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
router.post('/:destId/activities', auth, addActivity);

// Get activities for destination
router.get('/:destId/activities', getActivities);

// Update activity
router.put('/:actId', auth, updateActivity);

// Delete activity
router.delete('/:actId', auth, deleteActivity);

// Get activity suggestions (public)
router.get('/suggestions/:city', getSuggestions);

module.exports = router;
