import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMovieEmbedUrl, getTVEmbedUrl, setupPlayerEventListener, initializeWatchProgress, getWatchProgress, getMovieRecommendations, fetchTrendingMovies, fetchTrendingTV } from '../utils/vidsrcApi';

// Mock TV shows data for testing when TMDB API is not available
const MOCK_TV_SHOWS = {
  // Breaking Bad
  1396: {
    id: 1396,
    name: "Breaking Bad",
    seasons: [
      { season_number: 1, episode_count: 7 },
      { season_number: 2, episode_count: 13 },
      { season_number: 3, episode_count: 13 },
      { season_number: 4, episode_count: 13 },
      { season_number: 5, episode_count: 16 }
    ]
  },
  // Game of Thrones
  1399: {
    id: 1399,
    name: "Game of Thrones",
    seasons: [
      { season_number: 1, episode_count: 10 },
      { season_number: 2, episode_count: 10 },
      { season_number: 3, episode_count: 10 },
      { season_number: 4, episode_count: 10 },
      { season_number: 5, episode_count: 10 },
      { season_number: 6, episode_count: 10 },
      { season_number: 7, episode_count: 7 },
      { season_number: 8, episode_count: 6 }
    ]
  },
  // The Office
  2316: {
    id: 2316,
    name: "The Office",
    seasons: [
      { season_number: 1, episode_count: 6 },
      { season_number: 2, episode_count: 22 },
      { season_number: 3, episode_count: 25 },
      { season_number: 4, episode_count: 19 },
      { season_number: 5, episode_count: 28 },
      { season_number: 6, episode_count: 26 },
      { season_number: 7, episode_count: 26 },
      { season_number: 8, episode_count: 24 },
      { season_number: 9, episode_count: 25 }
    ]
  },
  // Friends
  1668: {
    id: 1668,
    name: "Friends",
    seasons: [
      { season_number: 1, episode_count: 24 },
      { season_number: 2, episode_count: 24 },
      { season_number: 3, episode_count: 25 },
      { season_number: 4, episode_count: 24 },
      { season_number: 5, episode_count: 24 },
      { season_number: 6, episode_count: 25 },
      { season_number: 7, episode_count: 24 },
      { season_number: 8, episode_count: 24 },
      { season_number: 9, episode_count: 24 },
      { season_number: 10, episode_count: 18 }
    ]
  },
  // Stranger Things
  66732: {
    id: 66732,
    name: "Stranger Things",
    seasons: [
      { season_number: 1, episode_count: 8 },
      { season_number: 2, episode_count: 9 },
      { season_number: 3, episode_count: 8 },
      { season_number: 4, episode_count: 9 }
    ]
  },
  // The Walking Dead
  1402: {
    id: 1402,
    name: "The Walking Dead",
    seasons: [
      { season_number: 1, episode_count: 6 },
      { season_number: 2, episode_count: 13 },
      { season_number: 3, episode_count: 16 },
      { season_number: 4, episode_count: 16 },
      { season_number: 5, episode_count: 16 },
      { season_number: 6, episode_count: 16 },
      { season_number: 7, episode_count: 16 },
      { season_number: 8, episode_count: 16 },
      { season_number: 9, episode_count: 16 },
      { season_number: 10, episode_count: 22 },
      { season_number: 11, episode_count: 24 }
    ]
  }
};

