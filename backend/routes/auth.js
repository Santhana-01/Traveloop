const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Private routes
router.get('/me', auth, getCurrentUser);

module.exports = router;
