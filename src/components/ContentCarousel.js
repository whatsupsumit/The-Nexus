import React, { useRef } from 'react';
import MovieCard from './MovieCard';

const ContentCarousel = ({ title, content = [], onItemClick, isTV = false, loading = false }) => {
  const scrollRef = useRef(null);
  
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  if (loading) {
    return (
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <div className="w-6 h-6 bg-red-400 rounded animate-pulse mr-3"></div>
          <div className="h-6 bg-gray-700 rounded w-48 animate-pulse"></div>
        </div>
        <div className="flex space-x-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48 aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!content || content.length === 0) {
    return (
      <div className="mb-12">
        <h2 className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-white mb-6 flex items-center">
          <span className="w-2 h-2 bg-red-400 rounded-full mr-3 animate-pulse"></span>
          {title}
        </h2>
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">📡</div>
          <p className="font-['JetBrains_Mono',monospace]">No content found in the matrix</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-12 group relative">
      {/* Section Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/5 via-purple-900/5 to-red-900/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-white flex items-center relative">
            {/* Animated indicator */}
            <div className="relative mr-4">
              <span className="w-3 h-3 bg-red-400 rounded-full inline-block animate-pulse"></span>
              <span className="absolute inset-0 w-3 h-3 bg-red-400 rounded-full animate-ping"></span>
            </div>
            
            {/* Glitch arrow effect */}
            <span className="text-red-400 relative group-hover:animate-pulse">
              {'>'}
              <span className="absolute inset-0 text-cyan-400 opacity-0 group-hover:opacity-50 transform translate-x-0.5 translate-y-0.5">{'>'}</span>
            </span>
            
            {/* Enhanced title with hologram effect */}
            <span className="ml-2 relative group-hover:text-red-300 transition-colors duration-300">
              {title}
              {/* Data stream effect */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </span>
          </h2>
          
          {/* Enhanced Navigation Arrows */}
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
            <button
              onClick={() => scroll('left')}
              className="relative bg-black/60 hover:bg-red-600/20 border border-red-800/30 hover:border-red-500/60 text-white p-2 rounded-lg transition-all duration-200 overflow-hidden group/btn"
            >
              {/* Button energy effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20 transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500"></div>
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="relative bg-black/60 hover:bg-red-600/20 border border-red-800/30 hover:border-red-500/60 text-white p-2 rounded-lg transition-all duration-200 overflow-hidden group/btn"
            >
              {/* Button energy effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20 transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500"></div>
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content Scroll Container with Enhanced Effects */}
        <div className="relative">
          {/* Scanning line effect */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-0 group-hover:opacity-100 animate-pulse z-20"></div>
          
          <div 
            ref={scrollRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 relative z-10"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {content.map((item, index) => (
              <div 
                key={item.id || index} 
                className="flex-shrink-0 w-48 transform transition-all duration-300 hover:scale-105 hover:z-20 relative"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Card glow effect on hover */}
                <div className="absolute -inset-2 bg-gradient-to-br from-red-500/20 via-purple-500/20 to-red-500/20 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                <div className="relative z-10">
                  <MovieCard
                    movie={item}
                    onClick={onItemClick}
                    isTV={isTV}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Enhanced Fade Gradients with particle effect */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black via-black/60 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-transparent"></div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black via-black/60 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-l from-red-900/10 to-transparent"></div>
          </div>
        </div>
        
        {/* Enhanced Content Counter with System Status */}
        <div className="mt-6 text-center relative">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="font-['JetBrains_Mono',monospace] text-xs text-gray-400 relative z-10">
            <div className="flex justify-center items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>{content.length} {isTV ? 'SERIES' : 'MOVIES'} LOADED</span>
              </div>
              
              <span className="text-red-400">•</span>
              
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-green-400">MATRIX SYNC ACTIVE</span>
              </div>
              
              <span className="text-red-400">•</span>
              
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-purple-400">NEURAL LINK STABLE</span>
              </div>
            </div>
            
            {/* Data flow indicator */}
            <div className="mt-2 text-xs text-gray-600">
              QUANTUM STREAM {Math.floor(Math.random() * 999) + 100}kb/s ↑↓
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCarousel;
