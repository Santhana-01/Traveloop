import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/BudgetForm.css';

function BudgetForm({ budget = {}, onSave, totalBudget = 0 }) {
  const [budgetData, setBudgetData] = useState(budget || {});
  const [message, setMessage] = useState('');
  const [editableTotal, setEditableTotal] = useState(totalBudget || 0);

  useEffect(() => {
    setBudgetData(budget || {});
    if (totalBudget) setEditableTotal(totalBudget);
  }, [budget, totalBudget]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'total') {
      setEditableTotal(parseFloat(value) || 0);
    } else {
      setBudgetData({
        ...budgetData,
        [name]: parseFloat(value) || 0
      });
    }
  };

  const handleSave = () => {
    const payload = {
      ...budgetData,
      total: editableTotal
    };
    onSave(payload);
    setMessage('Budget tracking updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const calculateSpent = () => {
    return (
      (budgetData.transport || 0) +
      (budgetData.stay || 0) +
      (budgetData.food || 0) +
      (budgetData.activity || 0) +
      (budgetData.miscellaneous || 0)
    );
  };

  const spentAmount = calculateSpent();
  const remainingAmount = editableTotal - spentAmount;
  const spentPercentage = editableTotal > 0 ? (spentAmount / editableTotal) * 100 : 0;
  const isOverBudget = spentAmount > editableTotal;

  return (
    <div className="budget-dashboard">
      <div className="budget-overview">
        <div className="budget-card total-card">
          <h4>Total Allocated Budget</h4>
          <div className="input-with-symbol">
            <span className="currency-symbol">₹</span>
            <input
              type="number"
              name="total"
              value={editableTotal}
              onChange={handleChange}
              className="large-budget-input"
              min="0"
            />
          </div>
        </div>
        
        <div className="budget-card spent-card">
          <h4>Total Spent</h4>
          <span className="value">₹{spentAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
        
        <div className={`budget-card remaining-card ${isOverBudget ? 'danger' : ''}`}>
          <h4>{isOverBudget ? 'Over Budget By' : 'Remaining Balance'}</h4>
          <span className="value">₹{Math.abs(remainingAmount).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
      </div>

      <div className="budget-progress-container">
        <div className="progress-labels">
          <span>{spentPercentage.toFixed(1)}% Used</span>
          {isOverBudget && <span className="warning-text">⚠️ Over Budget!</span>}
        </div>
        <div className="progress-track">
          <motion.div 
            className={`progress-fill ${isOverBudget ? 'over-budget' : ''}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(spentPercentage, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="expenses-section">
        <h3>Categorized Expenses</h3>
        <div className="expenses-grid">
          <div className="expense-input-card">
            <label>🚗 Transport & Flights</label>
            <input type="number" name="transport" value={budgetData.transport || ''} onChange={handleChange} placeholder="0.00" min="0" />
          </div>

          <div className="expense-input-card">
            <label>🏨 Hotels & Stay</label>
            <input type="number" name="stay" value={budgetData.stay || ''} onChange={handleChange} placeholder="0.00" min="0" />
          </div>

          <div className="expense-input-card">
            <label>🍽️ Food & Dining</label>
            <input type="number" name="food" value={budgetData.food || ''} onChange={handleChange} placeholder="0.00" min="0" />
          </div>

          <div className="expense-input-card">
            <label>🎭 Activities & Tours</label>
            <input type="number" name="activity" value={budgetData.activity || ''} onChange={handleChange} placeholder="0.00" min="0" />
          </div>
          
          <div className="expense-input-card">
            <label>🛍️ Miscellaneous / Other</label>
            <input type="number" name="miscellaneous" value={budgetData.miscellaneous || ''} onChange={handleChange} placeholder="0.00" min="0" />
          </div>
        </div>
      </div>

      <div className="budget-actions">
        <button className="btn-primary large-save-btn" onClick={handleSave}>
          Save Budget Plan
        </button>
        {message && (
          <motion.p 
            className="success-message"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {message}
          </motion.p>
        )}
      </div>
    </div>
  );
}

export default BudgetForm;
