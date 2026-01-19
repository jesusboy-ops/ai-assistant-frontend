import { useEffect } from 'react';

/**
 * Custom hook to scroll to top when component mounts
 * Useful for page navigation to ensure pages start at the top
 */
const useScrollToTop = () => {
  useEffect(() => {
    // Scroll to top immediately when component mounts
    window.scrollTo(0, 0);
    
    // Also scroll to top after a small delay to handle any layout shifts
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);
};

export default useScrollToTop;