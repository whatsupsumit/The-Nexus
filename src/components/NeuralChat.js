import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { X, x } from "lucide-react"
import { ArrowRightToLine } from 'lucide-react';

const NeuralChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [istoggle, setIsToggle] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const welcomeMessage = {
      text: "🎬 Hey there! I'm your NEXUS movie buddy! Tell me what you're in the mood for and I'll find you the perfect film. Want something funny? Scary? Romantic? Just ask me anything like 'I want a good action movie' or 'something to make me cry' - I got you covered! 🍿",
      isBot: true,
      timestamp: new Date().toLocaleTimeString(),
      animated: true
    };

    setTimeout(() => {
      setMessages([welcomeMessage]);
    }, 500);
  }, []);

  const moviePrompts = [
    "🌙 What should I watch tonight?",
    "💕 Something romantic and sweet",
    "👻 Scary movie that's actually good",
    "😂 Make me laugh with a comedy",
    "💥 High action and explosions",
    "🧠 Smart movie that makes me think"
  ];

  const getSmartMovieRecommendation = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Enhanced movie recommendations with more variety
    if (message.includes('10') || message.includes('list') || message.includes('many')) {
      // User wants multiple movies
      const categories = {
        action: ['Mad Max: Fury Road (2015)', 'John Wick (2014)', 'Mission: Impossible - Fallout (2018)', 'The Raid (2011)', 'Baby Driver (2017)', 'Atomic Blonde (2017)', 'Nobody (2021)', 'The Matrix (1999)', 'Die Hard (1988)', 'Terminator 2 (1991)'],
        comedy: ['Superbad (2007)', 'The Grand Budapest Hotel (2014)', 'Airplane! (1980)', 'Knives Out (2019)', 'What We Do in the Shadows (2014)', 'Game Night (2018)', 'The Nice Guys (2016)', 'In Bruges (2008)', 'Kiss Kiss Bang Bang (2005)', 'Hunt for the Wilderpeople (2016)'],
        horror: ['Hereditary (2018)', 'The Conjuring (2013)', 'Get Out (2017)', 'A Quiet Place (2018)', 'Midsommar (2019)', 'The Witch (2015)', 'It Follows (2014)', 'The Babadook (2014)', 'Sinister (2012)', 'The Wailing (2016)'],
        scifi: ['Inception (2010)', 'Ex Machina (2014)', 'Arrival (2016)', 'Interstellar (2014)', 'Blade Runner 2049 (2017)', 'The Matrix (1999)', 'Her (2013)', 'District 9 (2009)', 'Annihilation (2018)', 'Under the Skin (2013)'],
        drama: ['Parasite (2019)', 'Nomadland (2020)', 'Manchester by the Sea (2016)', 'Moonlight (2016)', 'The Social Network (2010)', 'There Will Be Blood (2007)', 'Call Me By Your Name (2017)', 'Lady Bird (2017)', 'Roma (2018)', 'The Master (2012)']
      };

      let selectedCategory = 'action';
      if (message.includes('comedy') || message.includes('funny')) selectedCategory = 'comedy';
      else if (message.includes('horror') || message.includes('scary')) selectedCategory = 'horror';
      else if (message.includes('sci-fi') || message.includes('science')) selectedCategory = 'scifi';
      else if (message.includes('drama') || message.includes('emotional')) selectedCategory = 'drama';
      else if (message.includes('action') || message.includes('fight')) selectedCategory = 'action';

      const movies = categories[selectedCategory];
      const count = message.includes('10') ? 10 : Math.min(movies.length, 8);
      const selectedMovies = movies.slice(0, count);

      return `🎬 Here are ${count} amazing ${selectedCategory} movies for you:\n\n${selectedMovies.map((movie, i) => `${i + 1}. **${movie}**`).join('\n')}\n\n🍿 Each one of these is absolutely fantastic! Which one catches your eye? I can tell you more about any of them!`;
    }

    // Regular single/few movie recommendations
    if (message.includes('comedy') || message.includes('funny') || message.includes('laugh')) {
      const comedies = [
        "🤣 **Superbad (2007)** - Absolute comedy gold! Michael Cera and Jonah Hill's chemistry is hilarious!",
        "😂 **The Grand Budapest Hotel (2014)** - Wes Anderson's quirky masterpiece with Ralph Fiennes being delightfully absurd!",
        "🎭 **Game Night (2018)** - Jason Bateman and Rachel McAdams in a hilarious mystery comedy that keeps surprising you!",
        "🤪 **What We Do in the Shadows (2014)** - Vampire flatmates being awkward? Pure comedic genius!",
        "😆 **The Nice Guys (2016)** - Ryan Gosling and Russell Crowe's buddy cop comedy is criminally underrated!"
      ];
      return comedies[Math.floor(Math.random() * comedies.length)] + " 🍿 Want more laughs? Just ask!";
    }

    if (message.includes('action') || message.includes('explosion') || message.includes('fight')) {
      const actions = [
        "💥 **Mad Max: Fury Road (2015)** - Charlize Theron kicks butt in the most insane car chase movie ever made!",
        "🔫 **John Wick (2014)** - Keanu Reeves + incredible choreography = pure action poetry!",
        "🚗 **Baby Driver (2017)** - Edgar Wright's action musical with car chases synced to amazing music!",
        "🥊 **Nobody (2021)** - Bob Odenkirk going full action hero? It's better than it sounds!",
        "💣 **Atomic Blonde (2017)** - Charlize Theron doing brutal 80s spy action with an amazing soundtrack!"
      ];
      return actions[Math.floor(Math.random() * actions.length)] + " 🎬 Ready for adrenaline? These deliver!";
    }

    if (message.includes('horror') || message.includes('scary')) {
      const horrors = [
        "👻 **Hereditary (2018)** - Toni Collette's performance will haunt you! Psychological horror perfection!",
        "😱 **The Conjuring (2013)** - Classic ghost story done absolutely right by James Wan!",
        "🩸 **Get Out (2017)** - Jordan Peele's genius thriller that's scary AND brilliantly written!",
        "🔪 **A Quiet Place (2018)** - The tension is unreal! Emily Blunt and John Krasinski's monster masterpiece!",
        "👹 **The Witch (2015)** - Period horror that feels authentically terrifying and beautifully crafted!"
      ];
      return horrors[Math.floor(Math.random() * horrors.length)] + " Sweet dreams... 😈 Need more scares?";
    }

    // Default amazing picks
    const defaults = [
      "🎬 **Everything Everywhere All at Once (2022)** - The most creative movie ever made! Michelle Yeoh jumping through multiverses!",
      "🏆 **Parasite (2019)** - Bong Joon-ho's masterpiece that will keep you guessing until the very end!",
      "🕷️ **Spider-Man: Into the Spider-Verse (2018)** - Animation revolution! Every frame is pure art!",
      "🎭 **Knives Out (2019)** - Daniel Craig's detective work in a modern murder mystery masterpiece!",
      "🌟 **Dune (2021)** - Denis Villeneuve's epic space opera with incredible visuals and Hans Zimmer's score!"
    ];

    return defaults[Math.floor(Math.random() * defaults.length)] + " 🍿 What genre excites you most? I've got endless recommendations!";
  };

  const callMovieAPI = async (userMessage) => {
    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      if (!apiKey) {
        console.log('❌ No Gemini API key found, using fallback');
        return getSmartMovieRecommendation(userMessage);
      }

      console.log('🤖 Calling Gemini API for real AI recommendations...');

      const moviePrompt = `You are the NEXUS Movie Recommendation AI, the coolest movie buddy on the planet! You LOVE movies and get super excited about helping people find their next favorite film.

IMPORTANT RULES:
- Always be enthusiastic and friendly, like talking to your best friend
- Give 2-3 specific movie recommendations with years
- Explain WHY each movie is perfect for what they asked
- Use simple, fun language - no fancy film critic words
- Add emojis to make it fun
- Keep it under 150 words
- If they ask about anything non-movie related, gently guide them back to movies

User asked: "${userMessage}"

Give them amazing movie suggestions that match what they want!`;

      // Try multiple working model names and API versions
      const apiAttempts = [
        // Current working models as of 2024-2025
        { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, name: 'gemini-1.5-flash (v1beta)' },
        { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, name: 'gemini-1.5-pro (v1beta)' },
        { url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, name: 'gemini-1.5-flash (v1)' },
        { url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`, name: 'gemini-1.5-pro (v1)' },
        // Legacy models (fallback)
        { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, name: 'gemini-pro (v1beta)' },
        { url: `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, name: 'gemini-pro (v1)' }
      ];

      for (const attempt of apiAttempts) {
        try {
          console.log(`🔄 Trying: ${attempt.name}`);

          const response = await fetch(attempt.url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: moviePrompt
                }]
              }],
              generationConfig: {
                temperature: 0.9,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 200,
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
              console.log(`✅ SUCCESS with: ${attempt.name}`);
              return data.candidates[0].content.parts[0].text;
            }
          } else {
            console.log(`❌ ${attempt.name} failed: ${response.status}`);
            if (response.status === 503) {
              console.log('   → Service temporarily unavailable');
            } else if (response.status === 404) {
              console.log('   → Model not found');
            } else if (response.status === 429) {
              console.log('   → Rate limit exceeded');
            } else if (response.status === 400) {
              console.log('   → Bad request - check API key');
            }
          }
        } catch (modelError) {
          console.log(`❌ ${attempt.name} error:`, modelError.message);
        }
      }

      // If all API attempts fail, use smart fallback
      console.log('🔄 All Gemini APIs failed, using intelligent fallback system');
      return getSmartMovieRecommendation(userMessage);

    } catch (error) {
      console.error("Movie AI Error:", error);
      return getSmartMovieRecommendation(userMessage);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    const newUserMessage = {
      text: userMessage,
      isBot: false,
      timestamp: new Date().toLocaleTimeString(),
      animated: true
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      const movieResponse = await callMovieAPI(userMessage);

      const newBotMessage = {
        text: movieResponse,
        isBot: true,
        timestamp: new Date().toLocaleTimeString(),
        animated: true
      };
      setMessages(prev => [...prev, newBotMessage]);

    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        text: "🎬 Something went wrong with my movie magic! Try asking me about movies again - I love talking about films! 🍿",
        isBot: true,
        timestamp: new Date().toLocaleTimeString(),
        animated: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
 
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  return (
    <div className="h-screen relative text-white overflow-hidden flex flex-col">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("/astro.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          filter: "brightness(0.3)",
        }}
      ></div>

      <div className="fixed inset-0 bg-gradient-to-br from-black/80 via-red-900/20 to-black/80"></div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {["🎬", "🍿", "🎭", "🎪", "🎨", "⭐"].map((icon, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            {icon}
          </div>
        ))}
      </div>

      <div className="relative z-10 h-full flex flex-col pt-16">
        <div className="container mx-auto px-4 max-w-7xl h-full flex flex-col">

          {/* Fixed Header */}
          <div className="flex-shrink-0 text-center py-4">
            <div className="inline-flex items-center gap-3 bg-black/60 backdrop-blur-lg rounded-full px-6 py-2 border border-red-500/30">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-lg">🎬</span>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                  NEXUS Movie AI
                </h1>
                <p className="text-xs text-gray-300">Your Personal Film Finder</p>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <button onClick={() => setIsToggle(true)} className={`${istoggle?"opacity-0":"opacity-100"} bg-white/30 backdrop-blur-sm mb-2 sm:hidden border w-8 px-4 py-2 flex flex-col justify-center items-center ml-4 rounded-lg`}>

            <ArrowRightToLine className="w-5 h-5"/>
          </button>

          {/* Main Layout - Left Sidebar + Right Chat */}
          <div className="flex gap-6 flex-1 min-h-0">

            {/* Left Sidebar - Movie Prompts */}

            <div className={` w-72 flex-shrink-0 ${istoggle ? "block" : "hidden"}`}>
              <div className="bg-black/50 backdrop-blur-lg rounded-2xl  border-red-500/30 p-4 h-full flex flex-col">
                <div className="flex py-2 justify-between">
                  <h3 className="text-base font-semibold sm:mb-3 text-red-300 text-center flex items-center justify-center gap-2">
                    🍿 Quick Requests
                  </h3>
                  <button className="sm:hidden" onClick={() => setIsToggle(false)}>
                    <X className="w-5 h-5" />
                  </button>

                </div>

                <div className="space-y-2 flex-1 overflow-y-auto">
                  {moviePrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="w-full bg-black/40 hover:bg-red-900/30 border border-red-700/40 rounded-lg px-3 py-3 text-sm transition-all duration-200 text-left hover:border-red-400/60 hover:scale-[1.02] hover:shadow-lg"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Chat Interface */}
            <div className="min-w-0 flex-1 ">

              <div className="bg-black/70 backdrop-blur-xl rounded-2xl border border-red-500/30 shadow-2xl h-full flex flex-col overflow-hidden">

                {/* Chat Messages */}
                <div
                  className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-red-500/50 scrollbar-track-gray-800/50"
                >
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.isBot ? "justify-start" : "justify-end"} ${message.animated ? "animate-fadeInUp" : ""
                        }`}
                    >
                      <div
                        className={`max-w-md px-4 py-3 rounded-2xl relative ${message.isBot
                          ? "bg-gradient-to-r from-red-600/30 to-purple-600/30 border border-red-500/40"
                          : "bg-gradient-to-r from-gray-600/50 to-gray-700/50 border border-gray-500/40"
                          }`}
                      >
                        {message.isBot && (
                          <div className="text-xs text-red-300 mb-1 flex items-center gap-1">
                            <span>🤖</span>
                            Movie AI
                          </div>
                        )}
                        <div className="text-sm leading-relaxed prose prose-invert max-w-none">
                          <ReactMarkdown>
                            {message.text}
                          </ReactMarkdown>
                        </div>
                        <p className="text-xs opacity-70 mt-2">{message.timestamp}</p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start animate-fadeInUp">
                      <div className="bg-gradient-to-r from-red-600/30 to-purple-600/30 border border-red-500/40 px-4 py-3 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                          <span className="text-sm text-red-300">Finding perfect movies...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="border-t border-red-500/30 bg-black/50 p-3 flex-shrink-0">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Tell me what movie mood you're in..."
                      className="flex-1 bg-gray-800/50 border border-gray-600/40 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-400/60"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim()}
                      className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${isLoading
                        ? "bg-gray-600/50 border border-gray-500/40"
                        : "bg-gradient-to-r from-red-600 to-purple-600 border border-red-400/60 hover:shadow-lg hover:scale-105"
                        }`}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-red-400 rounded-full animate-spin"></div>
                      ) : (
                        "🚀"
                      )}
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 mt-1 text-center">
                    Ask me anything like "funny movies" or "best action films" 🍿
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.5);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(239, 68, 68, 0.7), rgba(147, 51, 234, 0.7));
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(239, 68, 68, 0.9), rgba(147, 51, 234, 0.9));
        }
      `}</style>
    </div>
  );
};

export default NeuralChat;