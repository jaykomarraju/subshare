// src/routes/AppRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import SubscriptionDetails from '../pages/SubscriptionDetails';
import CreateSubscription from '../pages/CreateSubscription';
import PrivateRoute from '../components/common/PrivateRoute';

const AppRoutes = () => {
  return (
    // <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/subscription/create"
          element={
            <PrivateRoute>
              <CreateSubscription />
            </PrivateRoute>
          }
        />
        <Route
          path="/subscription/:id"
          element={
            <PrivateRoute>
              <SubscriptionDetails />
            </PrivateRoute>
          }
        />
        
        {/* Default route: redirect to Dashboard if logged in, otherwise to Login */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    // </Router>
  );
};

export default AppRoutes;
