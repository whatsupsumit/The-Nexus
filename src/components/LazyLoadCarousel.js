// React aur useEffect hook
import React, { useEffect } from 'react';
// Intersection Observer hook - carousel visible hone par detect karne ke liye
import { useInView } from 'react-intersection-observer';
// ContentCarousel component - actual carousel display karne ke liye
import ContentCarousel from './ContentCarousel';

// LazyLoadCarousel component - ContentCarousel ko wrap karta hai
// Jab carousel screen mein visible ho tab hi data fetch karta hai (performance optimization)
const LazyLoadCarousel = ({ onVisible, ...props }) => {
    
  // `triggerOnce: true` means it will only run this logic the first time it becomes visible.
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1, 
    rootMargin: '100px 0px', 
  });

  useEffect(() => {
    // When `inView` becomes true, we call the onVisible function
    // which triggers the data fetch in Browse.js.
    if (inView && onVisible) {
      onVisible();
    }
  }, [inView, onVisible]);

  return (
    <div ref={ref}>
      <ContentCarousel {...props} />
    </div>
  );
};

export default LazyLoadCarousel;