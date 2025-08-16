import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';

const Vault = () => {
  const navigate = useNavigate();
  const [vaultItems, setVaultItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filter, setFilter] = useState('all'); // all, movies, tv, anime
  const [sortBy, setSortBy] = useState('dateAdded'); // dateAdded, title, rating

  const loadVaultItems = () => {
    const vault = JSON.parse(localStorage.getItem('nexus_vault') || '[]');
    setVaultItems(vault);
  };

  useEffect(() => {
    loadVaultItems();
  }, []);

  useEffect(() => {
    const filterAndSortItems = () => {
      let filtered = [...vaultItems];

      // Filter by type
      if (filter !== 'all') {
        filtered = filtered.filter(item => {
          if (filter === 'movies') return item.type === 'movie';
          if (filter === 'tv') return item.type === 'tv';
          if (filter === 'anime') return item.media_type === 'anime';
          return true;
        });
      }

      // Sort items
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'title':
            const titleA = (a.title || a.name || '').toLowerCase();
            const titleB = (b.title || b.name || '').toLowerCase();
            return titleA.localeCompare(titleB);
          case 'rating':
            return (b.vote_average || 0) - (a.vote_average || 0);
          case 'dateAdded':
          default:
            return new Date(b.addedAt) - new Date(a.addedAt);
        }
      });

      setFilteredItems(filtered);
    };

    filterAndSortItems();
  }, [vaultItems, filter, sortBy]);

  const removeFromVault = (itemId) => {
    const vault = JSON.parse(localStorage.getItem('nexus_vault') || '[]');
    const updatedVault = vault.filter(item => item.id !== itemId);
    localStorage.setItem('nexus_vault', JSON.stringify(updatedVault));
    setVaultItems(updatedVault);
  };

  const clearVault = () => {
    if (window.confirm('Are you sure you want to clear your entire vault? This action cannot be undone.')) {
      localStorage.setItem('nexus_vault', JSON.stringify([]));
      setVaultItems([]);
    }
  };

  const handleItemClick = (item) => {
    if (item.media_type === 'anime') {
      navigate(`/anime/${item.id}`, { state: { anime: item } });
    } else if (item.type === 'movie') {
      navigate(`/movie/${item.id}`, { state: { movie: item } });
    } else if (item.type === 'tv') {
      navigate(`/tv/${item.id}`, { state: { tvShow: item } });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen text-white pt-24">
      {/* Header Section */}
      <div className="px-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-['JetBrains_Mono',monospace] text-4xl font-bold text-[#ef1a0fff] mb-4">
              <span className="text-red-400">{'>'}</span> NEXUS VAULT
            </h1>
            <p className="font-['JetBrains_Mono',monospace] text-gray-300">
              Your personal collection in the digital vault
            </p>
          </div>

          {vaultItems.length > 0 && (
            <button
              onClick={clearVault}
              className="bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 hover:border-red-500/50 px-6 py-2 rounded-lg font-['JetBrains_Mono',monospace] transition-all duration-300"
            >
              CLEAR VAULT
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-red-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{vaultItems.length}</div>
            <div className="text-sm text-gray-400 font-['JetBrains_Mono',monospace]">TOTAL ITEMS</div>
          </div>
          <div className="bg-gray-900/50 border border-red-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {vaultItems.filter(item => item.type === 'movie').length}
            </div>
            <div className="text-sm text-gray-400 font-['JetBrains_Mono',monospace]">MOVIES</div>
          </div>
          <div className="bg-gray-900/50 border border-red-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {vaultItems.filter(item => item.type === 'tv').length}
            </div>
            <div className="text-sm text-gray-400 font-['JetBrains_Mono',monospace]">TV SHOWS</div>
          </div>
          <div className="bg-gray-900/50 border border-red-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {vaultItems.filter(item => item.media_type === 'anime').length}
            </div>
            <div className="text-sm text-gray-400 font-['JetBrains_Mono',monospace]">ANIME</div>
          </div>
        </div>

        {/* Filters and Sort */}
        {vaultItems.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-8">
            {/* Filter Buttons */}
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'ALL' },
                { key: 'movies', label: 'MOVIES' },
                { key: 'tv', label: 'SERIES' },
                { key: 'anime', label: 'ANIME' }
              ].map(filterOption => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`font-['JetBrains_Mono',monospace] px-4 py-2 rounded-lg border transition-all duration-300 ${
                    filter === filterOption.key
                      ? 'bg-red-600 border-red-500 text-white'
                      : 'bg-transparent border-red-800/30 text-gray-300 hover:border-red-500/60 hover:text-white'
                  }`}
                >
                  {'>'} {filterOption.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-900/50 border border-red-800/30 text-white font-['JetBrains_Mono',monospace] px-4 py-2 rounded-lg focus:outline-none focus:border-red-500/60"
            >
              <option value="dateAdded">SORT: DATE ADDED</option>
              <option value="title">SORT: TITLE</option>
              <option value="rating">SORT: RATING</option>
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-8">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {filteredItems.map((item) => (
              <div
                key={`${item.id}-${item.type}`}
                className="transform transition-all duration-300 hover:scale-105 hover:z-10 relative group"
              >
                {/* Item glow effect */}
                <div className="absolute -inset-2 bg-gradient-to-br from-red-500/20 via-purple-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                
                <div className="relative z-10">
                  <div className="relative">
                    <MovieCard
                      movie={item}
                      onClick={handleItemClick}
                      isTV={item.type === 'tv'}
                      customBadge={
                        item.media_type === 'anime' ? 'ANIME' : 
                        item.type === 'tv' ? 'TV' : 'MOVIE'
                      }
                    />
                    
                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromVault(item.id);
                      }}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100"
                      title="Remove from Vault"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Date added overlay */}
                    <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm text-xs text-gray-300 px-2 py-1 rounded font-['JetBrains_Mono',monospace] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Added {formatDate(item.addedAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : vaultItems.length > 0 ? (
          // No items match current filter
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-['JetBrains_Mono',monospace] text-xl text-red-400 mb-2">NO ITEMS MATCH FILTER</h3>
            <p className="font-['JetBrains_Mono',monospace] text-gray-400 mb-4">
              Try changing your filter or add more content to your vault
            </p>
            <button
              onClick={() => setFilter('all')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-['JetBrains_Mono',monospace] transition-colors duration-200"
            >
              SHOW ALL ITEMS
            </button>
          </div>
        ) : (
          // Empty vault
          <div className="text-center py-20">
            <div className="inline-block p-12 border-2 border-dashed border-red-800/50 rounded-lg">
              <div className="text-8xl mb-6">🔒</div>
              <h3 className="font-['JetBrains_Mono',monospace] text-2xl text-red-400 mb-4">VAULT EMPTY</h3>
              <p className="font-['JetBrains_Mono',monospace] text-gray-400 text-lg mb-8 max-w-md">
                Start building your personal collection by adding movies, TV shows, and anime to your vault
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => navigate('/movies')}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-['JetBrains_Mono',monospace] font-bold transition-colors duration-200"
                >
                  BROWSE MOVIES
                </button>
                <button
                  onClick={() => navigate('/tv-shows')}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-['JetBrains_Mono',monospace] font-bold transition-colors duration-200"
                >
                  BROWSE TV SHOWS
                </button>
                <button
                  onClick={() => navigate('/anime')}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-['JetBrains_Mono',monospace] font-bold transition-colors duration-200"
                >
                  BROWSE ANIME
                </button>
              </div>
              
              <div className="mt-6 text-xs text-gray-600 font-mono">
                {'[NEURAL_SYNC_PENDING]'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Footer */}
      {vaultItems.length > 0 && (
        <div className="px-8 mt-16 mb-8 text-center">
          <div className="font-['JetBrains_Mono',monospace] text-sm text-gray-500 space-y-2">
            <div className="flex justify-center items-center space-x-4">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>VAULT STATUS: SECURED</span>
              <span className="text-red-400">●</span>
              <span>{filteredItems.length} ITEMS DISPLAYED</span>
              <span className="text-blue-400">●</span>
              <span>QUANTUM STORAGE: ∞ TB</span>
            </div>
            <div className="text-xs text-gray-600">
              Personal Collection v2.0 | Neural Vault Protocol Active
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vault;
