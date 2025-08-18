import React, { memo } from 'react';
import { getImageUrl, getYear } from '../utils/vidsrcApi';

const MovieCard = memo(({ movie, onClick, isTV = false, customBadge = null }) => {
  const title = isTV ? movie.name : movie.title;
  const releaseDate = isTV ? movie.first_air_date : movie.release_date;
  const posterPath = movie.poster_path;
  
  const handleImageError = (e) => {
    e.target.src = '/api/placeholder/300/400';
  };
  
  return (
    <div 
      className="movie-card relative aspect-[2/3] bg-gray-900 rounded-lg border border-red-800/50 cursor-pointer overflow-hidden will-change-transform"
      onClick={() => onClick(movie)}
      style={{ transform: 'translateZ(0)' }}
    >
      {/* Movie Poster */}
      {posterPath ? (
        <img
          src={movie.media_type === 'anime' ? posterPath : getImageUrl(posterPath)}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
          loading="lazy"
          onError={handleImageError}
          style={{ transform: 'translateZ(0)' }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
          <div className="text-center p-4">
            <div className="text-4xl mb-2">
              {movie.media_type === 'anime' ? '🎌' : '🎬'}
            </div>
            <p className="font-['JetBrains_Mono',monospace] text-xs text-gray-400">No Image</p>
          </div>
        </div>
      )}
      
      {/* Simple overlay - only shown on hover for essential info */}
      <div className="absolute inset-0 bg-black/80 opacity-0 hover:opacity-100 transition-opacity duration-200">
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white text-sm font-bold mb-1 truncate">
            {title}
          </h3>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300">{getYear(releaseDate)}</span>
            <span className="text-yellow-400">★ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default MovieCard;
