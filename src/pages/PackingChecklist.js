import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { packingApi } from '../api/client';
import Header from '../components/Header';
import '../styles/PackingChecklist.css';

function PackingChecklist() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    item: '',
    category: 'essentials',
    quantity: 1,
    priority: 'medium'
  });

  const categories = ['essentials', 'clothing', 'toiletries', 'electronics', 'documents', 'other'];
  const priorities = ['low', 'medium', 'high'];

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const loadItems = async () => {
    try {
      const response = await packingApi.getPackingItems(tripId);
      if (response.success) {
        setItems(response.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === 'quantity' ? parseInt(value) : value
    });
  };

  const handleAddItem = async () => {
    if (!formData.item.trim()) {
      setMessage('Please enter an item');
      return;
    }

    try {
      const response = await packingApi.addPackingItem(tripId, formData);
      if (response.success) {
        setItems([...items, response.item]);
        setFormData({
          item: '',
          category: 'essentials',
          quantity: 1,
          priority: 'medium'
        });
        setShowForm(false);
        setMessage('Item added to packing list!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Error adding item');
    }
  };

  const handleTogglePacked = async (itemId, packed) => {
    try {
      const response = await packingApi.togglePackingStatus(tripId, itemId);
      if (response.success) {
        setItems(
          items.map(item =>
            item._id === itemId ? { ...item, packed: !item.packed } : item
          )
        );
      }
    } catch (err) {
      setMessage('Error updating item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await packingApi.deletePackingItem(tripId, itemId);
      if (response.success) {
        setItems(items.filter(item => item._id !== itemId));
      }
    } catch (err) {
      setMessage('Error deleting item');
    }
  };

  const handleResetChecklist = async () => {
    if (!window.confirm('Reset all items to unpacked? This cannot be undone.')) return;

    try {
      const response = await packingApi.resetPackingList(tripId);
      if (response.success) {
        setItems(response.items);
        setMessage('Packing list reset!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Error resetting list');
    }
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      essentials: '🔑',
      clothing: '👕',
      toiletries: '🧴',
      electronics: '📱',
      documents: '📄',
      other: '📦'
    };
    return emojis[category] || '📦';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#51cf66',
      medium: '#fcc419',
      high: '#ff6b6b'
    };
    return colors[priority] || colors.medium;
  };

  // Group items by category
  const groupedItems = categories.reduce((acc, category) => {
    acc[category] = items.filter(item => item.category === category);
    return acc;
  }, {});

  // Calculate stats
  const totalItems = items.length;
  const packedItems = items.filter(item => item.packed).length;
  const packedPercentage = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  return (
    <>
      <Header
        title="Packing Checklist"
        showBackButton
        onBack={() => navigate(`/trip/${tripId}`)}
      />
      <div className="packing-container">
        {message && <div className="success-message">{message}</div>}

        {/* Progress Section */}
        {totalItems > 0 && (
          <div className="progress-section">
            <div className="progress-header">
              <h3>Packing Progress</h3>
              <span className="progress-percentage">{packedPercentage}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${packedPercentage}%` }}
              />
            </div>
            <div className="progress-stats">
              <div className="stat">
                <strong>{packedItems}</strong> of {totalItems} packed
              </div>
              <div className="stat">
                <strong>{totalItems - packedItems}</strong> remaining
              </div>
            </div>
          </div>
        )}

        {/* Add Item Button */}
        {!showForm && (
          <button
            className="btn-add-item"
            onClick={() => setShowForm(true)}
          >
            <span>+ Add Item</span>
          </button>
        )}

        {/* Add Item Form */}
        {showForm && (
          <div className="item-form-card">
            <h3>Add Packing Item</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Item</label>
                <input
                  type="text"
                  name="item"
                  value={formData.item}
                  onChange={handleInputChange}
                  placeholder="e.g., Passport, Sunscreen..."
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {getCategoryEmoji(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  {priorities.map(p => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-primary" onClick={handleAddItem}>
                Add to List
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    item: '',
                    category: 'essentials',
                    quantity: 1,
                    priority: 'medium'
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Items by Category */}
        {totalItems > 0 && (
          <div className="items-section">
            {categories.map(category => {
              const categoryItems = groupedItems[category];
              if (categoryItems.length === 0) return null;

              const categoryPacked = categoryItems.filter(item => item.packed).length;

              return (
                <div key={category} className="category-group">
                  <div className="category-header">
                    <h3>
                      {getCategoryEmoji(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                    </h3>
                    <span className="category-count">
                      {categoryPacked}/{categoryItems.length} packed
                    </span>
                  </div>
                  <div className="items-list">
                    {categoryItems.map(item => (
                      <div
                        key={item._id}
                        className={`item-row ${item.packed ? 'packed' : ''}`}
                      >
                        <div className="item-checkbox">
                          <input
                            type="checkbox"
                            checked={item.packed}
                            onChange={() => handleTogglePacked(item._id, item.packed)}
                            id={`item-${item._id}`}
                          />
                          <label htmlFor={`item-${item._id}`}></label>
                        </div>
                        <div className="item-details">
                          <div className="item-name">{item.item}</div>
                          <div className="item-meta">
                            <span className="quantity">Qty: {item.quantity}</span>
                            <span
                              className="priority"
                              style={{ color: getPriorityColor(item.priority) }}
                            >
                              {item.priority.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <button
                          className="btn-delete-small"
                          onClick={() => handleDeleteItem(item._id)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {totalItems === 0 && !showForm && (
          <div className="empty-state">
            <div className="empty-icon">🧳</div>
            <h3>No items yet</h3>
            <p>Start building your packing list to prepare for your trip.</p>
          </div>
        )}

        {/* Reset Button */}
        {totalItems > 0 && (
          <div className="action-footer">
            <button
              className="btn-reset"
              onClick={handleResetChecklist}
            >
              ↻ Reset Checklist
            </button>
          </div>
        )}

        {loading && <div className="loading">Loading checklist...</div>}
      </div>
    </>
  );
}

export default PackingChecklist;
