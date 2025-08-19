import React, { memo } from 'react';
import { getImageUrl, getYear } from '../utils/vidsrcApi';

const MovieCard = memo(({ movie, onClick, isTV = false, customBadge = null }) => {
  const title = isTV ? movie.name : movie.title;
  const releaseDate = isTV ? movie.first_air_date : movie.release_date;
  const posterPath = movie.poster_path;
  
  const handleImageError = (e) => {
    // Try alternative poster size for mobile
    if (e.target.src.includes('w500')) {
      e.target.src = getImageUrl(posterPath, 'w342');
    } else if (e.target.src.includes('w342')) {
      e.target.src = getImageUrl(posterPath, 'w185');
    } else {
      e.target.src = `https://via.placeholder.com/300x450/1f2937/ef4444?text=${encodeURIComponent(title?.charAt(0) || '?')}`;
    }
  };
  
  return (
    <div 
      className="movie-card relative aspect-[2/3] bg-gray-900 rounded-lg border border-red-800/50 cursor-pointer overflow-hidden will-change-transform min-h-[200px] sm:min-h-[240px] md:min-h-[280px]"
      onClick={() => onClick(movie)}
      style={{ transform: 'translateZ(0)' }}
    >
      {/* Movie Poster */}
      {posterPath ? (
        <img
          src={movie.media_type === 'anime' ? posterPath : getImageUrl(posterPath, 'w342')}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
          loading="lazy"
          onError={handleImageError}
          style={{ transform: 'translateZ(0)' }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
          <div className="text-center p-4">
            <div className="text-3xl sm:text-4xl mb-2">
              {movie.media_type === 'anime' ? '🎌' : isTV ? '📺' : '🎬'}
            </div>
            <p className="font-['JetBrains_Mono',monospace] text-xs text-gray-400 truncate">
              {title || 'No Title'}
            </p>
            <p className="font-['JetBrains_Mono',monospace] text-xs text-gray-500 mt-1">
              No Image
            </p>
          </div>
        </div>
      )}
      
      {/* Info overlay - always visible on mobile, hover on desktop */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-100 sm:opacity-0 sm:hover:opacity-100 transition-opacity duration-200">
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
          <h3 className="text-white text-xs sm:text-sm font-bold mb-1 truncate">
            {title}
          </h3>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300">{getYear(releaseDate)}</span>
            {movie.vote_average && (
              <span className="text-yellow-400">★ {movie.vote_average?.toFixed(1)}</span>
            )}
          </div>
          {isTV && (
            <div className="text-xs text-purple-400 mt-1">TV Series</div>
          )}
        </div>
      </div>
    </div>
  );
});

export default MovieCard;
