const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    title: {
      type: String,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    comment: {
      type: String,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    helpful: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    isVerifiedTraveler: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', ReviewSchema);
