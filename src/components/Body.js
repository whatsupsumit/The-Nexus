// React aur hooks - main app structure ke liye
import React, { useEffect, useState } from 'react';
// Saare page components import kar rahe - routes ke liye
import Login from './Login';
import Browse from './Browse';
import Movies from './Movies';
import TVShows from './TVShows';
import MovieDetails from './MovieDetails';
import TVShowDetails from './TVShowDetails';
import Vault from './Vault';
import Profile from './Profile';
import NeuralChat from './NeuralChat';
// Redux - global user state ke liye
import { useDispatch, useSelector } from 'react-redux';
// React Router - pages ke beech routing setup ke liye
import { createBrowserRouter, RouterProvider, Navigate, useLocation } from 'react-router-dom';
// Firebase auth - user login status check karne ke liye
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../utils/firebase';
// Redux actions - user login/logout par state update karne ke liye
import { addUser, removeUser } from '../utils/userSlice';
// Header aur Footer components - layout ke liye
import Header from './header';
// ProtectedRoute - unauthorized access rokne ke liye
import ProtectedRoute from './ProtectedRoute';
import Footer from './Footer';

// Body component - main app container, routing aur auth check karta hai
const Body = () => {
  const dispatch = useDispatch();
  const user = useSelector(store => store.user.name);
  const [authLoading, setAuthLoading] = useState(true);

  // Component to handle root path logic with access to location
  const RootHandler = () => {
    const location = useLocation();
    const from = location.state?.from || '/browse';
    
    // Show loading spinner while checking authentication status
    if (authLoading) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="font-['JetBrains_Mono',monospace] text-white text-lg">
              Loading NEXUS...
            </p>
          </div>
        </div>
      );
    }
    
    if (user) {
      // If user is authenticated, redirect to intended destination or browse
      return <Navigate to={from} replace />;
    } else {
      // If user is not authenticated, show login
      return (
        <div>
          <Header />
          <Login />
        </div>
      );
    }
  };

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <RootHandler />
    },
    {
      path: "/browse",
      element: (
        <ProtectedRoute>
          <div>
            <Header />
            <Browse />
          </div>
        </ProtectedRoute>
      )
    },
    {
      path: "/movies", 
      element: (
        <ProtectedRoute>
          <div>
            <Header />
            <div className="relative min-h-screen text-white">
              {/* NEXUS Background */}
              <div 
                className="fixed inset-0 w-full h-full z-0"
                style={{
                  backgroundImage: "url('redeye.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundAttachment: "fixed"
                }}
              />
              <div className="fixed inset-0 z-10 bg-gradient-to-t from-black via-black/60 to-black/80" />
              
              <div className="relative z-20">
                <Movies />
              </div>
            </div>
          </div>
        </ProtectedRoute>
      )
    },
    {
      path: "/tv-shows",
      element: (
        <ProtectedRoute>
          <div>
            <Header />
            <div className="relative min-h-screen text-white">
              {/* NEXUS Background */}
              <div 
                className="fixed inset-0 w-full h-full z-0"
                style={{
                  backgroundImage: "url('redeye.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundAttachment: "fixed"
                }}
              />
              <div className="fixed inset-0 z-10 bg-gradient-to-t from-black via-black/60 to-black/80" />
              
              <div className="relative z-20">
                <TVShows />
              </div>
            </div>
          </div>
        </ProtectedRoute>
      )
    },
    {
      path: "/movie/:id",
      element: (
        <ProtectedRoute>
          <div>
            <Header />
            <div className="relative min-h-screen text-white">
              {/* NEXUS Background */}
              <div 
                className="fixed inset-0 w-full h-full z-0"
                style={{
                  backgroundImage: "url('neffexbg.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundAttachment: "fixed"
                }}
              />
              <div className="fixed inset-0 z-10 bg-gradient-to-t from-black via-black/60 to-black/80" />
              
              <div className="relative z-20">
                <MovieDetails />
              </div>
            </div>
          </div>
        </ProtectedRoute>
      )
    },
    {
      path: "/tv/:id",
      element: (
        <ProtectedRoute>
          <div>
            <Header />
            <div className="relative min-h-screen text-white">
              {/* NEXUS Background */}
              <div 
                className="fixed inset-0 w-full h-full z-0"
                style={{
                  backgroundImage: "url('neffexbg.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundAttachment: "fixed"
                }}
              />
              <div className="fixed inset-0 z-10 bg-gradient-to-t from-black via-black/60 to-black/80" />
              
              <div className="relative z-20">
                <TVShowDetails />
              </div>
            </div>
          </div>
        </ProtectedRoute>
      )
    },
    {
      path: "/neural-chat",
      element: (
        <ProtectedRoute>
          <div>
            <Header />
            <NeuralChat />
          </div>
        </ProtectedRoute>
      )
    },
    {
      path: "/vault",
      element: (
        <ProtectedRoute>
          <div>
            <Header />
            <div className="relative min-h-screen text-white">
              {/* NEXUS Background */}
              <div 
                className="fixed inset-0 w-full h-full z-0"
                style={{
                  backgroundImage: "url('redeye.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundAttachment: "fixed"
                }}
              />
              <div className="fixed inset-0 z-10 bg-gradient-to-t from-black via-black/60 to-black/80" />
              
              <div className="relative z-20">
                <Vault />
              </div>
            </div>
          </div>
        </ProtectedRoute>
      )
    },
    {
      path: "/my-list",
      element: <Navigate to="/vault" replace />
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <div className="min-h-screen bg-black">
            <Header />
            <Profile />
          </div>
        </ProtectedRoute>
      )
    },
    {
      path: "/account",
      element: (
        <ProtectedRoute>
          <div>
            <Header />
            <div className="relative min-h-screen text-white">
              {/* NEXUS Background */}
              <div 
                className="fixed inset-0 w-full h-full z-0"
                style={{
                  backgroundImage: "url('neffexbg.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundAttachment: "fixed"
                }}
              />
              <div className="fixed inset-0 z-10 bg-gradient-to-t from-black via-black/60 to-black/80" />
              
              <div className="relative z-20 pt-32 px-8">
                <h1 className="font-['JetBrains_Mono',monospace] text-4xl font-bold text-[#ef1a0fff] mb-8">
                  <span className="text-red-400">{'>'}</span> ACCOUNT MATRIX
                </h1>
                <p className="font-['JetBrains_Mono',monospace] text-gray-300 mb-8">
                  Manage your NEXUS system access and security protocols
                </p>
                <div className="max-w-6xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-black/60 backdrop-blur-sm border border-red-800/30 rounded-lg p-6">
                      <h3 className="font-['JetBrains_Mono',monospace] text-red-400 text-lg font-bold mb-4">
                        Security Protocol
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-gray-300">Two-Factor Auth</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-gray-300">Neural Encryption</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <span className="text-gray-300">Biometric Lock</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-black/60 backdrop-blur-sm border border-red-800/30 rounded-lg p-6">
                      <h3 className="font-['JetBrains_Mono',monospace] text-red-400 text-lg font-bold mb-4">
                        Subscription Status
                      </h3>
                      <div className="text-sm space-y-2">
                        <div className="text-green-400 font-mono">NEXUS PREMIUM</div>
                        <div className="text-gray-400">Quantum Access Enabled</div>
                        <div className="text-xs text-gray-500">Renewal: Auto-Sync</div>
                      </div>
                    </div>
                    <div className="bg-black/60 backdrop-blur-sm border border-red-800/30 rounded-lg p-6">
                      <h3 className="font-['JetBrains_Mono',monospace] text-red-400 text-lg font-bold mb-4">
                        Usage Statistics
                      </h3>
                      <div className="text-sm space-y-2">
                        <div className="text-gray-400">Neural Sessions: <span className="text-blue-400">247</span></div>
                        <div className="text-gray-400">Data Consumed: <span className="text-green-400">∞ TB</span></div>
                        <div className="text-gray-400">Matrix Uptime: <span className="text-red-400">99.9%</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ProtectedRoute>
      )
    },
    {
      path: "/error",
      element: (
        <div>
          <Header />
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-center">
              <h1 className="font-['JetBrains_Mono',monospace] text-4xl font-bold text-[#ef1a0fff] mb-4">Error</h1>
              <p className="font-['JetBrains_Mono',monospace] text-gray-300">Something went wrong. Please try again.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      path: "*",
      element: (
        <div>
          <Header />
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-center">
              <h1 className="font-['JetBrains_Mono',monospace] text-4xl font-bold text-[#ef1a0fff] mb-4">404 - Page Not Found</h1>
              <p className="font-['JetBrains_Mono',monospace] text-gray-300 mb-4">The page you're looking for doesn't exist in the matrix.</p>
              <button 
                onClick={() => {
                  try {
                    window.location.href = '/';
                  } catch (error) {
                    // Fallback navigation
                    window.history.pushState({}, '', '/');
                    window.location.reload();
                  }
                }}
                className="font-['JetBrains_Mono',monospace] bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Return to Base
              </button>
            </div>
          </div>
        </div>
      )
    },
  ]);

  // Authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(addUser({ 
          uid, 
          email, 
          displayName, 
          photoURL 
        }));
      } else {
        dispatch(removeUser());
      }
      // Set loading to false once Firebase has determined auth state
      setAuthLoading(false);
    });

    // Cleanup subscription on unmount to prevent memory leaks
    return () => unsubscribe();
  }, [dispatch]);

    return (
  <div className="flex flex-col min-h-screen">
    <div className="flex-grow">
      <RouterProvider router={appRouter} />
    </div>
    <Footer />
  </div>
);


};

export default Body;