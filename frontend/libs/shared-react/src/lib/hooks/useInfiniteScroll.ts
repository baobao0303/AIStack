// Custom useInfiniteScroll Hook (SPEC_CORE_FE)
import { useEffect, useRef, useCallback } from 'react';

export interface UseInfiniteScrollProps {
  loading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
}

/**
 * Hook to trigger callback when intersection element enters viewport
 */
export function useInfiniteScroll({
  loading,
  hasNextPage,
  onLoadMore,
  rootMargin = '100px',
}: UseInfiniteScrollProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // DOM element node callback ref
  const containerRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            onLoadMore();
          }
        },
        { rootMargin }
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [loading, hasNextPage, onLoadMore, rootMargin]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { containerRef };
}

export default useInfiniteScroll;
