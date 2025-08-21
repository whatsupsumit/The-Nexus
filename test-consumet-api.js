// Test script for Consumet Mangasee123 API
// Using fetch instead of axios since it's built into Node.js 18+

async function testConsumetAPI() {
  console.log('Testing Consumet Mangasee123 API...\n');
  
  try {
    // Test 1: Search for manga
    console.log('1. Testing search functionality...');
    const searchUrl = "https://api.consumet.org/manga/mangasee123/demon";
    const searchResponse = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'NEXUS-Streaming-App'
      }
    });
    
    console.log('Response status:', searchResponse.status);
    console.log('Response headers:', searchResponse.headers);
    
    if (!searchResponse.ok) {
      throw new Error(`Search failed: ${searchResponse.status}`);
    }
    
    const responseText = await searchResponse.text();
    console.log('Raw response (first 500 chars):', responseText.substring(0, 500));
    
    try {
      const searchData = JSON.parse(responseText);
      console.log('✅ Search API works!');
      console.log('Sample results:', JSON.stringify(searchData, null, 2));
    } catch (parseError) {
      console.log('❌ JSON parsing failed:', parseError.message);
      console.log('This might indicate the API is down or returning HTML error pages');
    }
    
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
  }
}

testConsumetAPI();
