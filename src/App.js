import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { AnimatePresence } from 'framer-motion';

// Layout
import MainLayout from './components/layout/MainLayout';
import PageTransition from './components/common/PageTransition';
import CursorTrail from './components/common/CursorTrail';

// Modular Features
import LandingPage from './pages/LandingPage';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './features/dashboard/Dashboard';
import ItineraryBuilder from './features/itinerary/ItineraryBuilder';
import BudgetPlanner from './pages/BudgetPlanner';

// Keep some in pages for now until moved
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import UserProfile from './pages/UserProfile';
import TripNotes from './pages/TripNotes';
import PackingChecklist from './pages/PackingChecklist';
import CitySearch from './pages/CitySearch';
import ShareTrip from './pages/ShareTrip';

import './App.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

        {/* Protected routes with MainLayout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout title="Overview">
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips"
          element={
            <ProtectedRoute>
              <MainLayout title="My Journeys">
                <MyTrips />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-trip"
          element={
            <ProtectedRoute>
              <MainLayout title="New Journey">
                <CreateTrip />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trip/:tripId"
          element={
            <ProtectedRoute>
              <MainLayout title="Itinerary Builder">
                <ItineraryBuilder />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/budget"
          element={
            <ProtectedRoute>
              <MainLayout title="Budget Planner">
                <BudgetPlanner />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/checklist"
          element={
            <ProtectedRoute>
              <MainLayout title="Packing List">
                <PackingChecklist />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <MainLayout title="My Notes">
                <TripNotes />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore-destinations"
          element={
            <ProtectedRoute>
              <MainLayout title="Explore Cities">
                <CitySearch />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout title="Identity">
                <UserProfile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/public-trips"
          element={
            <ProtectedRoute>
              <MainLayout title="Community">
                <ShareTrip />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <CursorTrail />
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
