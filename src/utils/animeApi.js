// Anime API utilities - Using Jikan API (MyAnimeList unofficial API)
const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

// Cache to avoid hitting API rate limits
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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

// Generic API request with caching and rate limiting
const makeRequest = async (endpoint) => {
  const url = `${JIKAN_BASE_URL}${endpoint}`;
  const cacheKey = getCacheKey(url);
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    console.log('NEXUS: Returning cached anime data');
    return cachedData;
  }
  
  try {
    // Add delay to respect rate limits (Jikan has 3 requests per second limit)
    await new Promise(resolve => setTimeout(resolve, 334));
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }
    
    const data = await response.json();
    setCachedData(cacheKey, data);
    console.log('NEXUS: Anime data fetched from API');
    return data;
  } catch (error) {
    console.error('NEXUS: Anime API Error:', error);
    throw error;
  }
};

// Transform Jikan anime data to match our app format
const transformAnimeData = (anime) => {
  // Get the best quality image URLs
  const getImageUrl = (images) => {
    if (!images || !images.jpg) {
      return 'https://via.placeholder.com/300x400/1a1a1a/ef4444?text=No+Image';
    }
    
    // Priority: large_image_url > image_url > small_image_url
    return images.jpg.large_image_url || 
           images.jpg.image_url || 
           images.jpg.small_image_url ||
           'https://via.placeholder.com/300x400/1a1a1a/ef4444?text=Anime';
  };

  const imageUrl = getImageUrl(anime.images);
  
  return {
    id: anime.mal_id,
    title: anime.title || anime.title_english || 'Unknown Anime',
    name: anime.title || anime.title_english || 'Unknown Anime',
    original_title: anime.title_english || anime.title_japanese || anime.title,
    overview: anime.synopsis || 'No synopsis available.',
    poster_path: imageUrl,
    backdrop_path: imageUrl,
    release_date: anime.aired?.from || anime.year || new Date().getFullYear(),
    first_air_date: anime.aired?.from || anime.year || new Date().getFullYear(),
    vote_average: anime.score || 0,
    vote_count: anime.scored_by || 0,
    popularity: anime.popularity || 0,
    genres: anime.genres?.map(g => ({ id: g.mal_id, name: g.name })) || [],
    media_type: 'anime',
    type: anime.type, // TV, Movie, OVA, etc.
    episodes: anime.episodes || 1,
    status: anime.status || 'Unknown',
    rating: anime.rating || 'Not Rated',
    duration: anime.duration || 'Unknown',
    year: anime.year || new Date().getFullYear(),
    season: anime.season || 'Unknown',
    studios: anime.studios?.map(s => s.name) || [],
    mal_id: anime.mal_id,
    url: anime.url,
    trailer: anime.trailer?.url || anime.trailer?.embed_url,
    score: anime.score || 0,
    // Additional anime-specific data
    source: anime.source,
    aired: anime.aired,
    broadcast: anime.broadcast,
    licensors: anime.licensors?.map(l => l.name) || [],
    themes: anime.themes?.map(t => t.name) || [],
    demographics: anime.demographics?.map(d => d.name) || []
  };
};

// Fetch top anime
export const fetchTopAnime = async (page = 1) => {
  try {
    const data = await makeRequest(`/top/anime?page=${page}&limit=20`);
    return data.data.map(transformAnimeData);
  } catch (error) {
    console.error('Error fetching top anime:', error);
    return [];
  }
};

// Fetch seasonal anime
export const fetchSeasonalAnime = async (year = new Date().getFullYear(), season = 'fall') => {
  try {
    const data = await makeRequest(`/seasons/${year}/${season}?page=1&limit=20`);
    return data.data.map(transformAnimeData);
  } catch (error) {
    console.error('Error fetching seasonal anime:', error);
    return [];
  }
};

// Fetch trending anime (using top airing)
export const fetchTrendingAnime = async () => {
  try {
    const data = await makeRequest('/top/anime?filter=airing&page=1&limit=20');
    return data.data.map(transformAnimeData);
  } catch (error) {
    console.error('Error fetching trending anime:', error);
    return [];
  }
};

// Fetch popular anime
export const fetchPopularAnime = async () => {
  try {
    const data = await makeRequest('/top/anime?filter=bypopularity&page=1&limit=20');
    return data.data.map(transformAnimeData);
  } catch (error) {
    console.error('Error fetching popular anime:', error);
    return [];
  }
};

// Search anime
export const searchAnime = async (query, page = 1) => {
  if (!query.trim()) return [];
  
  try {
    const encodedQuery = encodeURIComponent(query);
    const data = await makeRequest(`/anime?q=${encodedQuery}&page=${page}&limit=20&order_by=popularity`);
    return data.data.map(transformAnimeData);
  } catch (error) {
    console.error('Error searching anime:', error);
    return [];
  }
};

// Get anime details by ID
export const getAnimeDetails = async (animeId) => {
  try {
    const data = await makeRequest(`/anime/${animeId}/full`);
    return transformAnimeData(data.data);
  } catch (error) {
    console.error('Error fetching anime details:', error);
    return null;
  }
};

// Get anime characters
export const getAnimeCharacters = async (animeId) => {
  try {
    const data = await makeRequest(`/anime/${animeId}/characters`);
    return data.data.map(char => ({
      id: char.character.mal_id,
      name: char.character.name,
      image: char.character.images?.jpg?.image_url,
      role: char.role,
      voice_actors: char.voice_actors?.map(va => ({
        name: va.person.name,
        image: va.person.images?.jpg?.image_url,
        language: va.language
      })) || []
    }));
  } catch (error) {
    console.error('Error fetching anime characters:', error);
    return [];
  }
};

// Get anime recommendations
export const getAnimeRecommendations = async (animeId) => {
  try {
    const data = await makeRequest(`/anime/${animeId}/recommendations`);
    return data.data.slice(0, 10).map(rec => transformAnimeData(rec.entry));
  } catch (error) {
    console.error('Error fetching anime recommendations:', error);
    return [];
  }
};

// Get anime by genre
export const getAnimeByGenre = async (genreId, page = 1) => {
  try {
    const data = await makeRequest(`/anime?genres=${genreId}&page=${page}&limit=20&order_by=popularity`);
    return data.data.map(transformAnimeData);
  } catch (error) {
    console.error('Error fetching anime by genre:', error);
    return [];
  }
};

// Get anime streaming sources (placeholder - you'll need a different API for actual streaming)
export const getAnimeStreamingUrl = (animeId, episode = 1) => {
  // This is a placeholder. You'll need to integrate with anime streaming APIs
  // For now, return a placeholder URL structure
  console.log('NEXUS: Anime streaming requested for ID:', animeId, 'Episode:', episode);
  return `https://example-anime-stream.com/anime/${animeId}/episode/${episode}`;
};

// Anime genres list
export const ANIME_GENRES = {
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
  41: 'Thriller'
};

const animeApi = {
  fetchTopAnime,
  fetchSeasonalAnime,
  fetchTrendingAnime,
  fetchPopularAnime,
  searchAnime,
  getAnimeDetails,
  getAnimeCharacters,
  getAnimeRecommendations,
  getAnimeByGenre,
  getAnimeStreamingUrl,
  ANIME_GENRES
};

export default animeApi;
