import React, { useState, useEffect } from 'react';
import { fetchTrendingMovies, fetchTrendingTV, fetchPopularMovies, fetchPopularTV } from '../utils/vidsrcApi';
import { fetchTrendingAnime, fetchTopAnime } from '../utils/animeApi';
import { fetchTrendingManga, fetchTopManga } from '../utils/mangaApi';

const SmartSuggestions = ({ currentPage, onContentSelect, userVault = [] }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadSmartSuggestions = async () => {
      setLoading(true);
      try {
        let allSuggestions = [];

        // Load suggestions based on current page
        switch (currentPage) {
          case 'movies':
            const [trendingMovies, popularMovies] = await Promise.all([
              fetchTrendingMovies(),
              fetchPopularMovies()
            ]);
            allSuggestions = [...trendingMovies.slice(0, 10), ...popularMovies.slice(0, 10)];
            break;

          case 'tv':
            const [trendingTV, popularTV] = await Promise.all([
              fetchTrendingTV(),
              fetchPopularTV()
            ]);
            allSuggestions = [...trendingTV.slice(0, 10), ...popularTV.slice(0, 10)];
            break;

          case 'anime':
            const [trendingAnime, topAnime] = await Promise.all([
              fetchTrendingAnime(),
              fetchTopAnime()
            ]);
            allSuggestions = [...trendingAnime.slice(0, 10), ...topAnime.slice(0, 10)];
            break;

          case 'manga':
            const [trendingManga, topManga] = await Promise.all([
              fetchTrendingManga(),
              fetchTopManga()
            ]);
            allSuggestions = [...trendingManga.slice(0, 10), ...topManga.slice(0, 10)];
            break;

          default:
            // Mixed suggestions for browse page
            const [movies, tv, anime, manga] = await Promise.all([
              fetchTrendingMovies(),
              fetchTrendingTV(),
              fetchTrendingAnime(),
              fetchTrendingManga()
            ]);
            allSuggestions = [
              ...movies.slice(0, 5),
              ...tv.slice(0, 5),
              ...anime.slice(0, 5),
              ...manga.slice(0, 5)
            ];
        }

        // Remove duplicates and items already in vault
        const uniqueSuggestions = allSuggestions
          .filter((item, index, self) => 
            index === self.findIndex(t => t.id === item.id) &&
            !userVault.some(vaultItem => vaultItem.id === item.id)
          )
          .slice(0, 20);

        setSuggestions(uniqueSuggestions);
      } catch (error) {
        console.error('Error loading smart suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSmartSuggestions();
  }, [currentPage, userVault]);

  const nextSuggestion = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, suggestions.length - 2));
  };

  const prevSuggestion = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, suggestions.length - 2)) % Math.max(1, suggestions.length - 2));
  };

  const getContentType = (content) => {
    if (content.media_type) return content.media_type.toUpperCase();
    if (content.first_air_date || content.name) return 'TV';
    if (content.release_date || content.title) return 'MOVIE';
    if (content.type === 'anime') return 'ANIME';
    if (content.type === 'manga') return 'MANGA';
    return 'UNKNOWN';
  };

  const formatTitle = (content) => {
    return content.title || content.name || content.title_english || 'Unknown Title';
  };

  const getImageUrl = (content) => {
    if (content.poster_path) {
      return `https://image.tmdb.org/t/p/w300${content.poster_path}`;
    }
    if (content.images?.jpg?.image_url) {
      return content.images.jpg.image_url;
    }
    if (content.backdrop_path) {
      return `https://image.tmdb.org/t/p/w300${content.backdrop_path}`;
    }
    return `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${formatTitle(content).charAt(0)}`;
  };

  if (loading) {
    return (
      <div className="bg-black/80 backdrop-blur-sm rounded-xl border border-red-900/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-['JetBrains_Mono',monospace] text-red-400 text-lg font-bold">
            NEXUS SUGGESTIONS
          </h3>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
        <div className="flex space-x-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-1">
              <div className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse mb-3"></div>
              <div className="h-4 bg-gray-800 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-800 rounded w-2/3 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) return null;

  const visibleSuggestions = suggestions.slice(currentIndex, currentIndex + 3);
  if (visibleSuggestions.length < 3 && suggestions.length >= 3) {
    visibleSuggestions.push(...suggestions.slice(0, 3 - visibleSuggestions.length));
  }

  return (
    <div className="bg-gradient-to-br from-black via-red-950/10 to-black backdrop-blur-sm rounded-xl border border-red-900/20 p-6 hover:border-red-800/40 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-['JetBrains_Mono',monospace] text-red-400 text-lg font-bold flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            NEXUS SUGGESTIONS
          </h3>
          <p className="font-['JetBrains_Mono',monospace] text-gray-400 text-sm mt-1">
            AI-curated recommendations • Click to explore
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevSuggestion}
            className="w-8 h-8 rounded-full bg-red-900/30 border border-red-800/30 text-red-400 hover:bg-red-800/30 transition-colors duration-200 flex items-center justify-center"
            disabled={suggestions.length <= 3}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSuggestion}
            className="w-8 h-8 rounded-full bg-red-900/30 border border-red-800/30 text-red-400 hover:bg-red-800/30 transition-colors duration-200 flex items-center justify-center"
            disabled={suggestions.length <= 3}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {visibleSuggestions.map((content, index) => (
          <div
            key={`${content.id}-${index}-${currentIndex}`}
            onClick={() => onContentSelect && onContentSelect(content)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3 transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-red-900/20">
              <img
                src={getImageUrl(content)}
                alt={formatTitle(content)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${formatTitle(content).charAt(0)}`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-2 left-2 right-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-['JetBrains_Mono',monospace] font-bold ${
                    getContentType(content) === 'MOVIE' ? 'bg-blue-900/80 text-blue-300' :
                    getContentType(content) === 'TV' ? 'bg-purple-900/80 text-purple-300' :
                    getContentType(content) === 'ANIME' ? 'bg-orange-900/80 text-orange-300' :
                    'bg-green-900/80 text-green-300'
                  }`}>
                    {getContentType(content)}
                  </span>
                </div>
              </div>
            </div>
            <h4 className="font-['JetBrains_Mono',monospace] text-white text-sm font-semibold truncate mb-1 group-hover:text-red-400 transition-colors">
              {formatTitle(content)}
            </h4>
            <div className="flex items-center space-x-2">
              {content.vote_average && (
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-['JetBrains_Mono',monospace] text-gray-400 text-xs">
                    {content.vote_average.toFixed(1)}
                  </span>
                </div>
              )}
              {(content.score || content.rating) && (
                <span className="font-['JetBrains_Mono',monospace] text-gray-400 text-xs">
                  {(content.score || content.rating)?.toFixed(1)}★
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {suggestions.length > 3 && (
        <div className="flex justify-center mt-4">
          <div className="flex space-x-1">
            {[...Array(Math.ceil(suggestions.length / 3))].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  Math.floor(currentIndex / 3) === i ? 'bg-red-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSuggestions;
