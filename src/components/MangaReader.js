import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMangaDetailsForReading, getMangaChapterPages } from '../utils/mangaReadingApi';

const MangaReader = () => {
  const { mangaId, chapterId } = useParams();
  const navigate = useNavigate();
  
  const [manga, setManga] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load manga details and chapters
  useEffect(() => {
    const loadMangaDetails = async () => {
      try {
        setLoading(true);
        const mangaData = await getMangaDetailsForReading(mangaId);
        setManga(mangaData);
        
        // Find current chapter
        const chapter = mangaData.chapters.find(ch => ch.id === chapterId);
        setCurrentChapter(chapter);
        
        if (!chapter) {
          setError('Chapter not found');
          return;
        }
        
        // Load chapter pages
        const pagesData = await getMangaChapterPages(chapterId);
        setPages(pagesData);
        setCurrentPage(0);
        
      } catch (err) {
        console.error('Failed to load manga:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (mangaId && chapterId) {
      loadMangaDetails();
    }
  }, [mangaId, chapterId]);

  const nextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      // Go to next chapter if available
      const currentChapterIndex = manga?.chapters.findIndex(ch => ch.id === chapterId);
      if (currentChapterIndex !== -1 && currentChapterIndex < manga.chapters.length - 1) {
        const nextChapter = manga.chapters[currentChapterIndex + 1];
        navigate(`/manga/${mangaId}/read/${nextChapter.id}`);
      }
    }
  }, [currentPage, pages.length, manga, chapterId, mangaId, navigate]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    } else {
      // Go to previous chapter if available
      const currentChapterIndex = manga?.chapters.findIndex(ch => ch.id === chapterId);
      if (currentChapterIndex > 0) {
        const prevChapter = manga.chapters[currentChapterIndex - 1];
        navigate(`/manga/${mangaId}/read/${prevChapter.id}`);
      }
    }
  }, [currentPage, manga, chapterId, mangaId, navigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          prevPage();
          break;
        case 'ArrowRight':
        case 'd':
          nextPage();
          break;
        case 'Escape':
          navigate('/manga');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextPage, prevPage, navigate]);

  const goToChapter = (chapter) => {
    navigate(`/manga/${mangaId}/read/${chapter.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 text-purple-500 mx-auto mb-4 animate-pulse text-6xl">📖</div>
          <div className="text-white text-xl">Loading manga...</div>
          <div className="text-gray-400 text-sm mt-2">Please wait while we fetch the pages</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌ Error loading manga</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <button
            onClick={() => navigate('/manga')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Manga
          </button>
        </div>
      </div>
    );
  }

  if (!pages.length) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">No pages found</div>
          <button
            onClick={() => navigate('/manga')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Manga
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/manga')}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold truncate max-w-md">{manga?.title}</h1>
              <p className="text-sm text-gray-400">{currentChapter?.title}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              Page {currentPage + 1} of {pages.length}
            </div>
            
            {/* Chapter selector */}
            <select
              value={chapterId}
              onChange={(e) => {
                const selectedChapter = manga.chapters.find(ch => ch.id === e.target.value);
                if (selectedChapter) goToChapter(selectedChapter);
              }}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm"
            >
              {manga?.chapters.map(chapter => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main reading area */}
      <div className="relative">
        {/* Navigation buttons */}
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextPage}
          disabled={currentPage === pages.length - 1}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Page display */}
        <div className="flex justify-center items-center min-h-screen p-4">
          {pages[currentPage] && (
            <div className="max-w-4xl mx-auto">
              <img
                src={pages[currentPage].img}
                alt={`Page ${currentPage + 1}`}
                className="w-full h-auto max-h-screen object-contain cursor-pointer"
                onClick={nextPage}
                onError={(e) => {
                  e.target.src = 'https://dummyimage.com/800x1200/333333/ffffff.png?text=Page+Not+Available';
                }}
                style={{
                  imageRendering: 'crisp-edges',
                  WebkitImageRendering: 'crisp-edges'
                }}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>

        {/* Page progress indicator */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 rounded-full px-4 py-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
              />
            </div>
            <span className="text-white whitespace-nowrap">
              {currentPage + 1}/{pages.length}
            </span>
          </div>
        </div>
      </div>

      {/* Instructions overlay (shows on first load) */}
      {currentPage === 0 && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 rounded-lg p-4 text-center text-sm text-gray-300 z-50">
          <div className="mb-2">Reading Controls:</div>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <span className="bg-gray-800 px-2 py-1 rounded">←→ Arrow keys</span>
            <span className="bg-gray-800 px-2 py-1 rounded">A/D keys</span>
            <span className="bg-gray-800 px-2 py-1 rounded">Click to advance</span>
            <span className="bg-gray-800 px-2 py-1 rounded">ESC to exit</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MangaReader;
