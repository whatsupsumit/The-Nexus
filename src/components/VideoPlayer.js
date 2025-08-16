import React, { useEffect, useRef, useState } from 'react';
import { getMovieEmbedUrl, getTVEmbedUrl, setupPlayerEventListener, initializeWatchProgress, getWatchProgress, getMovieRecommendations, fetchTrendingMovies, fetchTrendingTV } from '../utils/vidsrcApi';

// Watch history tracking function
const addToWatchHistory = (movie, isTV = false) => {
  try {
    const watchHistory = JSON.parse(localStorage.getItem('nexus_watch_history') || '[]');
    
    // Check if this item is already in recent history (last 5 items)
    const recentHistory = watchHistory.slice(-5);
    const isRecent = recentHistory.some(item => 
      item.id === movie.id && 
      item.media_type === (isTV ? 'tv' : 'movie')
    );
    
    if (!isRecent) {
      const historyItem = {
        ...movie,
        media_type: isTV ? 'tv' : 'movie',
        watchedAt: new Date().toISOString(),
        progress: 0
      };
      
      // Add to history and keep only last 50 items
      watchHistory.push(historyItem);
      const limitedHistory = watchHistory.slice(-50);
      
      localStorage.setItem('nexus_watch_history', JSON.stringify(limitedHistory));
      console.log('NEXUS: Added to watch history:', movie.title || movie.name);
    }
  } catch (error) {
    console.error('NEXUS: Error adding to watch history:', error);
  }
};

