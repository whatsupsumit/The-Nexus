import React, { useState, useRef, useEffect } from "react";

import { logger } from "../utils/logger";

import { X, x } from "lucide-react"
import { ArrowRightToLine } from 'lucide-react';


// Simple markdown parser component for chat messages
const MarkdownRenderer = ({ content }) => {
  const parseMarkdown = (text) => {
    if (!text) return [];
    
    const lines = text.split('\n');
    const elements = [];
    let currentIndex = 0;

    lines.forEach((line, index) => {
      let element = null;
      const key = `line-${index}`;

      // Handle headers (# ## ###)
      if (line.startsWith('### ')) {
        element = <h3 key={key} className="text-lg font-bold text-red-300 mt-3 mb-2">{line.slice(4)}</h3>;
      } else if (line.startsWith('## ')) {
        element = <h2 key={key} className="text-xl font-bold text-red-400 mt-4 mb-2">{line.slice(3)}</h2>;
      } else if (line.startsWith('# ')) {
        element = <h1 key={key} className="text-2xl font-bold text-red-500 mt-4 mb-3">{line.slice(2)}</h1>;
      }
      // Handle numbered lists
      else if (/^\d+\.\s/.test(line)) {
        const content = line.replace(/^\d+\.\s/, '');
        const formattedContent = formatInlineMarkdown(content);
        element = (
          <div key={key} className="flex items-start gap-2 mb-1">
            <span className="text-red-400 font-bold text-sm mt-0.5">{line.match(/^\d+/)[0]}.</span>
            <span className="flex-1" dangerouslySetInnerHTML={{ __html: formattedContent }} />
          </div>
        );
      }
      // Handle bullet points
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        const content = line.slice(2);
        const formattedContent = formatInlineMarkdown(content);
        element = (
          <div key={key} className="flex items-start gap-2 mb-1">
            <span className="text-red-400 mt-1">•</span>
            <span className="flex-1" dangerouslySetInnerHTML={{ __html: formattedContent }} />
          </div>
        );
      }
      // Handle empty lines
      else if (line.trim() === '') {
        element = <div key={key} className="h-2"></div>;
      }
      // Handle regular paragraphs
      else {
        const formattedContent = formatInlineMarkdown(line);
        element = <p key={key} className="mb-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedContent }} />;
      }

      if (element) {
        elements.push(element);
      }
    });

    return elements;
  };

  const formatInlineMarkdown = (text) => {
    if (!text) return '';
    
    return text
      // Bold **text** or __text__
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
      .replace(/__(.*?)__/g, '<strong class="text-white font-bold">$1</strong>')
      // Italic *text* or _text_
      .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em class="text-gray-200 italic">$1</em>')
      .replace(/(?<!_)_([^_]+)_(?!_)/g, '<em class="text-gray-200 italic">$1</em>')
      // Code `text`
      .replace(/`([^`]+)`/g, '<code class="bg-gray-800 text-green-400 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      // Links [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      // Movie titles in parentheses get special styling
      .replace(/\((\d{4})\)/g, '<span class="text-yellow-400 font-semibold">($1)</span>')
      // Emojis and special characters preservation
      .replace(/([🎬🍿🎭🎪🎨⭐🤣😂🎯💥🔫🚗🥊💣👻😱🩸🔪👹🌙💕🧠😈✅❌🔄🤖🚀])/g, '<span class="text-lg">$1</span>');
  };

  return <div className="space-y-1">{parseMarkdown(content)}</div>;
};


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
      text: `# 🎬 Welcome to NEXUS Movie AI!

Hey there! I'm your **NEXUS movie buddy**! Tell me what you're in the mood for and I'll find you the perfect film.

## What I can help with:
- **Comedy** - Something to make you laugh 😂
- **Action** - High-octane thrills 💥  
- **Horror** - Spine-chilling scares 👻
- **Romance** - Heart-warming stories 💕
- **Sci-Fi** - Mind-bending adventures 🚀

Just ask me anything like *"I want a good action movie"* or *"something to make me cry"* - I got you covered! 🍿`,
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

      return `## 🎬 Top ${count} ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Movies

${selectedMovies.map((movie, i) => `${i + 1}. **${movie}**`).join('\n')}

