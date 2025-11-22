// React aur memo import - memo performance optimize karta hai, unnecessary re-renders rokta hai
import React, { memo } from 'react';
// Utility functions - image URLs banane, year nikalne, backup images ke liye
import { getImageUrl, getYear, getBackupImageUrl } from '../utils/vidsrcApi';

// MovieCard component - single movie/TV show ka card display karta hai poster aur details ke saath
// memo use kar rahe so jab props same ho toh re-render nahi hoga (optimization)
const MovieCard = memo(({ movie, onClick, isTV = false, customBadge = null }) => {
  const title = isTV ? movie.name : movie.title;
  const releaseDate = isTV ? movie.first_air_date : movie.release_date;
  const posterPath = movie.poster_path;
  
  // Debug logging to see what data we're getting
  if (!title) {
    console.log('🔍 MovieCard Debug - Movie data:', movie);
  }
  
  const handleImageError = (e) => {
    console.log('🖼️ Image failed to load:', e.target.src);
    // Try alternative poster sizes first
    if (e.target.src.includes('w500')) {
      e.target.src = getImageUrl(posterPath, 'w342');
    } else if (e.target.src.includes('w342')) {
      e.target.src = getImageUrl(posterPath, 'w185');
    } else if (e.target.src.includes('tmdb.org')) {
      // If TMDB images are failing, try backup image service
      e.target.src = getBackupImageUrl(title, 'w342');
    } else {
      // Last resort: show custom fallback element
      e.target.style.display = 'none';
      const parent = e.target.parentElement;
      if (parent && !parent.querySelector('.fallback-image')) {
        const fallback = document.createElement('div');
        fallback.className = 'fallback-image w-full h-full flex items-center justify-center bg-theme-card-hover rounded-lg';
        fallback.innerHTML = `
          <div class="text-center p-4">
            <div class="text-3xl sm:text-4xl mb-2">
              ${isTV ? '📺' : '🎬'}
            </div>
            <p class="font-['JetBrains_Mono',monospace] text-xs text-theme-muted truncate">
              ${title || 'No Title'}
            </p>
            <p class="font-['JetBrains_Mono',monospace] text-xs text-theme-muted mt-1">
              No Image
            </p>
          </div>
        `;
        parent.appendChild(fallback);
      }
    }
  };
  
  return (
    <div 
      className="movie-card relative aspect-[2/3] bg-theme-card rounded-lg border border-theme cursor-pointer overflow-hidden will-change-transform min-h-[200px] sm:min-h-[240px] md:min-h-[280px] hover:border-red-500/50 transition-all duration-300"
      onClick={() => onClick(movie)}
      style={{ transform: 'translateZ(0)' }}
    >
      {/* Movie Poster */}
      {posterPath ? (
        <img
          src={posterPath.startsWith('http') ? posterPath : getImageUrl(posterPath, 'w342')}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
          loading="lazy"
          onError={handleImageError}
          style={{ transform: 'translateZ(0)' }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-theme-card-hover rounded-lg">
          <div className="text-center p-4">
            <div className="text-3xl sm:text-4xl mb-2">
              {isTV ? '📺' : '🎬'}
            </div>
            <p className="font-['JetBrains_Mono',monospace] text-xs text-theme-muted truncate">
              {title || 'No Title'}
            </p>
            <p className="font-['JetBrains_Mono',monospace] text-xs text-theme-muted mt-1">
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
