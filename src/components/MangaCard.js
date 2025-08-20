import React from 'react';

const MangaCard = ({ manga, onClick }) => {
  const handleClick = () => {
    onClick(manga);
  };

  const getImageUrl = () => {
    const imageUrl = manga.poster_path || manga.poster || manga.image || `https://dummyimage.com/342x513/1f2937/ffffff.png?text=${encodeURIComponent(manga.title || 'Manga')}`;
    return imageUrl;
  };

  const title = manga.title || manga.name || 'Unknown Manga';

  return (
    <div
      onClick={handleClick}
      className="relative group cursor-pointer overflow-hidden rounded-lg bg-nexus-black transition-all duration-300 hover:scale-105 hover:shadow-xl border border-nexus-red/20 hover:border-nexus-red/40"
    >
      {/* Poster Image */}
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={getImageUrl()}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://dummyimage.com/342x513/1f2937/ffffff.png?text=${encodeURIComponent(title)}`;
          }}
        />
        
        {/* Type/Status Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {manga.type && (
            <span className="px-2 py-1 text-xs font-bold bg-orange-600/90 text-white rounded font-['Arvo',serif]">
              {manga.type}
            </span>
          )}
          {manga.status && manga.status !== 'Unknown' && (
            <span className={`px-2 py-1 text-xs font-bold text-white rounded font-['Arvo',serif] ${
              manga.status === 'Publishing' ? 'bg-green-600/90' : 
              manga.status === 'Finished' ? 'bg-blue-600/90' : 
              'bg-gray-600/90'
            }`}>
              {manga.status}
            </span>
          )}
        </div>

        {/* Chapter/Volume Count */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {manga.chapters && manga.chapters !== 'Unknown' && (
            <span className="px-2 py-1 text-xs font-bold bg-nexus-red/90 text-white rounded font-['Arvo',serif]">
              {manga.chapters} CH
            </span>
          )}
          {manga.volumes && manga.volumes !== 'Unknown' && (
            <span className="px-2 py-1 text-xs font-bold bg-purple-600/90 text-white rounded font-['Arvo',serif]">
              {manga.volumes} VOL
            </span>
          )}
        </div>

        {/* Score badge */}
        {manga.score && manga.score > 0 && (
          <div className="absolute bottom-2 right-2">
            <span className="px-2 py-1 text-xs font-bold bg-yellow-600/90 text-white rounded font-['Arvo',serif]">
              ★ {manga.score.toFixed(1)}
            </span>
          </div>
        )}
      </div>
      
      {/* Info overlay - always visible on mobile, hover on desktop */}
      <div className="absolute inset-0 bg-gradient-to-t from-nexus-black/90 via-transparent to-transparent opacity-100 sm:opacity-0 sm:hover:opacity-100 transition-opacity duration-200">
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
          <h3 className="text-nexus-text-light text-xs sm:text-sm font-bold mb-1 truncate font-['Arvo',serif]">
            {title}
          </h3>
          <div className="flex items-center justify-between text-xs">
            <span className="text-nexus-text-dark font-['Arvo',serif]">{manga.year || 'Unknown'}</span>
            {manga.score && manga.score > 0 && (
              <span className="text-yellow-400 font-['Arvo',serif]">★ {manga.score.toFixed(1)}</span>
            )}
          </div>
          {manga.type && (
            <div className="text-xs text-orange-400 mt-1 font-['Arvo',serif]">{manga.type}</div>
          )}
          {manga.genres && manga.genres.length > 0 && (
            <div className="text-xs text-nexus-text-dark mt-1 truncate font-['Arvo',serif]">
              {manga.genres.slice(0, 2).map(g => g.name).join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Manga icon overlay */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-nexus-red/80 backdrop-blur-sm rounded-full p-3">
          <span className="text-2xl">📚</span>
        </div>
      </div>
    </div>
  );
};

export default MangaCard;
