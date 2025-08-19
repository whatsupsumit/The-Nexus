import React, { useEffect } from 'react';
import Login from './Login';
import MovieDetails from './MovieDetails';
import TVShowDetails from './TVShowDetails';
import Vault from './Vault';
import Profile from './Profile';
// Import enhanced components
import EnhancedBrowse from './EnhancedBrowse';
import EnhancedMovies from './EnhancedMovies';
import EnhancedTVShows from './EnhancedTVShows';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../utils/firebase';
import { addUser, removeUser } from '../utils/userSlice';
import ProtectedRoute from './ProtectedRoute';
import Header from './header';

const EnhancedBody = () => {
  const dispatch = useDispatch();
  const user = useSelector(store => store.user.name);

  // Component to handle root path logic
  const RootHandler = () => {
    if (user) {
      // If user is authenticated, redirect to browse
      return <Navigate to="/browse" replace />;
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
            <EnhancedBrowse />
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
            <EnhancedMovies />
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
            <EnhancedTVShows />
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
              
              <div className="relative z-20">
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-6">⚙️</div>
                    <h1 className="text-4xl font-bold text-red-400 mb-4">Account Settings</h1>
                    <p className="text-gray-300 mb-8 max-w-md">
                      Neural interface account management coming soon. Advanced user settings and preferences will be available here.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-100"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                        </div>
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
      path: "/neural-chat",
      element: (
        <ProtectedRoute>
          <div>
            <Header />
            <div className="relative min-h-screen text-white">
              {/* NEXUS Background */}
              <div 
                className="fixed inset-0 w-full h-full z-0"
                style={{
                  backgroundImage: "url('nexusbg.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundAttachment: "fixed"
                }}
              />
              <div className="fixed inset-0 z-10 bg-gradient-to-t from-black via-black/60 to-black/80" />
              
              <div className="relative z-20">
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-6">🤖</div>
                    <h1 className="text-4xl font-bold text-cyan-400 mb-4">Neural Chat Interface</h1>
                    <p className="text-gray-300 mb-8 max-w-md">
                      Advanced AI conversation system is currently in development. Neural chat capabilities coming soon.
                    </p>
                    <div className="space-y-4">
                      <div className="text-gray-400">Status: Initializing Neural Network...</div>
                      <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                          <span>Neural Matrix:</span>
                          <div className="text-cyan-400">Active</div>
                        </div>
                        <div className="text-gray-500">●</div>
                        <div className="flex items-center space-x-2">
                          <span>AI Status:</span>
                          <div className="text-yellow-400">Standby</div>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
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
              <h1 className="text-4xl font-bold text-red-400 mb-4">Error</h1>
              <p className="text-gray-300">Something went wrong. Please try again.</p>
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
              <div className="text-6xl mb-6">🚫</div>
              <h1 className="text-4xl font-bold text-red-400 mb-4">404 - Page Not Found</h1>
              <p className="text-gray-300 mb-8">The requested neural pathway could not be located.</p>
              <button 
                onClick={() => window.location.href = '/browse'}
                className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Return to Base
              </button>
            </div>
          </div>
        </div>
      )
    }
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(addUser({
          uid: uid,
          email: email,
          displayName: displayName,
          photoURL: photoURL
        }));
      } else {
        dispatch(removeUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default EnhancedBody;
