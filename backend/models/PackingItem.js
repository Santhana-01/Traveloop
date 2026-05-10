const mongoose = require('mongoose');

const PackingItemSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please provide an item name'],
      trim: true
    },
    category: {
      type: String,
      enum: ['Clothing', 'Documents', 'Electronics', 'Toiletries', 'Accessories', 'Other'],
      default: 'Other'
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    },
    isPacked: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PackingItem', PackingItemSchema);
