const Activity = require('../models/Activity');
const Destination = require('../models/Destination');
const Trip = require('../models/Trip');

// @desc    Add activity to destination
// @route   POST /api/destinations/:destId/activities
// @access  Private
exports.addActivity = async (req, res) => {
  try {
    const { name, date, time, duration, category, description, cost } = req.body;
    const { destId } = req.params;

    const destination = await Destination.findById(destId);
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

    const activity = await Activity.create({
      destination: destId,
      name,
      date,
      time,
      duration,
      category,
      description,
      cost: cost || 0
    });

    // Add to destination
    destination.activities.push(activity._id);
    await destination.save();

    res.status(201).json({
      success: true,
      message: 'Activity added successfully',
      activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get destination activities
// @route   GET /api/destinations/:destId/activities
// @access  Private
exports.getActivities = async (req, res) => {
  try {
    const { destId } = req.params;

    const activities = await Activity.find({ destination: destId }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: activities.length,
      activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update activity
// @route   PUT /api/activities/:actId
// @access  Private
exports.updateActivity = async (req, res) => {
  try {
    let activity = await Activity.findById(req.params.actId);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Verify authorization
    const destination = await Destination.findById(activity.destination);
    const trip = await Trip.findById(destination.trip);
    
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    activity = await Activity.findByIdAndUpdate(req.params.actId, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Activity updated successfully',
      activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:actId
// @access  Private
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.actId);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Verify authorization
    const destination = await Destination.findById(activity.destination);
    const trip = await Trip.findById(destination.trip);
    
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Remove from destination
    destination.activities = destination.activities.filter(a => a.toString() !== req.params.actId);
    await destination.save();

    await Activity.findByIdAndDelete(req.params.actId);

    res.status(200).json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get suggested activities (mock data)
// @route   GET /api/activities/suggestions/:city
// @access  Public
exports.getSuggestions = async (req, res) => {
  try {
    const { city } = req.params;

    // Mock data - replace with real data source
    const suggestions = {
      Paris: [
        { name: 'Eiffel Tower', category: 'Activity', cost: 15, duration: 2 },
        { name: 'Louvre Museum', category: 'Activity', cost: 17, duration: 3 },
        { name: 'Arc de Triomphe', category: 'Activity', cost: 12, duration: 1.5 }
      ],
      Tokyo: [
        { name: 'Senso-ji Temple', category: 'Activity', cost: 0, duration: 1 },
        { name: 'Shibuya Crossing', category: 'Activity', cost: 0, duration: 1 },
        { name: 'Tokyo Skytree', category: 'Activity', cost: 18, duration: 2 }
      ],
      NewYork: [
        { name: 'Statue of Liberty', category: 'Activity', cost: 20, duration: 3 },
        { name: 'Empire State Building', category: 'Activity', cost: 25, duration: 2 },
        { name: 'Central Park', category: 'Activity', cost: 0, duration: 2 }
      ]
    };

    const activities = suggestions[city] || [];

    res.status(200).json({
      success: true,
      activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
