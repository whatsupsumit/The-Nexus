import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';

const Vault = () => {
  const navigate = useNavigate();
  const [vaultItems, setVaultItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filter, setFilter] = useState('all'); // all, movies, tv
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
    localStorage.setItem('nexus_vault', JSON.stringify([]));
    setVaultItems([]);
  };

  const handleItemClick = (item) => {
    if (item.type === 'movie') {
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
    <div className="min-h-screen bg-black text-white pt-20 sm:pt-24 lg:pt-28">
      {/* RedEye Background Pattern */}
      <div className="fixed inset-0 bg-black">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/redeye.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(0.3) contrast(1.1)'
          }}
        />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            linear-gradient(rgba(255, 20, 35, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 20, 35, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Responsive Header Section with Extra Top Margin */}
        <div className="px-2 sm:px-4 lg:px-8 mb-4 sm:mb-6 lg:mb-8 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
            <div className="w-full sm:w-auto">
              <h1 className="font-['JetBrains_Mono',monospace] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#ef1a0fff] mb-2 sm:mb-4">
                <span className="text-red-400">{'>'}</span> NEXUS VAULT
              </h1>
              <p className="font-['JetBrains_Mono',monospace] text-gray-300 text-sm sm:text-base">
                <span className="hidden sm:inline">Your personal collection in the digital vault</span>
                <span className="sm:hidden">Your digital collection</span>
              </p>
            </div>

            {vaultItems.length > 0 && (
              <button
                onClick={clearVault}
                className="w-full sm:w-auto bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 hover:border-red-500/40 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-['JetBrains_Mono',monospace] transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
              >
                <span className="hidden sm:inline">CLEAR VAULT</span>
                <span className="sm:hidden">CLEAR</span>
              </button>
            )}
          </div>

          {/* Darker Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
            <div className="bg-black/60 border border-red-800/20 rounded-lg p-3 sm:p-4 text-center backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-bold text-red-400">{vaultItems.length}</div>
              <div className="text-xs sm:text-sm text-gray-400 font-['JetBrains_Mono',monospace]">
                <span className="hidden sm:inline">TOTAL ITEMS</span>
                <span className="sm:hidden">TOTAL</span>
              </div>
            </div>
            <div className="bg-black/60 border border-red-800/20 rounded-lg p-3 sm:p-4 text-center backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-bold text-blue-400">
                {vaultItems.filter(item => item.type === 'movie').length}
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-['JetBrains_Mono',monospace]">MOVIES</div>
            </div>
            <div className="bg-black/60 border border-red-800/20 rounded-lg p-3 sm:p-4 text-center backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-bold text-green-400">
                {vaultItems.filter(item => item.type === 'tv').length}
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-['JetBrains_Mono',monospace]">
                <span className="hidden sm:inline">TV SHOWS</span>
                <span className="sm:hidden">SERIES</span>
              </div>
            </div>
          </div>

          {/* Responsive Filters and Sort with Darker Theme */}
          {vaultItems.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
              {/* Filter Buttons - Responsive with Dark Theme */}
              <div className="flex flex-wrap gap-2 flex-1">
              {[
                { key: 'all', label: 'ALL', shortLabel: 'ALL' },
                { key: 'movies', label: 'MOVIES', shortLabel: 'MOV' },
                { key: 'tv', label: 'SERIES', shortLabel: 'TV' }
              ].map(filterOption => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`font-['JetBrains_Mono',monospace] px-3 sm:px-4 py-2 rounded-lg border transition-all duration-300 text-xs sm:text-sm backdrop-blur-sm ${
                    filter === filterOption.key
                      ? 'bg-red-600/80 border-red-500/60 text-white shadow-lg shadow-red-500/20'
                      : 'bg-black/40 border-red-800/20 text-gray-300 hover:border-red-500/40 hover:text-white hover:bg-black/60'
                  }`}
                >
                  <span className="hidden sm:inline">{'>'} {filterOption.label}</span>
                  <span className="sm:hidden">{filterOption.shortLabel}</span>
                </button>
              ))}
            </div>

            {/* Sort Dropdown - Darker Theme */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto bg-black/60 border border-red-800/20 text-white font-['JetBrains_Mono',monospace] px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:border-red-500/40 text-xs sm:text-sm backdrop-blur-sm"
            >
              <option value="dateAdded">
                <span className="hidden sm:inline">SORT: DATE ADDED</span>
                <span className="sm:hidden">DATE</span>
              </option>
              <option value="title">
                <span className="hidden sm:inline">SORT: TITLE</span>
                <span className="sm:hidden">TITLE</span>
              </option>
              <option value="rating">
                <span className="hidden sm:inline">SORT: RATING</span>
                <span className="sm:hidden">RATING</span>
              </option>
            </select>
          </div>
        )}
      </div>

      {/* Responsive Content */}
      <div className="px-2 sm:px-4 lg:px-8">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
            {filteredItems.map((item) => (
              <div
                key={`${item.id}-${item.type}`}
                className="transform transition-all duration-300 hover:scale-105 hover:z-10 relative group"
              >
                {/* Responsive glow effect */}
                <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-br from-red-500/20 via-purple-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm sm:blur-md"></div>
                
                <div className="relative z-10">
                  <div className="relative">
                    <MovieCard
                      movie={item}
                      onClick={handleItemClick}
                      isTV={item.type === 'tv'}
                      customBadge={
                        item.type === 'tv' ? 'TV' : 'MOVIE'
                      }
                    />
                    
                    {/* Responsive remove button with minus symbol */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromVault(item.id);
                      }}
                      className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-600/90 hover:bg-red-700 text-white w-6 h-6 sm:w-8 sm:h-8 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100 flex items-center justify-center font-bold text-sm sm:text-lg"
                      title="Remove from Vault"
                    >
                      -
                    </button>

                    {/* Responsive date added overlay */}
                    <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 bg-black/80 backdrop-blur-sm text-xs text-gray-300 px-1 py-0.5 sm:px-2 sm:py-1 rounded font-['JetBrains_Mono',monospace] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="hidden sm:inline">Added {formatDate(item.addedAt)}</span>
                      <span className="sm:hidden">Added</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : vaultItems.length > 0 ? (
          // No items match current filter - Responsive
          <div className="text-center py-10 sm:py-16 lg:py-20">
            <div className="text-4xl sm:text-6xl mb-4">🔍</div>
            <h3 className="font-['JetBrains_Mono',monospace] text-lg sm:text-xl text-red-400 mb-2">NO ITEMS MATCH FILTER</h3>
            <p className="font-['JetBrains_Mono',monospace] text-gray-400 mb-4 text-sm sm:text-base px-4">
              <span className="hidden sm:inline">Try changing your filter or add more content to your vault</span>
              <span className="sm:hidden">Try changing your filter</span>
            </p>
            <button
              onClick={() => setFilter('all')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-['JetBrains_Mono',monospace] transition-colors duration-200 text-sm sm:text-base"
            >
              SHOW ALL ITEMS
            </button>
          </div>
        ) : (
          // Compact Empty Vault State
          <div className="text-center py-6 sm:py-8 lg:py-12">
            <div className="inline-block p-4 sm:p-6 border-2 border-dashed border-red-800/50 rounded-lg mx-4">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🔒</div>
              <h3 className="font-['JetBrains_Mono',monospace] text-lg sm:text-xl text-red-400 mb-2 sm:mb-3">VAULT EMPTY</h3>
              <p className="font-['JetBrains_Mono',monospace] text-gray-400 text-xs sm:text-sm mb-4 sm:mb-5 max-w-xs sm:max-w-sm">
                <span className="hidden sm:inline">Start building your personal collection by adding content</span>
                <span className="sm:hidden">Add movies and shows to vault</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <button
                  onClick={() => navigate('/movies')}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-['JetBrains_Mono',monospace] font-bold transition-colors duration-200 text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">BROWSE MOVIES</span>
                  <span className="sm:hidden">MOVIES</span>
                </button>
                <button
                  onClick={() => navigate('/tv-shows')}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-['JetBrains_Mono',monospace] font-bold transition-colors duration-200 text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">BROWSE TV SHOWS</span>
                  <span className="sm:hidden">TV SHOWS</span>
                </button>
              </div>
              
              <div className="mt-3 sm:mt-4 text-xs text-gray-600 font-mono">
                {'[NEURAL_SYNC_PENDING]'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Responsive Status Footer */}
      {vaultItems.length > 0 && (
        <div className="px-2 sm:px-4 lg:px-8 mt-8 sm:mt-12 lg:mt-16 mb-4 sm:mb-6 lg:mb-8 text-center">
          <div className="font-['JetBrains_Mono',monospace] text-xs sm:text-sm text-gray-500 space-y-2">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>VAULT STATUS: SECURED</span>
              </div>
              <div className="hidden sm:flex items-center space-x-4">
                <span className="text-red-400">●</span>
                <span>{filteredItems.length} ITEMS DISPLAYED</span>
                <span className="text-blue-400">●</span>
                <span className="hidden lg:inline">QUANTUM STORAGE: ∞ TB</span>
                <span className="lg:hidden">∞ TB</span>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              <span className="hidden sm:inline">Personal Collection v2.0 | Neural Vault Protocol Active</span>
              <span className="sm:hidden">Neural Vault v2.0</span>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Vault;