const PackingItem = require('../models/PackingItem');
const Trip = require('../models/Trip');

// @desc    Add packing item
// @route   POST /api/trips/:tripId/packing
// @access  Private
exports.addPackingItem = async (req, res) => {
  try {
    const { name, category, quantity, priority, notes } = req.body;
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

    const item = await PackingItem.create({
      trip: tripId,
      name,
      category,
      quantity,
      priority,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Packing item added successfully',
      item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get packing items for trip
// @route   GET /api/trips/:tripId/packing
// @access  Private
exports.getPackingItems = async (req, res) => {
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

    const items = await PackingItem.find({ trip: tripId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update packing item
// @route   PUT /api/packing/:itemId
// @access  Private
exports.updatePackingItem = async (req, res) => {
  try {
    let item = await PackingItem.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Packing item not found'
      });
    }

    const trip = await Trip.findById(item.trip);
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    item = await PackingItem.findByIdAndUpdate(req.params.itemId, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Packing item updated successfully',
      item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete packing item
// @route   DELETE /api/packing/:itemId
// @access  Private
exports.deletePackingItem = async (req, res) => {
  try {
    const item = await PackingItem.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Packing item not found'
      });
    }

    const trip = await Trip.findById(item.trip);
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await PackingItem.findByIdAndDelete(req.params.itemId);

    res.status(200).json({
      success: true,
      message: 'Packing item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle packing status
// @route   PUT /api/packing/:itemId/toggle
// @access  Private
exports.togglePackingStatus = async (req, res) => {
  try {
    const item = await PackingItem.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Packing item not found'
      });
    }

    const trip = await Trip.findById(item.trip);
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    item.isPacked = !item.isPacked;
    await item.save();

    res.status(200).json({
      success: true,
      message: 'Packing status updated',
      item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reset packing checklist
// @route   DELETE /api/trips/:tripId/packing/reset
// @access  Private
exports.resetPackingList = async (req, res) => {
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

    await PackingItem.updateMany({ trip: tripId }, { isPacked: false });

    res.status(200).json({
      success: true,
      message: 'Packing list reset successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
