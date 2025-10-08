import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

const useLenis = () => {
  useEffect(() => {

    if (typeof window === 'undefined' || typeof document === 'undefined') return

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let lenis = null;
    let rafId = null;
    
    // Initialize Lenis with optimized settings for better performance
    if (!prefersReducedMotion) {
    lenis = new Lenis({
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

    const loop = (time) => {
       lenis.raf(time)
        rafId = requestAnimationFrame(loop);
      }
      rafId = requestAnimationFrame(loop);
    } else {
      window.lenis = null;
    }
    
    const fadeEls = Array.from(document.querySelectorAll('.scroll-fade-in:not(.in-view)'));
    let io = null;
    let ticking = false;
    let usingWindowScrollFallback = false;
    let scheduleCheckRef = null;
    
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view')
              observer.unobserve(entry.target) // stop observing once applied
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -10% 0px',
          threshold: 0,
        }
      );
      fadeEls.forEach((el) => io.observe(el));
    } else {
      const checkVisibility = () => {
        const vh = window.innerHeight
        for (let i = 0; i < fadeEls.length; i++) {
          const el = fadeEls[i]
          if (el.classList.contains('in-view')) continue
          const rect = el.getBoundingClientRect()
          const isVisible = rect.top < vh * 0.9 && rect.bottom > 0
          if (isVisible) el.classList.add('in-view')
        }
        ticking = false;
      };

      const scheduleCheck = () => {
        if (!ticking) {
          ticking = true
          requestAnimationFrame(checkVisibility)
        }
      };

      scheduleCheckRef = scheduleCheck;
      
      if (lenis) {
        lenis.on('scroll', scheduleCheck);
      } else {
        usingWindowScrollFallback = true;
        window.addEventListener('scroll', scheduleCheck, { passive: true });
      }

      scheduleCheck();
    }
    
    // Add smooth anchor linking
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (!target) return;
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || target.hasAttribute('download')) {
        return;
      }
      
        const href = target.getAttribute('href');
        if (!href || href === '#') return;
        const id = href.slice(1);
        const el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();

      const offset = -100
      if (lenis) {
        lenis.scrollTo(el, { offset, duration: 1.2 })
      } else {
        const rectTop = el.getBoundingClientRect().top + window.pageYOffset + offset
        window.scrollTo({ top: rectTop, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
      }
    }


    document.addEventListener('click', handleAnchorClick, false)

    // Cleanup function
    return () => {
      document.removeEventListener('click', handleAnchorClick, false)
      
      if (io) {
        io.disconnect()
        io = null
      }
      if (rafId != null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
      if (lenis) {
      lenis.destroy()
      }
      if (usingWindowScrollFallback && scheduleCheckRef) {
        window.removeEventListener('scroll', scheduleCheckRef);
      }
      window.lenis = null;
    };
  }, []);
};

export default useLenis;
