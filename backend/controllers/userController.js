const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, profilePhoto } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, profilePhoto },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
exports.updatePreferences = async (req, res) => {
  try {
    const { language, currency } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferences: { language, currency } },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add saved destination
// @route   POST /api/users/saved-destinations
// @access  Private
exports.addSavedDestination = async (req, res) => {
  try {
    const { name, country } = req.body;

    const user = await User.findById(req.user.id);

    // Check if already saved
    const exists = user.savedDestinations.some(d => d.name === name && d.country === country);
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Destination already saved'
      });
    }

    user.savedDestinations.push({ name, country });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Destination saved successfully',
      destinations: user.savedDestinations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get saved destinations
// @route   GET /api/users/saved-destinations
// @access  Private
exports.getSavedDestinations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      destinations: user.savedDestinations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove saved destination
// @route   DELETE /api/users/saved-destinations/:destName
// @access  Private
exports.removeSavedDestination = async (req, res) => {
  try {
    const { destName } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { savedDestinations: { name: destName } } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Destination removed from saved',
      destinations: user.savedDestinations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Change password
// @route   POST /api/users/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;

    if (newPassword !== newPasswordConfirm) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete account
// @route   DELETE /api/users/account
// @access  Private
exports.deleteAccount = async (req, res) => {
  try {
    // Optional: Add password confirmation here
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get public user profile
// @route   GET /api/users/:userId/public
// @access  Public
exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('name profilePhoto bio');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
