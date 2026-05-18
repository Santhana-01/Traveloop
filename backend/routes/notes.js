const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  addNote,
  getNotes,
  updateNote,
  deleteNote,
  togglePin
} = require('../controllers/noteController');

// Add note
router.post('/trips/:tripId', auth, addNote);

// Get notes
router.get('/trips/:tripId', auth, getNotes);

// Update note
router.put('/:noteId', auth, updateNote);

// Delete note
router.delete('/:noteId', auth, deleteNote);

// Toggle pin
router.put('/:noteId/toggle-pin', auth, togglePin);

module.exports = router;
