import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useApp();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;