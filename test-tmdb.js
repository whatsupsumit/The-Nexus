// Quick test to verify TMDB API connectivity
// NOTE: Replace YOUR_API_KEY_HERE with your actual TMDB API key for testing
const TMDB_API_KEY = 'YOUR_API_KEY_HERE';
const TMDB_BASE = 'https://api.themoviedb.org/3';

async function testTMDB() {
  // Safety check to prevent running with placeholder API key
  if (TMDB_API_KEY === 'YOUR_API_KEY_HERE' || !TMDB_API_KEY || TMDB_API_KEY.length < 10) {
    console.error('❌ Please replace YOUR_API_KEY_HERE with your actual TMDB API key');
    console.log('Get your API key from: https://www.themoviedb.org/settings/api');
    return false;
  }

  try {
    console.log('Testing TMDB API connectivity...');
    const response = await fetch(`${TMDB_BASE}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ TMDB API is working!');
    console.log(`Found ${data.results.length} popular movies`);
    console.log('First movie:', data.results[0].title);
    
    return true;
  } catch (error) {
    console.error('❌ TMDB API test failed:', error.message);
    return false;
  }
}

testTMDB();
