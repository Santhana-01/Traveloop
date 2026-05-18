const Trip = require('../models/Trip');
const Destination = require('../models/Destination');
const Activity = require('../models/Activity');
const crypto = require('crypto');

// @desc    Get all user trips
// @route   GET /api/trips
// @access  Private
exports.getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id })
      .populate('destinations')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trips.length,
      trips
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Private
exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate({
        path: 'destinations',
        populate: { path: 'activities' }
      });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check authorization
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this trip'
      });
    }

    res.status(200).json({
      success: true,
      trip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create trip
// @route   POST /api/trips
// @access  Private
exports.createTrip = async (req, res) => {
  try {
    const { name, description, startDate, endDate, budget } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const trip = await Trip.create({
      user: req.user.id,
      name,
      description,
      startDate,
      endDate,
      budget: budget || { total: 0, transport: 0, stay: 0, food: 0, activity: 0 }
    });

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      trip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
exports.updateTrip = async (req, res) => {
  try {
    let trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this trip'
      });
    }

    trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Trip updated successfully',
      trip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this trip'
      });
    }

    // Delete related documents
    await Activity.deleteMany({ destination: { $in: trip.destinations } });
    await Destination.deleteMany({ trip: req.params.id });
    
    // Use dynamic import or require here if needed, but safer to just use models if imported
    // await require('../models/PackingItem').deleteMany({ trip: req.params.id });
    // await require('../models/Note').deleteMany({ trip: req.params.id });

    await Trip.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Make trip public
// @route   PUT /api/trips/:id/make-public
// @access  Private
exports.makePublic = async (req, res) => {
  try {
    let trip = await Trip.findById(req.params.id);

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

    trip.isPublic = true;
    trip.publicUrl = `trip_${crypto.randomBytes(8).toString('hex')}`;
    await trip.save();

    res.status(200).json({
      success: true,
      message: 'Trip is now public',
      publicUrl: trip.publicUrl
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Make trip private
// @route   PUT /api/trips/:id/make-private
// @access  Private
exports.makePrivate = async (req, res) => {
  try {
    let trip = await Trip.findById(req.params.id);

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

    trip.isPublic = false;
    trip.publicUrl = null;
    await trip.save();

    res.status(200).json({
      success: true,
      message: 'Trip is now private'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get public trip
// @route   GET /api/public/trips/:publicUrl
// @access  Public
exports.getPublicTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ publicUrl: req.params.publicUrl })
      .populate({
        path: 'destinations',
        populate: { path: 'activities' }
      })
      .populate('user', 'name profilePhoto');

    if (!trip || !trip.isPublic) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    res.status(200).json({
      success: true,
      trip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Copy public trip
// @route   POST /api/trips/copy/:publicUrl
// @access  Private
exports.copyPublicTrip = async (req, res) => {
  try {
    const publicTrip = await Trip.findOne({ publicUrl: req.params.publicUrl })
      .populate('destinations');

    if (!publicTrip || !publicTrip.isPublic) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Create a copy for the user
    const newTrip = await Trip.create({
      user: req.user.id,
      name: `${publicTrip.name} (Copy)`,
      description: publicTrip.description,
      startDate: publicTrip.startDate,
      endDate: publicTrip.endDate
    });

    res.status(201).json({
      success: true,
      message: 'Trip copied successfully',
      trip: newTrip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update trip budget
// @route   PUT /api/trips/:id/budget
// @access  Private
exports.updateBudget = async (req, res) => {
  try {
    const { transport, stay, food, activity } = req.body;

    let trip = await Trip.findById(req.params.id);

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

    trip.budget = {
      transport: transport || 0,
      stay: stay || 0,
      food: food || 0,
      activity: activity || 0
    };

    await trip.save();

    res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      budget: trip.budget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update budget for a trip
// @route   PUT /api/trips/:id/budget
// @access  Private
exports.updateBudget = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    trip.budget = req.body;
    await trip.save();

    res.status(200).json({ success: true, budget: trip.budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add an expense to a trip
// @route   POST /api/trips/:id/expenses
// @access  Private
exports.addExpense = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    trip.expenses.push(req.body);
    await trip.save();

    res.status(201).json({ success: true, expenses: trip.expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an expense in a trip
// @route   PUT /api/trips/:id/expenses/:expenseId
// @access  Private
exports.updateExpense = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const expense = trip.expenses.id(req.params.expenseId);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    expense.set(req.body);
    await trip.save();

    res.status(200).json({ success: true, expenses: trip.expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an expense from a trip
// @route   DELETE /api/trips/:id/expenses/:expenseId
// @access  Private
exports.deleteExpense = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const expense = trip.expenses.id(req.params.expenseId);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    expense.remove();
    await trip.save();

    res.status(200).json({ success: true, expenses: trip.expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
