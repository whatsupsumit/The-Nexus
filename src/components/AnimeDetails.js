import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AnimeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animeData, setAnimeData] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [currentSource, setCurrentSource] = useState('hd-1');
  const [currentLanguage, setCurrentLanguage] = useState('sub');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnimeData = async () => {
      try {
        setLoading(true);
        
        // Mock data for now - you would implement actual API calls here
        const mockAnimeData = {
          id: id,
          title: `Anime ${id}`,
          description: 'A great anime series with amazing storyline and characters.',
          poster: `https://placehold.co/300x400/1f2937/9ca3af/?text=Anime+${id}&font=inter`,
          year: '2024',
          status: 'Ongoing',
          episodes: 24
        };

        const mockEpisodes = Array.from({ length: 12 }, (_, i) => ({
          id: i + 1,
          episode_no: i + 1,
          title: `Episode ${i + 1}`,
          thumbnail: `https://placehold.co/320x180/1f2937/9ca3af/?text=Episode+${i + 1}&font=inter`
        }));

        setAnimeData(mockAnimeData);
        setEpisodes(mockEpisodes);
        if (mockEpisodes.length > 0) {
          setCurrentEpisode(mockEpisodes[0]);
        }
      } catch (err) {
        console.error('Error loading anime details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAnimeData();
  }, [id]);

  const handleEpisodeClick = (episode) => {
    setCurrentEpisode(episode);
  };

  const handleSourceChange = (source) => {
    setCurrentSource(source);
  };

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
  };

  const getStreamUrl = () => {
    if (!currentEpisode) return 'about:blank';
    
    // This would be your actual streaming URL logic
    return `https://example.com/stream/${id}/${currentEpisode.episode_no}/${currentSource}/${currentLanguage}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="text-white font-['JetBrains_Mono',monospace]">Loading anime details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen w-full flex-col gap-4">
        <h2 className="text-2xl font-bold text-white font-['JetBrains_Mono',monospace]">Failed to load anime details</h2>
        <p className="text-white/80 font-['JetBrains_Mono',monospace]">{error}</p>
        <button
          onClick={() => navigate('/anime')}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-['JetBrains_Mono',monospace] transition duration-200"
        >
          Back to Anime
        </button>
      </div>
    );
  }

  if (!animeData) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="text-white font-['JetBrains_Mono',monospace]">No anime data found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white pt-24">
      <div className="flex flex-col xl:flex-row gap-6 w-full min-h-screen p-4 sm:p-6">
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Video Player */}
          <div className="w-full">
            <iframe
              className="w-full h-[50vh] xl:h-[60vh] rounded-2xl border border-gray-700/30 shadow-2xl shadow-black/50"
              src={getStreamUrl()}
              allowFullScreen
              title={`${animeData.title} - Episode ${currentEpisode?.episode_no || 1}`}
            />
          </div>

          {/* Anime Info and Controls */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Anime Details */}
            <div className="flex-1">
              <div className="bg-black/60 backdrop-blur-sm border border-red-800/30 rounded-lg p-6 space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-red-400 font-['JetBrains_Mono',monospace]">
                  {animeData.title}
                </h2>
                <p className="text-gray-300 leading-relaxed font-['JetBrains_Mono',monospace]">
                  {animeData.description || "No description available"}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-400 font-['JetBrains_Mono',monospace]">
                  <span>Year: {animeData.year}</span>
                  <span>Status: {animeData.status}</span>
                  <span>Episodes: {animeData.episodes}</span>
                </div>
              </div>
            </div>

            {/* Source and Language Controls */}
            <div className="lg:w-96">
              <div className="bg-black/60 backdrop-blur-sm border border-red-800/30 rounded-lg p-6 space-y-6">
                <h3 className="text-xl font-semibold text-center font-['JetBrains_Mono',monospace]">Servers</h3>

                {/* SUB Sources */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
                    <span className="text-sm font-medium text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full font-['JetBrains_Mono',monospace]">SUB</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['hd-1', 'hd-2', 'hd-3', 'vidplay'].map((source) => (
                      <button
                        key={`${source}-sub`}
                        onClick={() => {
                          handleSourceChange(source);
                          handleLanguageChange('sub');
                        }}
                        className={`py-2.5 px-4 rounded-xl font-medium transition-all duration-200 font-['JetBrains_Mono',monospace] ${
                          currentSource === source && currentLanguage === 'sub'
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105'
                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border border-gray-600/30'
                        }`}
                      >
                        {source.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DUB Sources */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
                    <span className="text-sm font-medium text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full font-['JetBrains_Mono',monospace]">DUB</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['hd-1', 'hd-2', 'hd-3', 'vidplay'].map((source) => (
                      <button
                        key={`${source}-dub`}
                        onClick={() => {
                          handleSourceChange(source);
                          handleLanguageChange('dub');
                        }}
                        className={`py-2.5 px-4 rounded-xl font-medium transition-all duration-200 font-['JetBrains_Mono',monospace] ${
                          currentSource === source && currentLanguage === 'dub'
                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25 scale-105'
                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border border-gray-600/30'
                        }`}
                      >
                        {source.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Episodes Sidebar */}
        <div className="xl:w-96">
          <div className="bg-black/60 backdrop-blur-sm border border-red-800/30 rounded-lg h-full flex flex-col">
            <div className="p-6 border-b border-gray-700/30">
              <h2 className="text-xl font-bold font-['JetBrains_Mono',monospace]">Episodes</h2>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {episodes.map((episode) => (
                <div
                  key={episode.id}
                  onClick={() => handleEpisodeClick(episode)}
                  className={`group bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl overflow-hidden hover:bg-gray-700/40 hover:border-gray-600/50 transition-all duration-300 cursor-pointer ${
                    currentEpisode?.id === episode.id
                      ? 'ring-2 ring-red-500/50 bg-red-500/10 border-red-500/30'
                      : ''
                  }`}
                >
                  <div className="flex">
                    <div className="relative flex-shrink-0 w-24 sm:w-32">
                      <img
                        src={episode.thumbnail}
                        alt={episode.title}
                        className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/320x180/1f2937/9ca3af/?text=Episode&font=inter";
                        }}
                      />
                      <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded">
                        EP {episode.episode_no}
                      </div>
                    </div>
                    <div className="flex-1 p-4 space-y-2">
                      <h3 className="font-semibold text-white leading-tight group-hover:text-red-300 transition-colors duration-200 font-['JetBrains_Mono',monospace]">
                        {episode.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;
