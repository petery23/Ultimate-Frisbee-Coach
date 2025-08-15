import { useCallback, useRef } from 'react';
import { router } from 'expo-router';

/**
 * Custom hook to prevent double-tap navigation issues
 * Returns a debounced navigation function that prevents rapid successive calls
 */
export function useNavigationDebounce(delay: number = 500) {
  const lastNavigationTime = useRef<number>(0);
  const isNavigating = useRef<boolean>(false);

  const debouncedPush = useCallback((href: any) => {
    const now = Date.now();
    
    // Prevent navigation if we're already navigating or if it's too soon since last navigation
    if (isNavigating.current || (now - lastNavigationTime.current) < delay) {
      return;
    }

    isNavigating.current = true;
    lastNavigationTime.current = now;

    // Navigate
    router.push(href);

    // Reset navigation flag after a timeout
    setTimeout(() => {
      isNavigating.current = false;
    }, delay);
  }, [delay]);

  const debouncedReplace = useCallback((href: any) => {
    const now = Date.now();
    
    // Prevent navigation if we're already navigating or if it's too soon since last navigation
    if (isNavigating.current || (now - lastNavigationTime.current) < delay) {
      return;
    }

    isNavigating.current = true;
    lastNavigationTime.current = now;

    // Navigate
    router.replace(href);

    // Reset navigation flag after a timeout
    setTimeout(() => {
      isNavigating.current = false;
    }, delay);
  }, [delay]);

  return {
    push: debouncedPush,
    replace: debouncedReplace,
    isNavigating: isNavigating.current,
  };
}
