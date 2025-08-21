// Test Gemini API integration
require('dotenv').config();

const testGeminiAPI = async () => {
  try {
    console.log('🔧 Testing Gemini API Setup...');
    
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    console.log('🔑 API Key present:', !!apiKey);
    console.log('🔑 API Key format:', apiKey ? apiKey.substring(0, 10) + '...' : 'Not found');
    
    if (!apiKey) {
      console.error('❌ API key not found!');
      return;
    }
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Say hello and confirm you are working!"
          }]
        }]
      })
    });
    
    console.log('📡 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Test successful!');
      console.log('🤖 AI Response:', data.candidates[0].content.parts[0].text);
    } else {
      const errorText = await response.text();
      console.error('❌ API Test failed:', errorText);
    }
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
  }
};

testGeminiAPI();
