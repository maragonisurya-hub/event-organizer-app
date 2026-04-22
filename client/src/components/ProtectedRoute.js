// src/components/ProtectedRoute.js
// Wraps routes that require authentication or a specific role.
// If the user isn't logged in, or doesn't have the right role, redirect them.
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  // Not logged in at all → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role (e.g. user trying to access admin route)
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
