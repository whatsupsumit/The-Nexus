// Enhanced TMDB API integration for The Nexus with mobile optimization
import { 
  mobileApiHandler, 
  detectDevice, 
  generateMockMovieData, 
  generateMockTVData,
  initializeMobileOptimizations
} from './mobileApiHelper.js';

// Use environment variables for security
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const ACCESS_TOKEN = process.env.REACT_APP_TMDB_ACCESS_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';

// Initialize mobile optimizations on module load
const deviceInfo = initializeMobileOptimizations();
console.log('TMDB API initialized for device:', deviceInfo);

// Enhanced fetch wrapper with mobile-specific optimizations
const fetchFromTMDB = async (endpoint) => {
  try {
    const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`;
    
    // Use mobile-optimized API handler
    const data = await mobileApiHandler.call(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8',
        'Accept': 'application/json'
      }
    });
    
    return data;
  } catch (error) {
    // Enhanced fallback for mobile devices
    const device = detectDevice();
    if (device.isMobile) {
      // Determine content type and return appropriate mock data
      if (endpoint.includes('/movie/') || endpoint.includes('/trending/movie')) {
        return {
          results: generateMockMovieData(20),
          total_results: 20,
          total_pages: 1,
          page: 1,
          isMockData: true,
          fallbackReason: 'Mobile API failure'
        };
      } else if (endpoint.includes('/tv/') || endpoint.includes('/trending/tv')) {
        return {
          results: generateMockTVData(20),
          total_results: 20,
          total_pages: 1,
          page: 1,
          isMockData: true,
          fallbackReason: 'Mobile API failure'
        };
      }
    }
    
    // Standard fallback for desktop or unknown content
    return { 
      results: [], 
      total_results: 0, 
      error: error.message,
      isFallback: true
    };
  }
};

// Fetch trending movies
export const fetchTrendingMovies = async () => {
  return fetchFromTMDB('/trending/movie/week');
};

// Fetch popular movies
export const fetchPopularMovies = async () => {
  return fetchFromTMDB('/movie/popular');
};

// Fetch top rated movies
export const fetchTopRatedMovies = async () => {
  return fetchFromTMDB('/movie/top_rated');
};

// Fetch upcoming movies
export const fetchUpcomingMovies = async () => {
  return fetchFromTMDB('/movie/upcoming');
};

// Fetch movie details
export const fetchMovieDetails = async (movieId) => {
  return fetchFromTMDB(`/movie/${movieId}`);
};

// Fetch movie videos (trailers, etc.)
export const fetchMovieVideos = async (movieId) => {
  return fetchFromTMDB(`/movie/${movieId}/videos`);
};

// Fetch movie credits
export const getMovieCredits = async (movieId) => {
  return fetchFromTMDB(`/movie/${movieId}/credits`);
};

// Fetch movie recommendations
export const getMovieRecommendations = async (movieId) => {
  return fetchFromTMDB(`/movie/${movieId}/recommendations`);
};

// Fetch trending TV shows
export const fetchTrendingTVShows = async () => {
  return fetchFromTMDB('/trending/tv/week');
};

// Alias for fetchTrendingTVShows
export const fetchTrendingTV = fetchTrendingTVShows;

// Fetch popular TV shows
export const fetchPopularTVShows = async () => {
  return fetchFromTMDB('/tv/popular');
};

// Alias for fetchPopularTVShows
export const fetchPopularTV = fetchPopularTVShows;

// Fetch top rated TV shows
export const fetchTopRatedTVShows = async () => {
  return fetchFromTMDB('/tv/top_rated');
};

// Alias for fetchTopRatedTVShows
export const fetchTopRatedTV = fetchTopRatedTVShows;

// Fetch TV show details
export const fetchTVShowDetails = async (tvId) => {
  return fetchFromTMDB(`/tv/${tvId}`);
};

// Alias for fetchTVShowDetails
export const getTVDetails = fetchTVShowDetails;

// Fetch TV show videos
export const fetchTVShowVideos = async (tvId) => {
  return fetchFromTMDB(`/tv/${tvId}/videos`);
};

// Fetch TV season details
export const getTVSeasonDetails = async (tvId, seasonNumber) => {
  return fetchFromTMDB(`/tv/${tvId}/season/${seasonNumber}`);
};

// Search movies
export const searchMovies = async (query) => {
  return fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}`);
};

// Search TV shows
export const searchTVShows = async (query) => {
  return fetchFromTMDB(`/search/tv?query=${encodeURIComponent(query)}`);
};

// Combined search function
export const searchContent = async (query) => {
  const [movieResults, tvResults] = await Promise.all([
    searchMovies(query),
    searchTVShows(query)
  ]);
  
  return [
    ...(movieResults.results || []).map(item => ({ ...item, media_type: 'movie' })),
    ...(tvResults.results || []).map(item => ({ ...item, media_type: 'tv' }))
  ];
};

// Generate image URL
export const getImageUrl = (path) => {
  return path ? `${IMAGE_BASE_URL}${path}` : null;
};

// Generate backdrop URL
export const getBackdropUrl = (path) => {
  return path ? `${BACKDROP_BASE_URL}${path}` : null;
};

// Backup image URL (same as getImageUrl for now)
export const getBackupImageUrl = getImageUrl;

// Get year from date string
export const getYear = (dateString) => {
  return dateString ? new Date(dateString).getFullYear() : '';
};

// Movie details alias
export const getMovieDetails = fetchMovieDetails;

// Movie videos alias
export const getMovieVideos = fetchMovieVideos;

// VidSrc streaming URL generators (basic)
export const getMovieStreamUrl = (movieId) => {
  return `https://vidsrc.xyz/embed/movie/${movieId}`;
};

