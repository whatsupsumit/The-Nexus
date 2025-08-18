import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

const useLenis = () => {
  useEffect(() => {
    // Initialize Lenis with optimized settings for better performance
    const lenis = new Lenis({
      duration: 0.8, // Faster, more responsive scrolling
      easing: (t) => 1 - Math.pow(1 - t, 2), // Quadratic ease-out for snappier feel
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.2, // Faster, more responsive scrolling
      touchMultiplier: 1.8,
      infinite: false,
      syncTouch: true,
      syncTouchLerp: 0.1, // Faster touch response
      normalizeWheel: true,
    });

    // Expose lenis instance globally for other components
    window.lenis = lenis;

    // Optimized scroll event listener - throttled for better performance
    let scrollThrottle = null;
    lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
      // Throttle scroll effects to improve performance
      if (scrollThrottle) return;
      
      scrollThrottle = setTimeout(() => {
        // Add scroll-triggered fade-in animations (optimized)
        const fadeElements = document.querySelectorAll('.scroll-fade-in:not(.in-view)');
        fadeElements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
          
          if (isVisible) {
            el.classList.add('in-view');
          }
        });
        
        scrollThrottle = null;
      }, 16); // ~60fps throttling for smooth performance
    });

    // RAF loop for Lenis
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Add smooth anchor linking
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        e.preventDefault();
        const id = target.getAttribute('href').slice(1);
        const element = document.getElementById(id);
        if (element) {
          lenis.scrollTo(element, {
            offset: -100, // Account for fixed headers
            duration: 1.2, // Faster anchor scrolling
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Cleanup function
    return () => {
      if (scrollThrottle) clearTimeout(scrollThrottle);
      lenis.destroy();
      window.lenis = null;
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
};

export default useLenis;
