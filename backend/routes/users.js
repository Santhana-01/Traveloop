const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  updatePreferences,
  addSavedDestination,
  getSavedDestinations,
  removeSavedDestination,
  changePassword,
  deleteAccount,
  getPublicProfile
} = require('../controllers/userController');

// Private routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/preferences', auth, updatePreferences);
router.post('/saved-destinations', auth, addSavedDestination);
router.get('/saved-destinations', auth, getSavedDestinations);
router.delete('/saved-destinations/:destName', auth, removeSavedDestination);
router.post('/change-password', auth, changePassword);
router.delete('/account', auth, deleteAccount);

// Public route
router.get('/:userId/public', getPublicProfile);

module.exports = router;
