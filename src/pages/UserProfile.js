import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userApi, tripApi } from '../api/client';
import Header from '../components/Header';
import '../styles/UserProfile.css';

function UserProfile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(user || {});
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || ''
  });
  const [newDestination, setNewDestination] = useState({
    name: '',
    country: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const [profileRes, destRes, tripsRes] = await Promise.all([
        userApi.getProfile(),
        userApi.getSavedDestinations(),
        tripApi.getUserTrips()
      ]);
      
      if (profileRes.success) {
        setProfile(profileRes.user);
        setFormData({
          name: profileRes.user.name,
          bio: profileRes.user.bio || ''
        });
      }
      if (destRes.success) {
        setSavedDestinations(destRes.destinations);
      }
      if (tripsRes.success) {
        setTrips(tripsRes.trips);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      const response = await userApi.updateProfile(formData);
      if (response.success) {
        setMessage('Profile updated successfully!');
        setEditing(false);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Error updating profile');
    }
  };

  const handleAddDestination = async () => {
    if (!newDestination.name || !newDestination.country) {
      setMessage('Please fill in all fields');
      return;
    }
    try {
      const response = await userApi.addSavedDestination(newDestination);
      if (response.success) {
        setSavedDestinations(response.destinations);
        setNewDestination({ name: '', country: '' });
        setMessage('Destination saved!');
        setTimeout(() => setMessage(''), 3000);
        loadProfile(); // Refresh stats
      }
    } catch (err) {
      setMessage('Error saving destination');
    }
  };

  const handleRemoveDestination = async (destName) => {
    try {
      const response = await userApi.removeSavedDestination(destName);
      if (response.success) {
        setSavedDestinations(response.destinations);
        loadProfile(); // Refresh stats
      }
    } catch (err) {
      setMessage('Error removing destination');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  const activitiesCount = trips.reduce((sum, t) => sum + (t.itinerary?.length || 0), 0);

  return (
    <div className="profile-page-container">
      <Header 
        title="My Profile" 
        onLogout={handleLogout}
        showBackButton
        onBack={() => navigate('/dashboard')}
      />
      <div className="profile-container">
        <div className="profile-card">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-photo">
              {profile.profilePhoto ? (
                <img src={profile.profilePhoto} alt="Profile" />
              ) : (
                <div className="photo-placeholder">
                  {profile.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="profile-info">
              <h2>{profile.name}</h2>
              <p>{profile.email}</p>
              {!editing && (
                <button className="btn-primary" onClick={() => setEditing(true)}>
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {message && <div className="success-message">{message}</div>}

          {/* Edit Form */}
          {editing && (
            <div className="edit-form">
              <h3>Edit Personal Details</h3>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="3" />
              </div>

              <div className="form-actions">
                <button className="btn-primary" onClick={handleSaveProfile}>Save</button>
                <button className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          )}

          {/* Stats - Dynamic */}
          <div className="stats-section">
            <div className="stats-grid">
              <div className="stat">
                <div className="stat-value">{savedDestinations.length}</div>
                <div className="stat-label">Saved Locations</div>
              </div>
              <div className="stat">
                <div className="stat-value">{trips.length}</div>
                <div className="stat-label">Trips Planned</div>
              </div>
              <div className="stat">
                <div className="stat-value">{activitiesCount}</div>
                <div className="stat-label">Total Days</div>
              </div>
            </div>
          </div>

          {/* Saved Destinations */}
          <div className="section saved-dest-section">
            <h3>💙 Saved Destinations</h3>
            <div className="add-destination">
              <input
                type="text"
                placeholder="City"
                value={newDestination.name}
                onChange={(e) => setNewDestination({ ...newDestination, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Country"
                value={newDestination.country}
                onChange={(e) => setNewDestination({ ...newDestination, country: e.target.value })}
              />
              <button className="btn-small" onClick={handleAddDestination}>Add</button>
            </div>

            {savedDestinations.length === 0 ? (
              <p className="empty-message">You haven't saved any destinations yet.</p>
            ) : (
              <div className="destinations-list">
                {savedDestinations.map((dest, idx) => (
                  <div key={idx} className="dest-item">
                    <div className="dest-info">
                      <strong>{dest.name}</strong>
                      <p>{dest.country}</p>
                    </div>
                    <button className="btn-delete-small" onClick={() => handleRemoveDestination(dest.name)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Logout at bottom */}
          <div className="profile-footer">
            <button className="btn-logout-large" onClick={handleLogout}>
              🚪 Logout from Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
