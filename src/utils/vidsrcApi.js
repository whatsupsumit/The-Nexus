// VidSrc.xyz API utilities for streaming content with TMDB integration

// Base URLs for different APIs
const VIDSRC_BASE = 'https://vidsrc.xyz/embed';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// Validate that API keys are present
if (!TMDB_API_KEY) {
  console.error('TMDB API key is missing. Please add REACT_APP_TMDB_API_KEY to your .env file');
}

// Simple cache for TMDB API responses
const tmdbCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const getCachedTMDBData = (key) => {
  const cached = tmdbCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedTMDBData = (key, data) => {
  tmdbCache.set(key, { data, timestamp: Date.now() });
};

// Enhanced fetch with caching
const fetchWithCache = async (url) => {
  const cached = getCachedTMDBData(url);
  if (cached) {
    return cached;
  }
  
  const response = await fetch(url);
  const data = await response.json();
  setCachedTMDBData(url, data);
  return data;
};

// VidSrc.xyz embed URLs - much simpler than VidLink
export const getMovieEmbedUrl = (tmdbId, options = {}) => {
  // VidSrc.xyz uses a much simpler URL structure
  return `${VIDSRC_BASE}/movie?tmdb=${tmdbId}`;
};

export const getTVEmbedUrl = (tmdbId, season, episode, options = {}) => {
  // VidSrc.xyz format for TV shows
  return `${VIDSRC_BASE}/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
};

export const getAnimeEmbedUrl = (malId, episode, type = 'sub', options = {}) => {
  // VidSrc.xyz doesn't have specific anime endpoints in the documentation provided
  // For now, we'll keep this function but return null as it's not supported
  console.warn('Anime embedding not available with VidSrc.xyz API');
  return null;
};

// TMDB API functions for getting movie/TV data
export const fetchTrendingMovies = async () => {
  try {
    const response = await fetch(
      `${TMDB_BASE}/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
};

export const fetchTrendingTV = async () => {
  try {
    const response = await fetch(
      `${TMDB_BASE}/trending/tv/week?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching trending TV shows:', error);
    return [];
  }
};

export const fetchPopularMovies = async () => {
  try {
    const url = `${TMDB_BASE}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
    const data = await fetchWithCache(url);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
};

export const fetchPopularTV = async () => {
  try {
    const url = `${TMDB_BASE}/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
    const data = await fetchWithCache(url);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    return [];
  }
};

export const fetchTopRatedMovies = async () => {
  try {
    const response = await fetch(
      `${TMDB_BASE}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return [];
  }
};

export const fetchTopRatedTV = async () => {
  try {
    const response = await fetch(
      `${TMDB_BASE}/tv/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching top rated TV shows:', error);
    return [];
  }
};

export const searchContent = async (query, type = 'multi') => {
  try {
    if (!query.trim()) return [];
    const response = await fetch(
      `${TMDB_BASE}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching content:', error);
    return [];
  }
};

export const getMovieDetails = async (id) => {
  try {
    const url = `${TMDB_BASE}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=videos,credits,similar`;
    const data = await fetchWithCache(url);
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

export const getTVDetails = async (id) => {
  try {
    const url = `${TMDB_BASE}/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=videos,credits,similar`;
    const data = await fetchWithCache(url);
    return data;
  } catch (error) {
    console.error('Error fetching TV details:', error);
    return null;
  }
};

export const getTVSeasonDetails = async (id, seasonNumber) => {
  try {
    const response = await fetch(
      `${TMDB_BASE}/tv/${id}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching TV season details:', error);
    return null;
  }
};

// Get TMDB image URL
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Get backdrop image URL
export const getBackdropUrl = (path, size = 'w1280') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// VidLink Player Event Handling and Progress Tracking

// Watch Progress Management
export const initializeWatchProgress = () => {
  // Initialize watch progress storage
  if (!localStorage.getItem('nexusWatchProgress')) {
    localStorage.setItem('nexusWatchProgress', JSON.stringify({}));
  }
};

export const getWatchProgress = () => {
  try {
    return JSON.parse(localStorage.getItem('nexusWatchProgress') || '{}');
  } catch (error) {
    console.error('Error reading watch progress:', error);
    return {};
  }
};

export const saveWatchProgress = (mediaData) => {
  try {
    if (!mediaData || !mediaData.id || !mediaData.title) {
      return; // Don't save if essential data is missing
    }
    
    const currentProgress = getWatchProgress();
    currentProgress[mediaData.id] = {
      ...currentProgress[mediaData.id],
      ...mediaData,
      last_updated: Date.now()
    };
    localStorage.setItem('nexusWatchProgress', JSON.stringify(currentProgress));
  } catch (error) {
    console.error('Error saving watch progress:', error);
  }
};

// Enhanced Player Event Listener for VidLink
export const setupPlayerEventListener = (callback) => {
  const eventHandler = (event) => {
    // Accept messages from VidSrc.xyz
    if (event.origin !== 'https://vidsrc.xyz') return;
    
    // Handle media data (watch progress) - VidSrc.xyz may have different event structure
    if (event.data?.type === 'MEDIA_DATA') {
      const mediaData = event.data.data;
      saveWatchProgress(mediaData);
      
      // Also trigger callback for UI updates
      if (callback) {
        callback({
          eventType: 'progress_update',
          mediaData: mediaData,
          currentTime: mediaData.progress?.watched || 0,
          duration: mediaData.progress?.duration || 0
        });
      }
    }
    
    // Handle player events - may need adjustment for VidSrc.xyz
    if (event.data?.type === 'PLAYER_EVENT') {
      const playerData = event.data.data;
      const { event: eventType, currentTime, duration, tmdbId, mediaType, season, episode } = playerData;
      
      // Only log important events, not every timeupdate
      if (eventType !== 'timeupdate') {
        console.log(`NEXUS Player: ${eventType} at ${currentTime}s of ${duration}s`);
      }
      
      if (callback) {
        callback({
          eventType,
          currentTime,
          duration,
          tmdbId,
          mediaType,
          season,
          episode
        });
      }
    }
  };

  // Add event listener
  window.addEventListener('message', eventHandler);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('message', eventHandler);
  };
};

// Continue Watching functionality
export const getContinueWatching = () => {
  const progress = getWatchProgress();
  return Object.values(progress)
    .filter(item => {
      const watchedPercentage = (item.progress?.watched || 0) / (item.progress?.duration || 1) * 100;
      return watchedPercentage > 5 && watchedPercentage < 90; // Between 5% and 90% watched
    })
    .sort((a, b) => (b.last_updated || 0) - (a.last_updated || 0))
    .slice(0, 10); // Top 10 recent items
};

// Format runtime
export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Get year from date
export const getYear = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).getFullYear();
};

// Get movie credits (cast and crew)
export const getMovieCredits = async (movieId) => {
  try {
    const response = await fetch(
      `${TMDB_BASE}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      cast: data.cast || [],
      crew: data.crew || []
    };
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    return { cast: [], crew: [] };
  }
};

// Get movie videos (trailers, teasers, etc.)
export const getMovieVideos = async (movieId) => {
  try {
    const response = await fetch(
      `${TMDB_BASE}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    return [];
  }
};

// Get movie recommendations
export const getMovieRecommendations = async (movieId) => {
  try {
    const response = await fetch(
      `${TMDB_BASE}/movie/${movieId}/recommendations?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching movie recommendations:', error);
    return [];
  }
};

// Get TV show credits
export const getTVCredits = async (tvId) => {
  try {
    const response = await fetch(
      `${TMDB_BASE}/tv/${tvId}/credits?api_key=${TMDB_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      cast: data.cast || [],
      crew: data.crew || []
    };
  } catch (error) {
    console.error('Error fetching TV credits:', error);
    return { cast: [], crew: [] };
  }
};
