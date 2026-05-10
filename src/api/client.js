const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

const clearAuthToken = () => {
  localStorage.removeItem('authToken');
};

const apiCall = async (method, endpoint, data = null, isPublic = false) => {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  if (!isPublic) {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'API Error');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Auth API
export const authApi = {
  register: (name, email, password) =>
    apiCall('POST', '/auth/register', { name, email, password, passwordConfirm: password }, true),
  
  login: (email, password) =>
    apiCall('POST', '/auth/login', { email, password }, true),
  
  getCurrentUser: () =>
    apiCall('GET', '/auth/me'),
  
  forgotPassword: (email) =>
    apiCall('POST', '/auth/forgot-password', { email }, true),
  
  resetPassword: (token, password) =>
    apiCall('POST', `/auth/reset-password/${token}`, { password, passwordConfirm: password }, true)
};

// Trip API
export const tripApi = {
  getUserTrips: () =>
    apiCall('GET', '/trips'),
  
  getTripById: (tripId) =>
    apiCall('GET', `/trips/${tripId}`),
  
  createTrip: (tripData) =>
    apiCall('POST', '/trips', tripData),
  
  updateTrip: (tripId, tripData) =>
    apiCall('PUT', `/trips/${tripId}`, tripData),
  
  deleteTrip: (tripId) =>
    apiCall('DELETE', `/trips/${tripId}`),
  
  makePublic: (tripId) =>
    apiCall('PUT', `/trips/${tripId}/make-public`),
  
  getPublicTrip: (publicUrl) =>
    apiCall('GET', `/trips/public/${publicUrl}`, null, true),
  
  copyPublicTrip: (publicUrl) =>
    apiCall('POST', `/trips/copy/${publicUrl}`),
  
  updateBudget: (tripId, budget) =>
    apiCall('PUT', `/trips/${tripId}/budget`, budget)
};

// Destination API
export const destinationApi = {
  addDestination: (tripId, destData) =>
    apiCall('POST', `/trips/${tripId}/destinations`, destData),
  
  getDestinations: (tripId) =>
    apiCall('GET', `/trips/${tripId}/destinations`, null, true),
  
  updateDestination: (destId, destData) =>
    apiCall('PUT', `/destinations/${destId}`, destData),
  
  deleteDestination: (destId) =>
    apiCall('DELETE', `/destinations/${destId}`),
  
  reorderDestinations: (tripId, destIds) =>
    apiCall('PUT', `/trips/${tripId}/reorder-destinations`, { destinationIds: destIds })
};

// Activity API
export const activityApi = {
  addActivity: (destId, actData) =>
    apiCall('POST', `/destinations/${destId}/activities`, actData),
  
  getActivities: (destId) =>
    apiCall('GET', `/destinations/${destId}/activities`, null, true),
  
  updateActivity: (actId, actData) =>
    apiCall('PUT', `/activities/${actId}`, actData),
  
  deleteActivity: (actId) =>
    apiCall('DELETE', `/activities/${actId}`),
  
  getSuggestions: (city) =>
    apiCall('GET', `/activities/suggestions/${city}`, null, true)
};

// Packing API
export const packingApi = {
  addItem: (tripId, itemData) =>
    apiCall('POST', `/trips/${tripId}/packing`, itemData),
  
  getItems: (tripId) =>
    apiCall('GET', `/trips/${tripId}/packing`),
  
  updateItem: (itemId, itemData) =>
    apiCall('PUT', `/packing/${itemId}`, itemData),
  
  deleteItem: (itemId) =>
    apiCall('DELETE', `/packing/${itemId}`),
  
  togglePacked: (itemId) =>
    apiCall('PUT', `/packing/${itemId}/toggle`),
  
  resetList: (tripId) =>
    apiCall('DELETE', `/trips/${tripId}/packing/reset`)
};

// Notes API
export const notesApi = {
  addNote: (tripId, noteData) =>
    apiCall('POST', `/trips/${tripId}/notes`, noteData),
  
  getNotes: (tripId) =>
    apiCall('GET', `/trips/${tripId}/notes`),
  
  updateNote: (noteId, noteData) =>
    apiCall('PUT', `/notes/${noteId}`, noteData),
  
  deleteNote: (noteId) =>
    apiCall('DELETE', `/notes/${noteId}`),
  
  togglePin: (noteId) =>
    apiCall('PUT', `/notes/${noteId}/toggle-pin`)
};

// Reviews API
export const reviewsApi = {
  addReview: (tripId, reviewData) =>
    apiCall('POST', `/reviews/${tripId}`, reviewData),
  
  getReviews: (tripId) =>
    apiCall('GET', `/reviews/${tripId}`, null, true),
  
  updateReview: (reviewId, reviewData) =>
    apiCall('PUT', `/reviews/${reviewId}`, reviewData),
  
  deleteReview: (reviewId) =>
    apiCall('DELETE', `/reviews/${reviewId}`)
};

// User API
export const userApi = {
  getProfile: () =>
    apiCall('GET', '/users/profile'),
  
  updateProfile: (profileData) =>
    apiCall('PUT', '/users/profile', profileData),
  
  updatePreferences: (preferences) =>
    apiCall('PUT', '/users/preferences', preferences),
  
  addSavedDestination: (destData) =>
    apiCall('POST', '/users/saved-destinations', destData),
  
  getSavedDestinations: () =>
    apiCall('GET', '/users/saved-destinations'),
  
  removeSavedDestination: (destName) =>
    apiCall('DELETE', `/users/saved-destinations/${destName}`),
  
  changePassword: (passwordData) =>
    apiCall('POST', '/users/change-password', passwordData),
  
  deleteAccount: () =>
    apiCall('DELETE', '/users/account'),
  
  getPublicProfile: (userId) =>
    apiCall('GET', `/users/${userId}/public`, null, true)
};

export {
  getAuthToken,
  setAuthToken,
  clearAuthToken
};
