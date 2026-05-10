const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  addReview,
  getReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

// Add review (private)
router.post('/:tripId', auth, addReview);

// Get reviews (public)
router.get('/:tripId', getReviews);

// Update review (private)
router.put('/:reviewId', auth, updateReview);

// Delete review (private)
router.delete('/:reviewId', auth, deleteReview);

module.exports = router;
