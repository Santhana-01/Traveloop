const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getUserTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  makePublic,
  getPublicTrip,
  copyPublicTrip,
  updateBudget
} = require('../controllers/tripController');

// Public routes
router.get('/public/:publicUrl', getPublicTrip);
router.post('/copy/:publicUrl', auth, copyPublicTrip);

// Private routes
router.get('/', auth, getUserTrips);
router.post('/', auth, createTrip);
router.get('/:id', auth, getTripById);
router.put('/:id', auth, updateTrip);
router.delete('/:id', auth, deleteTrip);
router.put('/:id/make-public', auth, makePublic);
router.put('/:id/budget', auth, updateBudget);

module.exports = router;
