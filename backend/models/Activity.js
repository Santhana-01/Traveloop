const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
  {
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please provide an activity name'],
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      default: null
    },
    duration: {
      type: Number,
      default: null
    },
    durationUnit: {
      type: String,
      enum: ['hours', 'days'],
      default: 'hours'
    },
    category: {
      type: String,
      enum: ['Activity', 'Dining', 'Transport', 'Accommodation', 'Shopping', 'Other'],
      default: 'Activity'
    },
    description: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    },
    cost: {
      type: Number,
      default: 0
    },
    location: {
      type: String,
      default: ''
    },
    photos: [String],
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    isPacked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', ActivitySchema);
