// Manga API utilities - Using Jikan API for manga data + AniList for IDs
const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

// Enhanced cache to avoid hitting API rate limits
const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for longer cache
const requestQueue = [];
let isProcessingQueue = false;
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests for Jikan API

const getCacheKey = (url) => url;

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

// Rate limiting queue processor
const processRequestQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const { resolve, reject, url } = requestQueue.shift();
    
    try {
      // Ensure proper spacing between requests
      const timeSinceLastRequest = Date.now() - lastRequestTime;
      if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise(r => setTimeout(r, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
      }
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'NEXUS-Streaming-App'
        }
      });
      
      lastRequestTime = Date.now();
      
      if (!response.ok) {
        throw new Error(`Jikan API error: ${response.status}`);
      }
      
      const data = await response.json();
      resolve(data);
    } catch (error) {
      reject(error);
    }
  }
  
  isProcessingQueue = false;
};

// Mock data for fallback when API fails
const getMockMangaData = (type) => {
  const mockManga = [
    {
      mal_id: 2, title: "Berserk", score: 9.4, chapters: 364, year: 1989,
      synopsis: "Dark fantasy tale of Guts, a lone swordsman in a brutal medieval world.",
      images: { jpg: { large_image_url: "https://dummyimage.com/300x400/330033/ffffff.png?text=Berserk" } },
      genres: [{ name: "Action" }, { name: "Horror" }, { name: "Supernatural" }],
      status: "Publishing", type: "Manga"
    },
    {
      mal_id: 13, title: "One Piece", score: 9.2, chapters: 1000, year: 1997,
      synopsis: "Epic pirate adventure in search of the ultimate treasure.",
      images: { jpg: { large_image_url: "https://dummyimage.com/300x400/0066cc/ffffff.png?text=One+Piece" } },
      genres: [{ name: "Adventure" }, { name: "Comedy" }, { name: "Drama" }],
      status: "Publishing", type: "Manga"
    },
    {
      mal_id: 157, title: "Vagabond", score: 9.0, chapters: 327, year: 1998,
      synopsis: "Legendary swordsman Miyamoto Musashi's journey to enlightenment.",
      images: { jpg: { large_image_url: "https://dummyimage.com/300x400/cc6600/ffffff.png?text=Vagabond" } },
      genres: [{ name: "Action" }, { name: "Drama" }, { name: "Historical" }],
      status: "On Hiatus", type: "Manga"
    },
    {
      mal_id: 761, title: "Monster", score: 9.1, chapters: 162, year: 1994,
      synopsis: "Psychological thriller about a doctor hunting a dangerous patient.",
      images: { jpg: { large_image_url: "https://dummyimage.com/300x400/666666/ffffff.png?text=Monster" } },
      genres: [{ name: "Drama" }, { name: "Horror" }, { name: "Psychological" }],
      status: "Finished", type: "Manga"
    },
    {
      mal_id: 74, title: "Slam Dunk", score: 9.0, chapters: 276, year: 1990,
      synopsis: "Basketball manga following delinquent Sakuragi Hanamichi.",
      images: { jpg: { large_image_url: "https://dummyimage.com/300x400/ff6600/ffffff.png?text=Slam+Dunk" } },
      genres: [{ name: "Comedy" }, { name: "Drama" }, { name: "Sports" }],
      status: "Finished", type: "Manga"
    },
    {
      mal_id: 116, title: "Fullmetal Alchemist", score: 9.0, chapters: 109, year: 2001,
      synopsis: "Brothers use alchemy to search for the Philosopher's Stone.",
      images: { jpg: { large_image_url: "https://dummyimage.com/300x400/cc3300/ffffff.png?text=Fullmetal+Alchemist" } },
      genres: [{ name: "Action" }, { name: "Drama" }, { name: "Fantasy" }],
      status: "Finished", type: "Manga"
    }
  ];
  
  return { data: mockManga.slice(0, 20) };
};

// Generic API request with enhanced caching and rate limiting
const makeRequest = async (endpoint) => {
  const url = `${JIKAN_BASE_URL}${endpoint}`;
  const cacheKey = getCacheKey(url);
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    
    return cachedData;
  }
  
  // Return mock data immediately if we've had recent rate limit errors
  const recentErrors = cache.get('recent_errors') || [];
  const recentRateLimit = recentErrors.some(error => 
    error.type === 'rate_limit' && Date.now() - error.timestamp < 60000
  );
  
  if (recentRateLimit) {
    
    const mockData = getMockMangaData(endpoint);
    setCachedData(cacheKey, mockData);
    return mockData;
  }
  
  try {
    // Add request to queue for rate limiting
    const data = await new Promise((resolve, reject) => {
      requestQueue.push({ resolve, reject, url });
      processRequestQueue();
    });
    
    setCachedData(cacheKey, data);
    
    return data;
  } catch (error) {
    
    
    // Track rate limit errors
    if (error.message.includes('429')) {
      const errors = cache.get('recent_errors') || [];
      errors.push({ type: 'rate_limit', timestamp: Date.now() });
      cache.set('recent_errors', errors.slice(-5)); // Keep last 5 errors
    }
    
    // Return mock data as fallback
    
    const mockData = getMockMangaData(endpoint);
    setCachedData(cacheKey, mockData);
    return mockData;
  }
};