🍿 **Each one of these is absolutely fantastic!** Which one catches your eye? I can tell you more about any of them!`;
    }

    if (message.includes('comedy') || message.includes('funny') || message.includes('laugh')) {
      const comedies = [
        "## 🤣 Comedy Gold!\n\n**Superbad (2007)** - Absolute comedy gold! Michael Cera and Jonah Hill's chemistry is hilarious!\n\n*Perfect for:* Late night laughs",
        "## 😂 Wes Anderson Magic!\n\n**The Grand Budapest Hotel (2014)** - Wes Anderson's quirky masterpiece with Ralph Fiennes being delightfully absurd!\n\n*Perfect for:* Sophisticated humor lovers",
        "## 🎭 Mystery Comedy!\n\n**Game Night (2018)** - Jason Bateman and Rachel McAdams in a hilarious mystery comedy that keeps surprising you!\n\n*Perfect for:* Date night laughs",
        "## 🤪 Vampire Comedy!\n\n**What We Do in the Shadows (2014)** - Vampire flatmates being awkward? Pure comedic genius!\n\n*Perfect for:* Something totally unique",
        "## 😆 Buddy Comedy!\n\n**The Nice Guys (2016)** - Ryan Gosling and Russell Crowe's buddy cop comedy is criminally underrated!\n\n*Perfect for:* Action-comedy fans"
      ];
      return comedies[Math.floor(Math.random() * comedies.length)] + "\n\n🍿 **Want more laughs?** Just ask!";
    }

    if (message.includes('action') || message.includes('explosion') || message.includes('fight')) {
      const actions = [
        "## 💥 Pure Action Perfection!\n\n**Mad Max: Fury Road (2015)** - Charlize Theron kicks butt in the most insane car chase movie ever made!\n\n*Why it's amazing:* Non-stop practical effects and stunts",
        "## 🔫 Action Poetry!\n\n**John Wick (2014)** - Keanu Reeves + incredible choreography = pure action poetry!\n\n*Why it's amazing:* Every fight scene is a masterclass",
        "## 🚗 Musical Action!\n\n**Baby Driver (2017)** - Edgar Wright's action musical with car chases synced to amazing music!\n\n*Why it's amazing:* Unique blend of music and mayhem",
        "## 🥊 Unexpected Hero!\n\n**Nobody (2021)** - Bob Odenkirk going full action hero? It's better than it sounds!\n\n*Why it's amazing:* Surprising and brutal",
        "## 💣 80s Spy Action!\n\n**Atomic Blonde (2017)** - Charlize Theron doing brutal 80s spy action with an amazing soundtrack!\n\n*Why it's amazing:* Stylish and intense"
      ];
      return actions[Math.floor(Math.random() * actions.length)] + "\n\n🎬 **Ready for adrenaline?** These deliver!";
    }

    if (message.includes('horror') || message.includes('scary')) {
      const horrors = [
        "## 👻 Psychological Horror Masterpiece!\n\n**Hereditary (2018)** - Toni Collette's performance will haunt you! Psychological horror perfection!\n\n*Scare level:* 🔥🔥🔥🔥🔥",
        "## 😱 Classic Ghost Story!\n\n**The Conjuring (2013)** - Classic ghost story done absolutely right by James Wan!\n\n*Scare level:* 🔥🔥🔥🔥",
        "## 🩸 Smart Thriller!\n\n**Get Out (2017)** - Jordan Peele's genius thriller that's scary AND brilliantly written!\n\n*Scare level:* 🔥🔥🔥",
        "## 🔪 Tense Monster Movie!\n\n**A Quiet Place (2018)** - The tension is unreal! Emily Blunt and John Krasinski's monster masterpiece!\n\n*Scare level:* 🔥🔥🔥🔥",
        "## 👹 Period Horror!\n\n**The Witch (2015)** - Period horror that feels authentically terrifying and beautifully crafted!\n\n*Scare level:* 🔥🔥🔥🔥"
      ];
      return horrors[Math.floor(Math.random() * horrors.length)] + "\n\n**Sweet dreams...** 😈 Need more scares?";
    }

    const defaults = [
      "## 🎬 Mind-Bending Masterpiece!\n\n**Everything Everywhere All at Once (2022)** - The most creative movie ever made! Michelle Yeoh jumping through multiverses!\n\n*Why it's perfect:* Comedy + Drama + Action + Philosophy",
      "## 🏆 Social Thriller!\n\n**Parasite (2019)** - Bong Joon-ho's masterpiece that will keep you guessing until the very end!\n\n*Why it's perfect:* Unpredictable and brilliant",
      "## 🕷️ Animation Revolution!\n\n**Spider-Man: Into the Spider-Verse (2018)** - Animation revolution! Every frame is pure art!\n\n*Why it's perfect:* Visual feast + great story",
      "## 🎭 Modern Mystery!\n\n**Knives Out (2019)** - Daniel Craig's detective work in a modern murder mystery masterpiece!\n\n*Why it's perfect:* Clever and entertaining",
      "## 🌟 Epic Space Opera!\n\n**Dune (2021)** - Denis Villeneuve's epic space opera with incredible visuals and Hans Zimmer's score!\n\n*Why it's perfect:* Stunning cinematography"
    ];

    return defaults[Math.floor(Math.random() * defaults.length)] + "\n\n🍿 **What genre excites you most?** I've got endless recommendations!";
  };

  const callMovieAPI = async (userMessage) => {
    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      if (!apiKey) {
        logger.info('No Gemini API key found, using fallback');
        return getSmartMovieRecommendation(userMessage);
      }

      logger.info('Calling Gemini API for real AI recommendations');

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

      const apiAttempts = [
        { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, name: 'gemini-1.5-flash (v1beta)' },
        { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, name: 'gemini-1.5-pro (v1beta)' },
        { url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, name: 'gemini-1.5-flash (v1)' },
        { url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`, name: 'gemini-1.5-pro (v1)' },
        { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, name: 'gemini-pro (v1beta)' },
        { url: `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, name: 'gemini-pro (v1)' }
      ];

      for (const attempt of apiAttempts) {
        try {

          logger.debug(`Trying Gemini model: ${attempt.name}`);

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
              logger.info(`SUCCESS with: ${attempt.name}`);
              return data.candidates[0].content.parts[0].text;
            }
          } else {

            logger.warn(`${attempt.name} failed: ${response.status}`);
            if (response.status === 503) {
              logger.debug('Service temporarily unavailable');
            } else if (response.status === 404) {
              logger.debug('Model not found');
            } else if (response.status === 429) {
              logger.debug('Rate limit exceeded');
            } else if (response.status === 400) {
              logger.debug('Bad request - check API key');
            }

            console.log(`❌ ${attempt.name} failed: ${response.status}`);

          }
        } catch (modelError) {
          logger.warn(`${attempt.name} error: ${modelError.message}`);
        }
      }


      // If all API attempts fail, use smart fallback
      logger.warn('All Gemini APIs failed, using intelligent fallback system');

      console.log('🔄 All Gemini APIs failed, using intelligent fallback system');

      return getSmartMovieRecommendation(userMessage);

    } catch (error) {
      logger.error('Movie AI Error', error, true);
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
      logger.error('Error in NeuralChat', error, true);
      const errorMessage = {
        text: "## 🎬 Oops! Movie Magic Glitch!\n\nSomething went wrong with my movie magic! Try asking me about movies again - **I love talking about films!** 🍿\n\n*Try asking:* \"What's a good comedy?\" or \"Best action movies\"",
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
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center"
    <div className="h-screen relative text-white overflow-hidden flex flex-col">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"

        style={{
          backgroundImage: `url("/astro.jpg")`,
          filter: "brightness(0.3)",
        }}

      />
      
      <div className="fixed inset-0 bg-gradient-to-br from-black/80 via-red-900/20 to-black/80" />
      
      {/* Floating Icons */}

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


      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 bg-black/60 backdrop-blur-xl rounded-full px-6 py-3 border border-red-500/30">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🎬</span>

      <div className="relative z-10 h-full flex flex-col pt-16">
        <div className="container mx-auto px-4 max-w-7xl h-full flex flex-col">

          {/* Fixed Header */}
          <div className="flex-shrink-0 text-center py-4">
            <div className="inline-flex items-center gap-3 bg-black/60 backdrop-blur-lg rounded-full px-6 py-2 border border-red-500/30">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-lg">🎬</span>

              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                  NEXUS Movie AI
                </h1>
                <p className="text-xs text-gray-300">Your Personal Film Finder</p>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
            </div>
          </div>
          <button onClick={() => setIsToggle(true)} className={`${istoggle?"opacity-0":"opacity-100"} bg-white/30 backdrop-blur-sm mb-2 sm:hidden border w-8 px-4 py-2 flex flex-col justify-center items-center ml-4 rounded-lg`}>

            <ArrowRightToLine className="w-5 h-5"/>
          </button>


          {/* Main Layout - Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            
            {/* Sidebar - Quick Prompts */}
            <div className="lg:col-span-3">
              <div className="bg-black/60 backdrop-blur-xl rounded-2xl border border-red-500/30 p-4">
                <h3 className="text-base font-semibold mb-3 text-red-300 text-center flex items-center justify-center gap-2">
                  <span className="text-lg">🍿</span>
                  <span>Quick Requests</span>
                </h3>
                <div className="space-y-2 max-h-[250px] lg:max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-red-500/50 scrollbar-track-transparent">

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
                      className="w-full bg-black/40 hover:bg-red-900/30 border border-red-700/40 hover:border-red-400/60 rounded-xl px-4 py-3 text-sm text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>


            {/* Chat Area */}
            <div className="lg:col-span-9">
              <div 
                className="bg-black/60 backdrop-blur-xl rounded-2xl border border-red-500/30 shadow-2xl flex flex-col"
                style={{ height: 'calc(100vh - 240px)', minHeight: '500px' }}
              >
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-thin scrollbar-thumb-red-500/50 scrollbar-track-transparent">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.isBot ? "justify-start" : "justify-end"} animate-fadeInUp`}
                    >
                      <div
                        className={`max-w-[90%] md:max-w-[75%] lg:max-w-[70%] px-4 md:px-5 py-3 md:py-4 rounded-2xl ${
                          message.isBot
                            ? "bg-gradient-to-br from-red-600/30 to-purple-600/30 border border-red-500/40"
                            : "bg-gray-800/80 border border-gray-600/40"
                        }`}

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
                        className={`max-w-[800px] px-4 py-3 rounded-2xl relative ${message.isBot
                          ? "bg-gradient-to-r from-red-600/30 to-purple-600/30 border border-red-500/40"
                          : "bg-gradient-to-r from-gray-600/50 to-gray-700/50 border border-gray-500/40"
                          }`}

                      >
                        {message.isBot && (
                          <div className="text-xs text-red-300 mb-2 flex items-center gap-1.5 font-medium">
                            <span>🤖</span>
                            <span>Movie AI</span>
                          </div>
                        )}
                        <div className="text-sm leading-relaxed">
                          {message.isBot ? (
                            <MarkdownRenderer content={message.text} />
                          ) : (
                            <p className="whitespace-pre-wrap">{message.text}</p>
                          )}
                        </div>
                        <p className="text-xs opacity-70 mt-2">{message.timestamp}</p>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {message.text}
                        </p>
                        <p className="text-xs opacity-60 mt-2">{message.timestamp}</p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start animate-fadeInUp">
                      <div className="bg-gradient-to-br from-red-600/30 to-purple-600/30 border border-red-500/40 px-4 md:px-5 py-3 md:py-4 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1.5">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                          </div>
                          <span className="text-sm text-red-300">Finding perfect movies...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-red-500/30 bg-black/40 p-4 md:p-5">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Tell me what movie mood you're in..."
                      className="flex-1 bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 md:px-5 py-3 md:py-3.5 text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-400/60 transition-all"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim()}

                      className={`px-6 md:px-7 py-3 md:py-3.5 rounded-xl font-semibold transition-all duration-300 flex-shrink-0 ${
                        isLoading || !input.trim()
                          ? "bg-gray-700/50 border border-gray-600/40 cursor-not-allowed" 
                          : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 border border-red-400/60 hover:shadow-lg hover:shadow-red-500/30 hover:scale-105"
                      }`}

                      className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${isLoading
                        ? "bg-gray-600/50 border border-gray-500/40"
                        : "bg-gradient-to-r from-red-600 to-purple-600 border border-red-400/60 hover:shadow-lg hover:scale-105"
                        }`}

                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-red-400 rounded-full animate-spin" />
                      ) : (
                        <span className="text-lg">🚀</span>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    Ask me anything like "funny movies" or "best action films" 🍿
                  </p>
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
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(239, 68, 68, 0.5), rgba(147, 51, 234, 0.5));
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(239, 68, 68, 0.8), rgba(147, 51, 234, 0.8));
        }
      `}</style>
    </div>
  );
};

export default NeuralChat;