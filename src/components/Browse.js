import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  fetchTrendingMoviesCached,
  fetchPopularMoviesCached,
  fetchTrendingTVShowsCached,
  fetchPopularTVShowsCached,
  fetchTopRatedMovies,
  fetchTopRatedTVShows,
  searchMovies,
  searchTVShows
} from '../utils/vidsrcApi';
import ContentCarousel from './ContentCarousel';
import VideoPlayer from './VideoPlayer';
import ContinueWatching from './ContinueWatching';

const Browse = () => {
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Content state
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedTV, setTopRatedTV] = useState([]);
  
  const [loading, setLoading] = useState(true);
  
  // Player state
  const [selectedContent, setSelectedContent] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isTV, setIsTV] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after component mounts
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Load initial content with simple caching
  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        // Load movies
        const [trendingMoviesData, popularMoviesData, topRatedMoviesData] = await Promise.all([
          fetchTrendingMoviesCached(),
          fetchPopularMoviesCached(),
          fetchTopRatedMovies()
        ]);
        
        setTrendingMovies(trendingMoviesData.results || []);
        setPopularMovies(popularMoviesData.results || []);
        setTopRatedMovies(topRatedMoviesData.results || []);
        
        // Load TV shows
        const [trendingTVData, popularTVData, topRatedTVData] = await Promise.all([
          fetchTrendingTVShowsCached(),
          fetchPopularTVShowsCached(),
          fetchTopRatedTVShows()
        ]);
        
        setTrendingTV(trendingTVData.results || []);
        setPopularTV(popularTVData.results || []);
        setTopRatedTV(topRatedTVData.results || []);
        
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadContent();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        const [movieResults, tvResults] = await Promise.all([
          searchMovies(searchQuery),
          searchTVShows(searchQuery)
        ]);
        
        const combinedResults = [
          ...(movieResults.results || []).map(item => ({ ...item, media_type: 'movie' })),
          ...(tvResults.results || []).map(item => ({ ...item, media_type: 'tv' }))
        ];
        
        setSearchResults(combinedResults);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleContentClick = (content, isTV = null) => {
    const contentIsTV = isTV !== null ? isTV : (content.media_type === 'tv' || content.first_air_date !== undefined);
    
    if (contentIsTV) {
      navigate(`/tv/${content.id}`, { state: { movie: content } });
    } else {
      navigate(`/movie/${content.id}`, { state: { movie: content } });
    }
  };

  // Add quick search functionality with Ctrl+G
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

  const closePlayer = () => {
    setShowPlayer(false);
    setSelectedContent(null);
    setIsTV(false);
  };

  const handleContentSelect = (content, contentIsTV) => {
    setSelectedContent(content);
    setIsTV(contentIsTV);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  if (showPlayer && selectedContent) {
    return (
      <VideoPlayer
        movie={selectedContent}
        isTV={isTV}
        season={selectedContent.startSeason || 1}
        episode={selectedContent.startEpisode || 1}
        onClose={closePlayer}
        onContentSelect={handleContentSelect}
      />
    );
  }

  return (
    <div className="relative min-h-screen text-nexus-text overflow-hidden bg-nexus-gradient">
      {/* Simplified Background Effect */}
      <div className="fixed inset-0 z-10 opacity-20">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-nexus-red/10 via-nexus-black to-nexus-black"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 20, 35, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 20, 35, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      {/* Dark Gradient Overlay for readability */}
      <div className="fixed inset-0 z-30 bg-gradient-to-t from-nexus-black via-nexus-black/85 to-nexus-black/95" />

      {/* Main Content */}
      <div className={`relative z-40 pt-20 sm:pt-24 md:pt-32 px-4 sm:px-6 md:px-8 transition-all duration-1000 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        {/* Hero Section with Search Bar */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="font-['Arvo',serif] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-nexus-text-light px-4">
            <span className="text-nexus-red">{'>'}</span> NEXUS STREAMING PLATFORM
          </h1>
          <p className="font-['Arvo',serif] text-base sm:text-lg md:text-xl text-nexus-text-dark mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Discover your next favorite movie or TV show.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search movies, series... (Ctrl+G)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-full bg-nexus-black/70 backdrop-blur-sm border-2 rounded-lg px-4 sm:px-6 py-3 sm:py-4 text-nexus-text-light font-['Arvo',serif] placeholder-nexus-text-dark focus:outline-none transition-all duration-300 text-sm sm:text-base ${
                  isSearchFocused ? 'border-nexus-red/60 bg-nexus-black/80' : 'border-nexus-red/30'
                }`}
                style={{
                  boxShadow: isSearchFocused ? "0 0 30px rgba(255, 20, 35, 0.2)" : "0 0 20px rgba(255, 20, 35, 0.1)"
                }}
              />
              <button 
                type="submit"
                className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-nexus-red hover:bg-nexus-red-light text-nexus-text-light p-2 rounded-lg transition-colors duration-200"
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-nexus-text-light border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-10 sm:right-14 top-1/2 transform -translate-y-1/2 text-nexus-text-dark hover:text-nexus-text-light transition-colors"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className={`relative z-40 px-4 sm:px-6 md:px-8 mb-6 sm:mb-8 transition-all duration-500 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <ContentCarousel
              title={`Search Results for "${searchQuery}"`}
              content={searchResults}
              onItemClick={handleContentClick}
              isTV={false}
              loading={isSearching}
            />
          </div>
        )}

        {/* Content Sections */}
        <div className={`relative z-40 px-4 sm:px-6 md:px-8 space-y-6 sm:space-y-8 transition-all duration-1000 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Continue Watching Section */}
          <div>
            <ContinueWatching onMovieClick={handleContentClick} />
          </div>
          
          {/* Trending Movies */}
          <div>
            <ContentCarousel
              title="TRENDING MOVIES"
              content={trendingMovies}
              onItemClick={handleContentClick}
              isTV={false}
              loading={loading}
            />
          </div>

          {/* Trending TV Shows */}
          <div>
            <ContentCarousel
              title="TRENDING TV SHOWS"
              content={trendingTV}
              onItemClick={handleContentClick}
              isTV={true}
              loading={loading}
            />
          </div>

          {/* Popular Movies */}
          <div>
            <ContentCarousel
              title="POPULAR MOVIES"
              content={popularMovies}
              onItemClick={handleContentClick}
              isTV={false}
              loading={loading}
            />
          </div>

          {/* Popular TV Shows */}
          <div>
            <ContentCarousel
              title="POPULAR TV SHOWS"
              content={popularTV}
              onItemClick={handleContentClick}
              isTV={true}
              loading={loading}
            />
          </div>

          {/* Top Rated Movies */}
          <div>
            <ContentCarousel
              title="TOP RATED MOVIES"
              content={topRatedMovies}
              onItemClick={handleContentClick}
              isTV={false}
              loading={loading}
            />
          </div>

          {/* Top Rated TV Shows */}
          <div>
            <ContentCarousel
              title="TOP RATED TV SHOWS"
              content={topRatedTV}
              onItemClick={handleContentClick}
              isTV={true}
              loading={loading}
            />
          </div>
        </div>

        {/* Footer with system status */}
        <div className="relative z-40 mt-12 sm:mt-16 md:mt-20 text-center pb-12 sm:pb-16 px-4 sm:px-6 md:px-8">
          <div className="font-['Arvo',serif] text-xs sm:text-sm text-nexus-text-dark space-y-2">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>SYSTEM STATUS: ONLINE</span>
              </div>
              <span className="hidden sm:inline text-green-400">●</span>
              <span className="hidden sm:inline">STREAMING: STABLE</span>
              <span className="hidden sm:inline text-nexus-red">●</span>
              <span className="hidden sm:inline">PLATFORM: SYNCHRONIZED</span>
            </div>
            <div className="text-xs text-nexus-grey">
              NEXUS v2.1.0 | Entertainment Platform Active | VidSrc Integration Enabled
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
