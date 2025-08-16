import React, { useEffect, useRef } from 'react';

const SmoothScrollEnhancer = () => {
  const scrollProgressRef = useRef(null);

  useEffect(() => {
    const updateScrollProgress = () => {
      if (scrollProgressRef.current) {
        const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
        const scrollCurrent = window.pageYOffset;
        const scrollProgress = (scrollCurrent / scrollTotal) * 100;
        
        scrollProgressRef.current.style.width = `${scrollProgress}%`;
      }
    };

    // Add scroll progress indicator
    window.addEventListener('scroll', updateScrollProgress);
    
    // Add custom scroll momentum effects
    let scrollTimeout;
    const handleScrollEnd = () => {
      document.body.classList.remove('is-scrolling');
    };

    const handleScroll = () => {
      document.body.classList.add('is-scrolling');
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollEnd, 150);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('scroll', handleScroll);
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

      {/* Custom CSS for scroll effects */}
      <style jsx>{`
        .is-scrolling {
          pointer-events: none;
        }
        
        .is-scrolling * {
          transition: transform 0.1s ease-out;
        }
      `}</style>
    </>
  );
};

export default SmoothScrollEnhancer;