export const getTVShowStreamUrl = (tvId, season = 1, episode = 1) => {
  return `https://vidsrc.xyz/embed/tv/${tvId}/${season}/${episode}`;
};

// Simple cache for recently fetched data (keep it simple)
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Enhanced fetch functions with simple caching
export const fetchTrendingMoviesCached = async () => {
  const cacheKey = 'trending-movies';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;
  
  const data = await fetchTrendingMovies();
  setCachedData(cacheKey, data);
  return data;
};

export const fetchPopularMoviesCached = async () => {
  const cacheKey = 'popular-movies';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;
  
  const data = await fetchPopularMovies();
  setCachedData(cacheKey, data);
  return data;
};

export const fetchTrendingTVShowsCached = async () => {
  const cacheKey = 'trending-tv';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;
  
  const data = await fetchTrendingTVShows();
  setCachedData(cacheKey, data);
  return data;
};

export const fetchPopularTVShowsCached = async () => {
  const cacheKey = 'popular-tv';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;
  
  const data = await fetchPopularTVShows();
  setCachedData(cacheKey, data);
  return data;
};

// Watch progress functions (simple localStorage implementation)
export const initializeWatchProgress = (contentId, contentType) => {
  const key = `watch_progress_${contentType}_${contentId}`;
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify({
      contentId,
      contentType,
      progress: 0,
      lastWatched: Date.now()
    }));
  }
};

export const getWatchProgress = (contentId, contentType) => {
  const key = `watch_progress_${contentType}_${contentId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
};

export const saveWatchProgress = (contentId, contentType, progress) => {
  const key = `watch_progress_${contentType}_${contentId}`;
  localStorage.setItem(key, JSON.stringify({
    contentId,
    contentType,
    progress,
    lastWatched: Date.now()
  }));
};

// Player event listener setup (placeholder)
export const setupPlayerEventListener = (iframe, contentId, contentType) => {
  // Simple implementation - in a real app you'd set up postMessage listeners
  return () => {}; // Return cleanup function
};

// Get continue watching content from localStorage
export const getContinueWatching = () => {
  const watchedItems = [];
  
  // Scan localStorage for watch progress items
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('watch_progress_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        if (data && data.progress > 0 && data.progress < 90) { // Show only partially watched items
          watchedItems.push(data);
        }
      } catch (error) {
        // Silent error handling
      }
    }
  }
  
  // Sort by last watched time (most recent first)
  watchedItems.sort((a, b) => b.lastWatched - a.lastWatched);
  
  return watchedItems.slice(0, 10); // Return max 10 items
};

// Enhanced VidSrc Streaming Integration
const VIDSRC_BASE_URL = 'https://vidsrc.xyz';

// Generate movie embed URL
export const getMovieEmbedUrl = (movieId, options = {}) => {
  // VidSrc uses simple path format: /embed/movie/TMDB_ID
  return `${VIDSRC_BASE_URL}/embed/movie/${movieId}`;
};

// Generate TV show embed URL (for episodes)
export const getTVShowEmbedUrl = (tvId, season = 1, episode = 1, options = {}) => {
  // VidSrc uses path format: /embed/tv/TMDB_ID/SEASON/EPISODE
  return `${VIDSRC_BASE_URL}/embed/tv/${tvId}/${season}/${episode}`;
};

// Generate episode embed URL (alias for getTVShowEmbedUrl)
export const getEpisodeEmbedUrl = (tvId, season, episode, options = {}) => {
  // VidSrc uses path format: /embed/tv/TMDB_ID/SEASON/EPISODE  
  return `${VIDSRC_BASE_URL}/embed/tv/${tvId}/${season}/${episode}`;
};

// Basic embed URL aliases (for compatibility)
export const getTVEmbedUrl = getTVShowEmbedUrl;

// Fetch latest movies from VidSrc
export const fetchLatestMoviesFromVidSrc = async (page = 1) => {
  try {
    const response = await fetch(`${VIDSRC_BASE_URL}/movies/latest/page-${page}.json`);
    if (!response.ok) {
      throw new Error(`VidSrc API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('VidSrc Latest Movies Error:', error);
    return { movies: [], error: error.message };
  }
};

// Fetch latest TV shows from VidSrc
export const fetchLatestTVShowsFromVidSrc = async (page = 1) => {
  try {
    const response = await fetch(`${VIDSRC_BASE_URL}/tvshows/latest/page-${page}.json`);
    if (!response.ok) {
      throw new Error(`VidSrc API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('VidSrc Latest TV Shows Error:', error);
    return { tvshows: [], error: error.message };
  }
};

// Fetch latest episodes from VidSrc
export const fetchLatestEpisodesFromVidSrc = async (page = 1) => {
  try {
    const response = await fetch(`${VIDSRC_BASE_URL}/episodes/latest/page-${page}.json`);
    if (!response.ok) {
      throw new Error(`VidSrc API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('VidSrc Latest Episodes Error:', error);
    return { episodes: [], error: error.message };
  }
};

// Test TMDB API connection
export const testTMDBConnection = async () => {
  try {
    console.log('Testing TMDB API connection...');
    const response = await fetchFromTMDB('/configuration');
    console.log('TMDB API Connection Successful:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('TMDB API Connection Failed:', error);
    return { success: false, error: error.message };
  }
};

// Test VidSrc API connection
export const testVidSrcConnection = async () => {
  try {
    console.log('Testing VidSrc API connection...');
    const response = await fetchLatestMoviesFromVidSrc(1);
    console.log('VidSrc API Connection Successful:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('VidSrc API Connection Failed:', error);
    return { success: false, error: error.message };
  }
};
