import React, { useState, useRef, useEffect } from 'react';

const NeuralChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState('cinema'); // cinema, general, creative
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Animated welcome message
    const welcomeMessage = {
      text: "� Welcome to Nexus Neural Interface! I'm your AI movie companion powered by Google Gemini. Ready to discover your next favorite film? Whether you want blockbuster recommendations, hidden gems, or deep movie discussions - I'm here to guide your cinematic journey! What movie adventure shall we begin?",
      isBot: true,
      timestamp: new Date().toLocaleTimeString(),
      animated: true
    };
    
    setTimeout(() => {
      setMessages([welcomeMessage]);
    }, 500);
  }, []);

  const chatModes = {
    cinema: {
      icon: "🎬",
      name: "Cinema AI",
      prompt: "You are Nexus Cinema AI, the ultimate movie expert and entertainment guru. Provide passionate, engaging movie recommendations, insights about films, actors, directors, and entertainment industry. Be enthusiastic about movies and TV shows. Keep responses exciting and informative, under 100 words. Include movie titles, years, and brief compelling reasons why someone should watch them.",
      gradient: "from-red-600/50 via-purple-600/50 to-blue-600/50"
    },
    general: {
      icon: "🤖",
      name: "General AI",
      prompt: "You are Nexus AI, a helpful and intelligent assistant. Provide thoughtful, accurate responses on any topic. Be conversational, friendly, and informative. Keep responses concise but comprehensive.",
      gradient: "from-blue-600/50 via-indigo-600/50 to-red-500/50"
    },
    creative: {
      icon: "✨",
      name: "Creative AI",
      prompt: "You are Nexus Creative AI, an imaginative and artistic assistant. Be creative, inspiring, and think outside the box. Help with creative writing, ideas, art concepts, and innovative thinking. Make responses engaging and imaginative.",
      gradient: "from-red-500/50 via-pink-600/50 to-blue-500/50"
    }
  };

  const quickPrompts = [
    "🎭 Recommend a movie for tonight",
    "� What's a good romantic comedy?",
    "🦸 Suggest an action-packed superhero film",
    "� Tell me about classic movies I should watch",
    "� Find me a mystery or thriller movie",
    "� What are the best movies of 2024?"
  ];

  const getQuickResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Only handle very specific commands, let AI handle everything else
    if (message === 'clear' || message === 'reset') {
      return "🧹 Neural pathways cleared! Starting fresh conversation.";
    }
    
    if (message === 'help' || message === '?') {
      return "🤖 I'm NEXUS AI, your neural companion! Ask me anything - from movies and entertainment to general questions. I adapt to your needs!";
    }
    
    // Let AI handle ALL other messages including greetings, thanks, etc.
    return null;
  };

  const typeMessage = async (text) => {
    setIsTyping(true);
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, Math.min(text.length * 20, 2000)));
    setIsTyping(false);
    return text;
  };

  const callGeminiAPI = async (userMessage) => {
    try {
      console.log('🚀 Nexus AI engaging...');
      
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Neural link not established - API key missing');
      }

      const currentMode = chatModes[chatMode];
      const enhancedPrompt = `${currentMode.prompt}

User message: "${userMessage}"

IMPORTANT: Always respond with genuine AI personality and intelligence. Detect the language of the user's message and respond in the same language naturally. Be helpful, enthusiastic, and engaging. Use emojis sparingly but effectively. Never give generic template responses.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: enhancedPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 300,
            stopSequences: ["\n\n\n"]
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Neural network disruption:', errorText);
        throw new Error(`Neural interface error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const aiText = data.candidates[0].content.parts[0].text;
        return await typeMessage(aiText);
      } else {
        throw new Error('Neural response malformed');
      }

    } catch (error) {
      console.error('💥 AI System Error:', error);
      
      if (error.message.includes('403')) {
        return "🔐 Neural access restricted. Please verify authentication protocols.";
      } else if (error.message.includes('429')) {
        return "⚡ Neural networks overloaded. Cooling down systems... Please try again shortly.";
      } else {
        return "🌌 Experiencing cosmic interference in my neural pathways. Recalibrating... Please try again!";
      }
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message with animation
    const newUserMessage = {
      text: userMessage,
      isBot: false,
      timestamp: new Date().toLocaleTimeString(),
      animated: true
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Check for quick responses first
      const quickResponse = getQuickResponse(userMessage);
      if (quickResponse) {
        await new Promise(resolve => setTimeout(resolve, 800));
        const quickBotMessage = {
          text: quickResponse,
          isBot: true,
          timestamp: new Date().toLocaleTimeString(),
          animated: true
        };
        setMessages(prev => [...prev, quickBotMessage]);
        return;
      }
      
      // Get AI response
      const aiResponse = await callGeminiAPI(userMessage);
      
      const newBotMessage = {
        text: aiResponse,
        isBot: true,
        timestamp: new Date().toLocaleTimeString(),
        animated: true,
        mode: chatMode
      };
      setMessages(prev => [...prev, newBotMessage]);
      
    } catch (error) {
      console.error('Error in message handling:', error);
      const errorMessage = {
        text: "🌌 Neural pathways temporarily disrupted. Cosmic interference detected. Please try again!",
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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
    // Auto-send after a brief delay
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  return (
    <div className="min-h-screen relative text-white overflow-hidden">
      {/* Primary Astro Background - Full Frame Contained */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/astro.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.4) contrast(1.2) saturate(1.1)',
          transform: 'scale(1.02)'
        }}
      ></div>
      
      {/* Secondary Background Fallback */}
      <div 
        className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
        style={{ zIndex: -1 }}
      ></div>
      
      {/* Enhanced Color Mixing Overlays - Blackish Red/Blue Theme */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/90 via-gray-900/85 to-black/95"></div>
      <div className="fixed inset-0 bg-gradient-to-t from-black/90 via-red-900/30 to-transparent"></div>
      <div className="fixed inset-0 bg-gradient-to-r from-blue-900/25 via-black/20 to-red-900/25"></div>
      <div className="fixed inset-0 bg-gradient-to-tl from-red-900/20 via-transparent to-blue-900/20"></div>
      
      {/* Animated Particles with Red/Blue Theme */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse bg-gradient-to-r from-red-400/25 to-blue-400/25"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      {/* Subtle Moving Stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute text-white/20 animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${8 + Math.random() * 6}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            ✦
          </div>
        ))}
      </div>

      {/* Main Content - Enhanced Header Clearance for Proper Spacing */}
      <div className="relative z-10 min-h-screen pt-24 sm:pt-28 md:pt-32 lg:pt-36 xl:pt-40 pb-4 neural-chat-container">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 min-h-full max-w-7xl">
          
          {/* Additional Safety Margin */}
          <div className="mb-4 sm:mb-6 lg:mb-8"></div>
          
          {/* Responsive Grid - Mobile-First Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6 min-h-full">
            
            {/* Smaller Left Sidebar - Compact Layout */}
            <div className="lg:col-span-3 xl:col-span-2 space-y-2 sm:space-y-3 lg:space-y-4 order-2 lg:order-1 h-fit">
              
              {/* Compact Header Section */}
              <div className="bg-black/85 backdrop-blur-xl rounded-lg sm:rounded-xl border border-red-900/60 p-2 sm:p-3 lg:p-4 shadow-xl bg-gradient-to-br from-black/70 to-gray-900/90 mt-2 sm:mt-3">
                <div className="text-center">
                  <div className="flex flex-col items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                    <div className="relative">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-600/50 to-blue-600/50 rounded-full flex items-center justify-center border border-red-400/70 backdrop-blur-md shadow-lg">
                        <span className="text-sm sm:text-lg">🧠</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-blue-600/30 rounded-full animate-ping"></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <h1 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-red-200 via-white to-blue-200 bg-clip-text text-transparent font-mono tracking-tight">
                        NEXUS NEURAL
                      </h1>
                      <p className="text-xs text-transparent bg-gradient-to-r from-red-100 to-blue-100 bg-clip-text font-medium">
                        <span className="hidden sm:inline">AI Interface</span>
                        <span className="sm:hidden">AI</span>
                      </p>
                    </div>
                  </div>

                  {/* Compact AI Mode Selector */}
                  <div className="space-y-1 mb-2 sm:mb-3">
                    {Object.entries(chatModes).map(([mode, config]) => (
                      <button
                        key={mode}
                        onClick={() => setChatMode(mode)}
                        className={`w-full px-2 py-1.5 sm:py-2 rounded-md font-medium transition-all duration-300 backdrop-blur-md text-xs ${
                          chatMode === mode
                            ? `bg-gradient-to-r ${config.gradient} border border-white/30 shadow-md`
                            : 'bg-gray-700/40 border border-gray-500/30 hover:bg-gray-600/50'
                        }`}
                      >
                        <span className="mr-1">{config.icon}</span>
                        <span className="hidden sm:inline text-xs">{config.name}</span>
                        <span className="sm:hidden text-xs">{config.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>

                  {/* Compact Status Indicator */}
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-600/30 border border-red-400/40 rounded-full backdrop-blur-sm">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-red-200 font-medium">
                      <span className="hidden sm:inline">Online</span>
                      <span className="sm:hidden">Online</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Compact Quick Actions - Fixed Height */}
              <div className="bg-black/80 backdrop-blur-xl rounded-lg border border-blue-900/60 p-2 sm:p-3 shadow-xl bg-gradient-to-br from-black/70 to-gray-900/90 lg:block hidden">
                <h3 className="text-xs sm:text-sm font-semibold mb-2 text-red-200 text-center">Quick Actions</h3>
                <div className="space-y-1 max-h-32 sm:max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-600 scrollbar-track-gray-800/50">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="w-full text-left p-1.5 sm:p-2 rounded-md bg-black/60 hover:bg-red-900/30 border border-red-700/40 transition-all duration-200 hover:border-red-400/60 text-xs transform backdrop-blur-sm text-white/90 hover:text-white shadow-sm"
                    >
                      {prompt.length > 32 ? prompt.substring(0, 32) + '...' : prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced Mobile Quick Actions - Better Visibility */}
              <div className="lg:hidden">
                <div className="bg-black/80 backdrop-blur-xl rounded-lg border border-red-900/50 p-2 shadow-xl bg-gradient-to-br from-black/70 to-gray-900/90 mb-2">
                  <h4 className="text-xs font-semibold mb-2 text-red-200 text-center">Quick Actions</h4>
                  <div className="flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-red-600/50 scrollbar-track-gray-800/50 pb-1">
                    {quickPrompts.slice(0, 4).map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickPrompt(prompt)}
                        className="flex-shrink-0 bg-black/70 hover:bg-red-900/30 border border-red-700/50 rounded-md px-3 py-2 text-xs transition-all duration-200 backdrop-blur-sm whitespace-nowrap text-white/90 hover:text-white shadow-md"
                      >
                        {prompt.split(' ').slice(0, 2).join(' ')}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Chat Interface - Responsive Height Container */}
            <div className="lg:col-span-9 xl:col-span-10 flex flex-col justify-between order-1 lg:order-2 mt-2 sm:mt-3 min-h-full">
              <div 
                className="bg-black/85 backdrop-blur-2xl rounded-xl sm:rounded-2xl border justify-between border-red-900/50 shadow-2xl overflow-hidden flex flex-col bg-gradient-to-br from-black/80 to-gray-900/90"
                style={{ 
                  height: 'calc(100vh - 180px)',
                  minHeight: 'calc(100vh - 220px)'
                }}
              >
                
                {/* Compact Chat Header */}
                <div className="bg-black/70 border-b border-red-900/60 p-2 sm:p-3 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base">{chatModes[chatMode].icon}</span>
                      <div>
                        <h2 className="text-sm sm:text-base font-semibold text-red-200">{chatModes[chatMode].name}</h2>
                        <p className="text-xs text-gray-300 hidden sm:block">Ready to assist you</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-300">Active</span>
                    </div>
                  </div>
                </div>
                
                {/* Messages Container - Responsive Scrolling */}
                <div 
                  className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-3 lg:p-4 space-y-2 sm:space-y-3 lg:space-y-4 scrollbar-thin scrollbar-thumb-cyan-600/50 scrollbar-track-gray-800/30"
                  style={{ 
                    minHeight: '200px',
                    maxHeight: 'calc(100vh - 450px)',
                    height: 'auto'
                  }}
                >
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} ${
                        message.animated ? 'animate-fadeInUp' : ''
                      }`}
                    >
                      <div
                        className={`max-w-[90%] sm:max-w-md lg:max-w-lg px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl relative backdrop-blur-md shadow-xl ${
                          message.isBot
                            ? `bg-gradient-to-r ${chatModes[message.mode || chatMode].gradient} border border-gray-500/50`
                            : 'bg-gradient-to-r from-gray-600/70 to-gray-700/70 border border-gray-400/50'
                        }`}
                      >
                        {message.isBot && (
                          <div className="text-xs text-red-200 mb-1 flex items-center gap-1">
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                            <span className="hidden sm:inline">{chatModes[message.mode || chatMode].icon} AI Response</span>
                            <span className="sm:hidden">AI</span>
                          </div>
                        )}
                        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-white">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1 text-gray-200">{message.timestamp}</p>
                        
                        {/* Glowing Edge for Bot Messages */}
                        {message.isBot && (
                          <div className="absolute -left-0.5 top-2 sm:top-3 w-0.5 sm:w-1 h-4 sm:h-6 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full shadow-lg"></div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {(isLoading || isTyping) && (
                    <div className="flex justify-start animate-fadeInUp">
                      <div className={`bg-gradient-to-r ${chatModes[chatMode].gradient} border border-gray-500/50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl backdrop-blur-md`}>
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs sm:text-sm text-red-200">
                            {isTyping ? 'Processing...' : 'Thinking...'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Ultra Responsive Input Area - Minimal Padding */}
                <div className="border-t border-blue-900/60 bg-black/70 p-1 sm:p-1.5 lg:p-2 backdrop-blur-md">
                  <div className="flex space-x-2 sm:space-x-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Message the neural network..."
                        className="w-full bg-gray-700/50 border border-gray-500/40 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-cyan-400/60 backdrop-blur-sm transition-all duration-200 text-sm sm:text-base"
                        disabled={isLoading}
                      />
                      {/* Focus Glow Effect */}
                      <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 transition-opacity duration-200 pointer-events-none focus-within:opacity-100"></div>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim()}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-xl relative group backdrop-blur-md text-sm sm:text-base ${
                        isLoading 
                          ? 'bg-gray-600/50 border border-gray-500/40' 
                          : `bg-gradient-to-r ${chatModes[chatMode].gradient} border border-cyan-400/60 hover:shadow-cyan-500/30 hover:shadow-xl`
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10">
                        {isLoading ? (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 border-t-cyan-400 rounded-full animate-spin"></div>
                        ) : (
                          '🚀'
                        )}
                      </span>
                    </button>
                  </div>
                  <div className="text-xs text-gray-300 mt-5 text-center">
                    <span className="hidden sm:inline">Powered by Google Gemini • {chatModes[chatMode].name} Mode Active</span>
                    <span className="sm:hidden">Gemini AI • {chatModes[chatMode].icon}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Custom Styles */}
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
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        /* Enhanced scrollbar styling - Red/Blue Theme */
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.5);
          border-radius: 10px;
          margin: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(239, 68, 68, 0.7), rgba(59, 130, 246, 0.7));
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(239, 68, 68, 0.9), rgba(59, 130, 246, 0.9));
        }
        .scrollbar-thin::-webkit-scrollbar-corner {
          background: transparent;
        }
        
        /* Mobile header spacing fix */
        @media (max-width: 640px) {
          .neural-chat-container {
            padding-top: max(6rem, env(safe-area-inset-top) + 4rem) !important;
          }
        }
        
        @media (min-width: 641px) and (max-width: 768px) {
          .neural-chat-container {
            padding-top: max(7rem, env(safe-area-inset-top) + 5rem) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default NeuralChat;
