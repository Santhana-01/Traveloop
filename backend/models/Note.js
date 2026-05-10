const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      default: null
    },
    date: {
      type: Date,
      default: Date.now
    },
    title: {
      type: String,
      required: [true, 'Please provide a note title'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    content: {
      type: String,
      required: [true, 'Please provide note content'],
      maxlength: [5000, 'Content cannot exceed 5000 characters']
    },
    category: {
      type: String,
      enum: ['Memory', 'Todo', 'Expense', 'Idea', 'Warning', 'Other'],
      default: 'Other'
    },
    photos: [String],
    isPinned: {
      type: Boolean,
      default: false
    },
    tags: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', NoteSchema);
