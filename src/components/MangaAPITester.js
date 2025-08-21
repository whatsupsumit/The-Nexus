import React, { useState } from 'react';
import { testMangaAPIConnectivity, searchMangaForReading, getMangaDetailsForReading, getMangaChapterPages } from '../utils/mangaReadingApi';

const MangaAPITester = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [mangaDetails, setMangaDetails] = useState(null);
  const [chapterPages, setChapterPages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const runAPITest = async () => {
    setLoading(true);
    setCurrentStep(1);
    
    try {
      console.log('🧪 Starting comprehensive manga API test...');
      
      // Step 1: Test connectivity
      const connectivity = await testMangaAPIConnectivity();
      setTestResults(connectivity);
      setCurrentStep(2);
      
      // Step 2: Search for manga
      const searchData = await searchMangaForReading('demon slayer');
      setSearchResults(searchData);
      setCurrentStep(3);
      
      if (searchData.length > 0) {
        const firstManga = searchData[0];
        setCurrentStep(4);
        
        // Step 3: Get manga details
        const details = await getMangaDetailsForReading(firstManga.id);
        setMangaDetails(details);
        setCurrentStep(5);
        
        // Step 4: Get chapter pages (if chapters exist)
        if (details.chapters && details.chapters.length > 0) {
          const firstChapter = details.chapters[0];
          const pages = await getMangaChapterPages(firstChapter.id);
          setChapterPages(pages);
          setCurrentStep(6);
        }
      }
      
      console.log('✅ API test completed!');
      
    } catch (error) {
      console.error('❌ API test failed:', error);
      setTestResults({ working: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">🧪 Manga Reading API Test</h2>
      
      <div className="mb-6 text-center">
        <button
          onClick={runAPITest}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {loading ? '🔄 Testing...' : '🚀 Run Full API Test'}
        </button>
      </div>

      {/* Progress Steps */}
      {loading && (
        <div className="mb-6">
          <div className="flex justify-center space-x-4 mb-4">
            {[1, 2, 3, 4, 5, 6].map(step => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step < currentStep ? 'bg-green-500' :
                  step === currentStep ? 'bg-purple-500 animate-pulse' :
                  'bg-gray-600'
                }`}
              >
                {step < currentStep ? '✓' : step}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-400">
            Step {currentStep}: {
              currentStep === 1 ? 'Testing connectivity...' :
              currentStep === 2 ? 'Searching manga...' :
              currentStep === 3 ? 'Found search results...' :
              currentStep === 4 ? 'Getting manga details...' :
              currentStep === 5 ? 'Loading chapter list...' :
              'Getting chapter pages...'
            }
          </div>
        </div>
      )}

      {/* Test Results */}
      {testResults && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">📊 API Connectivity Test</h3>
          <div className={`text-sm ${testResults.working ? 'text-green-400' : 'text-red-400'}`}>
            Status: {testResults.working ? '✅ Working' : '❌ Failed'}
          </div>
          <div className="text-sm text-gray-300">
            Source: {testResults.source}
          </div>
          {testResults.error && (
            <div className="text-sm text-red-400 mt-2">
              Error: {testResults.error}
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">🔍 Search Results ({searchResults.length} found)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.slice(0, 4).map(manga => (
              <div key={manga.id} className="bg-gray-700 p-3 rounded">
                <div className="font-semibold">{manga.title}</div>
                <div className="text-sm text-gray-400">ID: {manga.id}</div>
                {manga.altTitles && manga.altTitles.length > 0 && (
                  <div className="text-xs text-gray-500">
                    Alt: {manga.altTitles.slice(0, 2).join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manga Details */}
      {mangaDetails && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">📖 Manga Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-semibold">{mangaDetails.title}</div>
              <div className="text-sm text-gray-400">Status: {mangaDetails.status}</div>
              {mangaDetails.genres && (
                <div className="text-sm text-gray-400">
                  Genres: {mangaDetails.genres.slice(0, 3).join(', ')}
                </div>
              )}
            </div>
            <div>
              <div className="text-sm text-gray-300">
                Chapters: {mangaDetails.chapters ? mangaDetails.chapters.length : 'Unknown'}
              </div>
              {mangaDetails.description && (
                <div className="text-xs text-gray-500 mt-2 line-clamp-3">
                  {mangaDetails.description.substring(0, 150)}...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chapter Pages */}
      {chapterPages.length > 0 && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">📄 Chapter Pages ({chapterPages.length} pages)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {chapterPages.slice(0, 8).map(page => (
              <div key={page.page} className="bg-gray-700 p-3 rounded text-center">
                <div className="text-sm font-semibold">Page {page.page}</div>
                <img
                  src={page.img}
                  alt={`Page ${page.page}`}
                  className="w-full h-24 object-cover rounded mt-2"
                  onError={(e) => {
                    e.target.src = 'https://dummyimage.com/100x150/333333/ffffff.png?text=Page+' + page.page;
                  }}
                />
              </div>
            ))}
          </div>
          {chapterPages.length > 8 && (
            <div className="text-center text-gray-400 text-sm mt-4">
              ...and {chapterPages.length - 8} more pages
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {!loading && testResults && (
        <div className="p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">📋 Test Summary</h3>
          <div className="space-y-2 text-sm">
            <div>✅ API Connectivity: {testResults.working ? 'Working' : 'Failed'}</div>
            <div>✅ Search Function: {searchResults.length > 0 ? 'Working' : 'Failed'}</div>
            <div>✅ Details Function: {mangaDetails ? 'Working' : 'Failed'}</div>
            <div>✅ Chapter Pages: {chapterPages.length > 0 ? 'Working' : 'Failed'}</div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-700 rounded">
            <div className="font-semibold text-yellow-400">⚠️ Analysis:</div>
            <div className="text-sm text-gray-300 mt-1">
              {testResults.working
                ? "The Consumet API is working! You can integrate manga reading functionality."
                : "The Consumet API appears to be down, but the system gracefully falls back to mock data for demonstration purposes. The infrastructure is ready for when the API comes back online."
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MangaAPITester;
