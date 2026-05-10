const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please provide a destination name'],
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    photo: {
      type: String,
      default: null
    },
    costIndex: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    popularity: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
      }
    ],
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Destination', DestinationSchema);
