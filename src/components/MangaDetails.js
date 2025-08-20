import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getMangaDetails, getMangaCharacters, getMangaRecommendations } from '../utils/mangaApi';
import { getMangaEmbedUrl } from '../utils/vidsrcApi';
import MangaCard from './MangaCard';

const MangaDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [manga, setManga] = useState(location.state?.manga || null);
  const [characters, setCharacters] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(!manga);
  const [showReader, setShowReader] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(1);

  useEffect(() => {
    const loadMangaData = async () => {
      if (!manga) {
        setLoading(true);
        try {
          const mangaData = await getMangaDetails(id);
          setManga(mangaData);
        } catch (error) {
          console.error('Error loading manga details:', error);
        }
      }

      try {
        const [charactersData, recommendationsData] = await Promise.all([
          getMangaCharacters(id),
          getMangaRecommendations(id)
        ]);
        setCharacters(charactersData);
        setRecommendations(recommendationsData);
      } catch (error) {
        console.error('Error loading additional manga data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMangaData();
  }, [id, manga]);

  const handleReadManga = (chapter = 1) => {
    setCurrentChapter(chapter);
    setShowReader(true);
  };

  const handleMangaClick = (mangaItem) => {
    navigate(`/manga/${mangaItem.id}`, { state: { manga: mangaItem } });
  };

  if (loading) {
    return (
      <div className="min-h-screen text-white pt-24 px-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-800 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-800 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="min-h-screen text-white pt-24 px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">📚</div>
          <h2 className="font-['JetBrains_Mono',monospace] text-2xl text-red-400 mb-4">
            Manga Not Found
          </h2>
          <p className="font-['JetBrains_Mono',monospace] text-gray-400 mb-6">
            This manga couldn't be found in the quantum database
          </p>
          <button
            onClick={() => navigate('/manga')}
            className="font-['JetBrains_Mono',monospace] bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Return to Manga Library
          </button>
        </div>
      </div>
    );
  }

  const title = manga.title || manga.name || 'Unknown Manga';
  const score = manga.score || manga.vote_average || 0;
  const chapters = manga.chapters || 'Unknown';
  const volumes = manga.volumes || 'Unknown';
  const status = manga.status || 'Unknown';
  const synopsis = manga.synopsis || manga.overview || 'No synopsis available.';
  const genres = manga.genres || [];
  const year = manga.published?.from ? new Date(manga.published.from).getFullYear() : manga.year || 'Unknown';
  const authors = manga.authors?.map(a => a.name).join(', ') || 'Unknown';
  const serializations = manga.serializations?.map(s => s.name).join(', ') || 'Unknown';

  // Manga Reader Component
  const MangaReader = () => {
    const readerUrl = getMangaEmbedUrl(manga.mal_id || manga.id, currentChapter);
    
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Reader Header */}
        <div className="flex items-center justify-between p-4 bg-black/90 backdrop-blur-sm border-b border-purple-800/30">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowReader(false)}
              className="text-white hover:text-purple-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="font-['JetBrains_Mono',monospace] text-white text-lg font-semibold">
              {title} - Chapter {currentChapter}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentChapter(Math.max(1, currentChapter - 1))}
              disabled={currentChapter <= 1}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Previous
            </button>
            <span className="text-white font-['JetBrains_Mono',monospace]">
              {currentChapter} / {chapters}
            </span>
            <button
              onClick={() => setCurrentChapter(currentChapter + 1)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Next
            </button>
          </div>
        </div>
        
        {/* Reader Content */}
        <div className="flex-1 flex items-center justify-center bg-gray-900">
          <iframe
            src={readerUrl}
            className="w-full h-full border-0"
            title={`${title} - Chapter ${currentChapter}`}
            allowFullScreen
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-white pt-24">
      {showReader && <MangaReader />}
      
      {/* Hero Section */}
      <div className="relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={manga.poster_path || manga.image_url || manga.images?.jpg?.large_image_url}
            alt={title}
            className="w-full h-full object-cover opacity-20 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        </div>

        <div className="relative px-8 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Manga Poster */}
              <div className="lg:col-span-1">
                <div className="sticky top-32">
                  <img
                    src={manga.poster_path || manga.image_url || manga.images?.jpg?.large_image_url}
                    alt={title}
                    className="w-full max-w-md mx-auto rounded-xl shadow-2xl"
                  />
                  
                  {/* Action Buttons */}
                  <div className="mt-6 space-y-3">
                    <button
                      onClick={() => handleReadManga(1)}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-['JetBrains_Mono',monospace] py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      📖 READ NOW
                    </button>
                    <button
                      onClick={() => handleReadManga(currentChapter || 1)}
                      className="w-full bg-black/60 backdrop-blur-sm border border-purple-500/50 hover:bg-purple-600/20 text-white font-['JetBrains_Mono',monospace] py-3 rounded-lg transition-all duration-300"
                    >
                      📚 CONTINUE READING
                    </button>
                    <button className="w-full bg-black/60 backdrop-blur-sm border border-gray-500/50 hover:bg-gray-600/20 text-white font-['JetBrains_Mono',monospace] py-3 rounded-lg transition-all duration-300">
                      ⭐ ADD TO LIBRARY
                    </button>
                  </div>
                </div>
              </div>

              {/* Manga Info */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <div>
                    <h1 className="font-['JetBrains_Mono',monospace] text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-4">
                      {title}
                    </h1>
                    
                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      {score > 0 && (
                        <div className="bg-green-600/20 border border-green-500/50 px-3 py-1 rounded-full">
                          <span className="text-green-400 font-['JetBrains_Mono',monospace] text-sm">
                            ⭐ {score.toFixed(1)}
                          </span>
                        </div>
                      )}
                      <div className="bg-purple-600/20 border border-purple-500/50 px-3 py-1 rounded-full">
                        <span className="text-purple-400 font-['JetBrains_Mono',monospace] text-sm">
                          📖 {chapters} Chapters
                        </span>
                      </div>
                      <div className="bg-indigo-600/20 border border-indigo-500/50 px-3 py-1 rounded-full">
                        <span className="text-indigo-400 font-['JetBrains_Mono',monospace] text-sm">
                          📚 {volumes} Volumes
                        </span>
                      </div>
                      <div className="bg-blue-600/20 border border-blue-500/50 px-3 py-1 rounded-full">
                        <span className="text-blue-400 font-['JetBrains_Mono',monospace] text-sm">
                          {status}
                        </span>
                      </div>
                      <div className="bg-gray-600/20 border border-gray-500/50 px-3 py-1 rounded-full">
                        <span className="text-gray-400 font-['JetBrains_Mono',monospace] text-sm">
                          {year}
                        </span>
                      </div>
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {genres.map((genre, index) => (
                        <span
                          key={index}
                          className="bg-black/40 backdrop-blur-sm border border-purple-800/30 px-3 py-1 rounded-lg text-sm text-purple-300 font-['JetBrains_Mono',monospace]"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Synopsis */}
                  <div className="bg-black/40 backdrop-blur-sm border border-purple-800/30 rounded-xl p-6">
                    <h3 className="font-['JetBrains_Mono',monospace] text-xl font-bold text-purple-400 mb-4">
                      SYNOPSIS
                    </h3>
                    <p className="font-['JetBrains_Mono',monospace] text-gray-300 leading-relaxed">
                      {synopsis}
                    </p>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black/40 backdrop-blur-sm border border-purple-800/30 rounded-xl p-6">
                      <h3 className="font-['JetBrains_Mono',monospace] text-lg font-bold text-purple-400 mb-4">
                        PUBLICATION INFO
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Author(s):</span>
                          <span className="text-white">{authors}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Serialization:</span>
                          <span className="text-white">{serializations}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <span className="text-white">{status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Year:</span>
                          <span className="text-white">{year}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/40 backdrop-blur-sm border border-purple-800/30 rounded-xl p-6">
                      <h3 className="font-['JetBrains_Mono',monospace] text-lg font-bold text-purple-400 mb-4">
                        STATISTICS
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Score:</span>
                          <span className="text-white">{score > 0 ? `${score.toFixed(1)}/10` : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Chapters:</span>
                          <span className="text-white">{chapters}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Volumes:</span>
                          <span className="text-white">{volumes}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">MAL ID:</span>
                          <span className="text-white">{manga.mal_id || manga.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Characters Section */}
      {characters.length > 0 && (
        <div className="px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-purple-400 mb-6">
              CHARACTERS
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {characters.slice(0, 12).map((character) => (
                <div key={character.id} className="bg-black/40 backdrop-blur-sm border border-purple-800/30 rounded-lg p-4 text-center">
                  <img
                    src={character.image || 'https://dummyimage.com/100x100/6b46c1/ffffff.png?text=Character'}
                    alt={character.name}
                    className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                  />
                  <div className="text-xs text-white font-semibold line-clamp-2">
                    {character.name}
                  </div>
                  <div className="text-xs text-purple-400 mt-1">
                    {character.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-purple-400 mb-6">
              RECOMMENDED MANGA
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {recommendations.map((mangaItem, index) => (
                <MangaCard
                  key={mangaItem.id}
                  manga={mangaItem}
                  onClick={handleMangaClick}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MangaDetails;
