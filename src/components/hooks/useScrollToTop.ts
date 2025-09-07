import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to automatically scroll to top when route changes
 * This fixes the issue where users stay at the bottom of the page
 * when navigating to a new page
 */
export const useScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when location changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // Use 'auto' for instant scroll, 'smooth' for animated
    });
  }, [location.pathname]);
};

export default useScrollToTop;

