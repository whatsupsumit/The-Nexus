import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getTVDetails, getTVCredits, getTVSeasonDetails } from '../utils/vidsrcApi';
import VideoPlayer from './VideoPlayer';

const TVShowDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tvShow, setTVShow] = useState(location.state?.tvShow || null);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [seasonDetails, setSeasonDetails] = useState(null);
  const [loading, setLoading] = useState(!tvShow);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isInVault, setIsInVault] = useState(false);

  useEffect(() => {
    const loadTVData = async () => {
      try {
        setLoading(true);
        
        const [tvData, creditsData] = await Promise.all([
          tvShow ? Promise.resolve(tvShow) : getTVDetails(id),
          getTVCredits(id)
        ]);

        if (tvData) {
          setTVShow(tvData);
          setSeasons(tvData.seasons || []);
        }
        setCredits(creditsData);

        // Check if show is in vault
        const vault = JSON.parse(localStorage.getItem('nexus_vault') || '[]');
        setIsInVault(vault.some(item => item.id === parseInt(id)));
      } catch (error) {
        console.error('Error loading TV data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTVData();
  }, [id, tvShow]);

  // Load season details when season changes
  useEffect(() => {
    const loadSeasonDetails = async () => {
      if (tvShow && selectedSeason) {
        try {
          const details = await getTVSeasonDetails(tvShow.id, selectedSeason);
          setSeasonDetails(details);
          // Reset episode selection when season changes
          setSelectedEpisode(1);
        } catch (error) {
          console.error('Error loading season details:', error);
        }
      }
    };

    loadSeasonDetails();
  }, [tvShow, selectedSeason]);

  const handlePlayEpisode = () => {
    setShowPlayer(true);
  };

  const closePlayer = () => {
    setShowPlayer(false);
  };

  const toggleVault = () => {
    const vault = JSON.parse(localStorage.getItem('nexus_vault') || '[]');
    const showIndex = vault.findIndex(item => item.id === tvShow.id);

    if (showIndex >= 0) {
      // Remove from vault
      vault.splice(showIndex, 1);
      setIsInVault(false);
    } else {
      // Add to vault
      vault.push({
        ...tvShow,
        addedAt: new Date().toISOString(),
        type: 'tv'
      });
      setIsInVault(true);
    }

    localStorage.setItem('nexus_vault', JSON.stringify(vault));
  };

  const formatAirDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString();
  };

  if (showPlayer && tvShow) {
    return (
      <VideoPlayer
        movie={tvShow}
        isTV={true}
        season={selectedSeason}
        episode={selectedEpisode}
        onClose={closePlayer}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <div className="container mx-auto px-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-800 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="h-32 bg-gray-700 rounded mb-4"></div>
              </div>
              <div className="h-64 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tvShow) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <div className="container mx-auto px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">TV Show Not Found</h1>
          <button
            onClick={() => navigate('/tv-shows')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            Back to TV Shows
          </button>
        </div>
      </div>
    );
  }

  const creator = tvShow.created_by?.[0];
  const availableSeasons = seasons.filter(season => season.season_number > 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: tvShow.backdrop_path 
              ? `url(https://image.tmdb.org/t/p/original${tvShow.backdrop_path})`
              : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-8 pt-32 h-full flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {/* Poster */}
            <div className="flex justify-center md:justify-start">
              <div className="relative group">
                <img
                  src={tvShow.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
                    : '/placeholder-tv.jpg'
                  }
                  alt={tvShow.name}
                  className="w-80 h-auto rounded-lg shadow-2xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              </div>
            </div>

            {/* Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Back Button */}
              <button
                onClick={() => navigate('/tv-shows')}
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to TV Shows
              </button>

              {/* Title and Rating */}
              <div>
                <h1 className="font-['JetBrains_Mono',monospace] text-4xl md:text-6xl font-bold text-white mb-2">
                  {tvShow.name}
                </h1>
                {tvShow.tagline && (
                  <p className="text-xl text-gray-300 italic mb-4">"{tvShow.tagline}"</p>
                )}
                <div className="flex items-center space-x-6 mb-4">
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-2xl mr-2">⭐</span>
                    <span className="text-xl font-bold">{tvShow.vote_average?.toFixed(1)}</span>
                    <span className="text-gray-400 ml-2">({tvShow.vote_count} votes)</span>
                  </div>
                  <span className="text-gray-300">
                    {tvShow.number_of_seasons} Season{tvShow.number_of_seasons !== 1 ? 's' : ''}
                  </span>
                  <span className="text-gray-300">
                    {tvShow.number_of_episodes} Episodes
                  </span>
                </div>
              </div>

              {/* Genres */}
              {tvShow.genres && tvShow.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tvShow.genres.map(genre => (
                    <span
                      key={genre.id}
                      className="bg-red-600/20 border border-red-500/30 text-red-300 px-3 py-1 rounded-full text-sm font-['JetBrains_Mono',monospace]"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <div>
                <h3 className="text-xl font-bold mb-3 text-red-400">SYNOPSIS</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {tvShow.overview}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={toggleVault}
                  className={`border-2 px-8 py-3 rounded-lg font-['JetBrains_Mono',monospace] font-bold flex items-center transition-all duration-300 transform hover:scale-105 ${
                    isInVault 
                      ? 'border-green-500 text-green-400 bg-green-500/10'
                      : 'border-gray-500 text-gray-300 hover:border-red-500 hover:text-red-400'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d={isInVault ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} 
                    />
                  </svg>
                  {isInVault ? 'IN VAULT' : 'ADD TO VAULT'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Season & Episode Selection */}
      <div className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Episode Selection */}
          <div className="lg:col-span-2">
            <h2 className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-red-400 mb-6">
              SELECT EPISODE
            </h2>

            {/* Season Selector */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Season</h3>
              <div className="flex flex-wrap gap-2">
                {availableSeasons.map(season => (
                  <button
                    key={season.id}
                    onClick={() => setSelectedSeason(season.season_number)}
                    className={`px-4 py-2 rounded-lg font-['JetBrains_Mono',monospace] transition-all duration-300 ${
                      selectedSeason === season.season_number
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
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
                          ? 'border-red-500 bg-red-500/10'
                          : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={episode.still_path 
                              ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
                              : '/placeholder-episode.jpg'
                            }
                            alt={episode.name}
                            className="w-24 h-14 object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">
                            {episode.episode_number}. {episode.name}
                          </h4>
                          <p className="text-gray-400 text-sm mb-2">
                            {episode.runtime} min • {formatAirDate(episode.air_date)}
                          </p>
                          <p className="text-gray-300 text-sm line-clamp-2">
                            {episode.overview}
                          </p>
                          <div className="flex items-center mt-2">
                            <span className="text-yellow-400 mr-1">⭐</span>
                            <span className="text-sm">{episode.vote_average?.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Play Button */}
                {selectedEpisode && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={handlePlayEpisode}
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-['JetBrains_Mono',monospace] font-bold text-lg flex items-center mx-auto transition-all duration-300 transform hover:scale-105"
                    >
                      <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      PLAY S{selectedSeason}:E{selectedEpisode}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Show Info & Cast */}
          <div>
            <h2 className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-red-400 mb-6">DETAILS</h2>
            <div className="bg-gray-900/50 rounded-lg p-6 space-y-4 mb-8">
              {creator && (
                <div>
                  <p className="text-gray-400 text-sm">CREATED BY</p>
                  <p className="text-white">{creator.name}</p>
                </div>
              )}

              <div>
                <p className="text-gray-400 text-sm">FIRST AIRED</p>
                <p className="text-white">{formatAirDate(tvShow.first_air_date)}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">STATUS</p>
                <p className="text-white">{tvShow.status}</p>
              </div>

              {tvShow.networks && tvShow.networks.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm">NETWORK</p>
                  <p className="text-white">{tvShow.networks[0].name}</p>
                </div>
              )}

              {tvShow.production_companies && tvShow.production_companies.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm">PRODUCTION</p>
                  <p className="text-white">
                    {tvShow.production_companies.slice(0, 2).map(company => company.name).join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Cast */}
            {credits.cast.length > 0 && (
              <div>
                <h3 className="font-['JetBrains_Mono',monospace] text-xl font-bold text-red-400 mb-4">CAST</h3>
                <div className="space-y-3">
                  {credits.cast.slice(0, 8).map(actor => (
                    <div key={actor.id} className="flex items-center space-x-3">
                      <img
                        src={actor.profile_path 
                          ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                          : '/placeholder-person.jpg'
                        }
                        alt={actor.name}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-white text-sm">{actor.name}</p>
                        <p className="text-gray-400 text-xs">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVShowDetails;
