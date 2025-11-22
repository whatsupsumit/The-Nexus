// Gemini AI API utility - Movie spoilers aur recommendations generate karne ke liye
// Yeh file Gemini AI se communicate karke movie suggestions aur detailed spoilers provide karti hai

// Environment variable se Gemini API key lete hain
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

/**
 * Movie ka detailed spoiler story generate karta hai Gemini AI use karke
 * Yeh function movie ka complete story batata hai with all plot twists
 * @param {Object} movieData - TMDB se movie ka data (title, overview, genres, etc.)
 * @returns {Promise<string>} - AI-generated spoiler content (full story with details)
 */
export const generateMovieSpoiler = async (movieData) => {
  // Pehle check karte hain ki API key hai ya nahi
  if (!GEMINI_API_KEY) {
    console.warn('⚠️ Gemini API key not found, using fallback');
    // Agar API key nahi hai to backup spoiler generate karte hain
    return generateFallbackSpoiler(movieData);
  }

  // Movie data se zaroori information extract karte hain
  const { title, release_date, overview, genres } = movieData;
  // Release date se year nikaal rahe hain
  const year = release_date ? new Date(release_date).getFullYear() : 'Unknown';
  // Saari genres ko comma-separated string mein convert kar rahe hain
  const genreNames = genres?.map(g => g.name).join(', ') || 'Unknown';

  // AI ke liye detailed prompt create kar rahe hain
  // Yeh prompt AI ko batata hai ki kya generate karna hai
  const prompt = `Write a detailed story summary with FULL SPOILERS for the movie "${title}" (${year}).

Movie Overview: ${overview}
Genres: ${genreNames}

Please provide:
1. A comprehensive plot summary including ALL major spoilers
2. Character arcs and development
3. Key plot twists and revelations
4. The ending and resolution
5. Major themes and symbolism

Write in an engaging, narrative style. Include specific details about character motivations, plot twists, and the complete story arc from beginning to end. Make it detailed and informative for someone who wants to know the entire story without watching.

Format the response in clear paragraphs. Start with "⚠️ FULL SPOILERS AHEAD ⚠️" warning.`;

  const geminiEndpoints = [
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
  ];

  // Har endpoint ko ek ek karke try karte hain jab tak success nahi milta
  for (const endpoint of geminiEndpoints) {
    try {
      console.log('🤖 Generating spoiler with Gemini AI...');
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        console.warn(`Gemini API failed with status ${response.status}, trying next endpoint...`);
        continue;
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const generatedText = data.candidates[0].content.parts[0].text;
        console.log('✅ Spoiler generated successfully!');
        return generatedText;
      }
    } catch (error) {
      console.warn('Gemini API error:', error.message);
      continue;
    }
  }

  console.log('🔄 All Gemini endpoints failed, using fallback');
  return generateFallbackSpoiler(movieData);
};

/**
 * User ke message ke according movie recommendations generate karta hai Gemini AI use karke
 * Neural Chat mein yeh function use hota hai jab user movie ke baare mein puchta hai
 * @param {string} userMessage - User ka message/query (e.g., "comedy movie suggest karo")
 * @returns {Promise<string|null>} - AI-generated recommendation ya null agar fail ho
 */
export const generateRecommendation = async (userMessage) => {
  if (!GEMINI_API_KEY) {
    console.warn('⚠️ Gemini API key not found, cannot call Gemini');
    return null;
  }

  // System instruction - AI ko role aur behavior define karta hai
  // Yeh batata hai ki AI ko kaise respond karna hai (friendly, 2-3 recommendations)
  const systemInstruction = `You are NEXUS, a friendly movie recommendation assistant. Ask the user about their mood or context briefly if needed, then provide 2-3 specific movie recommendations (include year) with a short explanation why each fits, add emojis, and keep the tone casual and enthusiastic. Keep the response under 150 words.`;

  // System instruction + user message ko combine karke final prompt banate hain
  const prompt = `${systemInstruction}\n\nUser: ${userMessage}`;

  const geminiEndpoints = [
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
  ];

  for (const endpoint of geminiEndpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.9, topK: 40, topP: 0.95, maxOutputTokens: 400 }
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn(`Gemini recommend failed ${res.status}:`, err.error?.message || err);
        continue;
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (e) {
      console.warn('Gemini recommend error:', e.message || e);
      continue;
    }
  }

  // Return null to indicate failure so caller can fallback
  return null;
};

/**
 * Backup spoiler generate karta hai jab Gemini AI fail ho jaye
 * Yeh basic movie information use karke ek template-based spoiler banata hai
 * @param {Object} movieData - Movie data from TMDB
 * @returns {string} - Fallback spoiler content
 */
const generateFallbackSpoiler = (movieData) => {
  const { title, overview, genres } = movieData;
  const genreNames = genres?.map(g => g.name).join(', ') || 'Various genres';

  return `⚠️ FULL SPOILERS AHEAD ⚠️

${overview || 'No overview available.'}

📖 Detailed Story Analysis

This ${genreNames.toLowerCase()} film "${title}" takes viewers on a compelling journey through its narrative. While we don't have AI-generated spoilers available at the moment, here's what we know:

The film explores its themes through carefully crafted character arcs and plot developments. The story builds tension through its pacing and reveals key information at strategic moments to maintain audience engagement.

🎬 Plot Development

The narrative structure follows classic storytelling conventions while adding unique twists that set this film apart. Characters face challenges that test their resolve and lead to significant character growth throughout the story.

⭐ Resolution

The film concludes by tying together the various plot threads established earlier, providing resolution to the central conflicts while potentially leaving some elements open for interpretation or continuation.

💡 Note: For a complete AI-generated spoiler analysis, please ensure your Gemini API key is configured in your environment variables (REACT_APP_GEMINI_API_KEY).`;
};

/**
 * Spoiler cache management - Generated spoilers ko save karta hai taki baar baar API call na karna pade
 * LocalStorage use karke data store hota hai browser mein
 */
const SPOILER_CACHE_KEY = 'nexus_spoiler_cache'; // localStorage mein key ka naam
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days = 7 din tak cache valid rahega

// Cache se spoiler retrieve karne ka function
export const getCachedSpoiler = (movieId) => {
  try {
    const cache = JSON.parse(localStorage.getItem(SPOILER_CACHE_KEY) || '{}');
    const cached = cache[movieId];
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('📦 Using cached spoiler');
      return cached.content;
    }
    
    return null;
  } catch (error) {
    console.error('Error reading spoiler cache:', error);
    return null;
  }
};

export const cacheSpoiler = (movieId, content) => {
  try {
    const cache = JSON.parse(localStorage.getItem(SPOILER_CACHE_KEY) || '{}');
    cache[movieId] = {
      content,
      timestamp: Date.now()
    };
    
    // Keep only last 50 spoilers to prevent storage bloat
    const entries = Object.entries(cache);
    if (entries.length > 50) {
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
      const trimmed = Object.fromEntries(entries.slice(0, 50));
      localStorage.setItem(SPOILER_CACHE_KEY, JSON.stringify(trimmed));
    } else {
      localStorage.setItem(SPOILER_CACHE_KEY, JSON.stringify(cache));
    }
    
    console.log('💾 Spoiler cached successfully');
  } catch (error) {
    console.error('Error caching spoiler:', error);
  }
};
