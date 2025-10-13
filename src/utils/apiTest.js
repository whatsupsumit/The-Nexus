// API Testing utilities for The Nexus
import {
  testTMDBConnection,
  testVidSrcConnection,
  fetchTrendingMovies,
  fetchPopularMovies,
  getMovieEmbedUrl,
  getEpisodeEmbedUrl
} from './vidsrcApi';
import { logger } from './logger.js';

// Comprehensive API testing function
export const runAPITests = async () => {
  logger.info('🚀 Starting API Tests for The Nexus...\n');
  
  const results = {
    tmdb: { success: false, error: null },
    vidsrc: { success: false, error: null },
    movieData: { success: false, error: null },
    streaming: { success: false, error: null }
  };

  // Test 1: TMDB API Connection
  logger.info('📡 Testing TMDB API Connection...');
  try {
    const tmdbTest = await testTMDBConnection();
    results.tmdb = tmdbTest;
    logger.info(tmdbTest.success ? '✅ TMDB API: Connected' : '❌ TMDB API: Failed');
  } catch (error) {
    results.tmdb = { success: false, error: error.message };
    logger.info('❌ TMDB API: Connection Error');
  }

  // Test 2: VidSrc API Connection
  logger.info('📺 Testing VidSrc API Connection...');
  try {
    const vidsrcTest = await testVidSrcConnection();
    results.vidsrc = vidsrcTest;
    logger.info(vidsrcTest.success ? '✅ VidSrc API: Connected' : '❌ VidSrc API: Failed');
  } catch (error) {
    results.vidsrc = { success: false, error: error.message };
    logger.info('❌ VidSrc API: Connection Error');
  }

  // Test 3: TMDB Data Fetching
  logger.info('🎬 Testing TMDB Data Fetching...');
  try {
    const [trending, popular] = await Promise.all([
      fetchTrendingMovies(),
      fetchPopularMovies()
    ]);

    if (trending && trending.results && popular && popular.results) {
      results.movieData = {
        success: true,
        trendingCount: trending.results.length,
        popularCount: popular.results.length
      };
      logger.info(`✅ Movie Data: ${trending.results.length} trending, ${popular.results.length} popular`);
    } else {
      results.movieData = { success: false, error: 'No data returned' };
      logger.info('❌ Movie Data: No results found');
    }
  } catch (error) {
    results.movieData = { success: false, error: error.message };
    logger.info('❌ Movie Data: Fetch Error');
  }

  // Test 4: Streaming URL Generation
  logger.info('🔗 Testing Streaming URL Generation...');
  try {
    const movieUrl = getMovieEmbedUrl('385687', { autoplay: true, defaultLang: 'en' });
    const episodeUrl = getEpisodeEmbedUrl('1399', 1, 1, { autoplay: true, autonext: true });

    if (movieUrl && episodeUrl) {
      results.streaming = {
        success: true,
        movieUrl: movieUrl.substring(0, 50) + '...',
        episodeUrl: episodeUrl.substring(0, 50) + '...'
      };
      logger.info('✅ Streaming URLs: Generated successfully');
    } else {
      results.streaming = { success: false, error: 'URL generation failed' };
      logger.info('❌ Streaming URLs: Generation failed');
    }
  } catch (error) {
    results.streaming = { success: false, error: error.message };
    logger.info('❌ Streaming URLs: Generation error');
  }

  // Summary
  logger.info('\n📊 API Test Summary:');
  logger.info('='.repeat(50));

  const allSuccess = Object.values(results).every(r => r.success);
  logger.info(`Overall Status: ${allSuccess ? '✅ All APIs Working' : '⚠️ Some Issues Found'}`);

  Object.entries(results).forEach(([key, result]) => {
    const status = result.success ? '✅' : '❌';
    logger.info(`${status} ${key.toUpperCase()}: ${result.success ? 'OK' : result.error}`);
  });

  return results;
};

// Quick TMDB health check
export const quickTMDBCheck = async () => {
  try {
    const movies = await fetchTrendingMovies();
    return {
      healthy: !!(movies && movies.results && movies.results.length > 0),
      count: movies?.results?.length || 0,
      error: movies?.error || null
    };
  } catch (error) {
    return {
      healthy: false,
      count: 0,
      error: error.message
    };
  }
};

// Generate test streaming URLs
export const generateTestUrls = () => {
  return {
    movie: {
      basic: getMovieEmbedUrl('385687'),
      withOptions: getMovieEmbedUrl('385687', { 
        autoplay: true, 
        defaultLang: 'en' 
      })
    },
    episode: {
      basic: getEpisodeEmbedUrl('1399', 1, 1),
      withOptions: getEpisodeEmbedUrl('1399', 1, 1, { 
        autoplay: true, 
        autonext: true,
        defaultLang: 'en'
      })
    }
  };
};

const apiTestUtils = { runAPITests, quickTMDBCheck, generateTestUrls };
export default apiTestUtils;
