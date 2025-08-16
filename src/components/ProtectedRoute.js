import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const user = useSelector((store) => store.user.name);
  
  // If user is not authenticated, redirect to login
  return user ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
