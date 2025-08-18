import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getMovieDetails, getMovieCredits, getMovieVideos, getMovieRecommendations } from '../utils/vidsrcApi';
import VideoPlayer from './VideoPlayer';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [videos, setVideos] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(!movie);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isInVault, setIsInVault] = useState(false);
  const [backgroundVisible, setBackgroundVisible] = useState(false);

  useEffect(() => {
    const loadMovieData = async () => {
      try {
        setLoading(true);
        setBackgroundVisible(false); // Reset background on navigation
        
        // Use efficient loading strategy
        const promises = [];
        
        // Load movie details first if not available
        if (!movie) {
          promises.push(getMovieDetails(id));
        } else {
          promises.push(Promise.resolve(movie));
        }
        
        // Load additional data in parallel
        promises.push(getMovieCredits(id));
        promises.push(getMovieVideos(id));
        promises.push(getMovieRecommendations(id));

        const [movieData, creditsData, videosData, recommendationsData] = await Promise.all(promises);

        if (movieData && movieData.id) {
          setMovie(movieData);
          setCredits(creditsData || { cast: [], crew: [] });
          setVideos(videosData || []);
          setRecommendations(recommendationsData || []);

          // Check if movie is in vault
          const vault = JSON.parse(localStorage.getItem('nexus_vault') || '[]');
          setIsInVault(vault.some(item => item.id === parseInt(id)));

          // Start background transition after a short delay
          setTimeout(() => {
            setBackgroundVisible(true);
          }, 300);
        }
      } catch (error) {
        console.error('Error loading movie details:', error);
        setCredits({ cast: [], crew: [] });
        setVideos([]);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadMovieData();
    }
  }, [id, movie]);

  const handlePlayMovie = () => {
    setShowPlayer(true);
  };

  const closePlayer = () => {
    setShowPlayer(false);
  };

  const toggleVault = () => {
    const vault = JSON.parse(localStorage.getItem('nexus_vault') || '[]');
    const movieIndex = vault.findIndex(item => item.id === movie.id);

    if (movieIndex >= 0) {
      // Remove from vault
      vault.splice(movieIndex, 1);
      setIsInVault(false);
    } else {
      // Add to vault
      vault.push({
        ...movie,
        addedAt: new Date().toISOString(),
        type: 'movie'
      });
      setIsInVault(true);
    }

    localStorage.setItem('nexus_vault', JSON.stringify(vault));
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (showPlayer && movie) {
    return (
      <VideoPlayer
        movie={movie}
        isTV={false}
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

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <div className="container mx-auto px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Movie Not Found</h1>
          <button
            onClick={() => navigate('/movies')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  const director = credits.crew.find(person => person.job === 'Director');
  const writer = credits.crew.find(person => person.job === 'Writer' || person.job === 'Screenplay');
  const trailer = videos.find(video => video.type === 'Trailer');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        {/* Always present dark background */}
        <div className="absolute inset-0 bg-black" />
        
        {/* Movie background with smooth fade-in */}
        {movie?.backdrop_path && (
          <div 
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-2000 ease-out ${
              backgroundVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            }}
          />
        )}
        
        {/* Enhanced Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-8 pt-32 h-full flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {/* Poster */}
            <div className="flex justify-center md:justify-start">
              <div className="relative group">
                <img
                  src={movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : '/placeholder-movie.jpg'
                  }
                  alt={movie.title}
                  className="w-80 h-auto rounded-lg shadow-2xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              </div>
            </div>

            {/* Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Back Button */}
              <button
                onClick={() => navigate('/movies')}
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Movies
              </button>

              {/* Title and Rating */}
              <div>
                <h1 className="font-['JetBrains_Mono',monospace] text-4xl md:text-6xl font-bold text-white mb-2">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-xl text-gray-300 italic mb-4">"{movie.tagline}"</p>
                )}
                <div className="flex items-center space-x-6 mb-4">
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-2xl mr-2">⭐</span>
                    <span className="text-xl font-bold">{movie.vote_average?.toFixed(1)}</span>
                    <span className="text-gray-400 ml-2">({movie.vote_count} votes)</span>
                  </div>
                  {movie.runtime && (
                    <span className="text-gray-300">{formatRuntime(movie.runtime)}</span>
                  )}
                </div>
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map(genre => (
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
                  {movie.overview}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handlePlayMovie}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-['JetBrains_Mono',monospace] font-bold flex items-center transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  PLAY NOW
                </button>
                
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

                {trailer && (
                  <button
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')}
                    className="border-2 border-gray-500 text-gray-300 hover:border-red-500 hover:text-red-400 px-8 py-3 rounded-lg font-['JetBrains_Mono',monospace] font-bold flex items-center transition-all duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    TRAILER
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cast */}
          <div className="lg:col-span-2">
            <h2 className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-red-400 mb-6">CAST</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {credits.cast.slice(0, 12).map(actor => (
                <div key={actor.id} className="bg-gray-900/50 rounded-lg p-4 text-center">
                  <img
                    src={actor.profile_path 
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : '/placeholder-person.jpg'
                    }
                    alt={actor.name}
                    className="w-full aspect-square object-cover rounded-lg mb-2"
                  />
                  <p className="font-semibold text-white text-sm">{actor.name}</p>
                  <p className="text-gray-400 text-xs">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Movie Info */}
          <div>
            <h2 className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-red-400 mb-6">DETAILS</h2>
            <div className="bg-gray-900/50 rounded-lg p-6 space-y-4">
              {director && (
                <div>
                  <p className="text-gray-400 text-sm">DIRECTOR</p>
                  <p className="text-white">{director.name}</p>
                </div>
              )}
              
              {writer && (
                <div>
                  <p className="text-gray-400 text-sm">WRITER</p>
                  <p className="text-white">{writer.name}</p>
                </div>
              )}

              <div>
                <p className="text-gray-400 text-sm">RELEASE DATE</p>
                <p className="text-white">{new Date(movie.release_date).toLocaleDateString()}</p>
              </div>

              {movie.budget > 0 && (
                <div>
                  <p className="text-gray-400 text-sm">BUDGET</p>
                  <p className="text-white">{formatCurrency(movie.budget)}</p>
                </div>
              )}

              {movie.revenue > 0 && (
                <div>
                  <p className="text-gray-400 text-sm">BOX OFFICE</p>
                  <p className="text-white">{formatCurrency(movie.revenue)}</p>
                </div>
              )}

              {movie.production_companies && movie.production_companies.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm">PRODUCTION</p>
                  <p className="text-white">
                    {movie.production_companies.slice(0, 3).map(company => company.name).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-16">
            <h2 className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-red-400 mb-6">MORE LIKE THIS</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recommendations.slice(0, 12).map(rec => (
                <div
                  key={rec.id}
                  onClick={() => navigate(`/movie/${rec.id}`, { state: { movie: rec } })}
                  className="cursor-pointer group"
                >
                  <img
                    src={rec.poster_path 
                      ? `https://image.tmdb.org/t/p/w300${rec.poster_path}`
                      : '/placeholder-movie.jpg'
                    }
                    alt={rec.title}
                    className="w-full aspect-[2/3] object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                  <p className="text-white text-sm mt-2 group-hover:text-red-400 transition-colors">
                    {rec.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
