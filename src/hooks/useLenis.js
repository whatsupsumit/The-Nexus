import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

const useLenis = () => {
  useEffect(() => {
    // Initialize Lenis with enhanced settings for smooth scrolling
    const lenis = new Lenis({
      duration: 1.8, // Smoother, more fluid
      easing: (t) => 1 - Math.pow(1 - t, 3), // Cubic ease-out for smoother feel
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8, // Slower, more controlled scrolling
      touchMultiplier: 1.5,
      infinite: false,
      syncTouch: true, // Better touch synchronization
      syncTouchLerp: 0.075, // Smoother touch interpolation
      normalizeWheel: true, // Better cross-platform scrolling
    });

    // Expose lenis instance globally for other components
    window.lenis = lenis;

    // Add scroll event listener for custom animations
    lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
      // Custom scroll effects can be added here
      // console.log({ scroll, limit, velocity, direction, progress });
      
      // Add scroll-triggered fade-in animations
      const fadeElements = document.querySelectorAll('.scroll-fade-in');
      fadeElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        
        if (isVisible) {
          el.classList.add('in-view');
        }
      });
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
            duration: 2,
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Cleanup function
    return () => {
      lenis.destroy();
      window.lenis = null;
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
};

export default useLenis;
