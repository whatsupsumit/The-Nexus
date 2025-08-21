import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { auth } from '../utils/firebase';

const Profile = () => {
  const user = useSelector(store => store.user);
  const [watchHistory, setWatchHistory] = useState([]);
  const [vaultItems, setVaultItems] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [stats, setStats] = useState({
    totalWatched: 0,
    totalVaultItems: 0,
    favoriteGenre: 'Action',
    totalWatchTime: '127h 42m'
  });

  useEffect(() => {
    // Load watch history
    const history = JSON.parse(localStorage.getItem('nexus_watch_history') || '[]');
    setWatchHistory(history.slice(-10).reverse());
    
    // Load vault items
    const vault = JSON.parse(localStorage.getItem('nexus_vault') || '[]');
    setVaultItems(vault.slice(-12).reverse());
    
    // Calculate stats
    setStats({
      totalWatched: history.length,
      totalVaultItems: vault.length,
      favoriteGenre: 'Action', // Could be calculated from history
      totalWatchTime: `${Math.floor(history.length * 2.1)}h ${Math.floor((history.length * 2.1 % 1) * 60)}m`
    });
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        localStorage.setItem('nexus_profile_image', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearWatchHistory = () => {
    localStorage.removeItem('nexus_watch_history');
    setWatchHistory([]);
    setStats(prev => ({ ...prev, totalWatched: 0 }));
  };

  const removeFromVault = (itemId, mediaType) => {
    const currentVault = JSON.parse(localStorage.getItem('nexus_vault') || '[]');
    const filteredVault = currentVault.filter(item => 
      !(item.id === itemId && item.media_type === mediaType)
    );
    localStorage.setItem('nexus_vault', JSON.stringify(filteredVault));
    setVaultItems(filteredVault.slice(-12).reverse());
    setStats(prev => ({ ...prev, totalVaultItems: filteredVault.length }));
  };

  useEffect(() => {
    const savedImage = localStorage.getItem('nexus_profile_image');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-purple-900/20"></div>
        <div className="absolute inset-0 opacity-20 animate-pulse">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff0000' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}>
          </div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => {
            const delay = Math.random() * 3;
            return (
              <div
                key={i}
                className="absolute w-1 h-1 bg-red-500/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `pulse 2s ease-in-out infinite`,
                  animationDelay: `${delay}s`
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-['Arvo',serif] text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-400 to-red-600 mb-3 sm:mb-4 animate-pulse">
            PROFILE
          </h1>
          <div className="flex items-center justify-center space-x-2 text-green-400 font-['Arvo',serif] text-xs sm:text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>STREAMING INTERFACE ACTIVE</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Left Side - User Profile (3 columns) */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-red-900/30 to-black/60 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-red-500/10">
              {/* Profile Header */}
              <div className="text-center mb-4 sm:mb-6">
                <div className="relative inline-block mb-3 sm:mb-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-600 to-purple-700 rounded-full p-1 shadow-2xl shadow-red-500/50">
                    <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <label htmlFor="profile-upload" className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-500 transition-all duration-300 border-2 border-black shadow-lg">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </label>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                
                <h3 className="font-['Arvo',serif] text-red-400 text-lg sm:text-xl font-bold mb-1">
                  {user?.displayName || user?.name || 'User'}
                </h3>
                <p className="font-['Arvo',serif] text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 truncate">
                  {user?.email || 'No email available'}
                </p>
                
                {/* User Status */}
                <div className="bg-black/40 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 border border-red-800/30">
                  <div className="flex items-center justify-between text-xs font-['Arvo',serif]">
                    <span className="text-gray-400">STATUS:</span>
                    <span className="text-green-400 flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                      ONLINE
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-['Arvo',serif] mt-1">
                    <span className="text-gray-400">PLAN:</span>
                    <span className="text-purple-400">PREMIUM</span>
                  </div>
                </div>
              </div>

              {/* User Stats */}
              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-['Arvo',serif] text-red-400 text-sm font-bold mb-2 sm:mb-3 border-b border-red-800/30 pb-1">
                  STATISTICS
                </h4>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-black/30 rounded-lg p-2 sm:p-3 border border-red-800/20">
                    <div className="text-xl sm:text-2xl font-bold text-red-400 font-['Arvo',serif]">{stats.totalWatched}</div>
                    <div className="text-xs text-gray-400 font-['Arvo',serif]">WATCHED</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-2 sm:p-3 border border-red-800/20">
                    <div className="text-xl sm:text-2xl font-bold text-purple-400 font-['Arvo',serif]">{stats.totalVaultItems}</div>
                    <div className="text-xs text-gray-400 font-['Arvo',serif]">SAVED</div>
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-2 sm:p-3 border border-red-800/20">
                  <div className="text-sm text-green-400 font-['Arvo',serif] mb-1">{stats.totalWatchTime}</div>
                  <div className="text-xs text-gray-400 font-['Arvo',serif]">TOTAL WATCH TIME</div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-2 sm:p-3 border border-red-800/20">
                  <div className="text-sm text-blue-400 font-['Arvo',serif] mb-1">{stats.favoriteGenre}</div>
                  <div className="text-xs text-gray-400 font-['Arvo',serif]">TOP GENRE</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 sm:mt-6 space-y-2">
                <button 
                  onClick={clearWatchHistory}
                  className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg p-2 text-red-400 font-['Arvo',serif] text-xs sm:text-sm transition-all duration-300 hover:scale-105"
                >
                  CLEAR HISTORY
                </button>
                <button 
                  onClick={() => auth.signOut()}
                  className="w-full bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 rounded-lg p-2 text-gray-400 font-['Arvo',serif] text-xs sm:text-sm transition-all duration-300 hover:scale-105"
                >
                  LOGOUT
                </button>
              </div>
            </div>
          </div>

          {/* Middle - Watch History (6 columns) */}
          <div className="lg:col-span-6 mt-6 lg:mt-0">
            <div className="bg-gradient-to-br from-blue-900/20 to-black/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-blue-500/10 h-full">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h4 className="font-['Arvo',serif] text-blue-400 text-lg sm:text-xl font-bold flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  WATCH HISTORY
                </h4>
                <span className="font-['Arvo',serif] text-blue-300 text-xs sm:text-sm bg-blue-900/20 px-2 py-1 rounded border border-blue-500/30">
                  {watchHistory.length} ITEMS
                </span>
              </div>

              <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-track-black/20 scrollbar-thumb-blue-500/30">
                {watchHistory.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">📺</div>
                    <div className="text-blue-400 font-['Arvo',serif] text-base sm:text-lg mb-2">NO DATA FOUND</div>
                    <div className="text-gray-400 text-xs sm:text-sm font-['Arvo',serif]">Start watching to see your history</div>
                  </div>
                ) : (
                  watchHistory.map((item, index) => (
                    <div key={index} className="bg-black/40 rounded-lg p-3 sm:p-4 border border-blue-800/20 hover:border-blue-500/40 transition-all duration-300 group hover:bg-black/60">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-12 h-18 sm:w-16 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 border border-blue-800/30">
                          <img 
                            src={item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : `https://via.placeholder.com/200x300/1a1a1a/3b82f6?text=${(item.title || item.name || 'Unknown').charAt(0)}`}
                            alt={item.title || item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-['Arvo',serif] text-white font-semibold text-xs sm:text-sm truncate">
                            {item.title || item.name}
                          </div>
                          <div className="font-['Arvo',serif] text-blue-400 text-xs mt-1">
                            {new Date(item.watchedAt).toLocaleDateString()} • {new Date(item.watchedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-gray-400 font-['Arvo',serif] mb-1">
                              <span>PROGRESS</span>
                              <span>{item.progress || 0}%</span>
                            </div>
                            <div className="w-full h-1.5 sm:h-2 bg-gray-700/50 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                                style={{width: `${item.progress || 0}%`}}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all duration-200 p-1 sm:p-2"
                          onClick={() => {
                            const history = JSON.parse(localStorage.getItem('nexus_watch_history') || '[]');
                            const filtered = history.filter((_, i) => i !== history.length - 1 - index);
                            localStorage.setItem('nexus_watch_history', JSON.stringify(filtered));
                            setWatchHistory(filtered.slice(-10).reverse());
                          }}
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Vault (3 columns) */}
          <div className="lg:col-span-3 mt-6 lg:mt-0">
            <div className="bg-gradient-to-br from-purple-900/30 to-black/60 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-purple-500/10 h-full">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h4 className="font-['Arvo',serif] text-purple-400 text-lg sm:text-xl font-bold flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  SAVED
                </h4>
                <span className="font-['Arvo',serif] text-purple-300 text-xs sm:text-sm bg-purple-900/20 px-2 py-1 rounded border border-purple-500/30">
                  {vaultItems.length}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 max-h-[400px] sm:max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-track-black/20 scrollbar-thumb-purple-500/30">
                {vaultItems.length === 0 ? (
                  <div className="col-span-2 text-center py-8 sm:py-12">
                    <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">🔒</div>
                    <div className="text-purple-400 font-['Arvo',serif] text-base sm:text-lg mb-2">SAVED EMPTY</div>
                    <div className="text-gray-400 text-xs sm:text-sm font-['Arvo',serif]">Add content to save for later</div>
                  </div>
                ) : (
                  vaultItems.map((item, index) => (
                    <div key={index} className="group relative">
                      <div className="aspect-[2/3] rounded-lg overflow-hidden border border-purple-800/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                        <img 
                          src={item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : `https://via.placeholder.com/300x450/1a1a1a/a855f7?text=${(item.title || item.name || 'Unknown').charAt(0)}`}
                          alt={item.title || item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2">
                            <div className="font-['Arvo',serif] text-white text-xs font-semibold truncate">
                              {item.title || item.name}
                            </div>
                            <div className="font-['Arvo',serif] text-purple-300 text-xs">
                              {(item.release_date || item.first_air_date || '').slice(0, 4)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Remove Button */}
                      <button 
                        className="absolute top-1 right-1 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-600/80 rounded-full flex items-center justify-center text-white hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
                        onClick={() => removeFromVault(item.id, item.media_type)}
                      >
                        <svg className="w-2 h-2 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
