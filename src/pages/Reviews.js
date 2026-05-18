import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reviewsApi } from '../api/client';
import Header from '../components/Header';
import '../styles/Reviews.css';

function Reviews() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0
  });

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const loadReviews = async () => {
    try {
      const response = await reviewsApi.getReviews(tripId);
      if (response.success) {
        setReviews(response.reviews);
        setStats(response.stats);
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
      [name]: name === 'rating' ? parseInt(value) : value
    });
  };

  const handleSubmitReview = async () => {
    if (!formData.comment.trim()) {
      setMessage('Please write a comment');
      return;
    }

    try {
      const response = await reviewsApi.addReview(tripId, formData);
      if (response.success) {
        setReviews([response.review, ...reviews]);
        setStats(response.stats);
        setFormData({ rating: 5, comment: '' });
        setShowForm(false);
        setMessage('Review submitted! Thank you!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Error submitting review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete your review?')) return;

    try {
      const response = await reviewsApi.deleteReview(reviewId);
      if (response.success) {
        setReviews(reviews.filter(r => r._id !== reviewId));
        setStats(response.stats);
      }
    } catch (err) {
      setMessage('Error deleting review');
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
            onClick={() => interactive && onChange && onChange(star)}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#51cf66'; // Green
    if (rating >= 3.5) return '#fcc419'; // Yellow
    if (rating >= 2.5) return '#ff9f43'; // Orange
    return '#ff6b6b'; // Red
  };

  return (
    <div className="reviews-container">
        {message && <div className="success-message">{message}</div>}

        {/* Rating Summary */}
        <div className="rating-summary">
          <div className="rating-main">
            <div
              className="rating-score"
              style={{ color: getRatingColor(stats.averageRating) }}
            >
              {stats.averageRating.toFixed(1)}
            </div>
            <div>
              {renderStars(Math.round(stats.averageRating))}
              <p className="rating-label">
                Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Add Review Button */}
        {!showForm && (
          <button
            className="btn-add-review"
            onClick={() => setShowForm(true)}
          >
            <span>✏️ Write a Review</span>
          </button>
        )}

        {/* Review Form */}
        {showForm && (
          <div className="review-form-card">
            <h3>Share Your Experience</h3>
            <div className="form-group">
              <label>How would you rate this trip?</label>
              <div className="stars-interactive">
                {renderStars(formData.rating, true, (rating) => {
                  setFormData({ ...formData, rating });
                })}
              </div>
            </div>

            <div className="form-group">
              <label>Your Review</label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                placeholder="Share your thoughts about this trip..."
                rows="6"
              />
            </div>

            <div className="form-actions">
              <button className="btn-primary" onClick={handleSubmitReview}>
                Submit Review
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ rating: 5, comment: '' });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length > 0 && (
          <div className="reviews-section">
            <h3>All Reviews</h3>
            <div className="reviews-list">
              {reviews.map(review => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {review.author?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4>{review.author?.name}</h4>
                        <span className="review-date">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {review.isAuthor && (
                      <button
                        className="btn-delete-review"
                        onClick={() => handleDeleteReview(review._id)}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>

                  <p className="review-comment">{review.comment}</p>

                  {review.verified && (
                    <div className="verified-badge">✓ Verified Traveler</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {reviews.length === 0 && !showForm && (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>No reviews yet</h3>
            <p>Be the first to share your experience with this trip!</p>
          </div>
        )}

        {loading && <div className="loading">Loading reviews...</div>}
      </div>
  );
}

export default Reviews;
