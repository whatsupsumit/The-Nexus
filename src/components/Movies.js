import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPopularMovies, fetchTopRatedMovies, fetchTrendingMovies, searchContent } from '../utils/vidsrcApi';
import { detectDevice, mobileCache } from '../utils/mobileApiHelper';
import MovieCard from './MovieCard';
import VideoPlayer from './VideoPlayer';

const Movies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('popular');
  const [mobileStatus, setMobileStatus] = useState({ isMobile: false, connectionType: 'unknown', isOffline: false });

  // Initialize mobile detection and network monitoring
  useEffect(() => {
    const device = detectDevice();
    setMobileStatus({
      isMobile: device.isMobile,
      connectionType: device.connectionType,
      isOffline: !navigator.onLine
    });

    // Mobile-specific network listeners
    if (device.isMobile) {
      const handleOnline = () => {
        setMobileStatus(prev => ({ ...prev, isOffline: false }));
        console.log('📱 Mobile device came online, refreshing movie data...');
      };

      const handleOffline = () => {
        setMobileStatus(prev => ({ ...prev, isOffline: true }));
        console.log('📱 Mobile device went offline, using cached movie data...');
      };

      const handleConnectionChange = () => {
        if (navigator.connection) {
          setMobileStatus(prev => ({ 
            ...prev, 
            connectionType: navigator.connection.effectiveType 
          }));
          console.log('📱 Mobile connection changed to:', navigator.connection.effectiveType);
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
    const loadMovies = async () => {
      setLoading(true);
      try {
        let movieData = [];
        let response = {};
        
        // Mobile-optimized loading with enhanced error handling
        switch (currentFilter) {
          case 'trending':
            response = await fetchTrendingMovies();
            movieData = response.results || [];
            break;
          case 'top_rated':
            response = await fetchTopRatedMovies();
            movieData = response.results || [];
            break;
          default:
            response = await fetchPopularMovies();
            movieData = response.results || [];
        }

        // Show user feedback for mobile fallback data
        if (response.isMockData && mobileStatus.isMobile) {
          console.log('📱 Using offline movie content for mobile device');
        }
        
        setMovies(movieData);
        setFilteredMovies(movieData);

        // Cache data for mobile devices
        if (mobileStatus.isMobile && movieData.length > 0) {
          mobileCache.set(`movies_${currentFilter}`, movieData, 600000); // 10 minutes
        }
        
      } catch (error) {
        console.error('Error loading movies:', error);
        
        // Mobile fallback - try to use any cached data
        if (mobileStatus.isMobile) {
          const cachedData = mobileCache.get(`movies_${currentFilter}`);
          if (cachedData && cachedData.length > 0) {
            console.log('📱 Using emergency movie cache for mobile');
            setMovies(cachedData);
            setFilteredMovies(cachedData);
          } else {
            setMovies([]);
            setFilteredMovies([]);
          }
        } else {
          setMovies([]);
          setFilteredMovies([]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadMovies();
  }, [currentFilter, mobileStatus.isMobile]);

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
      setFilteredMovies(movies);
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await searchContent(query);
      // Ensure we only get movies from search results
      const movieResults = Array.isArray(searchResults) 
        ? searchResults.filter(item => item.media_type === 'movie')
        : [];
      setFilteredMovies(movieResults);
    } catch (error) {
      console.error('Search error:', error);
      setFilteredMovies([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie: movie } });
  };

  const closePlayer = () => {
    setShowPlayer(false);
    setSelectedMovie(null);
    // Navigate back to home page (Browse)
    navigate('/browse');
  };

  const filterButtons = [
    { key: 'trending', label: 'TRENDING', icon: '🔥', description: 'Hot movies dominating the charts' },
    { key: 'popular', label: 'POPULAR', icon: '⭐', description: 'Fan favorites across all time' },
    { key: 'top_rated', label: 'TOP RATED', icon: '👑', description: 'Highest rated cinematic masterpieces' }
  ];

  // Stats calculation - ensure filteredMovies is always an array
  const moviesArray = Array.isArray(filteredMovies) ? filteredMovies : [];
  const stats = {
    totalMovies: moviesArray.length,
    avgRating: moviesArray.length > 0 ? (moviesArray.reduce((sum, m) => sum + (m.vote_average || 0), 0) / moviesArray.length).toFixed(1) : 0,
    recentReleases: moviesArray.filter(m => {
      const releaseYear = new Date(m.release_date).getFullYear();
      return releaseYear >= new Date().getFullYear() - 1;
    }).length,
    blockbusters: moviesArray.filter(m => m.popularity > 100).length
  };

  if (showPlayer && selectedMovie) {
    return (
      <VideoPlayer
        movie={selectedMovie}
        isTV={false}
        onClose={closePlayer}
      />
    );
  }

  return (
    <div className="min-h-screen text-white pt-24 bg-gradient-to-br from-red-900/20 via-black to-orange-900/20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-orange-500/5 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-yellow-500/5 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Header Section */}
      <div className="relative px-8 mb-8">
        <div className="flex items-center mb-6">
          <div className="text-6xl mr-4">🎬</div>
          <div>
            <h1 className="font-['JetBrains_Mono',monospace] text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
              QUANTUM MOVIES
            </h1>
            <p className="font-['JetBrains_Mono',monospace] text-gray-300 text-lg">
              Cinematic universe at your fingertips • Stream beyond reality
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mb-8">
          {/* Mobile Status Indicator */}
          {mobileStatus.isMobile && (
            <div className="mb-4 p-3 bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-lg">
              <div className="flex items-center justify-between text-sm font-['JetBrains_Mono',monospace]">
                <div className="flex items-center space-x-2">
                  <span className="text-orange-400">📱</span>
                  <span className="text-gray-300">Mobile Mode</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${mobileStatus.isOffline ? 'bg-red-400' : 'bg-green-400'}`}></div>
                    <span className={mobileStatus.isOffline ? 'text-red-400' : 'text-green-400'}>
                      {mobileStatus.isOffline ? 'Offline' : 'Online'}
                    </span>
                  </div>
                  {!mobileStatus.isOffline && (
                    <span className="text-blue-400">{mobileStatus.connectionType}</span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="relative group">
            <input
              type="text"
              placeholder="Search the infinite movie multiverse... (Ctrl+G)"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-black/50 backdrop-blur-sm border-2 border-red-800/30 rounded-xl px-6 py-4 text-white font-['JetBrains_Mono',monospace] placeholder-gray-400 focus:outline-none focus:border-red-500/60 focus:bg-black/70 transition-all duration-300 group-hover:border-red-500/40"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              {isSearching ? (
                <div className="w-6 h-6 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              onClick={() => {
                setCurrentFilter(filter.key);
                setSearchQuery('');
              }}
              className={`group relative font-['JetBrains_Mono',monospace] p-4 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                currentFilter === filter.key
                  ? 'bg-gradient-to-r from-red-600/20 to-orange-600/20 border-red-500 text-white shadow-lg shadow-red-500/25'
                  : 'bg-black/30 border-red-800/30 text-gray-300 hover:border-red-500/60 hover:bg-black/50 hover:text-white'
              }`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl mr-2">{filter.icon}</span>
                  <span className="font-bold text-lg">{filter.label}</span>
                </div>
                <p className="text-sm opacity-80">{filter.description}</p>
              </div>
              {currentFilter === filter.key && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/40 backdrop-blur-sm border border-red-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{stats.totalMovies}</div>
            <div className="text-sm text-gray-400">Total Movies</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-orange-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{stats.avgRating}</div>
            <div className="text-sm text-gray-400">Avg Rating</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-yellow-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.recentReleases}</div>
            <div className="text-sm text-gray-400">Recent</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-green-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.blockbusters}</div>
            <div className="text-sm text-gray-400">Blockbusters</div>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="px-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : moviesArray.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {moviesArray.map((movie, index) => (
              <div key={movie.id} className="transition-all duration-300 hover:scale-105">
                <MovieCard
                  movie={movie}
                  onClick={handleMovieClick}
                  isTV={false}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="font-['JetBrains_Mono',monospace] text-xl text-red-400 mb-2">
              No Movies Found
            </h3>
            <p className="font-['JetBrains_Mono',monospace] text-gray-400">
              {searchQuery ? `No results for "${searchQuery}"` : 'Unable to load movies from the quantum database'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-16 px-8 pb-8">
        <div className="bg-black/30 backdrop-blur-sm border border-red-800/30 rounded-xl p-6">
          <div className="text-center">
            <h3 className="font-['JetBrains_Mono',monospace] text-xl font-bold text-red-400 mb-2">
              QUANTUM MOVIE STATS
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-gray-300">
                <span className="text-red-400 font-bold">{stats.totalMovies}</span> Movies Available
              </div>
              <div className="text-gray-300">
                <span className="text-orange-400 font-bold">{stats.avgRating}</span> Average Rating
              </div>
              <div className="text-gray-300">
                <span className="text-yellow-400 font-bold">{stats.recentReleases}</span> Recent Releases
              </div>
              <div className="text-gray-300">
                <span className="text-green-400 font-bold">{stats.blockbusters}</span> Blockbusters
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-4 font-['JetBrains_Mono',monospace]">
              Streaming through quantum technology • Powered by NEXUS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movies;
