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
      gradient: "from-purple-600/30 via-blue-600/30 to-cyan-500/30"
    },
    general: {
      icon: "🤖",
      name: "General AI",
      prompt: "You are Nexus AI, a helpful and intelligent assistant. Provide thoughtful, accurate responses on any topic. Be conversational, friendly, and informative. Keep responses concise but comprehensive.",
      gradient: "from-green-600/30 via-emerald-600/30 to-teal-500/30"
    },
    creative: {
      icon: "✨",
      name: "Creative AI",
      prompt: "You are Nexus Creative AI, an imaginative and artistic assistant. Be creative, inspiring, and think outside the box. Help with creative writing, ideas, art concepts, and innovative thinking. Make responses engaging and imaginative.",
      gradient: "from-pink-600/30 via-rose-600/30 to-orange-500/30"
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
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hey there! 👋 Ready to explore the universe of possibilities? What's on your mind today?";
    }
    
    if (message.includes('thanks') || message.includes('thank you')) {
      return "You're absolutely welcome! 😊 I'm here whenever you need me. What else can we discover together?";
    }
    
    if (message.includes('how are you')) {
      return "I'm fantastic and energized! ⚡ My neural networks are buzzing with excitement to help you. How are you doing?";
    }
    
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

Respond with personality, enthusiasm, and intelligence. Use emojis sparingly but effectively.`;

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
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 200,
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
      
      {/* Enhanced Color Mixing Overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/75 via-gray-900/70 to-black/85"></div>
      <div className="fixed inset-0 bg-gradient-to-t from-black/70 via-purple-900/20 to-transparent"></div>
      <div className="fixed inset-0 bg-gradient-to-r from-blue-900/15 via-purple-900/10 to-cyan-900/15"></div>
      <div className="fixed inset-0 bg-gradient-to-tl from-pink-900/10 via-transparent to-blue-900/10"></div>
      
      {/* Animated Particles with Astro Theme */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse bg-gradient-to-r from-cyan-400/20 to-purple-400/20"
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

      {/* Main Content - Single Frame Layout */}
      <div className="relative z-10 h-screen pt-20 pb-4">
        <div className="container mx-auto px-4 h-full max-w-7xl">
          
          {/* Single Frame Grid Layout */}
          <div className="grid lg:grid-cols-12 gap-6 h-full">
            
            {/* Left Sidebar - Header + Controls */}
            <div className="lg:col-span-4 flex flex-col space-y-6">
              
              {/* Epic Header */}
              <div className="bg-gray-900/60 backdrop-blur-2xl rounded-3xl border border-gray-600/40 p-6 shadow-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/70">
                <div className="text-center">
                  <div className="inline-flex items-center gap-4 mb-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/40 to-purple-600/40 rounded-full flex items-center justify-center border-2 border-cyan-400/60 backdrop-blur-md shadow-2xl">
                        <span className="text-2xl">🧠</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-600/20 rounded-full animate-ping"></div>
                      </div>
                    </div>
                    <div className="text-left">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200 bg-clip-text text-transparent font-mono tracking-tight drop-shadow-2xl">
                        NEXUS NEURAL
                      </h1>
                      <p className="text-sm text-transparent bg-gradient-to-r from-cyan-100 to-purple-100 bg-clip-text font-semibold">
                        Artificial Intelligence Interface
                      </p>
                    </div>
                  </div>

                  {/* AI Mode Selector */}
                  <div className="space-y-2 mb-4">
                    {Object.entries(chatModes).map(([mode, config]) => (
                      <button
                        key={mode}
                        onClick={() => setChatMode(mode)}
                        className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-md ${
                          chatMode === mode
                            ? `bg-gradient-to-r ${config.gradient} border-2 border-white/40 shadow-xl`
                            : 'bg-gray-700/40 border border-gray-500/40 hover:bg-gray-600/50'
                        }`}
                      >
                        <span className="mr-2">{config.icon}</span>
                        {config.name}
                      </button>
                    ))}
                  </div>

                  {/* Status Indicator */}
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-400/40 rounded-full backdrop-blur-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-200 font-medium">Neural Networks Online</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-900/60 backdrop-blur-2xl rounded-3xl border border-gray-600/40 p-4 shadow-2xl flex-1 bg-gradient-to-br from-gray-800/50 to-gray-900/70">
                <h3 className="text-lg font-semibold mb-4 text-cyan-200 text-center">Quick Actions</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-600 scrollbar-track-gray-800/50">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="w-full text-left p-3 rounded-lg bg-gray-700/40 hover:bg-gray-600/50 border border-gray-500/30 transition-all duration-200 hover:border-cyan-400/60 text-sm hover:scale-105 transform backdrop-blur-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Chat Interface */}
            <div className="lg:col-span-8 flex flex-col">
              <div className="bg-gray-900/60 backdrop-blur-2xl rounded-3xl border border-gray-600/40 shadow-2xl overflow-hidden flex-1 flex flex-col bg-gradient-to-br from-gray-800/50 to-gray-900/70">
                
                {/* Chat Header */}
                <div className="bg-gray-800/40 border-b border-gray-600/40 p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{chatModes[chatMode].icon}</span>
                      <div>
                        <h2 className="text-lg font-semibold text-cyan-200">{chatModes[chatMode].name}</h2>
                        <p className="text-xs text-gray-300">Ready to assist you</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-300">Active</span>
                    </div>
                  </div>
                </div>
                
                {/* Messages Container - Takes remaining height */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-600/50 scrollbar-track-gray-800/30 min-h-0">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} ${
                        message.animated ? 'animate-fadeInUp' : ''
                      }`}
                    >
                      <div
                        className={`max-w-md px-4 py-3 rounded-2xl relative backdrop-blur-md shadow-xl ${
                          message.isBot
                            ? `bg-gradient-to-r ${chatModes[message.mode || chatMode].gradient} border border-gray-500/50`
                            : 'bg-gradient-to-r from-gray-600/70 to-gray-700/70 border border-gray-400/50'
                        }`}
                      >
                        {message.isBot && (
                          <div className="text-xs text-cyan-200 mb-1 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                            <span>{chatModes[message.mode || chatMode].icon} AI Response</span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-white">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1 text-gray-200">{message.timestamp}</p>
                        
                        {/* Glowing Edge for Bot Messages */}
                        {message.isBot && (
                          <div className="absolute -left-0.5 top-3 w-1 h-6 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full shadow-lg"></div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {(isLoading || isTyping) && (
                    <div className="flex justify-start animate-fadeInUp">
                      <div className={`bg-gradient-to-r ${chatModes[chatMode].gradient} border border-gray-500/50 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md`}>
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-cyan-200">
                            {isTyping ? 'Neural processing...' : 'Thinking...'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area - Fixed at bottom */}
                <div className="border-t border-gray-600/40 bg-gray-800/40 p-4 backdrop-blur-md">
                  <div className="flex space-x-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your message to the neural network..."
                        className="w-full bg-gray-700/50 border border-gray-500/40 rounded-xl px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-cyan-400/60 backdrop-blur-sm transition-all duration-200"
                        disabled={isLoading}
                      />
                      {/* Focus Glow Effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 transition-opacity duration-200 pointer-events-none focus-within:opacity-100"></div>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim()}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-xl relative group backdrop-blur-md ${
                        isLoading 
                          ? 'bg-gray-600/50 border border-gray-500/40' 
                          : `bg-gradient-to-r ${chatModes[chatMode].gradient} border border-cyan-400/60 hover:shadow-cyan-500/30 hover:shadow-xl`
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10">
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-gray-300 border-t-cyan-400 rounded-full animate-spin"></div>
                        ) : (
                          '🚀'
                        )}
                      </span>
                    </button>
                  </div>
                  <div className="text-xs text-gray-300 mt-2 text-center">
                    Powered by Google Gemini • {chatModes[chatMode].name} Mode Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Custom Styles */}
      <style jsx>{`
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
        /* Enhanced scrollbar styling */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 194, 0.5);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 194, 0.7);
        }
      `}</style>
    </div>
  );
};

export default NeuralChat;
