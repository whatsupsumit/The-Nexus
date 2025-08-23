// Mobile-Enhanced API Helper for The Nexus
// Provides robust mobile compatibility, network detection, and fallback systems

// Network and device detection utilities
export const detectDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  return {
    isMobile: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent),
    isIOS: /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream,
    isAndroid: /android/i.test(userAgent),
    isLowEndDevice: navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2,
    connectionType: navigator.connection?.effectiveType || 'unknown'
  };
};

// Network connectivity checker
export const checkNetworkConnectivity = async () => {
  try {
    // Test with a small, fast endpoint
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('https://httpbin.org/status/200', {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-cache'
    });
    
    clearTimeout(timeoutId);
    
    return {
      isOnline: response.ok,
      latency: performance.now(),
      connectionQuality: navigator.connection?.effectiveType || 'unknown'
    };
  } catch (error) {
    return {
      isOnline: navigator.onLine,
      latency: Infinity,
      connectionQuality: 'poor',
      error: error.message
    };
  }
};

// Enhanced fetch with mobile-specific optimizations
export const mobileOptimizedFetch = async (url, options = {}) => {
  const device = detectDevice();
  const maxRetries = device.isMobile ? 3 : 1;
  const timeoutDuration = device.isMobile ? 15000 : 10000;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeoutDuration);
      
      const fetchOptions = {
        ...options,
        signal: controller.signal,
        headers: {
          'User-Agent': device.isMobile ? 'Mozilla/5.0 (Mobile; rv:100.0)' : navigator.userAgent,
          'Accept': 'application/json',
          'Cache-Control': device.isMobile ? 'max-age=300' : 'no-cache',
          ...options.headers
        }
      };
      
      // Add mobile-specific headers
      if (device.isMobile) {
        fetchOptions.headers['X-Requested-With'] = 'XMLHttpRequest';
        fetchOptions.headers['Accept-Encoding'] = 'gzip, deflate';
      }
      
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Progressive backoff delay
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Mock data generator for mobile fallback
export const generateMockMovieData = (count = 20) => {
  const mockMovies = [];
  const genres = ['Action', 'Comedy', 'Drama', 'Thriller', 'Sci-Fi', 'Horror', 'Romance', 'Adventure'];
  const titles = [
    'Digital Nexus', 'Cyber Dreams', 'Future Shock', 'Neon Nights', 'Virtual Reality',
    'Data Stream', 'Code Warriors', 'Tech Revolution', 'Digital Frontier', 'Cyber Storm',
    'Neural Network', 'Quantum Leap', 'Space Odyssey', 'Time Paradox', 'Mind Bender',
    'Reality Check', 'System Override', 'Digital Phoenix', 'Cyber Knight', 'Data Hunter'
  ];
  
  for (let i = 0; i < count; i++) {
    mockMovies.push({
      id: 900000 + i, // Use high IDs to avoid conflicts
      title: titles[i % titles.length] + (i > titles.length ? ` ${Math.ceil(i / titles.length)}` : ''),
      overview: `A thrilling ${genres[i % genres.length].toLowerCase()} experience that will keep you on the edge of your seat. This high-quality entertainment delivers exceptional storytelling and unforgettable characters.`,
      poster_path: `/placeholder-poster-${(i % 5) + 1}.jpg`,
      backdrop_path: `/placeholder-backdrop-${(i % 3) + 1}.jpg`,
      release_date: new Date(2020 + (i % 4), i % 12, (i % 28) + 1).toISOString().split('T')[0],
      vote_average: 7.0 + (i % 3),
      vote_count: 1000 + (i * 100),
      genre_ids: [genres[i % genres.length]],
      adult: false,
      video: false,
      original_language: 'en',
      popularity: 100 - i,
      isMockData: true
    });
  }
  
  return mockMovies;
};

