const Note = require('../models/Note');
const Trip = require('../models/Trip');

// @desc    Add trip note
// @route   POST /api/trips/:tripId/notes
// @access  Private
exports.addNote = async (req, res) => {
  try {
    const { title, content, category, destId } = req.body;
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const note = await Note.create({
      trip: tripId,
      destination: destId || null,
      title,
      content,
      category
    });

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get trip notes
// @route   GET /api/trips/:tripId/notes
// @access  Private
exports.getNotes = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const notes = await Note.find({ trip: tripId })
      .sort({ isPinned: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:noteId
// @access  Private
exports.updateNote = async (req, res) => {
  try {
    let note = await Note.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    const trip = await Trip.findById(note.trip);
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    note = await Note.findByIdAndUpdate(req.params.noteId, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:noteId
// @access  Private
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    const trip = await Trip.findById(note.trip);
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await note.remove();

    res.status(200).json({ success: true, message: 'Note removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle note pin status
// @route   PUT /api/notes/:noteId/toggle-pin
// @access  Private
exports.togglePin = async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    const trip = await Trip.findById(note.trip);
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.status(200).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
