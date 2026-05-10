const Review = require('../models/Review');
const Trip = require('../models/Trip');

// @desc    Add review to public trip
// @route   POST /api/reviews/:tripId
// @access  Private
exports.addReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip || !trip.isPublic) {
      return res.status(404).json({
        success: false,
        message: 'Public trip not found'
      });
    }

    // Check if user already reviewed
    const existing = await Review.findOne({
      trip: tripId,
      author: req.user.id
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this trip'
      });
    }

    const review = await Review.create({
      trip: tripId,
      author: req.user.id,
      rating,
      title,
      comment
    });

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get trip reviews
// @route   GET /api/trips/:tripId/reviews
// @access  Public
exports.getReviews = async (req, res) => {
  try {
    const { tripId } = req.params;

    const reviews = await Review.find({ trip: tripId, status: 'approved' })
      .populate('author', 'name profilePhoto')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.status(200).json({
      success: true,
      count: reviews.length,
      avgRating,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:reviewId
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    review = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:reviewId
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await Review.findByIdAndDelete(req.params.reviewId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
