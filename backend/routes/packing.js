const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  addPackingItem,
  getPackingItems,
  updatePackingItem,
  deletePackingItem,
  togglePackingStatus,
  resetPackingList
} = require('../controllers/packingController');

// Add packing item
router.post('/trips/:tripId', auth, addPackingItem);

// Get packing items
router.get('/trips/:tripId', auth, getPackingItems);

// Update packing item
router.put('/:itemId', auth, updatePackingItem);

// Delete packing item
router.delete('/:itemId', auth, deletePackingItem);

// Toggle packing status
router.put('/:itemId/toggle', auth, togglePackingStatus);

// Reset packing list
router.delete('/trips/:tripId/reset', auth, resetPackingList);

module.exports = router;
