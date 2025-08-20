import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPopularMovies, fetchTopRatedMovies, fetchTrendingMovies, searchContent } from '../utils/vidsrcApi';
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

  useEffect(() => {
    console.log('NEXUS: TMDB API Key available:', !!process.env.REACT_APP_TMDB_API_KEY);
    const loadMovies = async () => {
      setLoading(true);
      try {
        let movieData = [];
        switch (currentFilter) {
          case 'trending':
            movieData = await fetchTrendingMovies();
            break;
          case 'top_rated':
            movieData = await fetchTopRatedMovies();
            break;
          default:
            movieData = await fetchPopularMovies();
        }
        console.log('NEXUS: Loaded movies:', movieData?.length || 0);
        setMovies(movieData);
        setFilteredMovies(movieData);
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMovies();
  }, [currentFilter]);

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
      const searchResults = await searchContent(query, 'movie');
      setFilteredMovies(searchResults);
    } catch (error) {
      console.error('Search error:', error);
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
    { key: 'popular', label: 'POPULAR' },
    { key: 'trending', label: 'TRENDING' },
    { key: 'top_rated', label: 'TOP RATED' }
  ];

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
    <div className="min-h-screen text-white pt-24">
      {/* Header Section */}
      <div className="px-8 mb-8">
        <h1 className="font-['JetBrains_Mono',monospace] text-4xl font-bold text-[#ef1a0fff] mb-4">
          <span className="text-red-400">{'>'}</span> QUANTUM MOVIES
        </h1>
        <p className="font-['JetBrains_Mono',monospace] text-gray-300 mb-6">
          Access the latest blockbusters through quantum streaming technology
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search quantum movie database... (Ctrl+G)"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-black/70 backdrop-blur-sm border-2 border-red-800/30 rounded-lg px-6 py-3 text-white font-['JetBrains_Mono',monospace] placeholder-gray-400 focus:outline-none focus:border-red-500/60 transition-all duration-300"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-4 mb-8">
          {filterButtons.map((filter) => (
            <button
              key={filter.key}
              onClick={() => {
                setCurrentFilter(filter.key);
                setSearchQuery('');
              }}
              className={`font-['JetBrains_Mono',monospace] px-6 py-2 rounded-lg border transition-all duration-300 ${
                currentFilter === filter.key
                  ? 'bg-red-600 border-red-500 text-white'
                  : 'bg-transparent border-red-800/30 text-gray-300 hover:border-red-500/60 hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
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
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredMovies.map((movie, index) => (
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

      {/* Stats Footer */}
      <div className="px-8 mt-16 pb-8 text-center">
        <div className="font-['JetBrains_Mono',monospace] text-sm text-gray-500">
          <div className="flex justify-center items-center space-x-4 mb-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>{filteredMovies.length} movies loaded</span>
            <span className="text-red-400">●</span>
            <span>QUANTUM DATABASE ACTIVE</span>
          </div>
          <div className="text-xs text-gray-600">
            Filter: {filterButtons.find(f => f.key === currentFilter)?.label} | VidLink Streaming Protocol v2.1.0 | Neural Entertainment Matrix Active
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movies;
