import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTrendingAnime, fetchPopularAnime, fetchTopAnime, searchAnime } from '../utils/animeApi';
import AnimeCard from './AnimeCard';

const Anime = () => {
  const navigate = useNavigate();
  const [anime, setAnime] = useState([]);
  const [filteredAnime, setFilteredAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('trending');

  useEffect(() => {
    const loadAnime = async () => {
      setLoading(true);
      try {
        let animeData = [];
        switch (currentFilter) {
          case 'popular':
            animeData = await fetchPopularAnime();
            break;
          case 'top_rated':
            animeData = await fetchTopAnime();
            break;
          default:
            animeData = await fetchTrendingAnime();
        }
        console.log('NEXUS: Fetched anime data:', animeData);
        setAnime(animeData || []);
        setFilteredAnime(animeData || []);
      } catch (error) {
        console.error('Error loading anime:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAnime();
  }, [currentFilter]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        document.querySelector('input[type="text"]')?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredAnime(anime);
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await searchAnime(query);
      setFilteredAnime(searchResults || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAnimeClick = (animeItem) => {
    navigate(`/anime/${animeItem.id}`, { state: { anime: animeItem } });
  };

  const filterButtons = [
    { key: 'trending', label: 'TRENDING' },
    { key: 'popular', label: 'POPULAR' },
    { key: 'top_rated', label: 'TOP RATED' }
  ];

  return (
    <div className="min-h-screen text-white pt-24">
      {/* Header Section */}
      <div className="px-8 mb-8">
        <h1 className="font-['JetBrains_Mono',monospace] text-4xl font-bold text-[#ef1a0fff] mb-4">
          <span className="text-red-400">{'>'}</span> QUANTUM ANIME
        </h1>
        <p className="font-['JetBrains_Mono',monospace] text-gray-300 mb-6">
          Neural link to unlimited anime content from across dimensions
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search anime quantum database... (Ctrl+G)"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-black/70 backdrop-blur-sm border-2 border-red-800/30 rounded-lg px-6 py-3 text-white font-['JetBrains_Mono',monospace] placeholder-gray-400 focus:outline-none focus:border-red-500/60 transition-all duration-300"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-4 mb-8">
          {filterButtons.map((filter) => (
            <button
              key={filter.key}
              onClick={() => {
                setCurrentFilter(filter.key);
                setSearchQuery('');
              }}
              className={`font-['JetBrains_Mono',monospace] px-6 py-2 rounded-lg border transition-all duration-300 ${
                currentFilter === filter.key
                  ? 'bg-red-600 border-red-500 text-white'
                  : 'bg-transparent border-red-800/30 text-gray-300 hover:border-red-500/60 hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Anime Grid */}
      <div className="px-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : filteredAnime.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredAnime.map((animeItem, index) => (
              <div key={animeItem.id} className="transition-all duration-300 hover:scale-105">
                <AnimeCard
                  anime={animeItem}
                  onClick={handleAnimeClick}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎌</div>
            <h3 className="font-['JetBrains_Mono',monospace] text-xl text-red-400 mb-2">
              No Anime Found
            </h3>
            <p className="font-['JetBrains_Mono',monospace] text-gray-400">
              {searchQuery ? `No results for "${searchQuery}"` : 'Unable to load anime from the quantum database'}
            </p>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="px-8 mt-16 pb-8 text-center">
        <div className="font-['JetBrains_Mono',monospace] text-sm text-gray-500">
          <div className="flex justify-center items-center space-x-4 mb-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>{filteredAnime.length} anime loaded</span>
            <span className="text-red-400">●</span>
            <span>QUANTUM DATABASE ACTIVE</span>
          </div>
          <div className="text-xs text-gray-600">
            Filter: {filterButtons.find(f => f.key === currentFilter)?.label} | Source: Quantum Anime Network
          </div>
        </div>
      </div>
    </div>
  );
};

export default Anime;
