import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../utils/firebase';

const ProtectedRoute = ({ children }) => {
  const user = useSelector((store) => store.user.name);
  const [authLoading, setAuthLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // Firebase has determined the auth state
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="font-['JetBrains_Mono',monospace] text-white text-lg">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login with the intended destination
  if (!user) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }
  
  // User is authenticated, show the protected content
  return children;
};

export default ProtectedRoute;
