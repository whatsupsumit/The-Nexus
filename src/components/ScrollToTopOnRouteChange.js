import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    if (window.lenis) {
      // Use Lenis smooth scroll if available
      window.lenis.scrollTo(0, { duration: 0, immediate: true });
    } else {
      // Fallback to regular scroll
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTopOnRouteChange;
