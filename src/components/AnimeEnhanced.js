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
    { key: 'trending', label: 'TRENDING', icon: '🔥', description: 'Hottest anime series right now' },
    { key: 'popular', label: 'POPULAR', icon: '⭐', description: 'All-time fan favorite series' },
    { key: 'top_rated', label: 'TOP RATED', icon: '👑', description: 'Highest rated anime masterpieces' }
  ];

  // Stats calculation
  const stats = {
    totalAnime: filteredAnime.length,
    avgScore: filteredAnime.length > 0 ? (filteredAnime.reduce((sum, a) => sum + (a.score || 0), 0) / filteredAnime.length).toFixed(1) : 0,
    recentAnime: filteredAnime.filter(a => {
      const year = a.year || new Date(a.aired?.from).getFullYear();
      return year >= new Date().getFullYear() - 1;
    }).length,
    classics: filteredAnime.filter(a => (a.score || 0) > 8.5).length
  };

  return (
    <div className="min-h-screen text-white pt-24 bg-gradient-to-br from-orange-900/20 via-black to-pink-900/20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-pink-500/5 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-red-500/5 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Header Section */}
      <div className="relative px-8 mb-8">
        <div className="flex items-center mb-6">
          <div className="text-6xl mr-4">🎌</div>
          <div>
            <h1 className="font-['JetBrains_Mono',monospace] text-5xl font-bold bg-gradient-to-r from-orange-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
              QUANTUM ANIME
            </h1>
            <p className="font-['JetBrains_Mono',monospace] text-gray-300 text-lg">
              Neural link to infinite anime dimensions • Stream beyond reality
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mb-8">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search the infinite anime multiverse... (Ctrl+G)"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-black/50 backdrop-blur-sm border-2 border-orange-800/30 rounded-xl px-6 py-4 text-white font-['JetBrains_Mono',monospace] placeholder-gray-400 focus:outline-none focus:border-orange-500/60 focus:bg-black/70 transition-all duration-300 group-hover:border-orange-500/40"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              {isSearching ? (
                <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <div className="text-xs text-gray-500 hidden md:block">⌘G</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {filterButtons.map((filter) => (
            <button
              key={filter.key}
              onClick={() => {
                setCurrentFilter(filter.key);
                setSearchQuery('');
              }}
              className={`group relative font-['JetBrains_Mono',monospace] p-4 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                currentFilter === filter.key
                  ? 'bg-gradient-to-r from-orange-600/20 to-pink-600/20 border-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-black/30 border-orange-800/30 text-gray-300 hover:border-orange-500/60 hover:bg-black/50 hover:text-white'
              }`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl mr-2">{filter.icon}</span>
                  <span className="font-bold text-lg">{filter.label}</span>
                </div>
                <p className="text-sm opacity-80">{filter.description}</p>
              </div>
              {currentFilter === filter.key && (
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-pink-600/10 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/40 backdrop-blur-sm border border-orange-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{stats.totalAnime}</div>
            <div className="text-sm text-gray-400">Total Anime</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-pink-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-pink-400">{stats.avgScore}</div>
            <div className="text-sm text-gray-400">Avg Score</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-red-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{stats.recentAnime}</div>
            <div className="text-sm text-gray-400">Recent</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-yellow-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.classics}</div>
            <div className="text-sm text-gray-400">Classics</div>
          </div>
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
            <h3 className="font-['JetBrains_Mono',monospace] text-xl text-orange-400 mb-2">
              No Anime Found
            </h3>
            <p className="font-['JetBrains_Mono',monospace] text-gray-400">
              {searchQuery ? `No results for "${searchQuery}"` : 'Unable to load anime from the quantum database'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-16 px-8 pb-8">
        <div className="bg-black/30 backdrop-blur-sm border border-orange-800/30 rounded-xl p-6">
          <div className="text-center">
            <h3 className="font-['JetBrains_Mono',monospace] text-xl font-bold text-orange-400 mb-2">
              QUANTUM ANIME STATS
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-gray-300">
                <span className="text-orange-400 font-bold">{stats.totalAnime}</span> Anime Available
              </div>
              <div className="text-gray-300">
                <span className="text-pink-400 font-bold">{stats.avgScore}</span> Average Score
              </div>
              <div className="text-gray-300">
                <span className="text-red-400 font-bold">{stats.recentAnime}</span> Recent Anime
              </div>
              <div className="text-gray-300">
                <span className="text-yellow-400 font-bold">{stats.classics}</span> Classics
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-4 font-['JetBrains_Mono',monospace]">
              Quantum anime streaming • Powered by NEXUS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Anime;
