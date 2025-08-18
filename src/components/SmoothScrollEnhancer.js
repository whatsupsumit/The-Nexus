import React, { useEffect, useRef } from 'react';

const SmoothScrollEnhancer = () => {
  const scrollProgressRef = useRef(null);

  useEffect(() => {
    let animationFrameId = null;
    
    // Inject CSS styles into the document head
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      .is-scrolling {
        pointer-events: none;
      }
      
      /* Optimized hover transitions for better performance */
      .movie-card,
      .content-item {
        transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
        will-change: transform;
      }
      
      .movie-card:hover,
      .content-item:hover {
        transform: scale(1.05);
        box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
      }
      
      /* Prevent hover effects during scrolling for better performance */
      .is-scrolling .movie-card:hover,
      .is-scrolling .content-item:hover {
        transform: none !important;
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    const updateScrollProgress = () => {
      if (scrollProgressRef.current) {
        const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
        const scrollCurrent = window.pageYOffset;
        const scrollProgress = (scrollCurrent / scrollTotal) * 100;
        
        scrollProgressRef.current.style.width = `${scrollProgress}%`;
      }
    };

    // Throttled scroll handler for better performance
    const handleScroll = () => {
      if (animationFrameId) return;
      
      animationFrameId = requestAnimationFrame(() => {
        updateScrollProgress();
        animationFrameId = null;
      });
    };

    // Simplified scroll state management
    let scrollTimeout;
    const handleScrollState = () => {
      document.body.classList.add('is-scrolling');
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
      }, 100); // Reduced timeout for faster response
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScrollState, { passive: true });

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScrollState);
      // Clean up the style element
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, []);

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black/20 z-50 backdrop-blur-sm">
        <div
          ref={scrollProgressRef}
          className="h-full bg-gradient-to-r from-red-500 via-red-400 to-red-600 transition-all duration-300 ease-out shadow-lg shadow-red-500/50"
          style={{ width: '0%' }}
        />
      </div>
    </>
  );
};

export default SmoothScrollEnhancer;
