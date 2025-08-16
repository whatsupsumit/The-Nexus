import React, { useEffect } from 'react';
import Login from './Login';
import Browse from './Browse';
import Movies from './Movies';
import TVShows from './TVShows';
import MovieDetails from './MovieDetails';
import TVShowDetails from './TVShowDetails';
import Vault from './Vault';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../utils/firebase';
import { addUser, removeUser } from '../utils/userSlice';
import ProtectedRoute from './ProtectedRoute';
import Header from './header';

const Body = () => {
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
            <div className="relative min-h-screen text-white">
              {/* NEXUS Background */}
              <div 
                className="fixed inset-0 w-full h-full z-0"
                style={{
                  backgroundImage: "url('astro.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundAttachment: "fixed"
                }}
              />
              <div className="fixed inset-0 z-10 bg-gradient-to-t from-black via-black/60 to-black/80" />
              
              <div className="relative z-20 pt-32 px-8">
                <div className="max-w-4xl mx-auto">
                  <h1 className="font-['JetBrains_Mono',monospace] text-4xl font-bold text-cyan-400 mb-8 text-center">
                    NEURAL AI INTERFACE
                  </h1>
                  <div className="bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-lg p-8 text-center">
                    <div className="text-6xl mb-6">🤖</div>
                    <h2 className="font-['JetBrains_Mono',monospace] text-2xl text-white mb-4">
                      AI CHAT COMING SOON
                    </h2>
                    <p className="font-['JetBrains_Mono',monospace] text-gray-400 mb-6">
                      Neural AI interface is being calibrated. Stay tuned for intelligent movie recommendations and entertainment assistance.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
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
              
              <div className="relative z-20 pt-32 px-8 pb-20">
                {/* Profile Header */}
                <div className="text-center mb-12">
                  <h1 className="font-['JetBrains_Mono',monospace] text-4xl font-bold text-red-400 mb-4">
                    <span className="text-red-400">{'>'}</span> NEXUS PROFILE
                  </h1>
                  <p className="font-['JetBrains_Mono',monospace] text-gray-300">
                    Manage your entertainment profile and history
                  </p>
                </div>

                <div className="max-w-6xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Profile Avatar Section */}
                    <div className="lg:col-span-1">
                      <div className="bg-black/80 backdrop-blur-lg border border-red-800/40 rounded-2xl p-8 text-center">
                        {/* Avatar Display/Upload */}
                        <div className="relative inline-block mb-6">
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            id="avatar-upload"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  const img = document.getElementById('profile-avatar');
                                  const defaultAvatar = document.getElementById('default-avatar');
                                  if (img && defaultAvatar) {
                                    img.src = e.target.result;
                                    img.style.display = 'block';
                                    defaultAvatar.style.display = 'none';
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <label htmlFor="avatar-upload" className="cursor-pointer">
                            <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center border-4 border-red-400/50 shadow-2xl shadow-red-500/30 hover:scale-105 transition-transform duration-300 overflow-hidden">
                              <img 
                                id="profile-avatar"
                                className="w-full h-full object-cover rounded-full hidden"
                                alt="Profile"
                              />
                              <svg id="default-avatar" className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          </label>
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center border-2 border-black cursor-pointer hover:bg-red-500 transition-colors"
                               onClick={() => document.getElementById('avatar-upload').click()}>
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                        </div>
                        
                        <h3 className="font-['JetBrains_Mono',monospace] text-red-400 text-xl font-bold mb-2">
                          USER PROFILE
                        </h3>
                        <div className="text-sm text-gray-400 font-mono mb-4">
                          <div>STATUS: <span className="text-green-400">Active</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Watch History & Vault */}
                    <div className="lg:col-span-2 space-y-8">
                      
                      {/* Watch History */}
                      <div className="bg-black/80 backdrop-blur-lg border border-red-800/40 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="font-['JetBrains_Mono',monospace] text-red-400 text-lg font-bold">
                            WATCH HISTORY
                          </h4>
                          <button 
                            className="font-['JetBrains_Mono',monospace] text-gray-400 hover:text-red-400 text-sm transition-colors"
                            onClick={() => {
                              localStorage.removeItem('nexus_watch_history');
                              window.location.reload();
                            }}
                          >
                            Clear All
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          {(() => {
                            const watchHistory = JSON.parse(localStorage.getItem('nexus_watch_history') || '[]');
                            if (watchHistory.length === 0) {
                              return (
                                <div className="text-center py-8">
                                  <div className="text-gray-400 font-['JetBrains_Mono',monospace]">No watch history yet</div>
                                  <div className="text-gray-500 text-sm mt-2">Start watching content to see your history here</div>
                                </div>
                              );
                            }
                            return watchHistory.slice(-10).reverse().map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-red-800/20 hover:border-red-600/40 transition-all duration-300 group">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-16 rounded overflow-hidden">
                                    <img 
                                      src={item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : `https://via.placeholder.com/200x300/1a1a1a/ffffff?text=${(item.title || item.name || 'Unknown').charAt(0)}`}
                                      alt={item.title || item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="font-['JetBrains_Mono',monospace]">
                                    <div className="text-white font-semibold">{item.title || item.name}</div>
                                    <div className="text-gray-400 text-xs">{new Date(item.watchedAt).toLocaleDateString()}</div>
                                    <div className="w-32 h-1 bg-gray-700 rounded-full mt-1">
                                      <div className="h-full bg-red-500 rounded-full" style={{width: `${item.progress || 0}%`}}></div>
                                    </div>
                                  </div>
                                </div>
                                <button 
                                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all duration-200"
                                  onClick={() => {
                                    const history = JSON.parse(localStorage.getItem('nexus_watch_history') || '[]');
                                    const filtered = history.filter((_, i) => i !== history.length - 1 - index);
                                    localStorage.setItem('nexus_watch_history', JSON.stringify(filtered));
                                    window.location.reload();
                                  }}
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>

                      {/* Vault Section */}
                      <div className="bg-black/80 backdrop-blur-lg border border-red-800/40 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="font-['JetBrains_Mono',monospace] text-red-400 text-lg font-bold">
                            VAULT COLLECTION
                          </h4>
                          <span className="font-['JetBrains_Mono',monospace] text-gray-400 text-sm">
                            {JSON.parse(localStorage.getItem('nexus_vault') || '[]').length} Items
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {(() => {
                            const vault = JSON.parse(localStorage.getItem('nexus_vault') || '[]');
                            if (vault.length === 0) {
                              return (
                                <div className="col-span-full text-center py-8">
                                  <div className="text-gray-400 font-['JetBrains_Mono',monospace]">No items in vault yet</div>
                                  <div className="text-gray-500 text-sm mt-2">Add movies and shows to your vault to see them here</div>
                                </div>
                              );
                            }
                            return vault.slice(-8).reverse().map((item, index) => (
                              <div key={index} className="group relative">
                                <div className="aspect-[2/3] rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 border border-red-800/20 hover:border-red-500/40">
                                  <img 
                                    src={item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${(item.title || item.name || 'Unknown').charAt(0)}`}
                                    alt={item.title || item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-500"
                                    onClick={() => {
                                      const currentVault = JSON.parse(localStorage.getItem('nexus_vault') || '[]');
                                      const filteredVault = currentVault.filter(vaultItem => 
                                        !(vaultItem.id === item.id && vaultItem.media_type === item.media_type)
                                      );
                                      localStorage.setItem('nexus_vault', JSON.stringify(filteredVault));
                                      window.location.reload();
                                    }}
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                                <div className="mt-2 text-center">
                                  <div className="font-['JetBrains_Mono',monospace] text-white text-xs truncate">{item.title || item.name}</div>
                                  <div className="font-['JetBrains_Mono',monospace] text-gray-400 text-xs">
                                    {item.media_type === 'anime' ? 'Anime' : (item.release_date || item.first_air_date || '').slice(0, 4)}
                                  </div>
                                </div>
                              </div>
                            ));
                          })()}
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
                onClick={() => window.location.href = '/'}
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
    });

    // Cleanup subscription on unmount to prevent memory leaks
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;