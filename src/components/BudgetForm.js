import React, { useState, useEffect } from 'react';
import '../styles/BudgetForm.css';

function BudgetForm({ budget, onSave, totalBudget }) {
  const [budgetData, setBudgetData] = useState(budget);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setBudgetData(budget);
  }, [budget]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBudgetData({
      ...budgetData,
      [name]: parseFloat(value) || 0
    });
  };

  const handleSave = () => {
    onSave(budgetData);
    setMessage('Budget updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const calculateTotal = () => {
    return (
      (budgetData.transport || 0) +
      (budgetData.stay || 0) +
      (budgetData.food || 0) +
      (budgetData.activity || 0)
    );
  };

  return (
    <div className="budget-form">
      <h3>Trip Budget</h3>
      <div className="budget-inputs">
        <div className="budget-item">
          <label>🚗 Transport</label>
          <input
            type="number"
            name="transport"
            value={budgetData.transport || 0}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div className="budget-item">
          <label>🏨 Accommodation</label>
          <input
            type="number"
            name="stay"
            value={budgetData.stay || 0}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div className="budget-item">
          <label>🍽️ Food & Dining</label>
          <input
            type="number"
            name="food"
            value={budgetData.food || 0}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div className="budget-item">
          <label>🎭 Activities & Entertainment</label>
          <input
            type="number"
            name="activity"
            value={budgetData.activity || 0}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="budget-summary">
        <div className="summary-row">
          <span>Subtotal (Entered):</span>
          <span>₹{calculateTotal().toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Total Budget:</span>
          <span>₹{totalBudget.toFixed(2)}</span>
        </div>
      </div>

      <button className="btn-primary" onClick={handleSave}>
        Save Budget
      </button>
      {message && <p className="success-message">{message}</p>}
    </div>
  );
}

export default BudgetForm;
