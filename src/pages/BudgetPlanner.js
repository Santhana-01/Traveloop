import React, { useState, useEffect, useMemo } from 'react';
import { tripApi, budgetApi } from '../api/client';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import BudgetForm from '../components/BudgetForm';
import '../styles/BudgetForm.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetPlanner = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Miscellaneous',
  });

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const response = await tripApi.getUserTrips();
      if (response.success) {
        setTrips(response.trips);
        if (response.trips.length > 0) {
          setSelectedTrip(response.trips[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetSave = async (budgetData) => {
    if (!selectedTrip) return;
    try {
      const response = await budgetApi.updateBudget(selectedTrip._id, budgetData);
      if (response.success) {
        setSelectedTrip({ ...selectedTrip, budget: response.budget });
        setShowBudgetForm(false);
      }
    } catch (error) {
      console.error('Failed to save budget:', error);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!selectedTrip) return;
    try {
      const response = await budgetApi.addExpense(selectedTrip._id, newExpense);
      if (response.success) {
        setSelectedTrip({ ...selectedTrip, expenses: response.expenses });
        setShowExpenseForm(false);
        setNewExpense({ description: '', amount: '', category: 'Miscellaneous' });
      }
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };

  const totalSpent = useMemo(() => {
    return selectedTrip?.expenses?.reduce((acc, expense) => acc + expense.amount, 0) || 0;
  }, [selectedTrip]);

  const remainingBudget = (selectedTrip?.budget?.total || 0) - totalSpent;

  const dailyAverage = useMemo(() => {
    if (!selectedTrip) return 0;
    const startDate = new Date(selectedTrip.startDate);
    const endDate = new Date(selectedTrip.endDate);
    const tripDuration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    return tripDuration > 0 ? totalSpent / tripDuration : 0;
  }, [selectedTrip, totalSpent]);

  const pieData = {
    labels: ['Hotel', 'Transport', 'Food', 'Activities', 'Miscellaneous'],
    datasets: [
      {
        data: selectedTrip?.expenses ? [
          selectedTrip.expenses.filter(e => e.category === 'Hotel').reduce((a, b) => a + b.amount, 0),
          selectedTrip.expenses.filter(e => e.category === 'Transport').reduce((a, b) => a + b.amount, 0),
          selectedTrip.expenses.filter(e => e.category === 'Food').reduce((a, b) => a + b.amount, 0),
          selectedTrip.expenses.filter(e => e.category === 'Activities').reduce((a, b) => a + b.amount, 0),
          selectedTrip.expenses.filter(e => e.category === 'Miscellaneous').reduce((a, b) => a + b.amount, 0),
        ] : [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  if (loading) return <div className="fluid-loader">Calculating finances...</div>;

  return (
    <div className="budget-planner-immersive">
      <div className="budget-header-fluid">
        <div className="trip-selector-fluid">
          <label>Select Journey</label>
          <select
            value={selectedTrip?._id}
            onChange={(e) => setSelectedTrip(trips.find(t => t._id === e.target.value))}
          >
            {trips.map(trip => (
              <option key={trip._id} value={trip._id}>{trip.name}</option>
            ))}
          </select>
        </div>
        <button onClick={() => setShowBudgetForm(true)}>Set Budget</button>
      </div>

      {showBudgetForm && selectedTrip && (
        <BudgetForm
          budget={selectedTrip.budget}
          onSave={handleBudgetSave}
          totalBudget={selectedTrip.budget?.total}
        />
      )}

      <div className="budget-dashboard-grid">
        <motion.div className="budget-main-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="total-circular-progress">
            <div className="progress-content">
              <span className="total-label">Total Budget</span>
              <span className="total-value">₹{selectedTrip?.budget?.total.toLocaleString() || 0}</span>
            </div>
          </div>
          <div className="budget-meta-info">
            <div className="meta-item">
              <span>Spent</span>
              <strong className="spent-value">₹{totalSpent.toLocaleString()}</strong>
            </div>
            <div className="meta-item">
              <span>Remaining</span>
              <strong className="remaining-value">₹{remainingBudget.toLocaleString()}</strong>
            </div>
            <div className="meta-item">
              <span>Daily Average</span>
              <strong className="daily-avg-value">₹{dailyAverage.toFixed(2)}</strong>
            </div>
          </div>
        </motion.div>

        <div className="budget-categories-list">
          <Pie data={pieData} />
        </div>
      </div>

      <div className="expenses-section">
        <h3>Expenses</h3>
        <button onClick={() => setShowExpenseForm(!showExpenseForm)}>Add Expense</button>
        {showExpenseForm && (
          <form onSubmit={handleAddExpense}>
            <input type="text" placeholder="Description" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} required />
            <input type="number" placeholder="Amount" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} required />
            <select value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})}>
              <option>Hotel</option>
              <option>Transport</option>
              <option>Food</option>
              <option>Activities</option>
              <option>Miscellaneous</option>
            </select>
            <button type="submit">Add</button>
          </form>
        )}
        <div className="expenses-list">
          {selectedTrip?.expenses?.map(expense => (
            <div key={expense._id} className="expense-item">
              <span>{expense.description}</span>
              <span>{expense.category}</span>
              <span>₹{expense.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;
