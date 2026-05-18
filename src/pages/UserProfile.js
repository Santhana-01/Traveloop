import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userApi, tripApi } from '../api/client';
import Header from '../components/Header';
import MagneticEffect from '../components/common/MagneticEffect';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/UserProfile.css';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

function UserProfile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(user || {});
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [newDestination, setNewDestination] = useState({ name: '', country: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const [profileRes, destRes, tripsRes] = await Promise.all([
        userApi.getProfile(),
        userApi.getSavedDestinations(),
        tripApi.getUserTrips()
      ]);
      if (profileRes.success) { setProfile(profileRes.user); setFormData({ name: profileRes.user.name, bio: profileRes.user.bio || '' }); }
      if (destRes.success) setSavedDestinations(destRes.destinations);
      if (tripsRes.success) setTrips(tripsRes.trips);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await userApi.updateProfile(formData);
      if (response.success) {
        setProfile(response.user);
        setEditing(false);
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setMessage(err.message || 'Error updating profile');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleAddDestination = async (e) => {
    e.preventDefault();
    if (!newDestination.name || !newDestination.country) {
      setMessage('Please fill all fields for the new collection.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    try {
      const response = await userApi.addSavedDestination(newDestination);
      if (response.success) {
        setSavedDestinations(response.destinations);
        setNewDestination({ name: '', country: '' });
        setMessage('Collection added successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error(response.message || 'Failed to add collection');
      }
    } catch (err) {
      setMessage(err.message || 'Error adding collection');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRemoveDestination = async (destName) => {
    const previousDestinations = [...savedDestinations];
    try {
      const response = await userApi.removeSavedDestination(destName);
      if (response.success) {
        setSavedDestinations(response.destinations);
        setMessage('Collection removed successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error(response.message || 'Failed to remove collection');
      }
    } catch (err) { 
      setSavedDestinations(previousDestinations); // Revert
      setMessage('Error removing collection'); 
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div className="fluid-loader">Gathering your memories...</div>;

  const activitiesCount = trips.reduce((sum, t) => sum + (t.itinerary?.length || 0), 0);

  return (
    <div className="profile-immersive">
      <motion.main 
        className="profile-content content-flow"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {/* Profile Identity */}
        <motion.section className="profile-identity-section" variants={itemVariants}>
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-fluid">
              {profile.profilePhoto ? <img src={profile.profilePhoto} alt="Avatar" /> : <span>{profile.name?.charAt(0)}</span>}
            </div>
            <div className="avatar-glow"></div>
          </div>
          
          <div className="profile-text-info">
            <MagneticEffect strength={6}>
              <h1 className="profile-name-fluid">{profile.name}</h1>
            </MagneticEffect>
            <p className="profile-email-fluid">{profile.email}</p>
            <p className="profile-bio-fluid">{profile.bio || "Exploring the horizon, one trip at a time."}</p>
            <button className="btn-edit-fluid" onClick={() => setEditing(!editing)}>
              {editing ? 'Close' : 'Refine Identity'}
            </button>
          </div>
        </motion.section>

        <AnimatePresence>
          {editing && (
            <motion.section 
              className="edit-profile-fluid glass-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', padding: '2rem', borderRadius: '24px', marginBottom: '3rem' }}
            >
              <div className="edit-grid-fluid">
                <div className="input-group-fluid">
                  <label>Display Name</label>
                  <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Enter your full name" />
                </div>
                <div className="input-group-fluid">
                  <label>Personal Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} rows="3" placeholder="Tell us about your journey..." />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <MagneticEffect strength={4}>
                  <button className="btn-primary-fluid" onClick={handleSaveProfile}>Update Profile</button>
                </MagneticEffect>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Dynamic Inline Stats */}
        <motion.section className="profile-stats-inline no-box" variants={itemVariants}>
          {[
            { label: 'Saved', value: savedDestinations.length },
            { label: 'Explored', value: trips.length },
            { label: 'Days', value: activitiesCount }
          ].map((stat, i) => (
            <div key={i} className="profile-stat-item">
              <MagneticEffect strength={6}>
                <span className="stat-value-inline">{stat.value}</span>
              </MagneticEffect>
              <MagneticEffect strength={3}>
                <span className="stat-label-inline">{stat.label}</span>
              </MagneticEffect>
              {i < 2 && <div className="stat-glow-line"></div>}
            </div>
          ))}
        </motion.section>

        {/* Collection Section */}
        <motion.section className="collection-section-fluid no-box" variants={itemVariants}>
          <div className="section-header-fluid">
            <MagneticEffect strength={5}>
              <h2 className="section-title-fluid">Saved Collections</h2>
            </MagneticEffect>
          </div>

          <div className="collection-form-inline">
            <div className="collection-inputs">
              <input type="text" placeholder="City" value={newDestination.name} onChange={(e) => setNewDestination({ ...newDestination, name: e.target.value })} />
              <input type="text" placeholder="Country" value={newDestination.country} onChange={(e) => setNewDestination({ ...newDestination, country: e.target.value })} />
            </div>
            <MagneticEffect strength={3}>
              <button onClick={handleAddDestination} className="btn-add-profile">
                Add to Collection
              </button>
            </MagneticEffect>
          </div>

          <div className="saved-fluid-grid">
            {savedDestinations.map((dest, idx) => (
              <motion.div key={idx} className="saved-item-fluid borderless">
                <div className="saved-info">
                  <MagneticEffect strength={4}>
                    <h4>{dest.name}</h4>
                  </MagneticEffect>
                  <p>{dest.country}</p>
                </div>
                <MagneticEffect strength={3}>
                  <button className="btn-remove-fluid" onClick={() => handleRemoveDestination(dest.name)}>Remove</button>
                </MagneticEffect>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Footer Actions */}
        <motion.section className="profile-footer-fluid" variants={itemVariants}>
          <MagneticEffect strength={8}>
            <button className="btn-logout-fluid" onClick={() => { logout(); navigate('/login'); }}>
              Disconnect Account
            </button>
          </MagneticEffect>
        </motion.section>
      </motion.main>
    </div>
  );
}

export default UserProfile;
