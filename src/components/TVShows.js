import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPopularTV, fetchTopRatedTV, fetchTrendingTV, searchContent } from '../utils/vidsrcApi';
import { detectDevice, mobileCache } from '../utils/mobileApiHelper';
import MovieCard from './MovieCard';
import VideoPlayer from './VideoPlayer';

const TVShows = () => {
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShow, setSelectedShow] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('popular');
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [mobileStatus, setMobileStatus] = useState({ isMobile: false, connectionType: 'unknown', isOffline: false });

  // Initialize mobile detection and network monitoring
  useEffect(() => {
    const device = detectDevice();
    setMobileStatus({
      isMobile: device.isMobile,
      connectionType: device.connectionType,
      isOffline: !navigator.onLine
    });

    // Mobile-specific network listeners for TV shows
    if (device.isMobile) {
      const handleOnline = () => {
        setMobileStatus(prev => ({ ...prev, isOffline: false }));
        console.log('📱 Mobile device came online, refreshing TV show data...');
      };

      const handleOffline = () => {
        setMobileStatus(prev => ({ ...prev, isOffline: true }));
        console.log('📱 Mobile device went offline, using cached TV show data...');
      };

      const handleConnectionChange = () => {
        if (navigator.connection) {
          setMobileStatus(prev => ({ 
            ...prev, 
            connectionType: navigator.connection.effectiveType 
          }));
          console.log('📱 Mobile TV connection changed to:', navigator.connection.effectiveType);
        }
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      if (navigator.connection) {
        navigator.connection.addEventListener('change', handleConnectionChange);
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        if (navigator.connection) {
          navigator.connection.removeEventListener('change', handleConnectionChange);
        }
      };
    }
  }, []);

  useEffect(() => {
    const loadShows = async () => {
      setLoading(true);
      try {
        let showData = [];
        let response = {};
        
        // Mobile-optimized loading with enhanced error handling for TV shows
        switch (activeFilter) {
          case 'trending':
            response = await fetchTrendingTV();
            showData = response.results || [];
            break;
          case 'top_rated':
            response = await fetchTopRatedTV();
            showData = response.results || [];
            break;
          default:
            response = await fetchPopularTV();
            showData = response.results || [];
        }

        // Show user feedback for mobile fallback data
        if (response.isMockData && mobileStatus.isMobile) {
          console.log('📱 Using offline TV show content for mobile device');
        }
        
        setShows(showData);
        setFilteredShows(showData);

        // Cache data for mobile devices
        if (mobileStatus.isMobile && showData.length > 0) {
          mobileCache.set(`tvshows_${activeFilter}`, showData, 600000); // 10 minutes
        }
        
      } catch (error) {
        console.error('Error loading TV shows:', error);
        
        // Mobile fallback - try to use any cached data
        if (mobileStatus.isMobile) {
          const cachedData = mobileCache.get(`tvshows_${activeFilter}`);
          if (cachedData && cachedData.length > 0) {
            console.log('📱 Using emergency TV show cache for mobile');
            setShows(cachedData);
            setFilteredShows(cachedData);
          } else {
            setShows([]);
            setFilteredShows([]);
          }
        } else {
          setShows([]);
          setFilteredShows([]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadShows();
  }, [activeFilter, mobileStatus.isMobile]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        document.querySelector('input[type="text"]')?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredShows(shows);
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await searchContent(query);
      // Ensure we only get TV shows from search results
      const tvResults = Array.isArray(searchResults) 
        ? searchResults.filter(item => item.media_type === 'tv')
        : [];
      setFilteredShows(tvResults);
    } catch (error) {
      console.error('Search error:', error);
      setFilteredShows([]);
    } finally {
      setIsSearching(false);
    }
  };

  const filterButtons = [
    { key: 'trending', label: 'TRENDING', icon: '🔥', description: 'Hottest shows capturing audiences' },
    { key: 'popular', label: 'POPULAR', icon: '⭐', description: 'Fan-favorite series of all time' },
    { key: 'top_rated', label: 'TOP RATED', icon: '👑', description: 'Critically acclaimed masterpieces' }
  ];

  // Stats calculation
  const showsArray = Array.isArray(filteredShows) ? filteredShows : [];
  const stats = {
    totalShows: showsArray.length,
    avgRating: showsArray.length > 0 ? (showsArray.reduce((sum, s) => sum + (s.vote_average || 0), 0) / showsArray.length).toFixed(1) : 0,
    recentShows: showsArray.filter(s => {
      const firstAirYear = new Date(s.first_air_date).getFullYear();
      return firstAirYear >= new Date().getFullYear() - 1;
    }).length,
    longRunning: showsArray.filter(s => (s.number_of_seasons || 0) > 5).length
  };

  const closePlayer = () => {
    setShowPlayer(false);
    setSelectedShow(null);
    setSelectedSeason(1);
    setSelectedEpisode(1);
    // Navigate back to home page (Browse)
    navigate('/browse');
  };

  const handleShowClick = (show) => {
    navigate(`/tv/${show.id}`, { state: { tvShow: show } });
  };

  if (showPlayer && selectedShow) {
    return (
      <VideoPlayer
        movie={selectedShow}
        isTV={true}
        season={selectedSeason}
        episode={selectedEpisode}
        onClose={closePlayer}
      />
    );
  }

  return (
    <div className="min-h-screen text-white pt-24 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500/5 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-cyan-500/5 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Header Section */}
      <div className="relative px-8 mb-8">
        <div className="flex items-center mb-6">
          <div className="text-6xl mr-4">📺</div>
          <div>
            <h1 className="font-['JetBrains_Mono',monospace] text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              NEURAL SERIES
            </h1>
            <p className="font-['JetBrains_Mono',monospace] text-gray-300 text-lg">
              Direct neural link to infinite series • Stream beyond dimensions
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mb-8">
          {/* Mobile Status Indicator for TV Shows */}
          {mobileStatus.isMobile && (
            <div className="mb-4 p-3 bg-black/40 backdrop-blur-sm border border-blue-500/30 rounded-lg">
              <div className="flex items-center justify-between text-sm font-['JetBrains_Mono',monospace]">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400">📱</span>
                  <span className="text-gray-300">Mobile TV Mode</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${mobileStatus.isOffline ? 'bg-red-400' : 'bg-green-400'}`}></div>
                    <span className={mobileStatus.isOffline ? 'text-red-400' : 'text-green-400'}>
                      {mobileStatus.isOffline ? 'Offline' : 'Online'}
                    </span>
                  </div>
                  {!mobileStatus.isOffline && (
                    <span className="text-purple-400">{mobileStatus.connectionType}</span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="relative group">
            <input
              type="text"
              placeholder="Search the infinite series multiverse... (Ctrl+G)"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-black/50 backdrop-blur-sm border-2 border-blue-800/30 rounded-xl px-6 py-4 text-white font-['JetBrains_Mono',monospace] placeholder-gray-400 focus:outline-none focus:border-blue-500/60 focus:bg-black/70 transition-all duration-300 group-hover:border-blue-500/40"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              {isSearching ? (
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <div className="text-xs text-gray-500 hidden md:block">⌘G</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {filterButtons.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`group relative font-['JetBrains_Mono',monospace] p-4 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                activeFilter === filter.key
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-black/30 border-blue-800/30 text-gray-300 hover:border-blue-500/60 hover:bg-black/50 hover:text-white'
              }`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl mr-2">{filter.icon}</span>
                  <span className="font-bold text-lg">{filter.label}</span>
                </div>
                <p className="text-sm opacity-80">{filter.description}</p>
              </div>
              {activeFilter === filter.key && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/40 backdrop-blur-sm border border-blue-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.totalShows}</div>
            <div className="text-sm text-gray-400">Total Shows</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-purple-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.avgRating}</div>
            <div className="text-sm text-gray-400">Avg Rating</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-cyan-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">{stats.recentShows}</div>
            <div className="text-sm text-gray-400">Recent</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-green-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.longRunning}</div>
            <div className="text-sm text-gray-400">Long Running</div>
          </div>
        </div>
      </div>

      {/* TV Shows Grid */}
      <div className="px-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : showsArray.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {showsArray.map((show, index) => (
              <div key={show.id} className="transition-all duration-300 hover:scale-105">
                <MovieCard
                  movie={show}
                  onClick={handleShowClick}
                  isTV={true}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="font-['JetBrains_Mono',monospace] text-xl text-blue-400 mb-2">
              No TV Shows Found
            </h3>
            <p className="font-['JetBrains_Mono',monospace] text-gray-400">
              {searchQuery ? `No results for "${searchQuery}"` : 'Unable to load shows from the neural database'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-16 px-8 pb-8">
        <div className="bg-black/30 backdrop-blur-sm border border-blue-800/30 rounded-xl p-6">
          <div className="text-center">
            <h3 className="font-['JetBrains_Mono',monospace] text-xl font-bold text-blue-400 mb-2">
              NEURAL SERIES STATS
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-gray-300">
                <span className="text-blue-400 font-bold">{stats.totalShows}</span> Shows Available
              </div>
              <div className="text-gray-300">
                <span className="text-purple-400 font-bold">{stats.avgRating}</span> Average Rating
              </div>
              <div className="text-gray-300">
                <span className="text-cyan-400 font-bold">{stats.recentShows}</span> Recent Shows
              </div>
              <div className="text-gray-300">
                <span className="text-green-400 font-bold">{stats.longRunning}</span> Long Running
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-4 font-['JetBrains_Mono',monospace]">
              Neural streaming technology • Powered by NEXUS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVShows;
