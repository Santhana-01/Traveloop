import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login2';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard-v2';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import Itinerary from './pages/Itinerary';
import UserProfile from './pages/UserProfile';
import TripNotes from './pages/TripNotes';
import PackingChecklist from './pages/PackingChecklist';
import Reviews from './pages/Reviews';
// import ShareTrip from './pages/ShareTrip';
import CitySearch from './pages/CitySearch';
// import AuroraTrailsLanding from './pages/AuroraTrailsLanding';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips"
            element={
              <ProtectedRoute>
                <MyTrips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-trip"
            element={
              <ProtectedRoute>
                <CreateTrip />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip/:tripId"
            element={
              <ProtectedRoute>
                <Itinerary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/itinerary/:tripId"
            element={
              <ProtectedRoute>
                <Itinerary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip/:tripId/notes"
            element={
              <ProtectedRoute>
                <TripNotes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip/:tripId/packing"
            element={
              <ProtectedRoute>
                <PackingChecklist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip/:tripId/reviews"
            element={
              <ProtectedRoute>
                <Reviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/explore-destinations"
            element={
              <ProtectedRoute>
                <CitySearch />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
