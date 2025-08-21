// Enhanced Manga Reading API for NEXUS
// Integrating multiple sources for comprehensive manga reading functionality

const CONSUMET_BASE_URL = 'https://api.consumet.org/manga';

// Rate limiting and caching
const cache = new Map();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 500; // 500ms between requests

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

// Generic API request with error handling
const makeRequest = async (url, options = {}) => {
  const cacheKey = getCacheKey(url);
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    console.log('📋 Using cached data for:', url);
    return cachedData;
  }
  
  try {
    // Rate limiting
    const timeSinceLastRequest = Date.now() - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await new Promise(r => setTimeout(r, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
    }
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'User-Agent': 'NEXUS-Streaming-App',
        'Accept': 'application/json',
        ...options.headers
      }
    });
    
    lastRequestTime = Date.now();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('API returned non-JSON response (likely blocked or down)');
    }
    
    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
    
  } catch (error) {
    console.error('🚫 API Request failed:', error.message);
    throw error;
  }
};

// Mock data for when APIs are unavailable
const getMockMangaData = () => [
  {
    id: "demon-slayer",
    title: "Demon Slayer: Kimetsu no Yaiba",
    image: "https://dummyimage.com/300x400/8B0000/ffffff.png?text=Demon+Slayer",
    description: "A young boy becomes a demon slayer to save his sister.",
    genres: ["Action", "Supernatural", "Historical"],
    status: "Completed",
    chapters: [
      { id: "demon-slayer-chapter-1", title: "Chapter 1: Cruelty", releaseDate: "2016-02-15" },
      { id: "demon-slayer-chapter-2", title: "Chapter 2: Stranger", releaseDate: "2016-02-22" }
    ]
  },
  {
    id: "one-piece",
    title: "One Piece",
    image: "https://dummyimage.com/300x400/0066CC/ffffff.png?text=One+Piece",
    description: "Follow Monkey D. Luffy's quest to become the Pirate King.",
    genres: ["Adventure", "Comedy", "Action"],
    status: "Ongoing",
    chapters: [
      { id: "one-piece-chapter-1", title: "Chapter 1: Romance Dawn", releaseDate: "1997-07-22" },
      { id: "one-piece-chapter-2", title: "Chapter 2: They Call Him Straw Hat Luffy", releaseDate: "1997-08-04" }
    ]
  }
];

// Search manga with fallback to mock data
export const searchMangaForReading = async (query) => {
  if (!query.trim()) return [];
  
  try {
    // Try Consumet API first
    console.log('🔍 Searching manga:', query);
    const encodedQuery = encodeURIComponent(query);
    const url = `${CONSUMET_BASE_URL}/mangasee123/${encodedQuery}`;
    
    const data = await makeRequest(url);
    
    if (data && data.results && Array.isArray(data.results)) {
      console.log('✅ Found', data.results.length, 'manga results');
      return data.results.map(transformMangaSearchResult);
    }
    
    throw new Error('Invalid API response structure');
    
  } catch (error) {
    console.warn('⚠️ API failed, using mock data:', error.message);
    const mockData = getMockMangaData();
    return mockData.filter(manga => 
      manga.title.toLowerCase().includes(query.toLowerCase())
    );
  }
};

// Get manga details and chapters
export const getMangaDetailsForReading = async (mangaId) => {
  try {
    console.log('📖 Getting manga details:', mangaId);
    const url = `${CONSUMET_BASE_URL}/mangasee123/info?id=${mangaId}`;
    
    const data = await makeRequest(url);
    
    if (data && data.id) {
      console.log('✅ Got manga details');
      return transformMangaDetails(data);
    }
    
    throw new Error('Invalid manga details response');
    
  } catch (error) {
    console.warn('⚠️ API failed, using mock data:', error.message);
    const mockData = getMockMangaData();
    return mockData.find(m => m.id === mangaId) || mockData[0];
  }
};

// Get chapter pages for reading
export const getMangaChapterPages = async (chapterId) => {
  try {
    console.log('📄 Getting chapter pages:', chapterId);
    const url = `${CONSUMET_BASE_URL}/mangasee123/read/${chapterId}`;
    
    const data = await makeRequest(url);
    
    if (Array.isArray(data) && data.length > 0) {
      console.log('✅ Got', data.length, 'pages');
      return data.map(transformChapterPage);
    }
    
    throw new Error('Invalid chapter pages response');
    
  } catch (error) {
    console.warn('⚠️ API failed, using mock pages:', error.message);
    // Return mock pages for demonstration
    return generateMockChapterPages(chapterId);
  }
};

// Transform search results to consistent format
const transformMangaSearchResult = (manga) => ({
  id: manga.id,
  title: manga.title,
  image: manga.image || 'https://dummyimage.com/300x400/1f2937/ffffff.png?text=Manga',
  altTitles: manga.altTitles || [],
  headerForImage: manga.headerForImage || {}
});

// Transform manga details
const transformMangaDetails = (manga) => ({
  id: manga.id,
  title: manga.title,
  altTitles: manga.altTitles || [],
  genres: manga.genres || [],
  image: manga.image || 'https://dummyimage.com/300x400/1f2937/ffffff.png?text=Manga',
  description: manga.description || 'No description available.',
  status: manga.status || 'Unknown',
  chapters: manga.chapters ? manga.chapters.map(ch => ({
    id: ch.id,
    title: ch.title,
    releaseDate: ch.releaseDate,
    number: extractChapterNumber(ch.title)
  })).sort((a, b) => a.number - b.number) : [],
  headerForImage: manga.headerForImage || {}
});

// Transform chapter pages
const transformChapterPage = (page) => ({
  page: page.page,
  img: page.img,
  headerForImage: page.headerForImage || { Referer: 'https://mangasee123.com/' }
});

// Generate mock chapter pages for demonstration
const generateMockChapterPages = (chapterId) => {
  const pageCount = Math.floor(Math.random() * 15) + 10; // 10-25 pages
  const pages = [];
  
  for (let i = 1; i <= pageCount; i++) {
    pages.push({
      page: i,
      img: `https://dummyimage.com/800x1200/333333/ffffff.png?text=Page+${i}+of+${chapterId.replace(/-/g, '+').toUpperCase()}`,
      headerForImage: { Referer: 'https://mangasee123.com/' }
    });
  }
  
  return pages;
};

// Extract chapter number from title
const extractChapterNumber = (title) => {
  const match = title.match(/chapter[^\d]*(\d+(?:\.\d+)?)/i);
  return match ? parseFloat(match[1]) : 0;
};

// Test API connectivity
export const testMangaAPIConnectivity = async () => {
  try {
    console.log('🧪 Testing manga API connectivity...');
    const testResults = await searchMangaForReading('naruto');
    
    if (testResults && testResults.length > 0) {
      console.log('✅ Manga API is working!');
      return { working: true, source: 'consumet', results: testResults.length };
    } else {
      console.log('⚠️ API returned no results, using fallback');
      return { working: false, source: 'mock', results: 0 };
    }
  } catch (error) {
    console.log('❌ API test failed:', error.message);
    return { working: false, source: 'mock', error: error.message };
  }
};

// Export all functions
const mangaReadingApi = {
  searchMangaForReading,
  getMangaDetailsForReading,
  getMangaChapterPages,
  testMangaAPIConnectivity
};

export default mangaReadingApi;
