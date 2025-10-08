import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Hook to automatically scroll to top when route changes
 * This fixes the issue where users stay at the bottom of the page
 * when navigating to a new page
 */
export const useScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // Use 'auto' for instant scroll, 'smooth' for animated
    });
  }, [pathname]);
};

export default useScrollToTop;