// Transform Jikan manga data to match our app format
const transformMangaData = (manga) => {
  // Get the best quality image URLs
  const getImageUrl = (images) => {
    if (!images || !images.jpg) {
      return 'https://dummyimage.com/342x513/1f2937/ffffff.png?text=Manga';
    }
    
    // Priority: large_image_url > image_url > small_image_url
    return images.jpg.large_image_url || 
           images.jpg.image_url || 
           images.jpg.small_image_url ||
           'https://dummyimage.com/342x513/1f2937/ffffff.png?text=Manga';
  };

  const imageUrl = getImageUrl(manga.images);
  
  return {
    id: manga.mal_id,
    title: manga.title || manga.title_english || 'Unknown Manga',
    name: manga.title || manga.title_english || 'Unknown Manga',
    original_title: manga.title_english || manga.title_japanese || manga.title,
    overview: manga.synopsis || 'No synopsis available.',
    poster_path: imageUrl,
    backdrop_path: imageUrl,
    release_date: manga.published?.from || manga.year || new Date().getFullYear(),
    first_air_date: manga.published?.from || manga.year || new Date().getFullYear(),
    vote_average: manga.score || 0,
    vote_count: manga.scored_by || 0,
    popularity: manga.popularity || 0,
    genres: manga.genres?.map(g => ({ id: g.mal_id, name: g.name })) || [],
    media_type: 'manga',
    type: manga.type, // Manga, Manhwa, Manhua, etc.
    chapters: manga.chapters || 'Unknown',
    volumes: manga.volumes || 'Unknown',
    status: manga.status || 'Unknown',
    rating: manga.rating || 'Not Rated',
    year: manga.year || new Date().getFullYear(),
    authors: manga.authors?.map(a => a.name) || [],
    serializations: manga.serializations?.map(s => s.name) || [],
    mal_id: manga.mal_id,
    url: manga.url,
    score: manga.score || 0,
    // Additional manga-specific data
    published: manga.published,
    themes: manga.themes?.map(t => t.name) || [],
    demographics: manga.demographics?.map(d => d.name) || [],
    // For streaming compatibility
    anilist_id: manga.external?.find(ext => ext.name === 'AniList')?.url?.split('/').pop() || manga.mal_id
  };
};

// Fetch top manga
export const fetchTopManga = async (page = 1) => {
  try {
    const data = await makeRequest(`/top/manga?page=${page}&limit=20`);
    return data.data.map(transformMangaData);
  } catch (error) {
    
    return [];
  }
};

// Fetch trending manga (using currently publishing)
export const fetchTrendingManga = async () => {
  try {
    const data = await makeRequest('/top/manga?filter=bypopularity&page=1&limit=20');
    return data.data.map(transformMangaData);
  } catch (error) {
    
    return [];
  }
};

// Fetch popular manga
export const fetchPopularManga = async () => {
  try {
    const data = await makeRequest('/top/manga?filter=bypopularity&page=1&limit=20');
    return data.data.map(transformMangaData);
  } catch (error) {
    
    return [];
  }
};

// Search manga
export const searchManga = async (query, page = 1) => {
  if (!query.trim()) return [];
  
  try {
    const encodedQuery = encodeURIComponent(query);
    const data = await makeRequest(`/manga?q=${encodedQuery}&page=${page}&limit=20&order_by=popularity`);
    return data.data.map(transformMangaData);
  } catch (error) {
    
    return [];
  }
};

// Get manga details by ID
export const getMangaDetails = async (mangaId) => {
  try {
    const data = await makeRequest(`/manga/${mangaId}/full`);
    return transformMangaData(data.data);
  } catch (error) {
    
    return null;
  }
};

// Get manga characters
export const getMangaCharacters = async (mangaId) => {
  try {
    const data = await makeRequest(`/manga/${mangaId}/characters`);
    return data.data.map(char => ({
      id: char.character.mal_id,
      name: char.character.name,
      image: char.character.images?.jpg?.image_url,
      role: char.role
    }));
  } catch (error) {
    
    return [];
  }
};

// Get manga recommendations
export const getMangaRecommendations = async (mangaId) => {
  try {
    const data = await makeRequest(`/manga/${mangaId}/recommendations`);
    return data.data.slice(0, 10).map(rec => transformMangaData(rec.entry));
  } catch (error) {
    
    return [];
  }
};

// Get manga by genre
export const getMangaByGenre = async (genreId, page = 1) => {
  try {
    const data = await makeRequest(`/manga?genres=${genreId}&page=${page}&limit=20&order_by=popularity`);
    return data.data.map(transformMangaData);
  } catch (error) {
    
    return [];
  }
};

// Manga genres list (similar to anime but manga-specific)
export const MANGA_GENRES = {
  1: 'Action',
  2: 'Adventure',
  4: 'Comedy',
  8: 'Drama',
  9: 'Ecchi',
  10: 'Fantasy',
  14: 'Horror',
  22: 'Romance',
  24: 'Sci-Fi',
  36: 'Slice of Life',
  37: 'Supernatural',
  41: 'Thriller',
  43: 'Josei',
  15: 'Kids',
  42: 'Seinen',
  25: 'Shoujo',
  27: 'Shounen'
};

const mangaApi = {
  fetchTopManga,
  fetchTrendingManga,
  fetchPopularManga,
  searchManga,
  getMangaDetails,
  getMangaCharacters,
  getMangaRecommendations,
  getMangaByGenre,
  MANGA_GENRES
};

export default mangaApi;
