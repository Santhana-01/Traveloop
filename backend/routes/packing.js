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
router.post('/:tripId/packing', auth, addPackingItem);

// Get packing items
router.get('/:tripId/packing', auth, getPackingItems);

// Update packing item
router.put('/:itemId', auth, updatePackingItem);

// Delete packing item
router.delete('/:itemId', auth, deletePackingItem);

// Toggle packing status
router.put('/:itemId/toggle', auth, togglePackingStatus);

// Reset packing list
router.delete('/:tripId/packing/reset', auth, resetPackingList);

module.exports = router;
