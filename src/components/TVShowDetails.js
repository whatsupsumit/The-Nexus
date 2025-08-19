import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Info, ThumbsUp, Plus, Download, Star, Calendar, Clock, Tv, ExternalLink, ArrowLeft } from 'lucide-react';
import {
  getTVEmbedUrl,
  getImageUrl,
  getBackdropUrl,
  getTVSeasonDetails,
  getTVDetails
} from '../utils/vidsrcApi.js';

// Enhanced Spotlight Section Component
const SpotlightSection = ({ 
  show, 
  isLoading, 
  onWatchClick, 
  onInfoClick, 
  onWatchlistToggle, 
  onDownloadClick, 
  inWatchlist 
}) => {
  if (isLoading || !show) {
    return (
      <div className="relative w-full h-[80vh] bg-gray-800 animate-pulse flex items-end">
        <div className="relative z-10 p-8 w-full">
          <div className="h-16 bg-gray-700 rounded mb-4 w-1/2"></div>
          <div className="space-y-2 mb-6">
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          </div>
          <div className="space-y-2 mb-8">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-4/6"></div>
          </div>
          <div className="flex space-x-4">
            <div className="h-12 bg-gray-700 rounded w-32"></div>
            <div className="h-12 bg-gray-700 rounded w-12"></div>
            <div className="h-12 bg-gray-700 rounded w-12"></div>
          </div>
        </div>
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(show.backdrop_path, 'original');
  const logoImage = show.images?.logos?.find(logo => logo.iso_639_1 === 'en');
  
  return (
    <div 
      className="relative w-full h-[80vh] bg-cover bg-center bg-no-repeat flex items-end animate-fade-in"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url('${backdropUrl}')`
      }}
    >
      {/* Content */}
      <div className="relative z-10 p-8 w-full max-w-6xl">
        {/* Title/Logo */}
        {logoImage ? (
          <img 
            src={getImageUrl(logoImage.file_path, 'w500')} 
            alt={show.name}
            className="max-h-32 mb-6 animate-fade-in-delayed"
          />
        ) : (
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-delayed">
            {show.name}
          </h1>
        )}

        {/* Info Row */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm animate-fade-in-delayed-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-medium">{show.vote_average?.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-300" />
            <span className="text-gray-300">{new Date(show.first_air_date).getFullYear()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-gray-300" />
            <span className="text-gray-300">{show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}</span>
          </div>
          {show.episode_run_time && show.episode_run_time[0] && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-300" />
              <span className="text-gray-300">{show.episode_run_time[0]} min</span>
            </div>
          )}
          <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
            {show.status}
          </span>
        </div>

        {/* Overview */}
        <p className="text-lg text-gray-300 max-w-2xl mb-8 leading-relaxed animate-fade-in-delayed-3">
          {show.overview}
        </p>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mb-8 animate-fade-in-delayed-4">
          {show.genres?.slice(0, 4).map(genre => (
            <span 
              key={genre.id}
              className="px-3 py-1 bg-white/10 text-white rounded-full text-sm backdrop-blur-sm"
            >
              {genre.name}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 animate-fade-in-delayed-5">
          <button 
            onClick={onWatchClick}
            className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-all duration-200 shadow-lg"
          >
            <Play className="w-6 h-6" fill="currentColor" />
            Watch Now
          </button>
          
          <button 
            onClick={onInfoClick}
            className="flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
          >
            <Info className="w-5 h-5" />
            More Info
          </button>
          
          <button 
            onClick={() => {}}
            className="flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
          >
            <ThumbsUp className="w-5 h-5" />
            Like
          </button>
          
          <button 
            onClick={onWatchlistToggle}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm ${
              inWatchlist 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Plus className="w-5 h-5" />
            {inWatchlist ? 'Remove' : 'My List'}
          </button>

          <button 
            onClick={onDownloadClick}
            className="flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
          >
            <Download className="w-5 h-5" />
            Download
          </button>
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

      } catch (error) {
        console.error('Error loading show data:', error);
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
      if (selectedSeason && id) {
        try {
          const seasonData = await getTVSeasonDetails(id, selectedSeason);
          setSeasonDetails(seasonData);
          setSelectedEpisode(1);
        } catch (error) {
          console.error('Error loading season details:', error);
        }
      }
    };

    loadSeasonDetails();
  }, [selectedSeason, id]);

  const handleWatchClick = () => {
    setShowPlayer(true);
  };

  const handleInfoClick = () => {
    console.log('More info clicked');
  };

  const handleWatchlistToggle = () => {
    setInWatchlist(!inWatchlist);
  };

  const handleDownloadClick = () => {
    console.log('Download clicked');
  };

  const embedUrl = showPlayer ? getTVEmbedUrl(id, selectedSeason, selectedEpisode) : null;

  if (isLoading && !show) {
    return (
      <div className="min-h-screen bg-[var(--nexus-bg)] text-white">
        <SpotlightSection isLoading={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--nexus-bg)] text-white">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-black/50 text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-all duration-200 backdrop-blur-sm"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Spotlight Section */}
      <SpotlightSection 
        show={show}
        isLoading={isLoading}
        onWatchClick={handleWatchClick}
        onInfoClick={handleInfoClick}
        onWatchlistToggle={handleWatchlistToggle}
        onDownloadClick={handleDownloadClick}
        inWatchlist={inWatchlist}
      />

      {/* Video Player Modal */}
      {showPlayer && embedUrl && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl bg-black rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold">
                {show?.name} - Season {selectedSeason}, Episode {selectedEpisode}
              </h3>
              <button 
                onClick={() => setShowPlayer(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allowFullScreen
                title={`${show?.name} S${selectedSeason}E${selectedEpisode}`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-8 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Show Details */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--nexus-card)] rounded-lg p-6 space-y-6">
              {/* Poster */}
              <div className="aspect-[2/3] rounded-lg overflow-hidden">
                <img
                  src={getImageUrl(show?.poster_path, 'w500')}
                  alt={show?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Show Info */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">{show?.name}</h2>
                
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-white">{show?.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>First Air Date:</span>
                    <span className="text-white">{show?.first_air_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seasons:</span>
                    <span className="text-white">{show?.number_of_seasons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Episodes:</span>
                    <span className="text-white">{show?.number_of_episodes}</span>
                  </div>
                  {show?.episode_run_time && show.episode_run_time[0] && (
                    <div className="flex justify-between">
                      <span>Runtime:</span>
                      <span className="text-white">{show.episode_run_time[0]} min</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Rating:</span>
                    <span className="text-white">{show?.vote_average?.toFixed(1)}/10</span>
                  </div>
                </div>

                {/* Networks */}
                {show?.networks && show.networks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Networks</h3>
                    <div className="flex flex-wrap gap-2">
                      {show.networks.map(network => (
                        <span 
                          key={network.id}
                          className="px-2 py-1 bg-gray-700 text-white rounded text-xs"
                        >
                          {network.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* External Links */}
                {show?.external_ids && (
                  <div className="flex gap-3">
                    {show.external_ids.imdb_id && (
                      <a 
                        href={`https://www.imdb.com/title/${show.external_ids.imdb_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        IMDb
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Episode Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[var(--nexus-red)] mb-6">
              SELECT EPISODE
            </h2>

            {/* Season Selector */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Season</h3>
              <div className="flex flex-wrap gap-2">
                {seasons.map(season => (
                  <button
                    key={season.id}
                    onClick={() => setSelectedSeason(season.season_number)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      selectedSeason === season.season_number
                        ? 'bg-[var(--nexus-red)] text-white'
                        : 'bg-[var(--nexus-card)] text-gray-300 hover:bg-[var(--nexus-card-hover)]'
                    }`}
                  >
                    Season {season.season_number}
                  </button>
                ))}
              </div>
            </div>

            {/* Episode Grid */}
            {seasonDetails && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Episodes - Season {selectedSeason}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {seasonDetails.episodes?.map(episode => (
                    <div
                      key={episode.id}
                      onClick={() => setSelectedEpisode(episode.episode_number)}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-300 ${
                        selectedEpisode === episode.episode_number
                          ? 'border-[var(--nexus-red)] bg-[var(--nexus-red)]/10'
                          : 'border-gray-700 bg-[var(--nexus-card)] hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Episode Thumbnail */}
                        <div className="w-24 h-16 bg-gray-700 rounded flex-shrink-0 overflow-hidden">
                          {episode.still_path ? (
                            <img
                              src={getImageUrl(episode.still_path, 'w300')}
                              alt={`Episode ${episode.episode_number}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              <span className="text-xs">No Image</span>
                            </div>
                          )}
                        </div>

                        {/* Episode Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-sm mb-1 truncate">
                            {episode.episode_number}. {episode.name}
                          </h4>
                          <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                            {episode.overview || 'No description available.'}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{episode.air_date}</span>
                            {episode.runtime && <span>{episode.runtime} min</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cast Section */}
        {cast.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
            <div className="flex overflow-x-auto space-x-4 pb-4">
              {cast.slice(0, 10).map(person => (
                <div key={person.id} className="flex-shrink-0 w-32">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2">
                    <img
                      src={getImageUrl(person.profile_path, 'w185')}
                      alt={person.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/185/278';
                      }}
                    />
                  </div>
                  <h4 className="font-semibold text-white text-sm truncate">{person.name}</h4>
                  <p className="text-gray-400 text-xs truncate">{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TVShowDetails;
