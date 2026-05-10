import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/CitySearch.css';

function CitySearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const sampleDestinations = [
    {
      id: 1,
      name: 'Paris',
      country: 'France',
      category: 'romantic',
      rating: 4.8,
      reviews: 2430,
      image: '🗼',
      description: 'The City of Light awaits with iconic monuments and world-class cuisine.',
      cost: '₹₹₹',
      bestTime: 'Apr-Jun, Sep-Oct'
    },
    {
      id: 2,
      name: 'Tokyo',
      country: 'Japan',
      category: 'adventure',
      rating: 4.7,
      reviews: 1890,
      image: '🗾',
      description: 'Modern metropolis blending tradition with cutting-edge technology.',
      cost: '₹₹',
      bestTime: 'Mar-May, Oct-Nov'
    },
    {
      id: 3,
      name: 'New York',
      country: 'USA',
      category: 'urban',
      rating: 4.6,
      reviews: 3100,
      image: '🗽',
      description: 'The city that never sleeps with endless entertainment and dining.',
      cost: '₹₹₹',
      bestTime: 'May, Sep-Oct'
    },
    {
      id: 4,
      name: 'Barcelona',
      country: 'Spain',
      category: 'beach',
      rating: 4.7,
      reviews: 2560,
      image: '🏖️',
      description: 'Mediterranean charm with Gaudí architecture and vibrant culture.',
      cost: '₹₹',
      bestTime: 'May-Jun, Sep-Oct'
    },
    {
      id: 5,
      name: 'Dubai',
      country: 'UAE',
      category: 'luxury',
      rating: 4.5,
      reviews: 1820,
      image: '🏙️',
      description: 'Ultra-modern oasis with luxury shopping and desert adventures.',
      cost: '₹₹₹',
      bestTime: 'Nov-Mar'
    },
    {
      id: 6,
      name: 'Bali',
      country: 'Indonesia',
      category: 'beach',
      rating: 4.8,
      reviews: 2890,
      image: '🏝️',
      description: 'Tropical paradise with temples, beaches, and vibrant nightlife.',
      cost: '₹',
      bestTime: 'Apr-Oct'
    },
    {
      id: 7,
      name: 'Iceland',
      country: 'Iceland',
      category: 'adventure',
      rating: 4.9,
      reviews: 1650,
      image: '❄️',
      description: 'Land of fire and ice with stunning natural wonders.',
      cost: '₹₹₹',
      bestTime: 'Jun-Aug'
    },
    {
      id: 8,
      name: 'Rome',
      country: 'Italy',
      category: 'cultural',
      rating: 4.7,
      reviews: 2710,
      image: '🏛️',
      description: 'Ancient history comes alive in the Eternal City.',
      cost: '₹₹',
      bestTime: 'Apr-May, Sep-Oct'
    },
    {
      id: 9,
      name: 'Bangkok',
      country: 'Thailand',
      category: 'urban',
      rating: 4.6,
      reviews: 2340,
      image: '🏯',
      description: 'Bustling city with ornate temples and street food paradise.',
      cost: '₹',
      bestTime: 'Nov-Feb'
    },
    {
      id: 10,
      name: 'Sydney',
      country: 'Australia',
      category: 'beach',
      rating: 4.7,
      reviews: 2180,
      image: '🦘',
      description: 'Vibrant harbor city with iconic beaches and friendly vibes.',
      cost: '₹₹',
      bestTime: 'Dec-Feb'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Destinations', emoji: '🌍' },
    { id: 'beach', label: 'Beach', emoji: '🏖️' },
    { id: 'adventure', label: 'Adventure', emoji: '⛰️' },
    { id: 'cultural', label: 'Cultural', emoji: '🏛️' },
    { id: 'romantic', label: 'Romantic', emoji: '💕' },
    { id: 'urban', label: 'Urban', emoji: '🏙️' },
    { id: 'luxury', label: 'Luxury', emoji: '✨' }
  ];

  useEffect(() => {
    filterDestinations();
  }, [searchQuery, selectedCategory]);

  const filterDestinations = () => {
    setLoading(true);
    setTimeout(() => {
      let filtered = sampleDestinations;
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(dest => dest.category === selectedCategory);
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(dest =>
          dest.name.toLowerCase().includes(query) ||
          dest.country.toLowerCase().includes(query) ||
          dest.description.toLowerCase().includes(query)
        );
      }
      setDestinations(filtered);
      setLoading(false);
    }, 300);
  };

  const handleSelectDestination = (destination) => {
    navigate('/create-trip', {
      state: { destinationName: `${destination.name}, ${destination.country}` }
    });
  };

  const closeModal = () => setSelectedDetail(null);

  return (
    <div className="city-search-page">
      <Header 
        title="Explore Destinations" 
        showBackButton 
        onBack={() => navigate('/dashboard')} 
      />

      <div className="search-container">
        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by city, country, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-emoji">{category.emoji}</span>
              <span className="category-label">{category.label}</span>
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="results-section">
          <div className="results-header">
            <h2>
              {selectedCategory === 'all'
                ? 'All Destinations'
                : categories.find(c => c.id === selectedCategory)?.label}
            </h2>
            <span className="results-count">
              {destinations.length} destination{destinations.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading && <div className="loading">Loading destinations...</div>}

          {!loading && destinations.length > 0 && (
            <div className="destinations-grid">
              {destinations.map(destination => (
                <div key={destination.id} className="destination-card">
                  <div className="destination-image">{destination.image}</div>
                  
                  <div className="destination-content">
                    <div className="destination-header">
                      <h3>{destination.name}</h3>
                      <span className="destination-country">{destination.country}</span>
                    </div>

                    <p className="destination-description">{destination.description}</p>

                    <div className="destination-meta">
                      <div className="rating">
                        <span className="stars">★</span>
                        <span className="rating-value">
                          {destination.rating} ({destination.reviews})
                        </span>
                      </div>
                      <div className="cost-badge">{destination.cost}</div>
                    </div>

                    <div className="destination-details">
                      <div className="detail-item">
                        <span className="detail-label">Best Time</span>
                        <span className="detail-value highlighted">{destination.bestTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="destination-actions">
                    <button
                      className="btn-detail"
                      onClick={() => setSelectedDetail(destination)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn-select"
                      onClick={() => handleSelectDestination(destination)}
                    >
                      Plan Trip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && destinations.length === 0 && (
            <div className="empty-results">
              <div className="empty-icon">🔍</div>
              <h3>No destinations found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-header">
              <div className="modal-image">{selectedDetail.image}</div>
              <div>
                <h2>{selectedDetail.name}</h2>
                <p>{selectedDetail.country}</p>
              </div>
            </div>
            <div className="modal-body">
              <p className="modal-description">{selectedDetail.description}</p>
              <div className="modal-info-grid">
                <div className="info-item">
                  <span className="info-label">⭐ Rating</span>
                  <span className="info-value">{selectedDetail.rating} ({selectedDetail.reviews} reviews)</span>
                </div>
                <div className="info-item">
                  <span className="info-label">💰 Estimated Cost</span>
                  <span className="info-value">{selectedDetail.cost} (Scale 1-3)</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📅 Best Time to Visit</span>
                  <span className="info-value highlighted">{selectedDetail.bestTime}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">🏷️ Category</span>
                  <span className="info-value" style={{textTransform: 'capitalize'}}>{selectedDetail.category}</span>
                </div>
              </div>
              <button 
                className="btn-primary modal-action-btn"
                onClick={() => {
                  handleSelectDestination(selectedDetail);
                  closeModal();
                }}
              >
                Plan a Trip Here
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CitySearch;
