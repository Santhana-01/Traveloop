import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/CitySearch.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

function CitySearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const sampleDestinations = [
    { id: 1, name: 'Paris', country: 'France', category: 'romantic', rating: 4.8, reviews: 2430, image: '🗼', description: 'The City of Light awaits with iconic monuments and world-class cuisine.', cost: '₹₹₹', bestTime: 'Apr-Jun, Sep-Oct' },
    { id: 2, name: 'Tokyo', country: 'Japan', category: 'adventure', rating: 4.7, reviews: 1890, image: '🗾', description: 'Modern metropolis blending tradition with cutting-edge technology.', cost: '₹₹', bestTime: 'Mar-May, Oct-Nov' },
    { id: 3, name: 'New York', country: 'USA', category: 'urban', rating: 4.6, reviews: 3100, image: '🗽', description: 'The city that never sleeps with endless entertainment and dining.', cost: '₹₹₹', bestTime: 'May, Sep-Oct' },
    { id: 4, name: 'Barcelona', country: 'Spain', category: 'beach', rating: 4.7, reviews: 2560, image: '🏖️', description: 'Mediterranean charm with Gaudí architecture and vibrant culture.', cost: '₹₹', bestTime: 'May-Jun, Sep-Oct' },
    { id: 5, name: 'Dubai', country: 'UAE', category: 'luxury', rating: 4.5, reviews: 1820, image: '🏙️', description: 'Ultra-modern oasis with luxury shopping and desert adventures.', cost: '₹₹₹', bestTime: 'Nov-Mar' },
    { id: 6, name: 'Bali', country: 'Indonesia', category: 'beach', rating: 4.8, reviews: 2890, image: '🏝️', description: 'Tropical paradise with temples, beaches, and vibrant nightlife.', cost: '₹', bestTime: 'Apr-Oct' },
    { id: 7, name: 'Iceland', country: 'Iceland', category: 'adventure', rating: 4.9, reviews: 1650, image: '❄️', description: 'Land of fire and ice with stunning natural wonders.', cost: '₹₹₹', bestTime: 'Jun-Aug' },
    { id: 8, name: 'Rome', country: 'Italy', category: 'cultural', rating: 4.7, reviews: 2710, image: '🏛️', description: 'Ancient history comes alive in the Eternal City.', cost: '₹₹', bestTime: 'Apr-May, Sep-Oct' },
    { id: 9, name: 'Bangkok', country: 'Thailand', category: 'urban', rating: 4.6, reviews: 2340, image: '🏯', description: 'Bustling city with ornate temples and street food paradise.', cost: '₹', bestTime: 'Nov-Feb' },
    { id: 10, name: 'Sydney', country: 'Australia', category: 'beach', rating: 4.7, reviews: 2180, image: '🦘', description: 'Vibrant harbor city with iconic beaches and friendly vibes.', cost: '₹₹', bestTime: 'Dec-Feb' }
  ];

  const categories = [
    { id: 'all', label: 'All', emoji: '🌍' },
    { id: 'beach', label: 'Beach', emoji: '🏖️' },
    { id: 'adventure', label: 'Adventure', emoji: '⛰️' },
    { id: 'cultural', label: 'Cultural', emoji: '🏛️' },
    { id: 'romantic', label: 'Romantic', emoji: '💕' },
    { id: 'urban', label: 'Urban', emoji: '🏙️' },
    { id: 'luxury', label: 'Luxury', emoji: '✨' }
  ];

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      let filtered = sampleDestinations;
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(dest => dest.category === selectedCategory);
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(dest =>
          dest.name.toLowerCase().includes(query) ||
          dest.country.toLowerCase().includes(query)
        );
      }
      setDestinations(filtered);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const handleSelectDestination = (destination) => {
    navigate('/create-trip', {
      state: { destinationName: `${destination.name}, ${destination.country}` }
    });
  };

  return (
    <div className="city-search-page">

      <div className="search-container">
        <motion.div 
          className="search-hero"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Where to next?</h1>
          <div className="search-bar-wrapper">
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon-btn">🔍</span>
          </div>
        </motion.div>

        <motion.div 
          className="category-filter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map(category => (
            <motion.button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{category.emoji} {category.label}</span>
            </motion.button>
          ))}
        </motion.div>

        <div className="results-section">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="loading-results"
              >
                <div className="loader"></div>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="destinations-grid"
              >
                {destinations.map(destination => (
                  <motion.div 
                    key={destination.id} 
                    className="destination-card glass-panel"
                    variants={cardVariants}
                    whileHover={{ y: -10, scale: 1.02 }}
                  >
                    <div className="dest-img-container">
                      <span className="dest-emoji">{destination.image}</span>
                      <div className="dest-rating">★ {destination.rating}</div>
                    </div>
                    
                    <div className="dest-info">
                      <h3>{destination.name}</h3>
                      <p className="dest-country">{destination.country}</p>
                      <p className="dest-desc">{destination.description}</p>
                      
                      <div className="dest-footer">
                        <span className="dest-cost">{destination.cost}</span>
                        <motion.button
                          className="btn-plan"
                          onClick={() => handleSelectDestination(destination)}
                          whileHover={{ scale: 1.05, backgroundColor: '#47B5FF', color: '#04151F' }}
                        >
                          Plan Trip
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default CitySearch;
