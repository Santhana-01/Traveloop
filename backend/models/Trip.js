const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please provide a trip name'],
      trim: true,
      maxlength: [100, 'Trip name cannot exceed 100 characters']
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: ''
    },
    coverPhoto: {
      type: String,
      default: null
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date']
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide an end date']
    },
    status: {
      type: String,
      enum: ['planning', 'ongoing', 'completed'],
      default: 'planning'
    },
    isGroup: {
      type: Boolean,
      default: false
    },
    groupMembers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        role: {
          type: String,
          enum: ['owner', 'editor', 'viewer'],
          default: 'viewer'
        }
      }
    ],
    isPublic: {
      type: Boolean,
      default: false
    },
    publicUrl: {
      type: String,
      unique: true,
      sparse: true
    },
    destinations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination'
      }
    ],
    budget: {
      transport: {
        type: Number,
        default: 0
      },
      stay: {
        type: Number,
        default: 0
      },
      food: {
        type: Number,
        default: 0
      },
      activity: {
        type: Number,
        default: 0
      }
    },
    actualSpent: {
      transport: { type: Number, default: 0 },
      stay: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      activity: { type: Number, default: 0 }
    },
    tags: [String],
    reminderEmail: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', TripSchema);
