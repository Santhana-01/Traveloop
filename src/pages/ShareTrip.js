import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripApi } from '../api/client';
import Header from '../components/Header';
import '../styles/ShareTrip.css';

function ShareTrip() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const loadTrip = async () => {
    try {
      const response = await tripApi.getTripById(tripId);
      if (response.success) {
        setTrip(response.trip);
        if (response.trip.isPublic && response.trip.publicUrl) {
          setShareUrl(`${window.location.origin}/trip/public/${response.trip.publicUrl}`);
        }
      }
    } catch (err) {
      console.error(err);
      setMessage('Error loading trip');
    } finally {
      setLoading(false);
    }
  };

  const handleMakePublic = async () => {
    try {
      const response = await tripApi.makePublic(tripId);
      if (response.success) {
        setTrip(response.trip);
        setShareUrl(`${window.location.origin}/trip/public/${response.trip.publicUrl}`);
        setMessage('Trip is now public!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Error making trip public');
    }
  };

  const handleMakePrivate = async () => {
    if (!window.confirm('Make this trip private? People with the link will no longer access it.')) return;

    try {
      const response = await tripApi.makePrivate(tripId);
      if (response.success) {
        setTrip(response.trip);
        setShareUrl('');
        setMessage('Trip is now private');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Error making trip private');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareToSocial = (platform) => {
    const title = trip?.name || 'Check out my trip!';
    const text = `I created an itinerary for my trip to ${trip?.destination || 'an amazing place'}. Check it out and share your thoughts!`;
    const url = shareUrl;

    let shareUrl_social = '';
    switch (platform) {
      case 'facebook':
        shareUrl_social = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl_social = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl_social = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'email':
        shareUrl_social = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
      default:
        return;
    }
    window.open(shareUrl_social, '_blank');
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!trip) {
    return <div className="error-message">Trip not found</div>;
  }

  return (
      <div className="share-container">
        {message && <div className="success-message">{message}</div>}

        <div className="share-card">
          <div className="trip-info">
            <h2>{trip.name}</h2>
            <p className="trip-dates">
              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </p>
          </div>

          {/* Status Section */}
          <div className="status-section">
            <h3>Sharing Status</h3>
            <div className="status-badge">
              {trip.isPublic ? (
                <span className="badge-public">
                  🌐 Public - Anyone with the link can view
                </span>
              ) : (
                <span className="badge-private">
                  🔒 Private - Only you can view
                </span>
              )}
            </div>
          </div>

          {/* Share Link Section */}
          {trip.isPublic && shareUrl && (
            <div className="share-link-section">
              <h3>Share Your Trip</h3>
              <p className="section-desc">
                Share this link with friends and family to get feedback on your itinerary
              </p>

              {/* Copy Link */}
              <div className="link-box">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="share-link-input"
                />
                <button
                  className={`btn-copy ${copied ? 'copied' : ''}`}
                  onClick={handleCopyLink}
                >
                  {copied ? '✓ Copied!' : 'Copy Link'}
                </button>
              </div>

              {/* Social Sharing */}
              <div className="social-share">
                <h4>Share on Social Media</h4>
                <div className="social-buttons">
                  <button
                    className="social-btn facebook"
                    onClick={() => handleShareToSocial('facebook')}
                    title="Share on Facebook"
                  >
                    f
                  </button>
                  <button
                    className="social-btn twitter"
                    onClick={() => handleShareToSocial('twitter')}
                    title="Share on Twitter"
                  >
                    𝕏
                  </button>
                  <button
                    className="social-btn whatsapp"
                    onClick={() => handleShareToSocial('whatsapp')}
                    title="Share on WhatsApp"
                  >
                    ✓
                  </button>
                  <button
                    className="social-btn email"
                    onClick={() => handleShareToSocial('email')}
                    title="Share via Email"
                  >
                    ✉
                  </button>
                </div>
              </div>

              {/* Make Private Button */}
              <div className="action-section">
                <button
                  className="btn-make-private"
                  onClick={handleMakePrivate}
                >
                  🔒 Make Private
                </button>
              </div>
            </div>
          )}

          {/* Make Public Section */}
          {!trip.isPublic && (
            <div className="make-public-section">
              <h3>Make This Trip Public</h3>
              <p className="section-desc">
                Share your trip itinerary with others! When you make your trip public, people can:
              </p>
              <ul className="features-list">
                <li>View your entire itinerary and planned activities</li>
                <li>See your budget breakdown and destination information</li>
                <li>Leave reviews and feedback on your trip plan</li>
                <li>Use your itinerary as inspiration for their own trips</li>
              </ul>
              <button
                className="btn-make-public"
                onClick={handleMakePublic}
              >
                🌐 Make Public
              </button>
            </div>
          )}

          {/* Info Section */}
          <div className="info-section">
            <h3>📋 Trip Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Trip Name</label>
                <p>{trip.name}</p>
              </div>
              <div className="info-item">
                <label>Duration</label>
                <p>
                  {Math.ceil(
                    (new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)
                  )} days
                </p>
              </div>
              <div className="info-item">
                <label>Total Budget</label>
                <p>${trip.budget?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="info-item">
                <label>Destinations</label>
                <p>{trip.destinations?.length || 0} locations</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="faq-section">
            <h3>❓ Frequently Asked Questions</h3>
            <div className="faq-item">
              <h4>Can I edit my trip after making it public?</h4>
              <p>Yes! You can edit your trip anytime. Changes will be reflected on the public page automatically.</p>
            </div>
            <div className="faq-item">
              <h4>Can I see who viewed my trip?</h4>
              <p>Currently, we don't track viewer analytics. However, people can leave reviews to share their feedback.</p>
            </div>
            <div className="faq-item">
              <h4>Can I delete reviews?</h4>
              <p>Yes, you can delete any review on your public trip from the Reviews tab.</p>
            </div>
            <div className="faq-item">
              <h4>What information is visible when shared?</h4>
              <p>Your trip name, dates, destinations, activities, budget breakdown, and notes are visible. Personal contact information is never shared.</p>
            </div>
          </div>
        </div>
      </div>
  );
}

export default ShareTrip;