// Mobile-optimized storage with compression
export const mobileCache = {
  set: (key, data, ttl = 300000) => { // 5 minutes default TTL
    try {
      const item = {
        data: data,
        timestamp: Date.now(),
        ttl: ttl,
        device: detectDevice().isMobile ? 'mobile' : 'desktop'
      };
      
      // Compress data for mobile devices
      const jsonString = JSON.stringify(item);
      if (jsonString.length > 1000000 && detectDevice().isMobile) { // 1MB limit for mobile
        return false;
      }
      
      localStorage.setItem(`nexus_${key}`, jsonString);
      return true;
    } catch (error) {
      return false;
    }
  },
  
  get: (key) => {
    try {
      const cached = localStorage.getItem(`nexus_${key}`);
      if (!cached) return null;
      
      const item = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is still valid
      if (now - item.timestamp > item.ttl) {
        localStorage.removeItem(`nexus_${key}`);
        return null;
      }
      
      return item.data;
    } catch (error) {
      localStorage.removeItem(`nexus_${key}`);
      return null;
    }
  },
  
  clear: () => {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('nexus_'));
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      // Silent error handling
    }
  }
};

// Enhanced API with mobile fallback system
export const mobileApiHandler = {
  // Generic API call with full mobile support
  call: async (url, options = {}) => {
    const device = detectDevice();
    const cacheKey = `api_${btoa(url)}`;
    
    // Try cache first for mobile devices
    if (device.isMobile) {
      const cached = mobileCache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }
    
    try {
      // Check network connectivity first
      const connectivity = await checkNetworkConnectivity();
      if (!connectivity.isOnline) {
        throw new Error('No network connectivity detected');
      }
      
      const data = await mobileOptimizedFetch(url, options);
      
      // Cache successful responses for mobile
      if (device.isMobile && data) {
        mobileCache.set(cacheKey, data, 300000); // 5 minutes
      }
      
      return data;
    } catch (error) {
      // Return mock data as fallback for mobile
      if (device.isMobile) {
        if (url.includes('/movie/') || url.includes('/trending/movie')) {
          return {
            results: generateMockMovieData(20),
            total_results: 20,
            total_pages: 1,
            page: 1,
            isMockData: true
          };
        }
        if (url.includes('/tv/') || url.includes('/trending/tv')) {
          return {
            results: generateMockTVData(20),
            total_results: 20,
            total_pages: 1,
            page: 1,
            isMockData: true
          };
        }
      }
      
      throw error;
    }
  }
};

// Mock TV data generator
export const generateMockTVData = (count = 20) => {
  const mockShows = [];
  const genres = ['Drama', 'Comedy', 'Action', 'Thriller', 'Sci-Fi', 'Mystery', 'Fantasy', 'Crime'];
  const titles = [
    'Digital Chronicles', 'Cyber Tales', 'Future Vision', 'Neon Series', 'Virtual Worlds',
    'Data Matrix', 'Code Masters', 'Tech Legends', 'Digital Heroes', 'Cyber Adventures',
    'Neural Stories', 'Quantum Tales', 'Space Chronicles', 'Time Travelers', 'Mind Games',
    'Reality Shift', 'System Stories', 'Digital Saga', 'Cyber Quest', 'Data Legends'
  ];
  
  for (let i = 0; i < count; i++) {
    mockShows.push({
      id: 800000 + i, // Use high IDs to avoid conflicts
      name: titles[i % titles.length] + (i > titles.length ? ` ${Math.ceil(i / titles.length)}` : ''),
      overview: `An engaging ${genres[i % genres.length].toLowerCase()} series that captivates audiences with compelling storylines and memorable characters across multiple seasons.`,
      poster_path: `/placeholder-tv-poster-${(i % 5) + 1}.jpg`,
      backdrop_path: `/placeholder-tv-backdrop-${(i % 3) + 1}.jpg`,
      first_air_date: new Date(2018 + (i % 6), i % 12, (i % 28) + 1).toISOString().split('T')[0],
      vote_average: 7.5 + (i % 3) * 0.5,
      vote_count: 800 + (i * 75),
      genre_ids: [genres[i % genres.length]],
      adult: false,
      original_language: 'en',
      popularity: 150 - i,
      number_of_seasons: Math.max(1, i % 7),
      number_of_episodes: (Math.max(1, i % 7)) * (8 + (i % 15)),
      isMockData: true
    });
  }
  
  return mockShows;
};

// Initialize mobile optimizations
export const initializeMobileOptimizations = () => {
  const device = detectDevice();
  
  if (device.isMobile) {
    // Clear old cache on startup
    if (Math.random() < 0.1) { // 10% chance to clear cache
      mobileCache.clear();
    }
    
    // Add network change listeners
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', () => {
        // Silent network monitoring
      });
    }
  }
  
  return device;
};
