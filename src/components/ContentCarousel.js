import React, { useRef, memo, useCallback } from 'react';
import MovieCard from './MovieCard';

const ContentCarousel = memo(({ title, content = [], onItemClick, isTV = false, loading = false }) => {
  const scrollRef = useRef(null);
  
  const scroll = useCallback((direction) => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 480 ? 150 : window.innerWidth < 640 ? 200 : window.innerWidth < 1024 ? 250 : 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'auto' // Changed to auto for better performance
      });
    }
  }, []);
  
  if (loading) {
    return (
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center mb-4 sm:mb-6">
          <div className="w-4 h-4 sm:w-6 sm:h-6 bg-red-400 rounded mr-2 sm:mr-3"></div>
          <div className="h-4 sm:h-6 bg-gray-700 rounded w-32 sm:w-48"></div>
        </div>
        <div className="flex space-x-2 sm:space-x-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-32 sm:w-40 md:w-48 aspect-[2/3] bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!content || content.length === 0) {
    return (
      <div className="mb-8 sm:mb-12">
        <h2 className="font-['Arvo',serif] text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
          <span className="w-2 h-2 bg-red-400 rounded-full mr-2 sm:mr-3"></span>
          {title}
        </h2>
        <div className="text-center py-8 sm:py-12 text-gray-500">
          <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">📡</div>
          <p className="font-['Arvo',serif] text-sm sm:text-base">No content found</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-8 sm:mb-12 relative" style={{ transform: 'translateZ(0)' }}>
      <div className="relative">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="font-['Arvo',serif] text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center">
            <span className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full mr-2 sm:mr-4"></span>
            <span className="text-red-400 mr-2">&gt;</span>
            <span>{title}</span>
          </h2>
          
          <div className="hidden sm:flex space-x-2">
            <button
              onClick={() => scroll('left')}
              className="bg-black/60 hover:bg-red-600/20 border border-red-800/30 text-white p-2 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="bg-black/60 hover:bg-red-600/20 border border-red-800/30 text-white p-2 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex space-x-2 sm:space-x-4 overflow-x-auto scrollbar-hide pb-2 sm:pb-4"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              touchAction: 'pan-x',
              transform: 'translateZ(0)',
              willChange: 'scroll-position'
            }}
          >
            {content.map((item, index) => (
              <div 
                key={item.id || index} 
                className="flex-shrink-0 w-28 xs:w-32 sm:w-40 md:w-48"
                style={{ transform: 'translateZ(0)' }}
              >
                <MovieCard
                  movie={item}
                  onClick={onItemClick}
                  isTV={isTV}
                />
              </div>
            ))}
          </div>
          
          {/* Simplified fade gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
        </div>
        
        {/* Simplified status indicator */}
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-400">
            {content.length} {isTV ? 'SHOWS' : 'MOVIES'} • STREAMING ACTIVE
          </div>
        </div>
      </div>
    </div>
  );
});

export default ContentCarousel;
