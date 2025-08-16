import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  fetchTrendingMovies, 
  fetchTrendingTV, 
  fetchPopularMovies, 
  fetchPopularTV,
  fetchTopRatedMovies,
  fetchTopRatedTV,
  searchContent 
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

  // Load initial content
  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const [
          trendingMoviesData,
          trendingTVData,
          popularMoviesData,
          popularTVData,
          topRatedMoviesData,
          topRatedTVData
        ] = await Promise.all([
          fetchTrendingMovies(),
          fetchTrendingTV(),
          fetchPopularMovies(),
          fetchPopularTV(),
          fetchTopRatedMovies(),
          fetchTopRatedTV()
        ]);
        
        setTrendingMovies(trendingMoviesData);
        setTrendingTV(trendingTVData);
        setPopularMovies(popularMoviesData);
        setPopularTV(popularTVData);
        setTopRatedMovies(topRatedMoviesData);
        setTopRatedTV(topRatedTVData);
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
        const results = await searchContent(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleContentClick = (content, isTV = null, season = 1, episode = 1) => {
    // Navigate to details page instead of directly to player
    const contentIsTV = isTV !== null ? isTV : (content.media_type === 'tv' || content.first_air_date !== undefined);
    
    if (contentIsTV) {
      // For TV shows, navigate to TV details page
      navigate(`/tv/${content.id}`, { state: { movie: content } });
    } else {
      // For movies, navigate to movie details page
      navigate(`/movie/${content.id}`, { state: { movie: content } });
    }
    
    console.log('NEXUS: Navigating to details for:', content.title || content.name, contentIsTV ? 'TV' : 'Movie');
  };

  const closePlayer = () => {
    setShowPlayer(false);
    setSelectedContent(null);
    setIsTV(false);
  };

  const handleContentSelect = (content, contentIsTV) => {
    console.log('NEXUS: Switching to content:', content.title || content.name);
    setSelectedContent(content);
    setIsTV(contentIsTV);
    // Keep player open for seamless experience
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
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Simplified Quantum Grid Effect */}
      <div className="fixed inset-0 z-10 opacity-20">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-black to-black"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 69, 19, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 69, 19, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            animation: 'gridMove 30s linear infinite'
          }}
        />
      </div>

      {/* Reduced Floating Energy Orbs */}
      <div className="fixed inset-0 z-20 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute w-24 h-24 rounded-full opacity-10"
            style={{
              background: `radial-gradient(circle, rgba(139, 69, 19, 0.2) 0%, rgba(139, 69, 19, 0.05) 50%, transparent 70%)`,
              left: `${25 + i * 25}%`,
              top: `${20 + i * 20}%`,
              animation: `float ${12 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${i * 2}s`,
              filter: 'blur(2px)'
            }}
          />
        ))}
      </div>

      {/* Dark Gradient Overlay for readability */}
      <div className="fixed inset-0 z-30 bg-gradient-to-t from-black via-black/85 to-black/95" />

      {/* Main Content */}
      <div className={`relative z-40 pt-32 px-8 transition-all duration-1000 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        {/* Hero Section with Search Bar */}
        <div className="text-center mb-16">
          <h1 className="font-['JetBrains_Mono',monospace] text-3xl md:text-4xl font-bold mb-6 text-white">
            <span className="text-red-400">{'>'}</span> NEURAL ENTERTAINMENT XPERIENCE UNIFIED SYSTEM
          </h1>
          <p className="font-['JetBrains_Mono',monospace] text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Connected to the entertainment matrix. Your personalized reality awaits.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search movies, series, or enter the matrix..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-full bg-black/70 backdrop-blur-sm border-2 rounded-lg px-6 py-4 text-white font-['JetBrains_Mono',monospace] placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                  isSearchFocused ? 'border-red-500/60 bg-black/80' : 'border-red-800/30'
                }`}
                style={{
                  boxShadow: isSearchFocused ? "0 0 30px rgba(239, 26, 15, 0.2)" : "0 0 20px rgba(239, 26, 15, 0.1)"
                }}
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg transition-colors duration-200"
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </form>
            <div className="mt-2 font-['JetBrains_Mono',monospace] text-xs text-gray-500 flex items-center justify-center space-x-2">
              <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
              <span>AI-POWERED SEARCH ENGINE ACTIVE</span>
              {searchQuery && (
                <>
                  <span>|</span>
                  <span className="text-red-400">QUERY: "{searchQuery}"</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className={`relative z-40 px-8 mb-8 transition-all duration-500 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
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
        <div className={`relative z-40 px-8 space-y-8 transition-all duration-1000 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Continue Watching Section */}
          <div>
            <ContinueWatching onMovieClick={handleContentClick} />
          </div>
          
          {/* Trending Movies - Always visible */}
          <div className="opacity-100">
            <ContentCarousel
              title="QUANTUM TRENDING MOVIES"
              content={trendingMovies}
              onItemClick={handleContentClick}
              isTV={false}
              loading={loading}
            />
          </div>

          {/* Trending TV Shows - Always visible */}
          <div className="opacity-100">
            <ContentCarousel
              title="NEURAL TRENDING SERIES"
              content={trendingTV}
              onItemClick={handleContentClick}
              isTV={true}
              loading={loading}
            />
          </div>

          {/* Popular Movies */}
          <div>
            <ContentCarousel
              title="POPULAR QUANTUM MOVIES"
              content={popularMovies}
              onItemClick={handleContentClick}
              isTV={false}
              loading={loading}
            />
          </div>

          {/* Popular TV Shows */}
          <div>
            <ContentCarousel
              title="POPULAR NEURAL SERIES"
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
              title="TOP RATED SERIES"
              content={topRatedTV}
              onItemClick={handleContentClick}
              isTV={true}
              loading={loading}
            />
          </div>
        </div>

        {/* Footer with system status */}
        <div className="relative z-40 mt-20 text-center pb-16 px-8">
          <div className="font-['JetBrains_Mono',monospace] text-sm text-gray-500 space-y-2">
            <div className="flex justify-center items-center space-x-4">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>SYSTEM STATUS: ONLINE</span>
              <span className="text-green-400">●</span>
              <span>NEURAL LINK: STABLE</span>
              <span className="text-red-400">●</span>
              <span>MATRIX: SYNCHRONIZED</span>
            </div>
            <div className="text-xs text-gray-600">
              NEXUS v2.1.0 | Quantum Entertainment Protocol Active | VidSrc Integration Enabled
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;