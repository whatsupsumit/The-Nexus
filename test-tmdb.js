// Quick test to verify TMDB API connectivity
const TMDB_API_KEY = 'dc36900a16e14b924c96e065225b935b';
const TMDB_BASE = 'https://api.themoviedb.org/3';

async function testTMDB() {
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
