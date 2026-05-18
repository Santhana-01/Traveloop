import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { packingApi } from '../api/client';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/PackingChecklist.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

function PackingChecklist() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    item: '',
    category: 'Other',
    quantity: 1,
    priority: 'medium'
  });

  const categories = ['Clothing', 'Documents', 'Electronics', 'Toiletries', 'Accessories', 'Other'];
  const priorities = ['low', 'medium', 'high'];

  useEffect(() => {
    loadItems();
  }, [tripId]);

  const loadItems = async () => {
    try {
      const response = await packingApi.getItems(tripId);
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
      [name]: name === 'quantity' ? parseInt(value) : value
    });
  };

  const handleAddItem = async () => {
    if (!formData.item.trim()) {
      setMessage('Please enter an item');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const newItem = {
      item: formData.item,
      category: formData.category,
      quantity: formData.quantity,
      priority: formData.priority,
    };

    try {
      const response = await packingApi.addItem(tripId, newItem);
      if (response.success) {
        setItems([...items, response.item]);
        setFormData({ item: '', category: 'Other', quantity: 1, priority: 'medium' });
      } else {
        throw new Error('API reported failure');
      }
    } catch (err) {
      setMessage('Error adding item. Please check your connection.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleTogglePacked = async (itemId, packed) => {
    const previousItems = [...items];
    setItems(items.map(item => item._id === itemId ? { ...item, isPacked: !packed } : item));
    try {
      const response = await packingApi.togglePacked(itemId);
      if (response.success) {
        setItems(items.map(item => item._id === itemId ? response.item : item));
      } else {
        setItems(previousItems);
      }
    } catch (err) {
      setItems(previousItems);
      console.error(err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    const previousItems = [...items];
    setItems(items.filter(item => item._id !== itemId));
    try {
      const response = await packingApi.deleteItem(itemId);
      if (!response.success) {
        setItems(previousItems);
      }
    } catch (err) {
      setItems(previousItems);
      console.error(err);
    }
  };

  const getCategoryEmoji = (category) => {
    const emojis = { Accessories: '🔑', Clothing: '👕', Toiletries: '🧴', Electronics: '📱', Documents: '📄', Other: '📦' };
    return emojis[category] || '📦';
  };

  const totalItems = items.length;
  const packedItems = items.filter(item => item.isPacked).length;
  const packedPercentage = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  return (
    <div className="aurora-page-wrapper">
      <div className="packing-container-v2">
        <AnimatePresence>
          {message && (
            <motion.div 
              className="message-banner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                background: 'rgba(255, 87, 87, 0.15)',
                color: '#FF5757',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                textAlign: 'center',
                border: '1px solid rgba(255, 87, 87, 0.3)'
              }}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="checklist-hero">
          <h1>Packing Checklist</h1>
          <p>{packedItems} of {totalItems} items packed</p>
          <div className="slim-progress-bar">
            <motion.div 
              className="slim-progress-fill" 
              initial={{ width: 0 }}
              animate={{ width: `${packedPercentage}%` }}
            />
          </div>
        </div>

        <div className="add-item-inline">
          <input 
            type="text" 
            name="item" 
            placeholder="What else do you need to pack?" 
            value={formData.item} 
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          />
          <button onClick={handleAddItem}>Add</button>
        </div>

        <div className="checklist-v2-grid">
          {categories.map(category => {
            const categoryItems = items.filter(item => item.category === category);
            if (categoryItems.length === 0) return null;

            return (
              <div key={category} className="category-v2-section">
                <h3 className="category-v2-title">{getCategoryEmoji(category)} {category}</h3>
                <div className="todo-list-v2">
                  <AnimatePresence mode="popLayout">
                    {categoryItems.map(item => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className={`todo-row-v2 ${item.isPacked ? 'is-packed' : ''}`}
                      >
                        <div className="todo-left" onClick={() => handleTogglePacked(item._id, item.isPacked)}>
                          <div className={`todo-checkbox-v2 ${item.isPacked ? 'checked' : ''}`}>
                            {item.isPacked && <span>✓</span>}
                          </div>
                          <div className="todo-text-v2">
                            <span className="todo-name-v2">{item.name}</span>
                            {item.quantity > 1 && <span className="todo-qty-v2">x{item.quantity}</span>}
                          </div>
                        </div>
                        <button className="todo-delete-v2" onClick={() => handleDeleteItem(item._id)}>✕</button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {totalItems === 0 && (
          <div className="empty-checklist-v2">
            <p>Your checklist is empty. Start adding items above!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PackingChecklist;
