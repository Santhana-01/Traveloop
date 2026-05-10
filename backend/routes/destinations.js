const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  addDestination,
  getDestinations,
  updateDestination,
  deleteDestination,
  reorderDestinations
} = require('../controllers/destinationController');

// Add destination to trip
router.post('/:tripId/destinations', auth, addDestination);

// Get destinations for a trip
router.get('/:tripId/destinations', getDestinations);

// Update destination
router.put('/:destId', auth, updateDestination);

// Delete destination
router.delete('/:destId', auth, deleteDestination);

// Reorder destinations
router.put('/:tripId/reorder-destinations', auth, reorderDestinations);

module.exports = router;