const VideoPlayer = ({ movie, isTV = false, season = 1, episode = 1, onClose, onContentSelect }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showBackButton, setShowBackButton] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [currentEmbedUrl, setCurrentEmbedUrl] = useState('');
  const [watchProgress, setWatchProgress] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [trendingContent, setTrendingContent] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const iframeRef = useRef(null);

  // Initialize watch progress system
  useEffect(() => {
    initializeWatchProgress();
    
    // Check for existing progress
    const progress = getWatchProgress();
    const movieProgress = progress[movie.id];
    if (movieProgress) {
      setWatchProgress(movieProgress);
      console.log('NEXUS: Found existing progress for', movie.title || movie.name);
    }
  }, [movie.id, movie.title, movie.name]);

  // Load recommendations
  useEffect(() => {
    const loadRecommendations = async () => {
      setLoadingRecommendations(true);
      try {
        let recommendedContent = [];
        
        if (!isTV) {
          // Get movie recommendations
          const movieRecs = await getMovieRecommendations(movie.id);
          recommendedContent = movieRecs?.results?.slice(0, 10) || [];
        }
        
        // If we don't have enough recommendations, add trending content
        if (recommendedContent.length < 8) {
          const trendingMovies = await fetchTrendingMovies();
          const trendingTV = await fetchTrendingTV();
          const allTrending = [...(trendingMovies || []), ...(trendingTV || [])]
            .filter(item => item.id !== movie.id)
            .slice(0, 15);
          
          setTrendingContent(allTrending);
          recommendedContent = [...recommendedContent, ...allTrending].slice(0, 15);
        }
        
        setRecommendations(recommendedContent);
      } catch (error) {
        console.error('Error loading recommendations:', error);
        // Fallback to trending content
        try {
          const trendingMovies = await fetchTrendingMovies();
          const trendingTV = await fetchTrendingTV();
          const allTrending = [...(trendingMovies || []), ...(trendingTV || [])]
            .filter(item => item.id !== movie.id)
            .slice(0, 15);
          setRecommendations(allTrending);
        } catch (fallbackError) {
          console.error('Error loading trending content:', fallbackError);
        }
      } finally {
        setLoadingRecommendations(false);
      }
    };

    loadRecommendations();
  }, [movie.id, isTV]);

  // Initialize embed URL with optimized settings for better performance
  useEffect(() => {
    const startTime = watchProgress?.progress?.watched || 0;
    
    const embedOptions = {
      primaryColor: 'ef4444',
      secondaryColor: '991b1b',
      iconColor: 'ef4444',
      icons: 'vid',
      title: false, // Disable to reduce lag
      poster: false, // Disable to reduce lag
      autoplay: false, // Let user control playback
      startAt: Math.floor(startTime),
      player: 'default', // Use lighter player
    };

    const url = isTV 
      ? getTVEmbedUrl(movie.id, season, episode, embedOptions)
      : getMovieEmbedUrl(movie.id, embedOptions);
    
    setCurrentEmbedUrl(url);
    console.log('NEXUS: Loading optimized embed URL:', url);
  }, [movie.id, isTV, season, episode, watchProgress]);

  // Handle player events
  useEffect(() => {
    const cleanup = setupPlayerEventListener((eventData) => {
      try {
        const { eventType, mediaData } = eventData;
        
        switch (eventType) {
          case 'play':
            addToWatchHistory(movie, isTV);
            break;
          case 'progress_update':
            setWatchProgress(mediaData);
            break;
          case 'ended':
            console.log('NEXUS: Video playback completed');
            break;
          case 'timeupdate':
            if (mediaData) {
              setWatchProgress(mediaData);
            }
            break;
          default:
            break;
        }
      } catch (error) {
        // Silent error handling
      }
    });
    
    return () => cleanup && cleanup();
  }, [movie, isTV]);

  // Handle mouse movement for controls
  useEffect(() => {
    let hideControlsTimer;
    
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(hideControlsTimer);
      hideControlsTimer = setTimeout(() => setShowControls(false), 3000);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(hideControlsTimer);
    };
  }, []);

  const title = isTV ? movie.name || movie.original_name : movie.title || movie.original_title;
  
  const handleIframeError = () => {
    console.log('NEXUS: Stream loading failed');
    setHasError(true);
    setIsLoading(false);
  };
  
  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
    console.log('NEXUS: Video player loaded successfully');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleRecommendationClick = (content) => {
    if (onContentSelect) {
      const contentIsTV = content.media_type === 'tv' || content.first_air_date;
      onContentSelect(content, contentIsTV);
    }
  };

  const handleBackToHome = () => {
    console.log('NEXUS: Back to home clicked');
    if (onClose) {
      onClose();
    }
  };
  // Debug the embed URL
  console.log('NEXUS: Loading movie/show:', movie);
  console.log('NEXUS: Embed URL:', currentEmbedUrl);
  
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        {/* Fullscreen Back Button */}
        <button
          onClick={handleBackToHome}
          className="absolute top-4 left-4 z-60 flex items-center justify-center w-12 h-12 bg-black/50 backdrop-blur-sm border border-red-500/30 hover:border-red-400/60 rounded-full text-white hover:text-red-400 transition-all duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-60 flex items-center justify-center w-12 h-12 bg-black/50 backdrop-blur-sm border border-red-500/30 hover:border-red-400/60 rounded-full text-white hover:text-red-400 transition-all duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l4.5-4.5M9 15v4.5M9 15H4.5M9 15l-4.5 4.5M15 15h4.5M15 15v4.5m0 0l4.5-4.5" />
          </svg>
        </button>

        {/* Loading Indicator */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-55">
            <div className="text-center">
              <div className="inline-block w-12 h-12 border-4 border-red-400 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-['JetBrains_Mono',monospace] text-white text-lg mb-2">
                Initializing NEXUS Stream...
              </p>
            </div>
          </div>
        )}

        {/* Video Player */}
        <div className="w-full h-full">
          <iframe
            ref={iframeRef}
            src={currentEmbedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            referrerPolicy="origin"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            className="w-full h-full"
            title={`NEXUS Player - ${title}`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex">
      {/* Main Video Player Area (Left Side) */}
      <div className="flex-1 flex flex-col">
        {/* Header with Controls */}
        <div className="flex items-center justify-between p-4 bg-black/90 border-b border-red-900/20">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToHome}
              className="flex items-center justify-center w-10 h-10 bg-red-600/20 backdrop-blur-sm border border-red-500/30 hover:border-red-400/60 rounded-full text-white hover:text-red-400 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-red-400 tracking-wider">
              NEXUS
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center w-10 h-10 bg-red-600/20 backdrop-blur-sm border border-red-500/30 hover:border-red-400/60 rounded-full text-white hover:text-red-400 transition-all duration-300"
              title="Fullscreen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Video Player Container */}
        <div className="flex-1 bg-black relative">
          {/* Loading Indicator */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-red-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-['JetBrains_Mono',monospace] text-white text-lg mb-2">
                  Initializing NEXUS Stream...
                </p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <div className="text-center max-w-md">
                <div className="text-red-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="font-['JetBrains_Mono',monospace] text-white text-xl mb-4">
                  STREAM TEMPORARILY UNAVAILABLE
                </h2>
                <button
                  onClick={() => {
                    setHasError(false);
                    setIsLoading(true);
                    if (iframeRef.current) {
                      iframeRef.current.src = currentEmbedUrl;
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-['JetBrains_Mono',monospace] py-2 px-4 rounded transition-colors duration-200"
                >
                  RETRY CONNECTION
                </button>
              </div>
            </div>
          )}

          {/* Video Player */}
          <iframe
            ref={iframeRef}
            src={currentEmbedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            referrerPolicy="origin"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            className="w-full h-full"
            title={`NEXUS Player - ${title}`}
          />
        </div>

        {/* Video Info */}
        <div className="p-4 bg-black/90 border-t border-red-900/20">
          <h1 className="font-['JetBrains_Mono',monospace] text-white text-xl font-bold mb-2">
            {title}
          </h1>
          {isTV && (
            <p className="font-['JetBrains_Mono',monospace] text-gray-400 text-sm">
              Season {season} • Episode {episode}
            </p>
          )}
          <div className="flex items-center mt-3 space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="font-['JetBrains_Mono',monospace] text-red-400 text-xs">NEXUS STREAM</span>
            </div>
            {movie.vote_average && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-['JetBrains_Mono',monospace] text-gray-300 text-sm">
                  {movie.vote_average?.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations Sidebar (Right Side) */}
      <div className="w-96 bg-black/95 border-l border-red-900/20 flex flex-col">
        <div className="p-4 border-b border-red-900/20">
          <h2 className="font-['JetBrains_Mono',monospace] text-red-400 text-lg font-bold">
            RECOMMENDED
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {loadingRecommendations ? (
            <div className="p-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex space-x-3 mb-4">
                  <div className="w-24 h-16 bg-gray-800 rounded animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-800 rounded mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-800 rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {recommendations.slice(0, 12).map((content, index) => (
                <div
                  key={`${content.id}-${index}`}
                  onClick={() => handleRecommendationClick(content)}
                  className="flex space-x-3 cursor-pointer hover:bg-red-900/10 rounded-lg p-2 transition-colors duration-200 group"
                >
                  <div className="w-24 h-16 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={
                        content.backdrop_path
                          ? `https://image.tmdb.org/t/p/w300${content.backdrop_path}`
                          : content.poster_path
                          ? `https://image.tmdb.org/t/p/w300${content.poster_path}`
                          : `https://via.placeholder.com/300x169/1a1a1a/ffffff?text=${(content.title || content.name || 'Unknown').charAt(0)}`
                      }
                      alt={content.title || content.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-['JetBrains_Mono',monospace] text-white text-sm font-semibold truncate mb-1 group-hover:text-red-400 transition-colors">
                      {content.title || content.name}
                    </h3>
                    <p className="font-['JetBrains_Mono',monospace] text-gray-400 text-xs">
                      {content.media_type === 'tv' || content.first_air_date ? 'TV Series' : 'Movie'}
                    </p>
                    {content.vote_average && (
                      <div className="flex items-center space-x-1 mt-1">
                        <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-['JetBrains_Mono',monospace] text-gray-400 text-xs">
                          {content.vote_average?.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {recommendations.length === 0 && !loadingRecommendations && (
                <div className="text-center py-8">
                  <p className="font-['JetBrains_Mono',monospace] text-gray-400">
                    No recommendations available
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
