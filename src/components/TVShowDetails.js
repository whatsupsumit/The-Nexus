// React aur hooks - UI aur state management ke liye
import React, { useState, useEffect } from 'react';
// React Router - URL se TV show ID lene aur navigation ke liye
import { useParams, useNavigate } from 'react-router-dom';
// VideoPlayer component - TV show episodes play karne ke liye
import VideoPlayer from './VideoPlayer';
// TMDB API functions - TV show images, backdrop, season details fetch karne ke liye
import {
  getImageUrl,
  getBackdropUrl,
  getTVSeasonDetails,
  getTVDetails
} from '../utils/vidsrcApi.js';

// HeroSection component - TV show ka main banner section (background image, title, buttons)
const HeroSection = ({ 
  show, 
  isLoading, 
  onWatchClick, 
  inWatchlist,
  onWatchlistToggle,
  selectedSeason,
  selectedEpisode
}) => {
  if (isLoading || !show) {
    return (
      <div className="relative w-full h-[70vh] lg:h-[80vh] bg-gray-900 animate-pulse flex items-end">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
        <div className="relative z-20 p-6 lg:p-12 w-full max-w-7xl mx-auto">
          <div className="space-y-4">
            <div className="h-16 lg:h-20 bg-gray-700 rounded w-3/4 lg:w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-1/3"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-700 rounded w-4/6"></div>
            </div>
            <div className="flex space-x-4 pt-4">
              <div className="h-14 bg-gray-700 rounded w-40"></div>
              <div className="h-14 bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(show.backdrop_path, 'original');
  
  return (
    <div className="relative w-full h-[70vh] lg:h-[85vh] overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-1000 ease-out"
        style={{ 
          backgroundImage: `url('${backdropUrl}')`,
          filter: 'brightness(0.4)'
        }}
      />
      
      {/* Enhanced Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60 z-10" />
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-5 z-10" style={{
        backgroundImage: `
          linear-gradient(rgba(255, 20, 35, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 20, 35, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }} />

      {/* Content */}
      <div className="relative z-20 h-full flex items-end">
        <div className="w-full max-w-7xl mx-auto p-6 lg:p-12 pt-20 md:pt-24 lg:pt-6">
          <div className="max-w-4xl">
            {/* Series Badge */}
            <div className="flex items-center space-x-3 mb-4 animate-fade-in">
              <div className="flex items-center space-x-2 bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-3 md:px-4 py-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="font-['JetBrains_Mono',monospace] text-red-400 text-xs md:text-sm font-bold tracking-wider">
                  NEXUS SERIES
                </span>
              </div>
              <div className="hidden sm:flex items-center space-x-2 bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-3 py-1">
                <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span className="font-['JetBrains_Mono',monospace] text-purple-400 text-xs font-bold">
                  {show.number_of_seasons} SEASON{show.number_of_seasons !== 1 ? 'S' : ''}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 animate-fade-in-delayed font-['JetBrains_Mono',monospace] leading-tight tracking-wider">
              {show.name}
            </h1>

            {/* Info Row */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm animate-fade-in-delayed-2">
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-white font-['JetBrains_Mono',monospace] font-bold">{show.vote_average?.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-300 font-['JetBrains_Mono',monospace]">{new Date(show.first_air_date).getFullYear()}</span>
              </div>
              {show.episode_run_time && show.episode_run_time[0] && (
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-300 font-['JetBrains_Mono',monospace]">{show.episode_run_time[0]} min</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                <div className={`w-2 h-2 rounded-full ${show.status === 'Returning Series' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-gray-300 font-['JetBrains_Mono',monospace] text-xs uppercase tracking-wider">
                  {show.status}
                </span>
              </div>
            </div>

            {/* Overview */}
            <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mb-6 md:mb-8 leading-relaxed animate-fade-in-delayed-3 font-['JetBrains_Mono',monospace]">
              {show.overview}
            </p>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6 md:mb-8 animate-fade-in-delayed-4">
              {show.genres?.slice(0, 4).map(genre => (
                <span 
                  key={genre.id}
                  className="px-3 md:px-4 py-1 md:py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-xs md:text-sm font-['JetBrains_Mono',monospace] border border-white/20 hover:bg-red-600/20 hover:border-red-500/30 transition-all duration-300"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 animate-fade-in-delayed-5 pb-4 md:pb-0">
              <button 
                onClick={onWatchClick}
                className="group flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-['JetBrains_Mono',monospace] font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
              >
                <svg className="w-5 md:w-6 h-5 md:h-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                WATCH S{selectedSeason}E{selectedEpisode}
              </button>
              
              <button 
                onClick={onWatchlistToggle}
                className={`group flex items-center justify-center gap-3 px-4 md:px-6 py-3 md:py-4 rounded-xl font-['JetBrains_Mono',monospace] font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border-2 ${
                  inWatchlist 
                    ? 'bg-green-600/20 border-green-500 text-green-400 hover:bg-green-600/30' 
                    : 'bg-white/10 border-white/30 text-white hover:border-red-500 hover:text-red-400'
                }`}
              >
                <svg className="w-4 md:w-5 h-4 md:h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d={inWatchlist ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} 
                  />
                </svg>
                <span className="hidden sm:inline">{inWatchlist ? 'IN VAULT' : 'ADD TO VAULT'}</span>
                <span className="sm:hidden">{inWatchlist ? 'VAULT' : 'ADD'}</span>
              </button>
              
              <button className="group flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-4 md:px-6 py-3 md:py-4 rounded-xl font-['JetBrains_Mono',monospace] font-bold text-base md:text-lg hover:border-purple-500 hover:text-purple-400 transition-all duration-300 transform hover:scale-105">
                <svg className="w-4 md:w-5 h-4 md:h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                LIKE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TVShowDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [show, setShow] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [seasonDetails, setSeasonDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [cast, setCast] = useState([]);
  const [loadingSeasonDetails, setLoadingSeasonDetails] = useState(false);

  useEffect(() => {
    const loadShowData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch show details
        const showData = await getTVDetails(id);
        setShow(showData);
        
        if (showData?.seasons) {
          const regularSeasons = showData.seasons.filter(season => season.season_number > 0);
          setSeasons(regularSeasons);
          
          if (regularSeasons.length > 0) {
            const firstSeason = regularSeasons[0].season_number;
            setSelectedSeason(firstSeason);
            
            // Load first season details
            const seasonData = await getTVSeasonDetails(id, firstSeason);
            setSeasonDetails(seasonData);
          }
        }

        // Extract cast and crew
        if (showData?.credits) {
          setCast(showData.credits.cast || []);
        }

        // Check if in watchlist
        const vault = JSON.parse(localStorage.getItem('nexus_vault') || '[]');
        setInWatchlist(vault.some(item => item.id === parseInt(id) && item.type === 'tv'));

      } catch (error) {
        // Silent error handling for production
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadShowData();
    }
  }, [id]);

  // Load season details when season changes
  useEffect(() => {
    const loadSeasonDetails = async () => {
      if (selectedSeason && id && !isLoading) {
        try {
          setLoadingSeasonDetails(true);
          const seasonData = await getTVSeasonDetails(id, selectedSeason);
          setSeasonDetails(seasonData);
          setSelectedEpisode(1);
        } catch (error) {
          // Silent error handling for production
        } finally {
          setLoadingSeasonDetails(false);
        }
      }
    };

    loadSeasonDetails();
  }, [selectedSeason, id, isLoading]);

  const handleWatchClick = () => {
    setShowPlayer(true);
  };

  const handleWatchlistToggle = () => {
    const vault = JSON.parse(localStorage.getItem('nexus_vault') || '[]');
    const itemIndex = vault.findIndex(item => 
      item.id === parseInt(id) && item.type === 'tv'
    );

    if (itemIndex >= 0) {
      // Remove from vault
      vault.splice(itemIndex, 1);
      setInWatchlist(false);
    } else {
      // Add to vault
      vault.push({
        ...show,
        addedAt: new Date().toISOString(),
        type: 'tv'
      });
      setInWatchlist(true);
    }

    localStorage.setItem('nexus_vault', JSON.stringify(vault));
  };

  const handleSeasonEpisodeChange = (season, episode) => {
    setSelectedSeason(season);
    setSelectedEpisode(episode);
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
  };

  if (isLoading && !show) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <HeroSection isLoading={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-16 md:pt-20">
      {/* Enhanced Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-20 md:top-24 left-6 z-50 flex items-center gap-2 bg-black/80 backdrop-blur-xl text-white px-4 py-3 rounded-xl hover:bg-black/90 transition-all duration-300 border border-red-900/30 hover:border-red-500/50 font-['JetBrains_Mono',monospace] font-bold"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        BACK
      </button>

      {/* Hero Section */}
      <HeroSection 
        show={show}
        isLoading={isLoading}
        onWatchClick={handleWatchClick}
        inWatchlist={inWatchlist}
        onWatchlistToggle={handleWatchlistToggle}
        selectedSeason={selectedSeason}
        selectedEpisode={selectedEpisode}
      />

      {/* Video Player */}
      {showPlayer && show && (
        <VideoPlayer
          movie={show}
          isTV={true}
          season={selectedSeason}
          episode={selectedEpisode}
          onClose={handleClosePlayer}
          onSeasonEpisodeChange={handleSeasonEpisodeChange}
        />
      )}

      {/* Main Content */}
      <div className="relative z-30 mt-8 md:mt-16 lg:-mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
            
            {/* Show Details Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-red-900/20 lg:sticky lg:top-8">
                {/* Poster */}
                <div className="aspect-[2/3] rounded-xl overflow-hidden mb-4 md:mb-6 group max-w-xs mx-auto lg:max-w-none">
                  <img
                    src={getImageUrl(show?.poster_path, 'w500')}
                    alt={show?.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Show Info */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white font-['JetBrains_Mono',monospace] tracking-wider">{show?.name}</h2>
                  
                  <div className="space-y-3 text-sm text-gray-300 font-['JetBrains_Mono',monospace]">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Status:</span>
                      <span className={`font-bold ${show?.status === 'Returning Series' ? 'text-green-400' : 'text-red-400'}`}>
                        {show?.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">First Air:</span>
                      <span className="text-white">{show?.first_air_date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Seasons:</span>
                      <span className="text-white font-bold">{show?.number_of_seasons}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Episodes:</span>
                      <span className="text-white font-bold">{show?.number_of_episodes}</span>
                    </div>
                    {show?.episode_run_time && show.episode_run_time[0] && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Runtime:</span>
                        <span className="text-white">{show.episode_run_time[0]} min</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Rating:</span>
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-white font-bold">{show?.vote_average?.toFixed(1)}/10</span>
                      </div>
                    </div>
                  </div>

                  {/* Networks */}
                  {show?.networks && show.networks.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-3 font-['JetBrains_Mono',monospace]">NETWORKS</h3>
                      <div className="flex flex-wrap gap-2">
                        {show.networks.map(network => (
                          <span 
                            key={network.id}
                            className="px-3 py-1 bg-gray-700/50 text-white rounded-full text-xs font-['JetBrains_Mono',monospace] border border-gray-600/30"
                          >
                            {network.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* External Links */}
                  {show?.external_ids && (
                    <div className="pt-4 border-t border-gray-700/50">
                      <div className="flex gap-3">
                        {show.external_ids.imdb_id && (
                          <a 
                            href={`https://www.imdb.com/title/${show.external_ids.imdb_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors font-['JetBrains_Mono',monospace] text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            IMDb
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Episode Selection */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 md:p-6 lg:p-8 border border-red-900/20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-red-400 font-['JetBrains_Mono',monospace] tracking-wider">
                    SELECT EPISODE
                  </h2>
                  <div className="flex items-center space-x-2 bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-3 md:px-4 py-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="font-['JetBrains_Mono',monospace] text-red-400 text-xs md:text-sm font-bold">
                      S{selectedSeason}E{selectedEpisode} READY
                    </span>
                  </div>
                </div>

                {/* Season Selector */}
                <div className="mb-6 md:mb-8">
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4 font-['JetBrains_Mono',monospace]">SEASON</h3>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {seasons.map(season => (
                      <button
                        key={season.id}
                        onClick={() => setSelectedSeason(season.season_number)}
                        className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-['JetBrains_Mono',monospace] font-bold transition-all duration-300 transform hover:scale-105 text-sm md:text-base ${
                          selectedSeason === season.season_number
                            ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600/30'
                        }`}
                      >
                        Season {season.season_number}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Episode Grid */}
                {loadingSeasonDetails ? (
                  <div className="grid grid-cols-1 gap-3 md:gap-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="bg-gray-800/50 rounded-xl p-3 md:p-4 animate-pulse">
                        <div className="flex items-start space-x-3 md:space-x-4">
                          <div className="w-20 md:w-24 h-12 md:h-16 bg-gray-700 rounded flex-shrink-0"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-3 md:h-4 bg-gray-700 rounded w-3/4"></div>
                            <div className="h-2 md:h-3 bg-gray-700 rounded w-1/2"></div>
                            <div className="h-2 md:h-3 bg-gray-700 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : seasonDetails ? (
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6 font-['JetBrains_Mono',monospace]">
                      EPISODES - SEASON {selectedSeason}
                    </h3>
                    <div className="grid grid-cols-1 gap-3 md:gap-4">
                      {seasonDetails.episodes?.map(episode => (
                        <div
                          key={episode.id}
                          onClick={() => setSelectedEpisode(episode.episode_number)}
                          className={`group cursor-pointer rounded-xl p-3 md:p-4 transition-all duration-300 transform hover:scale-[1.02] ${
                            selectedEpisode === episode.episode_number
                              ? 'bg-red-600/20 border-2 border-red-500 shadow-lg shadow-red-500/10'
                              : 'bg-gray-800/30 border-2 border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/50'
                          }`}
                        >
                          <div className="flex items-start space-x-3 md:space-x-4">
                            {/* Episode Thumbnail */}
                            <div className="w-20 md:w-24 h-12 md:h-16 bg-gray-700 rounded flex-shrink-0 overflow-hidden">
                              {episode.still_path ? (
                                <img
                                  src={getImageUrl(episode.still_path, 'w300')}
                                  alt={`Episode ${episode.episode_number}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gradient-to-br from-gray-700 to-gray-800">
                                  <svg className="w-4 md:w-6 h-4 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                              )}
                            </div>

                            {/* Episode Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-['JetBrains_Mono',monospace] font-bold text-white text-sm md:text-base mb-1 truncate group-hover:text-red-400 transition-colors">
                                {episode.episode_number}. {episode.name}
                              </h4>
                              <p className="text-gray-400 text-xs md:text-sm mb-2 line-clamp-2 font-['JetBrains_Mono',monospace]">
                                {episode.overview || 'No description available.'}
                              </p>
                              <div className="flex items-center justify-between text-xs font-['JetBrains_Mono',monospace] text-gray-500">
                                <span className="hidden sm:inline">{episode.air_date}</span>
                                {episode.runtime && <span className="hidden sm:inline">{episode.runtime} min</span>}
                                {episode.vote_average > 0 && (
                                  <div className="flex items-center space-x-1">
                                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span>{episode.vote_average.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 md:py-12">
                    <div className="text-gray-600 mb-4">
                      <svg className="w-12 md:w-16 h-12 md:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <p className="font-['JetBrains_Mono',monospace] text-gray-400 text-base md:text-lg">
                      No episodes available for this season
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cast Section */}
          {cast.length > 0 && (
            <div className="mt-8 md:mt-12 bg-black/40 backdrop-blur-xl rounded-2xl p-4 md:p-6 lg:p-8 border border-red-900/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white font-['JetBrains_Mono',monospace] tracking-wider">CAST</h2>
                <div className="flex items-center space-x-2 bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-3 md:px-4 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="font-['JetBrains_Mono',monospace] text-purple-400 text-xs md:text-sm font-bold">
                    {cast.length} ACTORS
                  </span>
                </div>
              </div>
              <div className="flex overflow-x-auto space-x-4 md:space-x-6 pb-4 scrollbar-hide">
                {cast.slice(0, 12).map(person => (
                  <div key={person.id} className="flex-shrink-0 w-28 md:w-36 group">
                    <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2 md:mb-3 bg-gray-800">
                      <img
                        src={getImageUrl(person.profile_path, 'w185')}
                        alt={person.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/185x278/1a1a1a/ffffff?text=${person.name.charAt(0)}`;
                        }}
                      />
                    </div>
                    <h4 className="font-['JetBrains_Mono',monospace] font-bold text-white text-xs md:text-sm truncate group-hover:text-red-400 transition-colors">
                      {person.name}
                    </h4>
                    <p className="font-['JetBrains_Mono',monospace] text-gray-400 text-xs truncate">
                      {person.character}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TVShowDetails;
