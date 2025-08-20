// VidSrc.xyz API utilities for streaming content with TMDB integration

// Base URLs for different APIs
const VIDSRC_BASE = 'https://vidsrc.xyz/embed';
const VIDSRC_ICU_BASE = 'https://vidsrc.icu/embed'; // New anime/manga streaming service
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// Validate that API keys are present
if (!TMDB_API_KEY) {
  console.error('TMDB API key is missing. Please add REACT_APP_TMDB_API_KEY to your .env file');
}

// Test TMDB API connectivity
export const testTMDBConnectivity = async () => {
  try {
    const testUrl = `${TMDB_BASE}/configuration?api_key=${TMDB_API_KEY}`;
    const response = await fetch(testUrl);
    
    if (response.ok) {
      console.log('🌐 TMDB API is online and working!');
      return true;
    } else {
      console.log('⚠️ TMDB API returned error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ TMDB API connectivity test failed:', error.message);
    return false;
  }
};

// Auto-test connectivity on import
testTMDBConnectivity();

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

// Mock data generator for when API fails
const getMockData = (url) => {
  const mockMovies = [
    {
      id: 1,
      title: "The Matrix",
      poster_path: "https://dummyimage.com/342x513/1f2937/ffffff.png?text=The+Matrix",
      backdrop_path: "https://dummyimage.com/1280x720/1f2937/ffffff.png?text=The+Matrix",
      overview: "A computer hacker learns from mysterious rebels about the true nature of his reality.",
      release_date: "1999-03-30",
      vote_average: 8.7,
      vote_count: 23000,
      popularity: 100
    },
    {
      id: 2,
      title: "Blade Runner 2049",
      poster_path: "https://dummyimage.com/342x513/1f2937/ffffff.png?text=Blade+Runner+2049",
      backdrop_path: "https://dummyimage.com/1280x720/1f2937/ffffff.png?text=Blade+Runner+2049",
      overview: "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.",
      release_date: "2017-10-04",
      vote_average: 8.0,
      vote_count: 15000,
      popularity: 95
    },
    {
      id: 3,
      title: "Interstellar",
      poster_path: "https://dummyimage.com/342x513/1f2937/ffffff.png?text=Interstellar",
      backdrop_path: "https://dummyimage.com/1280x720/1f2937/ffffff.png?text=Interstellar",
      overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      release_date: "2014-11-07",
      vote_average: 8.6,
      vote_count: 33000,
      popularity: 90
    },
    {
      id: 4,
      title: "Inception",
      poster_path: "https://dummyimage.com/342x513/1f2937/ffffff.png?text=Inception",
      backdrop_path: "https://dummyimage.com/1280x720/1f2937/ffffff.png?text=Inception",
      overview: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
      release_date: "2010-07-16",
      vote_average: 8.8,
      vote_count: 35000,
      popularity: 88
    },
    {
      id: 5,
      title: "Dune",
      poster_path: "https://dummyimage.com/342x513/1f2937/ffffff.png?text=Dune",
      backdrop_path: "https://dummyimage.com/1280x720/1f2937/ffffff.png?text=Dune",
      overview: "Paul Atreides leads nomadic tribes in a revolt against the galactic emperor and his father's evil nemesis.",
      release_date: "2021-10-22",
      vote_average: 8.0,
      vote_count: 25000,
      popularity: 85
    },
    {
      id: 6,
      title: "The Dark Knight",
      poster_path: "https://dummyimage.com/342x513/1f2937/ffffff.png?text=The+Dark+Knight",
      backdrop_path: "https://dummyimage.com/1280x720/1f2937/ffffff.png?text=The+Dark+Knight",
      overview: "Batman faces the Joker, a criminal mastermind who wants to plunge Gotham City into anarchy.",
      release_date: "2008-07-18",
      vote_average: 9.0,
      vote_count: 32000,
      popularity: 82
    },
    {
      id: 7,
      title: "Avatar",
      poster_path: "https://dummyimage.com/342x513/1f2937/ffffff.png?text=Avatar",
      backdrop_path: "https://dummyimage.com/1280x720/1f2937/ffffff.png?text=Avatar",
      overview: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders.",
      release_date: "2009-12-18",
      vote_average: 7.9,
      vote_count: 30000,
      popularity: 80
    },
    {
      id: 8,
      title: "Spider-Man: No Way Home",
      poster_path: "https://dummyimage.com/342x513/1f2937/ffffff.png?text=Spider+Man",
      backdrop_path: "https://dummyimage.com/1280x720/1f2937/ffffff.png?text=Spider+Man",
      overview: "Spider-Man's identity is revealed, so he asks Doctor Strange for help, but things go wrong.",
      release_date: "2021-12-17",
      vote_average: 8.4,
      vote_count: 28000,
      popularity: 78
    }
  ];

  const mockTVShows = [
    {
      id: 1399,
      name: "Game of Thrones",
      poster_path: "https://dummyimage.com/342x513/1f2937/ffffff.png?text=Game+of+Thrones",
      backdrop_path: "https://dummyimage.com/1280x720/1f2937/ffffff.png?text=Game+of+Thrones",
      overview: "Seven noble families fight for control of the mythical land of Westeros.",
      first_air_date: "2011-04-17",
      vote_average: 8.3,
      vote_count: 22000,
      popularity: 100
    },
    {
      id: 1396,
      name: "Breaking Bad",
      poster_path: "https://dummyimage.com/342x513/1f2937/ffffff.png?text=Breaking+Bad",
      backdrop_path: "https://dummyimage.com/1280x720/1f2937/ffffff.png?text=Breaking+Bad",
      overview: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing drugs.",
      first_air_date: "2008-01-20",
      vote_average: 9.5,
      vote_count: 25000,
      popularity: 95
    },
    {
      id: 94605,
      name: "Arcane",
      poster_path: "https://dummyimage.com/342x513/1f2937/ffffff.png?text=Arcane",
      backdrop_path: "https://dummyimage.com/1280x720/1f2937/ffffff.png?text=Arcane",
      overview: "Set in utopian Piltover and the oppressed underground of Zaun, the story follows sisters Vi and Jinx.",
      first_air_date: "2021-11-06",
      vote_average: 9.0,
      vote_count: 18000,
      popularity: 90
    },
    {
      id: 85271,
      name: "Wednesday",
      poster_path: "https://dummyimage.com/342x513/1f2937/ffffff.png?text=Wednesday",
      backdrop_path: "https://dummyimage.com/1280x720/1f2937/ffffff.png?text=Wednesday",
      overview: "Follow Wednesday Addams' years as a student at Nevermore Academy.",
      first_air_date: "2022-11-23",
      vote_average: 8.6,
      vote_count: 15000,
      popularity: 88
    },
    {
      id: 71712,
      name: "The Boys",
      poster_path: "https://dummyimage.com/342x513/1f2937/ffffff.png?text=The+Boys",
      backdrop_path: "https://dummyimage.com/1280x720/1f2937/ffffff.png?text=The+Boys",
      overview: "A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers.",
      first_air_date: "2019-07-26",
      vote_average: 8.7,
      vote_count: 20000,
      popularity: 85
    },
    {
      id: 103768,
      name: "The Bear",
      poster_path: "https://dummyimage.com/342x513/1f2937/ffffff.png?text=The+Bear",
      backdrop_path: "https://dummyimage.com/1280x720/1f2937/ffffff.png?text=The+Bear",
      overview: "A young chef from the fine dining world comes home to Chicago to run his family sandwich shop.",
      first_air_date: "2022-06-23",
      vote_average: 8.3,
      vote_count: 12000,
      popularity: 82
    }
  ];

  if (url.includes('/movie/popular') || url.includes('/movie/top_rated') || url.includes('/trending/movie')) {
    return { results: mockMovies };
  } else if (url.includes('/tv/popular') || url.includes('/tv/top_rated') || url.includes('/trending/tv')) {
    return { results: mockTVShows };
  } else if (url.includes('/search/')) {
    // For search, return both movies and TV shows
    return { results: [...mockMovies, ...mockTVShows] };
  }
  
  return { results: [] };
};

// Enhanced fetch with caching and FAST fallback for TMDB outages
const fetchWithCache = async (url) => {
  const cached = getCachedTMDBData(url);
  if (cached) {
    return cached;
  }
  
  // ULTRA FAST timeout - immediately fallback to mock data during outages
  const fastTimeout = 800; // 0.8 seconds only
  
  try {
    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Quick timeout')), fastTimeout)
    );
    
    // Create fetch promise
    const fetchPromise = fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    // Race between fetch and timeout
    const response = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    setCachedTMDBData(url, data);
    console.log('✅ TMDB API working perfectly!');
    return data;
  } catch (error) {
    console.log('⚡ TMDB timeout/error - immediately using mock data for fast loading');
    
    // IMMEDIATE fallback to mock data - no more attempts
    const mockData = getMockData(url);
    setCachedTMDBData(url, mockData);
    return mockData;
  }
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

export const getAnimeEmbedUrl = (anilistId, episode = 1, dub = 0, skip = 0) => {
  // vidsrc.icu format: https://vidsrc.icu/embed/anime/{id}/{episode}/{dub}/{skip}
  // anilistId: from https://anilist.co
  // episode: episode number (required)
  // dub: 0 for sub, 1 for dub (optional)
  // skip: 1 to auto skip intro/outro (optional)
  
  if (!anilistId) {
    console.error('Anime ID is required for streaming');
    return null;
  }
  
  let url = `${VIDSRC_ICU_BASE}/anime/${anilistId}/${episode}`;
  
  // Add dub preference if specified
  if (dub !== undefined) {
    url += `/${dub}`;
    
    // Add skip parameter if specified
    if (skip !== undefined) {
      url += `/${skip}`;
    }
  }
  
  console.log('🎌 Generated anime embed URL:', url);
  return url;
};

export const getMangaEmbedUrl = (anilistId, chapter = 1) => {
  // vidsrc.icu format: https://vidsrc.icu/embed/manga/{id}/{chapter}
  // anilistId: from https://anilist.co
  // chapter: chapter number (required)
  
  if (!anilistId) {
    console.error('Manga ID is required for reading');
    return null;
  }
  
  const url = `${VIDSRC_ICU_BASE}/manga/${anilistId}/${chapter}`;
  console.log('📚 Generated manga embed URL:', url);
  return url;
};

// TMDB API functions for getting movie/TV data
export const fetchTrendingMovies = async () => {
  try {
    const data = await fetchWithCache(
      `${TMDB_BASE}/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US`
    );
    return data.results || [];
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
};

export const fetchTrendingTV = async () => {
  try {
    const data = await fetchWithCache(
      `${TMDB_BASE}/trending/tv/week?api_key=${TMDB_API_KEY}&language=en-US`
    );
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
    const data = await fetchWithCache(
      `${TMDB_BASE}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    return data.results || [];
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return [];
  }
};

export const fetchTopRatedTV = async () => {
  try {
    const data = await fetchWithCache(
      `${TMDB_BASE}/tv/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    return data.results || [];
  } catch (error) {
    console.error('Error fetching top rated TV shows:', error);
    return [];
  }
};

export const searchContent = async (query, type = 'multi') => {
  try {
    if (!query.trim()) return [];
    const data = await fetchWithCache(
      `${TMDB_BASE}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`
    );
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
// Get TMDB image URL with fallback
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Get backup image URL when TMDB images fail
export const getBackupImageUrl = (title, size = 'w500') => {
  // Use a reliable image service with movie titles
  const encodedTitle = encodeURIComponent(title || 'Movie');
  const dimensions = size === 'w500' ? '500x750' : size === 'w342' ? '342x513' : '185x278';
  return `https://dummyimage.com/${dimensions}/1f2937/ffffff.png&text=${encodedTitle}`;
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
