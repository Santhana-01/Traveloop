const Destination = require('../models/Destination');
const Trip = require('../models/Trip');
const Activity = require('../models/Activity');

// @desc    Add destination to trip
// @route   POST /api/trips/:tripId/destinations
// @access  Private
exports.addDestination = async (req, res) => {
  try {
    const { name, country, startDate, endDate, description } = req.body;
    const { tripId } = req.params;

    // Verify trip ownership
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

    const destination = await Destination.create({
      trip: tripId,
      name,
      country,
      startDate,
      endDate,
      description,
      order: trip.destinations.length
    });

    // Add destination to trip
    trip.destinations.push(destination._id);
    await trip.save();

    res.status(201).json({
      success: true,
      message: 'Destination added successfully',
      destination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get trip destinations
// @route   GET /api/trips/:tripId/destinations
// @access  Private
exports.getDestinations = async (req, res) => {
  try {
    const { tripId } = req.params;

    const destinations = await Destination.find({ trip: tripId })
      .populate('activities')
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: destinations.length,
      destinations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update destination
// @route   PUT /api/destinations/:destId
// @access  Private
exports.updateDestination = async (req, res) => {
  try {
    let destination = await Destination.findById(req.params.destId);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    // Verify trip ownership
    const trip = await Trip.findById(destination.trip);
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    destination = await Destination.findByIdAndUpdate(req.params.destId, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Destination updated successfully',
      destination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:destId
// @access  Private
exports.deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.destId);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    // Verify trip ownership
    const trip = await Trip.findById(destination.trip);
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Delete related activities
    await Activity.deleteMany({ destination: req.params.destId });

    // Remove from trip
    trip.destinations = trip.destinations.filter(d => d.toString() !== req.params.destId);
    await trip.save();

    await Destination.findByIdAndDelete(req.params.destId);

    res.status(200).json({
      success: true,
      message: 'Destination deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reorder destinations
// @route   PUT /api/trips/:tripId/reorder-destinations
// @access  Private
exports.reorderDestinations = async (req, res) => {
  try {
    const { destinationIds } = req.body;
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Update order for each destination
    for (let i = 0; i < destinationIds.length; i++) {
      await Destination.findByIdAndUpdate(destinationIds[i], { order: i });
    }

    res.status(200).json({
      success: true,
      message: 'Destinations reordered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
