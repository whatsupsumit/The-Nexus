import React, { useState, useEffect } from 'react';
import { getContinueWatching, getImageUrl } from '../utils/vidsrcApi';

const ContinueWatching = ({ onMovieClick }) => {
  const [continueItems, setContinueItems] = useState([]);

  useEffect(() => {
    const loadContinueWatching = () => {
      const items = getContinueWatching();
      setContinueItems(items);
    };

    loadContinueWatching();
    
    // Refresh every 30 seconds to catch new progress
    const interval = setInterval(loadContinueWatching, 30000);
    return () => clearInterval(interval);
  }, []);

  if (continueItems.length === 0) {
    return null;
  }

  const formatProgress = (progress) => {
    if (!progress || !progress.duration) return 0;
    return Math.round((progress.watched / progress.duration) * 100);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="mb-8">
      <h2 className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-[#ef1a0fff] mb-4 flex items-center">
        <span className="text-red-400 mr-2">{'>'}</span> CONTINUE WATCHING
        <div className="ml-3 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </h2>
      
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {continueItems.map((item) => (
          <div
            key={`${item.id}-${item.type}-${item.last_season_watched || ''}-${item.last_episode_watched || ''}`}
            className="flex-shrink-0 w-80 bg-gradient-to-b from-red-900/10 to-black/40 rounded-lg border border-red-800/30 hover:border-red-500/60 transition-all hover:scale-105 cursor-pointer group"
            onClick={() => {
              const movieData = {
                id: item.id,
                title: item.title,
                name: item.title,
                poster_path: item.poster_path,
                backdrop_path: item.backdrop_path
              };
              
              if (item.type === 'tv' && item.last_season_watched && item.last_episode_watched) {
                onMovieClick(movieData, true, parseInt(item.last_season_watched), parseInt(item.last_episode_watched));
              } else {
                onMovieClick(movieData, item.type === 'tv');
              }
            }}
          >
            <div className="relative">
              <img
                src={getImageUrl(item.backdrop_path || item.poster_path, 'w780')}
                alt={item.title}
                className="w-full h-44 object-cover rounded-t-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/780x440/1a1a1a/ef4444?text=NEXUS';
                }}
              />
              
              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60 rounded-b-lg overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-300"
                  style={{ width: `${formatProgress(item.progress)}%` }}
                ></div>
              </div>
              
              {/* Resume Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/80 backdrop-blur-sm rounded-full p-4">
                  <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-['JetBrains_Mono',monospace] text-white text-sm font-medium mb-2 truncate">
                {item.title}
              </h3>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-gray-400">
                  <span>{formatProgress(item.progress)}% watched</span>
                  {item.type === 'tv' && item.last_season_watched && item.last_episode_watched && (
                    <>
                      <span>•</span>
                      <span>S{item.last_season_watched}:E{item.last_episode_watched}</span>
                    </>
                  )}
                </div>
                <div className="text-red-400 font-['JetBrains_Mono',monospace]">
                  {item.progress?.watched && item.progress?.duration && (
                    <span>{formatTime(item.progress.duration - item.progress.watched)} left</span>
                  )}
                </div>
              </div>
              
              {/* Type Badge */}
              <div className="mt-2 inline-block">
                <span className={`text-xs font-['JetBrains_Mono',monospace] px-2 py-1 rounded ${
                  item.type === 'movie' 
                    ? 'bg-blue-900/30 text-blue-400 border border-blue-800/30' 
                    : 'bg-purple-900/30 text-purple-400 border border-purple-800/30'
                }`}>
                  {item.type === 'movie' ? 'MOVIE' : 'TV SERIES'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Stats */}
      <div className="mt-4 text-center">
        <div className="font-['JetBrains_Mono',monospace] text-xs text-gray-500">
          <span className="text-green-400">{continueItems.length}</span> items in progress
          <span className="mx-2 text-red-400">●</span>
          <span>Auto-synced via VidLink</span>
        </div>
      </div>
    </div>
  );
};

export default ContinueWatching;
