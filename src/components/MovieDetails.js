// React aur hooks - UI aur state management ke liye
import React, { useState, useEffect } from 'react';
// React Router - URL se movie ID lene aur navigation ke liye
import { useParams, useNavigate } from 'react-router-dom';
// TMDB API functions - movie details, cast, videos, recommendations fetch karne ke liye
import { getMovieDetails, getMovieCredits, getMovieVideos, getMovieRecommendations } from '../utils/vidsrcApi';
// Safe navigation utility - external links safely open karne ke liye
import { safeOpenExternal } from '../utils/safeNavigation';
// VideoPlayer component - movie play karne ke liye
import VideoPlayer from './VideoPlayer';

// MovieDetails component - single movie ki detailed info display karta hai (cast, trailers, etc)
const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null); // Always start with null to force fresh data load
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [videos, setVideos] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true); // Always start loading
  const [showPlayer, setShowPlayer] = useState(false);
  const [isInVault, setIsInVault] = useState(false);
  const [backgroundVisible, setBackgroundVisible] = useState(false);

  useEffect(() => {
    const loadMovieData = async () => {
      try {
        setLoading(true);
        setBackgroundVisible(false); // Reset background on navigation
        
        // Clear previous data when navigating to a new movie
        setMovie(null);
        setCredits({ cast: [], crew: [] });
        setVideos([]);
        setRecommendations([]);
        
        // Use efficient loading strategy
        const promises = [];
        
        // Always load fresh movie details for the new ID
        promises.push(getMovieDetails(id));
        
        // Load additional data in parallel
        promises.push(getMovieCredits(id));
        promises.push(getMovieVideos(id));
        promises.push(getMovieRecommendations(id));

        const [movieData, creditsData, videosData, recommendationsData] = await Promise.all(promises);

        if (movieData && movieData.id) {
          setMovie(movieData);
          setCredits(creditsData || { cast: [], crew: [] });
          // Extract results array from API response
          setVideos(videosData?.results || []);
          setRecommendations(recommendationsData?.results || []);

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
  }, [id]); // Remove movie from dependencies to always fetch fresh data

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

  const director = credits.crew?.find(person => person.job === 'Director');
  const writer = credits.crew?.find(person => person.job === 'Writer' || person.job === 'Screenplay');
  const videosArray = Array.isArray(videos) ? videos : [];
  const trailer = videosArray.find(video => video.type === 'Trailer');

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-auto">
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
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-12 min-h-screen flex items-start lg:items-center">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
            {/* Poster */}
            <div className="flex justify-center lg:justify-start order-1 lg:order-1">
              <div className="relative group">
                <img
                  src={movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : '/placeholder-movie.jpg'
                  }
                  alt={movie.title}
                  className="w-64 sm:w-72 lg:w-80 h-auto rounded-lg shadow-2xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-2">
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
                <h1 className="font-['JetBrains_Mono',monospace] text-2xl sm:text-3xl lg:text-4xl xl:text-6xl font-bold text-white mb-2">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-xl text-gray-300 italic mb-4">"{movie.tagline}"</p>
                )}
                
                {/* Enhanced Info Bar */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-2xl mr-2">⭐</span>
                    <span className="text-xl font-bold">{movie.vote_average?.toFixed(1)}</span>
                    <span className="text-gray-400 ml-2">({movie.vote_count} votes)</span>
                  </div>
                  
                  {movie.runtime && (
                    <div className="flex items-center gap-1 text-gray-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}
                  
                  {movie.release_date && (
                    <div className="flex items-center gap-1 text-gray-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(movie.release_date)}</span>
                    </div>
                  )}
                  
                  {movie.production_countries && movie.production_countries.length > 0 && (
                    <div className="flex items-center gap-1 text-gray-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{movie.production_countries[0].name}</span>
                    </div>
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

              {/* Action Buttons - Enhanced for responsive with better mobile visibility */}
              <div className="space-y-4 mt-8">
                {/* Primary Actions - Always visible with enhanced mobile spacing */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                  <button
                    onClick={handlePlayMovie}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-4 sm:py-3 rounded-lg font-['JetBrains_Mono',monospace] font-bold flex items-center justify-center transition-all duration-300 transform hover:scale-105 w-full sm:w-auto text-lg shadow-lg order-1"
                  >
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span className="text-base sm:text-lg">PLAY NOW</span>
                  </button>
                  
                  <button
                    onClick={toggleVault}
                    className={`border-2 px-6 sm:px-8 py-4 sm:py-3 rounded-lg font-['JetBrains_Mono',monospace] font-bold flex items-center justify-center transition-all duration-300 transform hover:scale-105 w-full sm:w-auto order-2 ${
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
                      onClick={() => {
                        const url = `https://www.youtube.com/watch?v=${encodeURIComponent(trailer.key)}`;
                        const success = safeOpenExternal(url);
                        if (!success) {
                          console.warn('Failed to open trailer safely');
                        }
                      }}
                      className="border-2 border-gray-500 text-gray-300 hover:border-red-500 hover:text-red-400 px-6 sm:px-8 py-4 sm:py-3 rounded-lg font-['JetBrains_Mono',monospace] font-bold flex items-center justify-center transition-all duration-300 w-full sm:w-auto order-3"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                      TRAILER
                    </button>
                  )}
                </div>

                {/* External Links */}
                <div className="flex flex-wrap gap-3">
                  {movie.imdb_id && (
                    <a 
                      href={`https://www.imdb.com/title/${movie.imdb_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/15 text-white px-4 py-2 rounded-full hover:bg-white/25 transition-all flex items-center gap-2 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      IMDb
                    </a>
                  )}
                  
                  {movie.homepage && (
                    <a 
                      href={movie.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/15 text-white px-4 py-2 rounded-full hover:bg-white/25 transition-all flex items-center gap-2 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                      Official Site
                    </a>
                  )}
                  
                  <a 
                    href={`https://www.themoviedb.org/movie/${movie.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/15 text-white px-4 py-2 rounded-full hover:bg-white/25 transition-all flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    TMDB
                  </a>
                </div>
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
            <h2 className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-red-400 mb-6">CAST & CREW</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.isArray(credits.cast) && credits.cast.slice(0, 12).map(actor => (
                <div 
                  key={actor.id} 
                  className="bg-gray-900/50 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-105"
                  onClick={() => {
                    // You can add navigation to actor details page here if you have one
                    console.log('Navigate to actor:', actor.name);
                  }}
                >
                  <div className="relative mb-3">
                    <img
                      src={actor.profile_path 
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : '/placeholder-person.jpg'
                      }
                      alt={actor.name}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end justify-center">
                      <span className="text-white text-xs mb-2">View Profile</span>
                    </div>
                  </div>
                  <p className="font-semibold text-white text-sm line-clamp-1">{actor.name}</p>
                  <p className="text-gray-400 text-xs line-clamp-2">{actor.character}</p>
                </div>
              ))}
            </div>
            
            {/* Show Director and Key Crew */}
            {(director || writer) && (
              <div className="mt-8">
                <h3 className="font-['JetBrains_Mono',monospace] text-lg font-bold text-red-400 mb-4">KEY CREW</h3>
                <div className="flex flex-wrap gap-4">
                  {director && (
                    <div className="bg-gray-900/50 rounded-lg p-4 text-center min-w-[150px]">
                      {director.profile_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${director.profile_path}`}
                          alt={director.name}
                          className="w-16 h-16 object-cover rounded-full mx-auto mb-2"
                        />
                      )}
                      <p className="font-semibold text-white text-sm">{director.name}</p>
                      <p className="text-gray-400 text-xs">Director</p>
                    </div>
                  )}
                  
                  {writer && writer.id !== director?.id && (
                    <div className="bg-gray-900/50 rounded-lg p-4 text-center min-w-[150px]">
                      {writer.profile_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${writer.profile_path}`}
                          alt={writer.name}
                          className="w-16 h-16 object-cover rounded-full mx-auto mb-2"
                        />
                      )}
                      <p className="font-semibold text-white text-sm">{writer.name}</p>
                      <p className="text-gray-400 text-xs">{writer.job}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Movie Info */}
          <div>
            <h2 className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-red-400 mb-6">MOVIE DETAILS</h2>
            <div className="bg-gray-900/50 rounded-lg p-6 space-y-6">
              {movie.release_date && (
                <div>
                  <p className="text-gray-400 text-sm font-['JetBrains_Mono',monospace] uppercase tracking-wide">Release Date</p>
                  <p className="text-white font-semibold">{formatDate(movie.release_date)}</p>
                </div>
              )}

              {director && (
                <div>
                  <p className="text-gray-400 text-sm font-['JetBrains_Mono',monospace] uppercase tracking-wide">Director</p>
                  <p className="text-white font-semibold">{director.name}</p>
                </div>
              )}
              
              {writer && (
                <div>
                  <p className="text-gray-400 text-sm font-['JetBrains_Mono',monospace] uppercase tracking-wide">Writer</p>
                  <p className="text-white font-semibold">{writer.name}</p>
                </div>
              )}

              {movie.budget > 0 && (
                <div>
                  <p className="text-gray-400 text-sm font-['JetBrains_Mono',monospace] uppercase tracking-wide">Budget</p>
                  <p className="text-white font-semibold">{formatCurrency(movie.budget)}</p>
                </div>
              )}

              {movie.revenue > 0 && (
                <div>
                  <p className="text-gray-400 text-sm font-['JetBrains_Mono',monospace] uppercase tracking-wide">Box Office</p>
                  <p className="text-white font-semibold">{formatCurrency(movie.revenue)}</p>
                  {movie.budget > 0 && (
                    <p className="text-green-400 text-xs mt-1">
                      {((movie.revenue / movie.budget) * 100).toFixed(0)}% return
                    </p>
                  )}
                </div>
              )}

              {movie.production_companies && movie.production_companies.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm font-['JetBrains_Mono',monospace] uppercase tracking-wide">Production</p>
                  <div className="space-y-1">
                    {movie.production_companies.slice(0, 3).map(company => (
                      <p key={company.id} className="text-white text-sm">{company.name}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm font-['JetBrains_Mono',monospace] uppercase tracking-wide">Languages</p>
                  <p className="text-white font-semibold">
                    {movie.spoken_languages.map(lang => lang.english_name).join(', ')}
                  </p>
                </div>
              )}
              
              {movie.status && (
                <div>
                  <p className="text-gray-400 text-sm font-['JetBrains_Mono',monospace] uppercase tracking-wide">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    movie.status === 'Released' ? 'bg-green-600/20 text-green-400' : 
                    'bg-yellow-600/20 text-yellow-400'
                  }`}>
                    {movie.status}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {Array.isArray(recommendations) && recommendations.length > 0 && (
          <div className="mt-16">
            <h2 className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-red-400 mb-6">MORE LIKE THIS</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {recommendations.slice(0, 12).map((rec, index) => (
                <div
                  key={rec.id}
                  onClick={() => navigate(`/movie/${rec.id}`, { state: { movie: rec } })}
                  className="cursor-pointer group animate-stagger"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <div className="relative">
                    <img
                      src={rec.poster_path 
                        ? `https://image.tmdb.org/t/p/w300${rec.poster_path}`
                        : '/placeholder-movie.jpg'
                      }
                      alt={rec.title}
                      className="w-full aspect-[2/3] object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end justify-center">
                      <div className="p-3 text-center">
                        <svg className="w-8 h-8 text-white mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white text-xs">Watch Now</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-white text-sm font-semibold group-hover:text-red-400 transition-colors line-clamp-2">
                      {rec.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-yellow-400 text-xs">⭐</span>
                      <span className="text-gray-400 text-xs">{rec.vote_average?.toFixed(1)}</span>
                      <span className="text-gray-500 text-xs">•</span>
                      <span className="text-gray-400 text-xs">
                        {rec.release_date ? new Date(rec.release_date).getFullYear() : 'TBA'}
                      </span>
                    </div>
                  </div>
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
