import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPopularTV, fetchTopRatedTV, fetchTrendingTV, searchContent } from '../utils/vidsrcApi';
import MovieCard from './MovieCard';
import VideoPlayer from './VideoPlayer';

const TVShows = () => {
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShow, setSelectedShow] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('popular');
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  useEffect(() => {
    const loadShows = async () => {
      setLoading(true);
      try {
        let showData = [];
        switch (activeFilter) {
          case 'trending':
            showData = await fetchTrendingTV();
            break;
          case 'top_rated':
            showData = await fetchTopRatedTV();
            break;
          default:
            showData = await fetchPopularTV();
        }
        setShows(showData);
        setFilteredShows(showData);
      } catch (error) {
        console.error('Error loading TV shows:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadShows();
  }, [activeFilter]);

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
      setFilteredShows(shows);
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await searchContent(query, 'tv');
      setFilteredShows(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleShowClick = (show) => {
    navigate(`/tv/${show.id}`, { state: { tvShow: show } });
  };

  const closePlayer = () => {
    setShowPlayer(false);
    setSelectedShow(null);
    setSelectedSeason(1);
    setSelectedEpisode(1);
    // Navigate back to home page (Browse)
    navigate('/browse');
  };

  const filterButtons = [
    { key: 'popular', label: 'POPULAR' },
    { key: 'trending', label: 'TRENDING' },
    { key: 'top_rated', label: 'TOP RATED' }
  ];

  if (showPlayer && selectedShow) {
    return (
      <VideoPlayer
        movie={selectedShow}
        isTV={true}
        season={selectedSeason}
        episode={selectedEpisode}
        onClose={closePlayer}
      />
    );
  }

  return (
    <div className="min-h-screen text-white pt-24">
      {/* Header Section */}
      <div className="px-8 mb-8">
        <h1 className="font-['JetBrains_Mono',monospace] text-4xl font-bold text-[#ef1a0fff] mb-4">
          <span className="text-red-400">{'>'}</span> NEURAL SERIES
        </h1>
        <p className="font-['JetBrains_Mono',monospace] text-gray-300 mb-6">
          Direct neural link to unlimited series content
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search neural series database... (Ctrl+G)"
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
              onClick={() => setActiveFilter(filter.key)}
              className={`font-['JetBrains_Mono',monospace] px-6 py-2 rounded-lg transition-all duration-200 ${
                activeFilter === filter.key
                  ? 'bg-red-600 text-white'
                  : 'bg-black/50 text-gray-400 hover:text-white hover:bg-red-600/20 border border-red-800/30'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Season/Episode Selector */}
        {selectedShow && (
          <div className="bg-black/50 backdrop-blur-sm border border-red-800/30 rounded-lg p-4 mb-6">
            <h3 className="font-['JetBrains_Mono',monospace] text-white text-lg font-bold mb-4">
              {selectedShow.name || selectedShow.original_name}
            </h3>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <label className="font-['JetBrains_Mono',monospace] text-gray-400 text-sm">SEASON:</label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(Number(e.target.value))}
                  className="bg-black border border-red-800/30 text-white rounded px-3 py-1 font-['JetBrains_Mono',monospace] text-sm"
                >
                  {[...Array(selectedShow.number_of_seasons || 10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="font-['JetBrains_Mono',monospace] text-gray-400 text-sm">EPISODE:</label>
                <select
                  value={selectedEpisode}
                  onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                  className="bg-black border border-red-800/30 text-white rounded px-3 py-1 font-['JetBrains_Mono',monospace] text-sm"
                >
                  {[...Array(20)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowPlayer(true)}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-['JetBrains_Mono',monospace] text-sm transition-colors"
              >
                PLAY S{selectedSeason.toString().padStart(2, '0')}:E{selectedEpisode.toString().padStart(2, '0')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TV Shows Grid */}
      <div className="px-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : filteredShows.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredShows.map((show) => (
              <div key={show.id} className="transition-all duration-300 hover:scale-105">
                <MovieCard
                  movie={show}
                  onClick={handleShowClick}
                  isTV={true}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="font-['JetBrains_Mono',monospace] text-xl text-red-400 mb-2">
              No Series Found
            </h3>
            <p className="font-['JetBrains_Mono',monospace] text-gray-400">
              {searchQuery ? `No results for "${searchQuery}"` : 'Unable to load series from the neural database'}
            </p>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="px-8 mt-16 pb-8 text-center">
        <div className="font-['JetBrains_Mono',monospace] text-sm text-gray-500">
          <div className="flex justify-center items-center space-x-4 mb-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>{filteredShows.length} series loaded</span>
            <span className="text-red-400">●</span>
            <span>NEURAL DATABASE ACTIVE</span>
          </div>
          <div className="text-xs text-gray-600">
            Filter: {filterButtons.find(f => f.key === activeFilter)?.label} | Source: TMDB + VidSrc
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVShows;
