// React aur hooks - UI, state aur optimized functions ke liye
import React, { useEffect, useState, useCallback } from "react";
// React Router - page navigation ke liye
import { useNavigate } from "react-router-dom";
// TMDB API functions - movies aur TV shows fetch karne ke liye (cached versions use kar rahe for performance)
import {
  fetchTrendingMoviesCached,
  fetchPopularMoviesCached,
  fetchTrendingTVShowsCached,
  fetchPopularTVShowsCached,
  fetchTopRatedMovies,
  fetchTopRatedTVShows,
  searchMovies,
  searchTVShows,
} from "../utils/vidsrcApi";

// Component imports - carousel components (lazy loading optimization ke saath)
import LazyLoadCarousel from "./LazyLoadCarousel";
import ContentCarousel from "./ContentCarousel";
import VideoPlayer from "./VideoPlayer";
import ContinueWatching from "./ContinueWatching";

// Helper function - content state initialize karta hai (pagination aur loading tracking ke liye)
const createContentState = () => ({
  items: [],
  page: 1,
  hasMore: true,
  loadingMore: false,
  loaded: false,
});

const Browse = () => {
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const [content, setContent] = useState({
    trendingMovies: createContentState(),
    trendingTV: createContentState(),
    popularMovies: createContentState(),
    popularTV: createContentState(),
    topRatedMovies: createContentState(),
    topRatedTV: createContentState(),
  });

  // This state is now only for the overall page skeleton, not individual carousels
  const [initialPageLoad, setInitialPageLoad] = useState(true);

  // Player state
  const [selectedContent, setSelectedContent] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isTV, setIsTV] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // --- MODIFICATION: Load ONLY the very first carousel's data initially ---
  useEffect(() => {
    const loadPriorityContent = async () => {
      try {
        const data = await fetchTrendingMoviesCached(1);
        setContent((prev) => ({
          ...prev,
          trendingMovies: {
            ...prev.trendingMovies,
            items: data.results || [],
            page: 2,
            hasMore: (data.results || []).length > 0,
            loaded: true,
          },
        }));
      } catch (error) {
        console.error("Error loading priority content:", error);
      } finally {
        setInitialPageLoad(false); // The main page is now ready
      }
    };

    loadPriorityContent();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- NEW: Function to load the initial data for a specific category when it becomes visible ---
  const loadInitialDataForCategory = useCallback(
    async (categoryKey) => {
      // Prevent re-fetching if already loaded
      if (content[categoryKey].loaded) return;

      try {
        let data;
        switch (categoryKey) {
          case "trendingTV":
            data = await fetchTrendingTVShowsCached(1);
            break;
          case "popularMovies":
            data = await fetchPopularMoviesCached(1);
            break;
          case "popularTV":
            data = await fetchPopularTVShowsCached(1);
            break;
          case "topRatedMovies":
            data = await fetchTopRatedMovies(1);
            break;
          case "topRatedTV":
            data = await fetchTopRatedTVShows(1);
            break;
          default:
            return;
        }

        setContent((prev) => ({
          ...prev,
          [categoryKey]: {
            ...prev[categoryKey],
            items: data.results || [],
            page: 2,
            hasMore: (data.results || []).length > 0,
            loaded: true,
          },
        }));
      } catch (error) {
        console.error(`Error loading initial data for ${categoryKey}:`, error);
        // Mark as loaded to prevent retrying on error
        setContent((prev) => ({
          ...prev,
          [categoryKey]: { ...prev[categoryKey], loaded: true },
        }));
      }
    },
    [content]
  );

  const loadMoreContent = useCallback(
    async (categoryKey) => {
      const categoryState = content[categoryKey];
      if (!categoryState.hasMore || categoryState.loadingMore) return;

      setContent((prev) => ({
        ...prev,
        [categoryKey]: { ...prev[categoryKey], loadingMore: true },
      }));

      try {
        let data;
        switch (categoryKey) {
          case "trendingMovies":
            data = await fetchTrendingMoviesCached(categoryState.page);
            break;
          case "popularMovies":
            data = await fetchPopularMoviesCached(categoryState.page);
            break;
          case "topRatedMovies":
            data = await fetchTopRatedMovies(categoryState.page);
            break;
          case "trendingTV":
            data = await fetchTrendingTVShowsCached(categoryState.page);
            break;
          case "popularTV":
            data = await fetchPopularTVShowsCached(categoryState.page);
            break;
          case "topRatedTV":
            data = await fetchTopRatedTVShows(categoryState.page);
            break;
          default:
            return;
        }

        const newItems = data.results || [];
        setContent((prev) => ({
          ...prev,
          [categoryKey]: {
            items: [...prev[categoryKey].items, ...newItems],
            page: prev[categoryKey].page + 1,
            hasMore: newItems.length > 0,
            loadingMore: false,
          },
        }));
      } catch (error) {
        console.error(`Error loading more ${categoryKey}:`, error);
        setContent((prev) => ({
          ...prev,
          [categoryKey]: {
            ...prev[categoryKey],
            loadingMore: false,
            hasMore: false,
          },
        }));
      }
    },
    [content]
  );

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        const [movieResults, tvResults] = await Promise.all([
          searchMovies(searchQuery),
          searchTVShows(searchQuery),
        ]);

        const combinedResults = [
          ...(movieResults.results || []).map((item) => ({
            ...item,
            media_type: "movie",
          })),
          ...(tvResults.results || []).map((item) => ({
            ...item,
            media_type: "tv",
          })),
        ];

        setSearchResults(combinedResults);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleContentClick = (content, isTV = null) => {
    const contentIsTV =
      isTV !== null
        ? isTV
        : content.media_type === "tv" || content.first_air_date !== undefined;

    if (contentIsTV) {
      navigate(`/tv/${content.id}`, { state: { movie: content } });
    } else {
      navigate(`/movie/${content.id}`, { state: { movie: content } });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "g") {
        e.preventDefault();
        document.querySelector('input[type="text"]')?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closePlayer = () => {
    setShowPlayer(false);
    setSelectedContent(null);
    setIsTV(false);
  };

  const handleContentSelect = (content, contentIsTV) => {
    setSelectedContent(content);
    setIsTV(contentIsTV);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  if (showPlayer && selectedContent) {
    return (
      <VideoPlayer
        movie={selectedContent}
        isTV={isTV}
        season={selectedContent.startSeason || 1}
        episode={selectedContent.startEpisode || 1}
        onClose={closePlayer}
        onContentSelect={handleContentSelect}
      />
    );
  }

  return (
    <div className="relative min-h-screen text-nexus-text overflow-hidden bg-nexus-gradient">
      {/* ... (background and overlay divs remain unchanged) ... */}
      <div className="fixed inset-0 z-10 opacity-20">
        <div
          className="absolute inset-0 bg-gradient-to-br from-nexus-red/10 via-nexus-black to-nexus-black"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 20, 35, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 20, 35, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>
      <div className="fixed inset-0 z-30 bg-gradient-to-t from-nexus-black via-nexus-black/85 to-nexus-black/95" />

      {/* Main Content */}
      <div
        className={`relative z-40 pt-20 sm:pt-24 md:pt-32 px-4 sm:px-6 md:px-8 transition-all duration-1000 ${
          showAnimation
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }`}
      >
        {/* ... (Hero section and Search bar remain unchanged) ... */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="font-['Arvo',serif] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-nexus-text-light px-4">
            <span className="text-nexus-red">{">"}</span> NEXUS STREAMING
            PLATFORM
          </h1>
          <p className="font-['Arvo',serif] text-base sm:text-lg md:text-xl text-nexus-text-dark mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Discover your next favorite movie or TV show.
          </p>
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search movies, series... (Ctrl+G)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-full bg-nexus-black/70 backdrop-blur-sm border-2 rounded-lg px-4 sm:px-6 py-3 sm:py-4 text-nexus-text-light font-['Arvo',serif] placeholder-nexus-text-dark focus:outline-none transition-all duration-300 text-sm sm:text-base ${
                  isSearchFocused
                    ? "border-nexus-red/60 bg-nexus-black/80"
                    : "border-nexus-red/30"
                }`}
                style={{
                  boxShadow: isSearchFocused
                    ? "0 0 30px rgba(255, 20, 35, 0.2)"
                    : "0 0 20px rgba(255, 20, 35, 0.1)",
                }}
              />
              <button
                type="submit"
                className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-nexus-red hover:bg-nexus-red-light text-nexus-text-light p-2 rounded-lg transition-colors duration-200"
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-nexus-text-light border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                )}
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-10 sm:right-14 top-1/2 transform -translate-y-1/2 text-nexus-text-dark hover:text-nexus-text-light transition-colors"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </form>
          </div>
        </div>

        {/* ... (Search Results section remains unchanged) ... */}
        {searchResults.length > 0 && (
          <div
            className={`relative z-40 px-4 sm:px-6 md:px-8 mb-6 sm:mb-8 transition-all duration-500 ${
              showAnimation
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <ContentCarousel
              title={`Search Results for "${searchQuery}"`}
              content={searchResults}
              onItemClick={handleContentClick}
              isTV={false}
              loading={isSearching}
            />
          </div>
        )}

        {/* --- MODIFICATION: Wrap carousels to lazy load them --- */}
        <div
          className={`relative z-40 px-4 sm:px-6 md:px-8 space-y-6 sm:space-y-8 transition-all duration-1000 ${
            showAnimation
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div>
            <ContinueWatching onMovieClick={handleContentClick} />
          </div>

          {/* This first carousel loads immediately */}
          <div>
            <ContentCarousel
              title="TRENDING MOVIES"
              content={content.trendingMovies.items}
              onItemClick={handleContentClick}
              isTV={false}
              loading={initialPageLoad}
              hasMore={content.trendingMovies.hasMore}
              loadMore={() => loadMoreContent("trendingMovies")}
            />
          </div>

          {/* These carousels will only load when they scroll into view */}
          <LazyLoadCarousel
            title="TRENDING TV SHOWS"
            content={content.trendingTV.items}
            onItemClick={handleContentClick}
            isTV={true}
            loading={!content.trendingTV.loaded}
            hasMore={content.trendingTV.hasMore}
            loadMore={() => loadMoreContent("trendingTV")}
            onVisible={() => loadInitialDataForCategory("trendingTV")}
          />

          <LazyLoadCarousel
            title="POPULAR MOVIES"
            content={content.popularMovies.items}
            onItemClick={handleContentClick}
            isTV={false}
            loading={!content.popularMovies.loaded}
            hasMore={content.popularMovies.hasMore}
            loadMore={() => loadMoreContent("popularMovies")}
            onVisible={() => loadInitialDataForCategory("popularMovies")}
          />

          <LazyLoadCarousel
            title="POPULAR TV SHOWS"
            content={content.popularTV.items}
            onItemClick={handleContentClick}
            isTV={true}
            loading={!content.popularTV.loaded}
            hasMore={content.popularTV.hasMore}
            loadMore={() => loadMoreContent("popularTV")}
            onVisible={() => loadInitialDataForCategory("popularTV")}
          />

          <LazyLoadCarousel
            title="TOP RATED MOVIES"
            content={content.topRatedMovies.items}
            onItemClick={handleContentClick}
            isTV={false}
            loading={!content.topRatedMovies.loaded}
            hasMore={content.topRatedMovies.hasMore}
            loadMore={() => loadMoreContent("topRatedMovies")}
            onVisible={() => loadInitialDataForCategory("topRatedMovies")}
          />

          <LazyLoadCarousel
            title="TOP RATED TV SHOWS"
            content={content.topRatedTV.items}
            onItemClick={handleContentClick}
            isTV={true}
            loading={!content.topRatedTV.loaded}
            hasMore={content.topRatedTV.hasMore}
            loadMore={() => loadMoreContent("topRatedTV")}
            onVisible={() => loadInitialDataForCategory("topRatedTV")}
          />
        </div>

        {/* ... (Footer remains unchanged) ... */}
        <div className="relative z-40 mt-12 sm:mt-16 md:mt-20 text-center pb-12 sm:pb-4 px-4 sm:px-6 md:px-8">
          <div className="font-['Arvo',serif] text-xs sm:text-sm text-nexus-text-dark space-y-2">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>SYSTEM STATUS: ONLINE</span>
              </div>
              <span className="hidden sm:inline text-green-400">●</span>
              <span className="hidden sm:inline">STREAMING: STABLE</span>
              <span className="hidden sm:inline text-nexus-red">●</span>
              <span className="hidden sm:inline">PLATFORM: SYNCHRONIZED</span>
            </div>
            <div className="text-xs text-nexus-grey">
              NEXUS v2.1.0 | Entertainment Platform Active | VidSrc Integration
              Enabled
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-[9999] p-3 rounded-full bg-nexus-red text-nexus-text-light shadow-lg hover:bg-nexus-red-light transition-all duration-300 ${
          showBackToTop
            ? "opacity-100 scale-100"
            : "opacity-0 scale-0 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default Browse;
