const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getUserTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  makePublic,
    makePrivate,
  getPublicTrip,
  copyPublicTrip,
  updateBudget,
  addExpense,
  updateExpense,
  deleteExpense
} = require('../controllers/tripController');

// Public routes
router.get('/public/:publicUrl', getPublicTrip);
router.post('/copy/:publicUrl', auth, copyPublicTrip);

// Private routes
router.get('/', auth, getUserTrips);
router.post('/', auth, createTrip);
router.get('/:id', auth, getTripById);
router.put('/:id', auth, updateTrip);
router.delete('/:id', auth, deleteTrip);
router.put('/:id/make-public', auth, makePublic);
router.put('/:id/make-private', auth, makePrivate);
router.put('/:id/budget', auth, updateBudget);
router.post('/:id/expenses', auth, addExpense);
router.put('/:id/expenses/:expenseId', auth, updateExpense);
router.delete('/:id/expenses/:expenseId', auth, deleteExpense);

module.exports = router;
