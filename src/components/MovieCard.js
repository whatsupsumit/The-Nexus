import React from 'react';
import { getImageUrl, getYear } from '../utils/vidsrcApi';

const MovieCard = ({ movie, onClick, isTV = false, customBadge = null }) => {
  const title = isTV ? movie.name : movie.title;
  const releaseDate = isTV ? movie.first_air_date : movie.release_date;
  const posterPath = movie.poster_path;
  
  const handleImageError = (e) => {
    e.target.src = '/api/placeholder/300/400';
  };

  const badge = customBadge || (isTV ? 'Series' : 'Movie');
  
  return (
    <div 
      className="movie-card group relative aspect-[2/3] bg-gradient-to-b from-red-900/20 to-black/60 rounded-lg border border-red-800/30 hover:border-red-500/60 transition-all duration-200 cursor-pointer overflow-hidden will-change-transform"
      onClick={() => onClick(movie)}
    >
      {/* Movie Poster */}
      {posterPath ? (
        <img
          src={movie.media_type === 'anime' ? posterPath : getImageUrl(posterPath)}
          alt={title}
          className="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
          onError={handleImageError}
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
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-['JetBrains_Mono',monospace] text-white text-sm font-bold mb-1 line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300">{getYear(releaseDate)}</span>
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400">⭐</span>
              <span className="text-gray-300">{movie.vote_average?.toFixed(1) || movie.score?.toFixed(1) || 'N/A'}</span>
            </div>
          </div>
          <div className="mt-2 flex items-center space-x-2">
            <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
            <span className={`text-xs uppercase tracking-wider ${
              customBadge === 'ANIME' ? 'text-purple-400' : 'text-red-400'
            }`}>
              {badge}
            </span>
          </div>
        </div>
      </div>
      
      {/* Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-red-600 rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-200">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Rating Badge */}
      <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex items-center space-x-1">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="font-['JetBrains_Mono',monospace] text-white text-xs">
            {movie.vote_average?.toFixed(1) || 'N/A'}
          </span>
        </div>
      </div>
      
      {/* NEXUS Scan Line Effect */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
    </div>
  );
};

export default MovieCard;
