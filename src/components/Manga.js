import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTrendingManga, fetchPopularManga, fetchTopManga, searchManga } from '../utils/mangaApi';
import MangaCard from './MangaCard';
import SmartSuggestions from './SmartSuggestions';

const Manga = () => {
  const navigate = useNavigate();
  const [manga, setManga] = useState([]);
  const [filteredManga, setFilteredManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('trending');

  useEffect(() => {
    const loadManga = async () => {
      setLoading(true);
      try {
        let mangaData = [];
        switch (currentFilter) {
          case 'popular':
            mangaData = await fetchPopularManga();
            break;
          case 'top_rated':
            mangaData = await fetchTopManga();
            break;
          default:
            mangaData = await fetchTrendingManga();
        }
        console.log('NEXUS: Fetched manga data:', mangaData);
        setManga(mangaData || []);
        setFilteredManga(mangaData || []);
      } catch (error) {
        console.error('Error loading manga:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadManga();
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
      setFilteredManga(manga);
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await searchManga(query);
      setFilteredManga(searchResults || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleMangaClick = (mangaItem) => {
    navigate(`/manga/${mangaItem.id}`, { state: { manga: mangaItem } });
  };

  const filterButtons = [
    { key: 'trending', label: 'TRENDING', icon: '🔥', description: 'Most discussed manga right now' },
    { key: 'popular', label: 'POPULAR', icon: '⭐', description: 'Reader favorites across all time' },
    { key: 'top_rated', label: 'TOP RATED', icon: '👑', description: 'Highest scored manga masterpieces' }
  ];

  // Stats calculation
  const stats = {
    totalManga: filteredManga.length,
    avgScore: filteredManga.length > 0 ? (filteredManga.reduce((sum, m) => sum + (m.score || 0), 0) / filteredManga.length).toFixed(1) : 0,
    completedSeries: filteredManga.filter(m => m.status === 'Finished').length,
    ongoingSeries: filteredManga.filter(m => m.status === 'Publishing').length
  };

  return (
    <div className="min-h-screen text-white pt-24 bg-gradient-to-br from-purple-900/20 via-black to-indigo-900/20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-indigo-500/5 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-pink-500/5 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Header Section */}
      <div className="relative px-8 mb-8">
        <div className="flex items-center mb-6">
          <div className="text-6xl mr-4">📚</div>
          <div>
            <h1 className="font-['JetBrains_Mono',monospace] text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-2">
              QUANTUM MANGA
            </h1>
            <p className="font-['JetBrains_Mono',monospace] text-gray-300 text-lg">
              Digital library of infinite manga dimensions • Read beyond reality
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mb-8">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search the infinite manga multiverse... (Ctrl+G)"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-black/50 backdrop-blur-sm border-2 border-purple-800/30 rounded-xl px-6 py-4 text-white font-['JetBrains_Mono',monospace] placeholder-gray-400 focus:outline-none focus:border-purple-500/60 focus:bg-black/70 transition-all duration-300 group-hover:border-purple-500/40"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              {isSearching ? (
                <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-black/30 border-purple-800/30 text-gray-300 hover:border-purple-500/60 hover:bg-black/50 hover:text-white'
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
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/40 backdrop-blur-sm border border-purple-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.totalManga}</div>
            <div className="text-sm text-gray-400">Total Manga</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-indigo-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-indigo-400">{stats.avgScore}</div>
            <div className="text-sm text-gray-400">Avg Score</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-green-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.ongoingSeries}</div>
            <div className="text-sm text-gray-400">Ongoing</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-blue-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.completedSeries}</div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
        </div>
      </div>

      {/* Manga Grid */}
      <div className="relative px-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="group">
                <div className="aspect-[2/3] bg-gradient-to-br from-purple-800/20 to-indigo-800/20 rounded-lg animate-pulse"></div>
                <div className="mt-2 space-y-1">
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-800/50 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredManga.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {filteredManga.map((mangaItem, index) => (
                <div 
                  key={mangaItem.id} 
                  className="group transition-all duration-300 hover:scale-105 hover:z-10 relative"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <MangaCard
                    manga={mangaItem}
                    onClick={handleMangaClick}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">📖</div>
            <h3 className="font-['JetBrains_Mono',monospace] text-2xl text-purple-400 mb-4">
              No Manga Found in This Dimension
            </h3>
            <p className="font-['JetBrains_Mono',monospace] text-gray-400 text-lg max-w-md mx-auto">
              {searchQuery 
                ? `The quantum search for "${searchQuery}" yielded no results across the manga multiverse` 
                : 'Unable to access the manga database from this dimensional gateway'
              }
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setCurrentFilter('trending');
              }}
              className="mt-6 font-['JetBrains_Mono',monospace] bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Reset Dimensional Portal
            </button>
          </div>
        )}
      </div>

      {/* Smart Suggestions */}
      <div className="mt-8 px-8">
        <SmartSuggestions 
          currentPage="manga"
          onContentSelect={(manga) => {
            // For manga, navigate to read page with the manga ID
            navigate(`/manga/read/${manga.mal_id}`);
          }}
        />
      </div>

      {/* Enhanced Stats Footer */}
      <div className="relative px-8 mt-20 pb-12">
        <div className="bg-black/40 backdrop-blur-sm border border-purple-800/30 rounded-xl p-6">
          <div className="font-['JetBrains_Mono',monospace] text-center">
            <div className="flex justify-center items-center space-x-6 mb-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-green-400">{filteredManga.length} manga loaded</span>
              </div>
              <span className="text-purple-400">●</span>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-500"></span>
                <span className="text-purple-400">QUANTUM DATABASE ACTIVE</span>
              </div>
              <span className="text-indigo-400">●</span>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse delay-1000"></span>
                <span className="text-indigo-400">MULTIVERSE SYNC</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
              <div>
                <div className="text-purple-400 font-semibold">Current Filter</div>
                <div>{filterButtons.find(f => f.key === currentFilter)?.label}</div>
              </div>
              <div>
                <div className="text-indigo-400 font-semibold">Data Source</div>
                <div>Quantum Manga Network</div>
              </div>
              <div>
                <div className="text-pink-400 font-semibold">Last Updated</div>
                <div>{new Date().toLocaleTimeString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manga;
