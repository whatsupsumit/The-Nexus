import React from 'react';

const AnimeCard = ({ anime, onClick }) => {
  const handleClick = () => {
    onClick(anime);
  };

  const getImageUrl = () => {
    const imageUrl = anime.poster_path || anime.poster || anime.image || `https://placehold.co/300x400/1f2937/9ca3af/?text=${encodeURIComponent(anime.title || 'Anime')}&font=inter`;
    return imageUrl;
  };

  const title = anime.title || anime.name || 'Unknown Anime';

  return (
    <div
      onClick={handleClick}
      className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      {/* Poster Image */}
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={getImageUrl()}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/300x400/1f2937/9ca3af/?text=${encodeURIComponent(title)}&font=inter`;
          }}
        />
        
        {/* Quality/Status Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {anime.tvInfo?.quality && (
            <span className="px-2 py-1 text-xs font-bold bg-green-600/90 text-white rounded">
              {anime.tvInfo.quality}
            </span>
          )}
          {anime.tvInfo?.sub && (
            <span className="px-2 py-1 text-xs font-bold bg-blue-600/90 text-white rounded">
              SUB
            </span>
          )}
          {anime.tvInfo?.dub && (
            <span className="px-2 py-1 text-xs font-bold bg-purple-600/90 text-white rounded">
              DUB
            </span>
          )}
        </div>

        {/* Episode Count */}
        {anime.tvInfo?.eps && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 text-xs font-bold bg-red-600/90 text-white rounded">
              {anime.tvInfo.eps} EPS
            </span>
          </div>
        )}
      </div>
      
      {/* Info overlay - always visible on mobile, hover on desktop */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-100 sm:opacity-0 sm:hover:opacity-100 transition-opacity duration-200">
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
          <h3 className="text-white text-xs sm:text-sm font-bold mb-1 truncate">
            {title}
          </h3>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300">{anime.year || 'Unknown'}</span>
            {anime.rating && (
              <span className="text-yellow-400">★ {anime.rating}</span>
            )}
          </div>
          {anime.tvInfo?.showType && (
            <div className="text-xs text-purple-400 mt-1">{anime.tvInfo.showType}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