// Generate mock episodes for a season
const generateMockEpisodes = (tvId, seasonNumber, episodeCount) => {
  const episodes = [];
  const showName = MOCK_TV_SHOWS[tvId]?.name || "TV Series";
  
  for (let i = 1; i <= episodeCount; i++) {
    episodes.push({
      id: `${tvId}-${seasonNumber}-${i}`,
      episode_number: i,
      season_number: seasonNumber,
      name: `Episode ${i}`,
      overview: `Join the continuing story in ${showName} Season ${seasonNumber} Episode ${i}. Experience thrilling drama, compelling characters, and unforgettable moments that will keep you on the edge of your seat.`,
      air_date: `2023-${String(seasonNumber).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      still_path: null,
      runtime: Math.floor(Math.random() * 20) + 40 // Random runtime between 40-60 minutes
    });
  }
  return episodes;
};

// Function to fetch TV show details including seasons
const fetchTVShowDetails = async (tvId) => {
  try {
    // Check if we have mock data for this TV show
    if (MOCK_TV_SHOWS[tvId]) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      return MOCK_TV_SHOWS[tvId];
    }
    
    // For shows not in mock data, create a generic show structure with realistic episode counts
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    
    // Create different season structures based on TV show ID for variety
    const seasonStructures = [
      [
        { season_number: 1, episode_count: 8 },
        { season_number: 2, episode_count: 10 },
        { season_number: 3, episode_count: 12 }
      ],
      [
        { season_number: 1, episode_count: 12 },
        { season_number: 2, episode_count: 13 },
        { season_number: 3, episode_count: 10 },
        { season_number: 4, episode_count: 14 }
      ],
      [
        { season_number: 1, episode_count: 6 },
        { season_number: 2, episode_count: 8 }
      ]
    ];
    
    // Use TV ID to consistently select the same structure for the same show
    const structureIndex = parseInt(tvId) % seasonStructures.length;
    const selectedStructure = seasonStructures[structureIndex];
    
    return {
      id: tvId,
      name: "TV Series",
      seasons: selectedStructure
    };
  } catch (error) {
    return null;
  }
};

// Function to fetch season details including episodes
const fetchSeasonDetails = async (tvId, seasonNumber) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if we have mock data for this TV show
    if (MOCK_TV_SHOWS[tvId]) {
      const season = MOCK_TV_SHOWS[tvId].seasons.find(s => s.season_number === seasonNumber);
      if (season) {
        const episodes = generateMockEpisodes(tvId, seasonNumber, season.episode_count);
        return {
          id: `${tvId}-season-${seasonNumber}`,
          season_number: seasonNumber,
          episodes: episodes
        };
      }
    }
    
    // For generic shows, create episodes based on typical season structure
    const seasonVariations = [
      { 1: 8, 2: 10, 3: 12, 4: 10 },
      { 1: 10, 2: 12, 3: 8, 4: 14 },
      { 1: 6, 2: 8, 3: 10, 4: 12 }
    ];
    
    const variationIndex = parseInt(tvId) % seasonVariations.length;
    const variation = seasonVariations[variationIndex];
    const episodeCount = variation[seasonNumber] || 8; // Default to 8 episodes
    
    const episodes = generateMockEpisodes(tvId, seasonNumber, episodeCount);
    
    return {
      id: `${tvId}-season-${seasonNumber}`,
      season_number: seasonNumber,
      episodes: episodes
    };
  } catch (error) {
    return null;
  }
};

// Watch history tracking function
const addToWatchHistory = (movie, isTV = false, season = null, episode = null) => {
  try {
    const watchHistory = JSON.parse(localStorage.getItem('nexus_watch_history') || '[]');
    
    // Check if this item is already in recent history (last 5 items)
    const recentHistory = watchHistory.slice(-5);
    const mediaType = isTV ? 'tv' : 'movie';
    const isRecent = recentHistory.some(item => 
      item.id === movie.id && 
      item.media_type === mediaType
    );
    
    if (!isRecent) {
      const historyItem = {
        ...movie,
        media_type: mediaType,
        watchedAt: new Date().toISOString(),
        progress: 0,
        ...(isTV && { season, episode })
      };
      
      // Add to history and keep only last 50 items
      watchHistory.push(historyItem);
      const limitedHistory = watchHistory.slice(-50);
      
      localStorage.setItem('nexus_watch_history', JSON.stringify(limitedHistory));
      
    }
  } catch (error) {
    
  }
};

const VideoPlayer = ({ movie, isTV = false, season = 1, episode = 1, onClose, onContentSelect, onSeasonEpisodeChange }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentEmbedUrl, setCurrentEmbedUrl] = useState('');
  const [watchProgress, setWatchProgress] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [isInVault, setIsInVault] = useState(false);
  const [currentSeason, setCurrentSeason] = useState(season);
  const [currentEpisode, setCurrentEpisode] = useState(episode);
  const [playbackQuality, setPlaybackQuality] = useState('auto');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [tvShowDetails, setTvShowDetails] = useState(null);
  const [nextEpisodes, setNextEpisodes] = useState([]);
  const iframeRef = useRef(null);

  // Update current season/episode when props change
  useEffect(() => {
    setCurrentSeason(season);
    setCurrentEpisode(episode);
  }, [season, episode]);

  // Initialize watch progress system
  useEffect(() => {
    initializeWatchProgress();
    
    // Check for existing progress
    const progress = getWatchProgress();
    const movieProgress = progress[movie.id];
    if (movieProgress) {
      setWatchProgress(movieProgress);
      
    }

    // Check if movie is in vault
    const vault = JSON.parse(localStorage.getItem('nexus_vault') || '[]');
    const mediaType = isTV ? 'tv' : 'movie';
    setIsInVault(vault.some(item => item.id === movie.id && item.type === mediaType));
  }, [movie.id, movie.title, movie.name, isTV]);

  // Load TV show data for series
  useEffect(() => {
    const loadTVShowData = async () => {
      if (!isTV || !movie.id) return;
      
      setLoadingRecommendations(true);
      setNextEpisodes([]); // Clear previous episodes
      
      try {
        // Fetch TV show details first
        const showDetails = await fetchTVShowDetails(movie.id);
        
        if (!showDetails) {
          setTvShowDetails(null);
          setNextEpisodes([]);
          return;
        }
        
        setTvShowDetails(showDetails);

        // Ensure we have a valid season number
        const validSeasons = showDetails.seasons?.filter(s => s.season_number > 0) || [];
        const targetSeason = validSeasons.find(s => s.season_number === currentSeason) 
          ? currentSeason 
          : (validSeasons[0]?.season_number || 1);

        // Fetch current season details
        const seasonData = await fetchSeasonDetails(movie.id, targetSeason);
        
        if (!seasonData || !seasonData.episodes || seasonData.episodes.length === 0) {
          // Try to fetch episodes from season 1 if current season fails
          if (targetSeason !== 1) {
            console.log('[NEXUS] Trying season 1 as fallback...');
            const fallbackSeasonData = await fetchSeasonDetails(movie.id, 1);
            if (fallbackSeasonData && fallbackSeasonData.episodes && fallbackSeasonData.episodes.length > 0) {
              setNextEpisodes(fallbackSeasonData.episodes);
              setCurrentSeason(1);
              return;
            }
          }
          
          setNextEpisodes([]);
          return;
        }
        
        // Get all episodes from current season
        let episodesList = [...seasonData.episodes];
        
        // Ensure episodes have proper season numbers
        episodesList = episodesList.map(ep => ({
          ...ep,
          season_number: ep.season_number || targetSeason
        }));

        // If we need more episodes and there are more seasons available
        if (episodesList.length < 8 && validSeasons.length > 1) {
          const currentSeasonIndex = validSeasons.findIndex(s => s.season_number === targetSeason);
          
          // Try to get episodes from next season
          if (currentSeasonIndex >= 0 && currentSeasonIndex < validSeasons.length - 1) {
            const nextSeason = validSeasons[currentSeasonIndex + 1];
            
            try {
              const nextSeasonData = await fetchSeasonDetails(movie.id, nextSeason.season_number);
              if (nextSeasonData && nextSeasonData.episodes && nextSeasonData.episodes.length > 0) {
                const additionalEpisodes = nextSeasonData.episodes
                  .slice(0, Math.min(5, 12 - episodesList.length))
                  .map(ep => ({
                    ...ep,
                    season_number: nextSeason.season_number
                  }));
                
                episodesList.push(...additionalEpisodes);
              }
            } catch (error) {
              // Silent error handling
            }
          }
        }

        setNextEpisodes(episodesList);
        
      } catch (error) {
        setTvShowDetails(null);
        setNextEpisodes([]);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    if (isTV) {
      loadTVShowData();
    } else {
      // Clear TV data when switching to movies
      setTvShowDetails(null);
      setNextEpisodes([]);
    }
  }, [isTV, movie.id, currentSeason]);

  // Load recommendations
  // Load recommendations for movies only
  useEffect(() => {
    const loadRecommendations = async () => {
      if (isTV) return; // Skip recommendations for TV shows as we show episodes instead
      
      setLoadingRecommendations(true);
      try {
        let recommendedContent = [];
        
        // Get movie recommendations
        const movieRecs = await getMovieRecommendations(movie.id);
        recommendedContent = movieRecs?.results?.slice(0, 10) || [];
        
        // If we don't have enough recommendations, add trending content
        if (recommendedContent.length < 8) {
          const trendingMovies = await fetchTrendingMovies();
          const trendingTV = await fetchTrendingTV();
          const allTrending = [...(trendingMovies || []), ...(trendingTV || [])]
            .filter(item => item.id !== movie.id)
            .slice(0, 15);
          
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
          console.error('Fallback error:', fallbackError);
        }
      } finally {
        setLoadingRecommendations(false);
      }
    };

    if (!isTV) {
      loadRecommendations();
    }
  }, [movie.id, isTV]);

  // Initialize embed URL with optimized settings for better performance
  useEffect(() => {
    const loadUrl = async () => {
      if (!movie || !movie.id) {
        console.warn('VideoPlayer: Movie data is incomplete');
        return;
      }

      let url = '';
      try {
        // For movies and TV shows, use simplified VidSrc URLs
        url = isTV 
          ? getTVEmbedUrl(movie.id, currentSeason, currentEpisode)
          : getMovieEmbedUrl(movie.id);
        
        // Only set URL if it's valid and not empty
        if (url && url.trim() !== '') {
          setCurrentEmbedUrl(url);
        } else {
          console.warn('VideoPlayer: Generated URL is empty or invalid');
          setHasError(true);
        }
      } catch (error) {
        console.error('VideoPlayer: Error generating embed URL:', error);
        setHasError(true);
      }
    };

    loadUrl();
  }, [movie, isTV, currentSeason, currentEpisode, watchProgress, autoPlay]);

  // Handle player events
  useEffect(() => {
    const cleanup = setupPlayerEventListener((eventData) => {
      try {
        if (!eventData || typeof eventData !== 'object') {
          console.warn('VideoPlayer: Invalid event data received');
          return;
        }

        const { eventType, mediaData } = eventData;
        
        if (!eventType) {
          console.warn('VideoPlayer: Event type missing');
          return;
        }
        
        switch (eventType) {
          case 'play':
            if (movie && movie.id) {
              addToWatchHistory(movie, isTV, currentSeason, currentEpisode);
            }
            break;
          case 'progress_update':
            if (mediaData) {
              setWatchProgress(mediaData);
            }
            break;
          case 'ended':
            console.log('VideoPlayer: Video ended');
            break;
          case 'timeupdate':
            if (mediaData) {
              setWatchProgress(mediaData);
            }
            break;
          default:
            // Unknown event type - silently ignore
            break;
        }
      } catch (error) {
        console.warn('VideoPlayer: Error handling player event:', error.message);
      }
    });
    
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [movie, isTV, currentSeason, currentEpisode]);

  // Handle mouse movement for controls (simplified)
  useEffect(() => {
    let hideControlsTimer;
    
    const handleMouseMove = () => {
      // Controls handling removed for simplicity
      clearTimeout(hideControlsTimer);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(hideControlsTimer);
    };
  }, []);

  const title = isTV ? movie.name || movie.original_name : movie.title || movie.original_title;
  
  const handleIframeError = () => {
    
    setHasError(true);
    setIsLoading(false);
  };
  
  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
    
  };

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const handleRecommendationClick = (content) => {
    if (onContentSelect) {
      const contentIsTV = content.media_type === 'tv' || content.first_air_date;
      onContentSelect(content, contentIsTV);
    } else {
      // Close current player first
      if (onClose) {
        onClose();
      }
      
      // Navigate to the content details page
      const contentIsTV = content.media_type === 'tv' || content.first_air_date;
      if (contentIsTV) {
        navigate(`/tv/${content.id}`);
      } else {
        navigate(`/movie/${content.id}`);
      }
    }
  };

  const handleEpisodeClick = (episode, seasonNumber = currentSeason) => {
    if (onSeasonEpisodeChange) {
      setCurrentSeason(seasonNumber);
      setCurrentEpisode(episode.episode_number);
      onSeasonEpisodeChange(seasonNumber, episode.episode_number);
    }
  };

  const handleSeasonSelect = async (seasonNumber) => {
    console.log('[NEXUS] Season selected:', seasonNumber);
    
    if (onSeasonEpisodeChange) {
      setCurrentSeason(seasonNumber);
      setCurrentEpisode(1);
      
      // Trigger the parent component update
      onSeasonEpisodeChange(seasonNumber, 1);
    } else {
      // If no parent handler, update state directly
      setCurrentSeason(seasonNumber);
      setCurrentEpisode(1);
    }
  };

  const toggleVault = () => {
    const vault = JSON.parse(localStorage.getItem('nexus_vault') || '[]');
    const mediaType = isTV ? 'tv' : 'movie';
    const itemIndex = vault.findIndex(item => 
      item.id === movie.id && item.type === mediaType
    );

    if (itemIndex >= 0) {
      // Remove from vault
      vault.splice(itemIndex, 1);
      setIsInVault(false);
    } else {
      // Add to vault
      vault.push({
        ...movie,
        addedAt: new Date().toISOString(),
        type: mediaType
      });
      setIsInVault(true);
    }

    localStorage.setItem('nexus_vault', JSON.stringify(vault));
  };

  const handleBackToHome = () => {
    if (onClose) {
      onClose();
    }
  };

  // Enhanced episode navigation functions
  const handleNextEpisode = useCallback(() => {
    if (isTV && onSeasonEpisodeChange && nextEpisodes.length > 0) {
      // Find current episode in the list
      const currentEpisodeIndex = nextEpisodes.findIndex(
        ep => ep.episode_number === currentEpisode && 
              (ep.season_number || currentSeason) === currentSeason
      );
      
      // Check if there's a next episode
      if (currentEpisodeIndex >= 0 && currentEpisodeIndex < nextEpisodes.length - 1) {
        const nextEpisodeData = nextEpisodes[currentEpisodeIndex + 1];
        setCurrentSeason(nextEpisodeData.season_number || currentSeason);
        setCurrentEpisode(nextEpisodeData.episode_number);
        onSeasonEpisodeChange(nextEpisodeData.season_number || currentSeason, nextEpisodeData.episode_number);
      }
    }
  }, [isTV, onSeasonEpisodeChange, currentEpisode, currentSeason, nextEpisodes]);

  const handlePreviousEpisode = useCallback(() => {
    if (isTV && currentEpisode > 1 && onSeasonEpisodeChange) {
      const prevEpisode = currentEpisode - 1;
      setCurrentEpisode(prevEpisode);
      onSeasonEpisodeChange(currentSeason, prevEpisode);
    }
  }, [isTV, currentEpisode, onSeasonEpisodeChange, currentSeason]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT') return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          // Toggle play/pause via iframe messaging if possible
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'ArrowRight':
          if (isTV && e.shiftKey) {
            e.preventDefault();
            handleNextEpisode();
          }
          break;
        case 'ArrowLeft':
          if (isTV && e.shiftKey) {
            e.preventDefault();
            handlePreviousEpisode();
          }
          break;
        case 'Escape':
          if (isFullscreen) {
            e.preventDefault();
            setIsFullscreen(false);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isTV, currentEpisode, currentSeason, isFullscreen, handleNextEpisode, handlePreviousEpisode, toggleFullscreen]);
  
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col lg:flex-row">
      {/* Main Video Player Area */}
      <div className="flex-1 flex flex-col order-1 lg:order-1">
        {/* Header with Controls */}
        <div className="flex items-center justify-between p-3 sm:p-4 bg-black/95 border-b border-red-900/20 backdrop-blur-xl">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={handleBackToHome}
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-red-600/20 backdrop-blur-sm border border-red-500/30 hover:border-red-400/60 rounded-full text-white hover:text-red-400 transition-all duration-300"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="font-['JetBrains_Mono',monospace] text-lg sm:text-2xl font-bold text-red-400 tracking-wider">
              NEXUS
            </div>
            
            {/* Enhanced Episode Navigation for TV Shows */}
            {isTV && (
              <div className="hidden sm:flex items-center space-x-3 ml-6 bg-black/40 rounded-lg px-4 py-2 border border-red-900/30">
                <button
                  onClick={handlePreviousEpisode}
                  disabled={currentEpisode <= 1}
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                    currentEpisode <= 1 
                      ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' 
                      : 'bg-red-600/20 text-white hover:bg-red-600/40 hover:text-red-400'
                  }`}
                  title="Previous Episode (Shift + ←)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="text-center">
                  <div className="text-xs text-gray-400 font-['JetBrains_Mono',monospace]">
                    S{currentSeason}E{currentEpisode}
                  </div>
                  <div className="text-sm text-white font-['JetBrains_Mono',monospace] font-bold">
                    Episode {currentEpisode}
                  </div>
                </div>
                
                <button
                  onClick={handleNextEpisode}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600/20 text-white hover:bg-red-600/40 hover:text-red-400 transition-all duration-300"
                  title="Next Episode (Shift + →)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Playback Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-700/20 backdrop-blur-sm border border-gray-600/30 hover:border-gray-500/60 rounded-full text-white hover:text-gray-300 transition-all duration-300"
                title="Player Settings"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              
              {/* Settings Dropdown */}
              {showSettings && (
                <div className="absolute right-0 top-12 bg-black/95 backdrop-blur-xl border border-red-900/30 rounded-lg p-4 z-50 min-w-[200px]">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 font-['JetBrains_Mono',monospace] mb-1 block">
                        Quality
                      </label>
                      <select
                        value={playbackQuality}
                        onChange={(e) => setPlaybackQuality(e.target.value)}
                        className="w-full bg-gray-800 text-white text-sm rounded px-2 py-1 font-['JetBrains_Mono',monospace]"
                      >
                        <option value="auto">Auto</option>
                        <option value="1080p">1080p</option>
                        <option value="720p">720p</option>
                        <option value="480p">480p</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-400 font-['JetBrains_Mono',monospace] mb-1 block">
                        Speed
                      </label>
                      <select
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                        className="w-full bg-gray-800 text-white text-sm rounded px-2 py-1 font-['JetBrains_Mono',monospace]"
                      >
                        <option value={0.5}>0.5x</option>
                        <option value={0.75}>0.75x</option>
                        <option value={1}>1x</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2}>2x</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-400 font-['JetBrains_Mono',monospace]">
                        Auto-play Next
                      </label>
                      <button
                        onClick={() => setAutoPlay(!autoPlay)}
                        className={`w-10 h-6 rounded-full transition-colors duration-300 ${
                          autoPlay ? 'bg-red-600' : 'bg-gray-600'
                        } relative`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${
                            autoPlay ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Add to Vault Button */}
            <button
              onClick={toggleVault}
              className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 backdrop-blur-sm border rounded-full transition-all duration-300 ${
                isInVault 
                  ? 'bg-green-600/20 border-green-500/30 text-green-400 hover:border-green-400/60' 
                  : 'bg-red-600/20 border-red-500/30 text-white hover:border-red-400/60 hover:text-red-400'
              }`}
              title={isInVault ? "Remove from Vault" : "Add to Vault"}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d={isInVault ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} 
                />
              </svg>
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-red-600/20 backdrop-blur-sm border border-red-500/30 hover:border-red-400/60 rounded-full text-white hover:text-red-400 transition-all duration-300"
              title="Toggle Fullscreen (F)"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Video Player Container */}
        <div className="flex-1 bg-black relative min-h-[250px] sm:min-h-[400px] lg:min-h-[500px]">
          {/* Loading Indicator */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="inline-block w-16 h-16 border-4 border-red-400/20 border-t-red-400 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-2xl">🎬</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-['JetBrains_Mono',monospace] text-white text-lg font-bold">
                    Initializing NEXUS Stream...
                  </p>
                  <p className="font-['JetBrains_Mono',monospace] text-gray-400 text-sm">
                    Connecting to quantum servers • Optimizing playback
                  </p>
                  <div className="flex justify-center space-x-1 mt-4">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Error Display */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black via-red-950/20 to-black z-10">
              <div className="text-center max-w-lg p-8 bg-black/80 backdrop-blur-sm rounded-lg border border-red-900/30">
                <div className="text-red-400 mb-6 animate-pulse">
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="font-['JetBrains_Mono',monospace] text-white text-2xl mb-2 font-bold">
                  STREAM TEMPORARILY UNAVAILABLE
                </h2>
                <p className="font-['JetBrains_Mono',monospace] text-gray-400 text-sm mb-6 leading-relaxed">
                  The quantum servers are experiencing high traffic. Our AI is working to restore connection.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      setHasError(false);
                      setIsLoading(true);
                      if (iframeRef.current) {
                        iframeRef.current.src = currentEmbedUrl;
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-['JetBrains_Mono',monospace] py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>RETRY CONNECTION</span>
                  </button>
                  <button
                    onClick={() => {
                      if (onClose) {
                        onClose();
                      }
                    }}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-['JetBrains_Mono',monospace] py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>GO BACK</span>
                  </button>
                </div>
                <div className="flex justify-center space-x-1 mt-6">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-ping delay-75"></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-ping delay-150"></div>
                </div>
              </div>
            </div>
          )}

          {/* Video Player */}
          <iframe
            ref={iframeRef}
            src={currentEmbedUrl || null}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen={true}
            referrerPolicy="unsafe-url"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            className="w-full h-full"
            title={`NEXUS Player - ${title}`}
          />
        </div>

        {/* Enhanced Video Info Section */}
        <div className="p-4 sm:p-6 bg-black/95 border-t border-red-900/20 backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h1 className="font-['JetBrains_Mono',monospace] text-white text-xl sm:text-2xl font-bold mb-2">
                    {title}
                  </h1>
                  {isTV && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-['JetBrains_Mono',monospace] text-gray-400 text-base sm:text-lg">
                          Season {currentSeason} • Episode {currentEpisode}
                        </span>
                        <div className="hidden sm:flex items-center space-x-2">
                          <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                          <span className="font-['JetBrains_Mono',monospace] text-red-400 text-sm">
                            SERIES
                          </span>
                        </div>
                      </div>
                      
                      {/* Mobile Episode Navigation */}
                      <div className="flex sm:hidden items-center space-x-3 bg-black/40 rounded-lg px-3 py-2 border border-red-900/30">
                        <button
                          onClick={handlePreviousEpisode}
                          disabled={currentEpisode <= 1}
                          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                            currentEpisode <= 1 
                              ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' 
                              : 'bg-red-600/20 text-white hover:bg-red-600/40'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        
                        <span className="text-sm text-white font-['JetBrains_Mono',monospace]">
                          S{currentSeason}E{currentEpisode}
                        </span>
                        
                        <button
                          onClick={handleNextEpisode}
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600/20 text-white hover:bg-red-600/40 transition-all duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center mt-3 gap-3 sm:gap-6">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${isTV ? 'bg-purple-400' : 'bg-red-400'}`}></div>
                  <span className="font-['JetBrains_Mono',monospace] text-xs sm:text-sm" style={{color: isTV ? '#a855f7' : '#ef4444'}}>
                    NEXUS {isTV ? 'SERIES' : 'STREAM'}
                  </span>
                </div>
                {movie.vote_average && (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-['JetBrains_Mono',monospace] text-gray-300 text-xs sm:text-sm">
                      {movie.vote_average?.toFixed(1)}
                    </span>
                  </div>
                )}
                {(movie.release_date || movie.first_air_date) && (
                  <span className="font-['JetBrains_Mono',monospace] text-gray-400 text-xs sm:text-sm">
                    {new Date(movie.release_date || movie.first_air_date).getFullYear()}
                  </span>
                )}
                
                {/* Keyboard Shortcuts Hint */}
                {isTV && (
                  <div className="hidden lg:flex items-center space-x-2 bg-gray-900/50 px-3 py-1 rounded-full">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-['JetBrains_Mono',monospace] text-gray-400 text-xs">
                      Shift + ←→ for episodes • F for fullscreen
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Enhanced Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {isTV && (
                <button
                  onClick={() => setAutoPlay(!autoPlay)}
                  className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-['JetBrains_Mono',monospace] font-bold flex items-center transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm border-2 ${
                    autoPlay 
                      ? 'border-green-500 text-green-400 bg-green-500/10'
                      : 'border-gray-500 text-gray-300 hover:border-purple-500 hover:text-purple-400'
                  }`}
                  title="Toggle auto-play next episode"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d={autoPlay ? "M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" : "M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} 
                    />
                  </svg>
                  <span className="hidden sm:inline">{autoPlay ? 'AUTO-PLAY' : 'MANUAL'}</span>
                  <span className="sm:hidden">{autoPlay ? 'AUTO' : 'MAN'}</span>
                </button>
              )}
              
              <button
                onClick={toggleVault}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-['JetBrains_Mono',monospace] font-bold flex items-center transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm ${
                  isInVault 
                    ? 'border-2 border-green-500 text-green-400 bg-green-500/10'
                    : 'border-2 border-gray-500 text-gray-300 hover:border-red-500 hover:text-red-400'
                }`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d={isInVault ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} 
                  />
                </svg>
                <span className="hidden sm:inline">{isInVault ? 'IN VAULT' : 'ADD TO VAULT'}</span>
                <span className="sm:hidden">{isInVault ? 'SAVED' : 'SAVE'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes/Recommendations Sidebar */}
      <div className="w-full lg:w-96 bg-black/95 border-t lg:border-t-0 lg:border-l border-red-900/20 flex flex-col overflow-hidden order-2 lg:order-2 max-h-96 lg:max-h-none">
        <div className="p-2 sm:p-4 border-b border-red-900/20 bg-gradient-to-r from-red-950/30 to-black">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-['JetBrains_Mono',monospace] text-red-400 text-base sm:text-lg font-bold flex items-center">
                <div className="w-1 h-5 bg-red-500 mr-2 sm:mr-3 rounded"></div>
                {isTV ? 'EPISODES' : 'RECOMMENDED FOR YOU'}
              </h2>
              <p className="font-['JetBrains_Mono',monospace] text-gray-500 text-xs mt-1">
                {isTV ? 'Next episodes • Click to watch' : 'AI-curated suggestions • Click to watch'}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="font-['JetBrains_Mono',monospace] text-red-400 text-xs hidden sm:inline">
                LIVE
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {isTV ? (
            /* TV Show Episodes Section */
            <div>
              {loadingRecommendations ? (
                <div className="p-2 sm:p-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                      <div className="w-20 h-14 sm:w-28 sm:h-20 bg-gray-800 rounded animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-3 sm:h-4 bg-gray-800 rounded mb-2 animate-pulse"></div>
                        <div className="h-2 sm:h-3 bg-gray-800 rounded w-2/3 animate-pulse"></div>
                        <div className="h-2 sm:h-3 bg-gray-800 rounded w-1/2 mt-1 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  {/* Next Episodes */}
                  {nextEpisodes.length > 0 && (
                    <div className="p-2 sm:p-4 space-y-2 sm:space-y-3">
                      <h3 className="font-['JetBrains_Mono',monospace] text-purple-400 text-sm font-bold mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        ALL EPISODES
                      </h3>
                      {nextEpisodes.map((episode, index) => (
                        <div
                          key={`${episode.season_number || currentSeason}-${episode.episode_number}`}
                          onClick={() => handleEpisodeClick(episode, episode.season_number || currentSeason)}
                          className="flex space-x-2 sm:space-x-3 cursor-pointer hover:bg-purple-900/10 rounded-lg p-2 sm:p-3 transition-colors duration-200 group border border-transparent hover:border-purple-900/30"
                        >
                          <div className="w-20 h-14 sm:w-28 sm:h-20 rounded overflow-hidden flex-shrink-0 bg-gray-800 flex items-center justify-center">
                            {episode.still_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                                alt={episode.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            ) : (
                              <div className="text-gray-500 text-center">
                                <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs">S{episode.season_number || currentSeason}E{episode.episode_number}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className={`font-['JetBrains_Mono',monospace] text-xs px-2 py-0.5 rounded border ${
                                episode.episode_number === currentEpisode && (episode.season_number || currentSeason) === currentSeason
                                  ? 'bg-red-900/30 border-red-800/30 text-red-400'
                                  : 'bg-purple-900/30 border-purple-800/30 text-purple-400'
                              }`}>
                                S{episode.season_number || currentSeason}E{episode.episode_number}
                              </span>
                              {episode.episode_number === currentEpisode && (episode.season_number || currentSeason) === currentSeason && (
                                <span className="font-['JetBrains_Mono',monospace] text-red-400 text-xs font-bold">
                                  NOW PLAYING
                                </span>
                              )}
                              {episode.air_date && (
                                <span className="font-['JetBrains_Mono',monospace] text-gray-500 text-xs">
                                  {new Date(episode.air_date).getFullYear()}
                                </span>
                              )}
                            </div>
                            <h3 className="font-['JetBrains_Mono',monospace] text-white text-xs sm:text-sm font-semibold truncate mb-1 group-hover:text-purple-400 transition-colors">
                              {episode.name || `Episode ${episode.episode_number}`}
                            </h3>
                            {episode.overview && (
                              <p className="font-['JetBrains_Mono',monospace] text-gray-500 text-xs leading-relaxed line-clamp-2">
                                {episode.overview.length > 80 ? episode.overview.substring(0, 80) + '...' : episode.overview}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Season Selection */}
                  {tvShowDetails && tvShowDetails.seasons && tvShowDetails.seasons.length > 1 && (
                    <div className="border-t border-red-900/20 p-2 sm:p-4">
                      <h3 className="font-['JetBrains_Mono',monospace] text-red-400 text-sm font-bold mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        SEASONS
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {tvShowDetails.seasons
                          .filter(season => season.season_number > 0) // Filter out season 0 (specials)
                          .map((season) => (
                            <button
                              key={season.season_number}
                              onClick={() => handleSeasonSelect(season.season_number)}
                              className={`p-2 sm:p-3 rounded-lg border transition-all duration-200 font-['JetBrains_Mono',monospace] text-xs sm:text-sm font-bold ${
                                currentSeason === season.season_number
                                  ? 'bg-red-600/20 border-red-500/50 text-red-400'
                                  : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:border-red-500/30 hover:text-red-400'
                              }`}
                            >
                              <div className="text-center">
                                <div>Season {season.season_number}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {season.episode_count} episodes
                                </div>
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* No episodes available - show different messages based on state */}
                  {nextEpisodes.length === 0 && !loadingRecommendations && (
                    <div className="text-center py-8">
                      <div className="text-gray-600 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      {!tvShowDetails ? (
                        <div>
                          <p className="font-['JetBrains_Mono',monospace] text-gray-400 text-sm mb-2">
                            Unable to load series data
                          </p>
                          <p className="font-['JetBrains_Mono',monospace] text-gray-500 text-xs">
                            Check your connection and try again
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-['JetBrains_Mono',monospace] text-gray-400 text-sm mb-2">
                            No episodes found for Season {currentSeason}
                          </p>
                          <p className="font-['JetBrains_Mono',monospace] text-gray-500 text-xs mb-4">
                            Try selecting a different season below
                          </p>
                          {tvShowDetails.seasons && tvShowDetails.seasons.length > 1 && (
                            <div className="flex flex-wrap justify-center gap-2">
                              {tvShowDetails.seasons
                                .filter(season => season.season_number > 0)
                                .slice(0, 5)
                                .map((season) => (
                                  <button
                                    key={season.season_number}
                                    onClick={() => handleSeasonSelect(season.season_number)}
                                    className="px-3 py-1 text-xs bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 rounded font-['JetBrains_Mono',monospace] transition-colors"
                                  >
                                    S{season.season_number}
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Loading state when switching seasons */}
                  {loadingRecommendations && (
                    <div className="text-center py-8">
                      <div className="text-gray-600 mb-4">
                        <div className="inline-block w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="font-['JetBrains_Mono',monospace] text-gray-400 text-sm">
                        Loading Season {currentSeason} episodes...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Movie Recommendations Section */
            <div>
              {loadingRecommendations ? (
                <div className="p-2 sm:p-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                      <div className="w-20 h-14 sm:w-28 sm:h-20 bg-gray-800 rounded animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-3 sm:h-4 bg-gray-800 rounded mb-2 animate-pulse"></div>
                        <div className="h-2 sm:h-3 bg-gray-800 rounded w-2/3 animate-pulse"></div>
                        <div className="h-2 sm:h-3 bg-gray-800 rounded w-1/2 mt-1 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2 sm:p-4 space-y-2 sm:space-y-4">
                  {recommendations.slice(0, 15).map((content, index) => (
                    <div
                      key={`${content.id}-${index}`}
                      onClick={() => handleRecommendationClick(content)}
                      className="flex space-x-2 sm:space-x-3 cursor-pointer hover:bg-red-900/10 rounded-lg p-2 sm:p-3 transition-colors duration-200 group border border-transparent hover:border-red-900/30"
                    >
                      <div className="w-20 h-14 sm:w-28 sm:h-20 rounded overflow-hidden flex-shrink-0">
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
                        <h3 className="font-['JetBrains_Mono',monospace] text-white text-xs sm:text-sm font-semibold truncate mb-1 group-hover:text-red-400 transition-colors">
                          {content.title || content.name}
                        </h3>
                        <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                          <span className={`font-['JetBrains_Mono',monospace] text-xs px-1 sm:px-2 py-0.5 rounded ${
                            content.media_type === 'tv' || content.first_air_date 
                              ? 'bg-purple-900/30 text-purple-400 border border-purple-800/30' 
                              : 'bg-blue-900/30 text-blue-400 border border-blue-800/30'
                          }`}>
                            {content.media_type === 'tv' || content.first_air_date ? 'TV' : 'MOVIE'}
                          </span>
                          {content.vote_average && (
                            <div className="flex items-center space-x-1">
                              <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="font-['JetBrains_Mono',monospace] text-gray-400 text-xs">
                                {content.vote_average?.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                        {content.overview && (
                          <p className="font-['JetBrains_Mono',monospace] text-gray-500 text-xs leading-relaxed line-clamp-2">
                            {content.overview.length > 80 ? content.overview.substring(0, 80) + '...' : content.overview}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {recommendations.length === 0 && !loadingRecommendations && (
                    <div className="text-center py-8">
                      <div className="text-gray-600 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <p className="font-['JetBrains_Mono',monospace] text-gray-400">
                        No recommendations available
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Mode */}
      {isFullscreen && (
        <div className="fixed inset-0 z-60 bg-black">
          {/* Fullscreen Back Button */}
          <button
            onClick={handleBackToHome}
            className="absolute top-4 left-4 z-70 flex items-center justify-center w-12 h-12 bg-black/50 backdrop-blur-sm border border-red-500/30 hover:border-red-400/60 rounded-full text-white hover:text-red-400 transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-70 flex items-center justify-center w-12 h-12 bg-black/50 backdrop-blur-sm border border-red-500/30 hover:border-red-400/60 rounded-full text-white hover:text-red-400 transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l4.5-4.5M9 15v4.5M9 15H4.5M9 15l-4.5 4.5M15 15h4.5M15 15v4.5m0 0l4.5-4.5" />
            </svg>
          </button>

          {/* Loading Indicator */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-65">
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
              src={currentEmbedUrl || null}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen={true}
              referrerPolicy="unsafe-url"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              className="w-full h-full"
              title={`NEXUS Player - ${title}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
