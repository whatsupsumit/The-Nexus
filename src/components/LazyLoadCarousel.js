import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import ContentCarousel from './ContentCarousel';

// This component wraps our ContentCarousel.
// It accepts an `onVisible` function as a prop.
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