// Custom useLoading Hook (SPEC_CORE_FE)
import { useState, useCallback } from 'react';

export interface UseLoadingResult {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(promise: Promise<T>) => Promise<T>;
}

/**
 * Custom hook to encapsulate loading toggle patterns
 */
export function useLoading(initialState = false): UseLoadingResult {
  const [loading, setLoading] = useState(initialState);

  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);

  const withLoading = useCallback(async <T>(promise: Promise<T>): Promise<T> => {
    setLoading(true);
    try {
      return await promise;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    startLoading,
    stopLoading,
    withLoading,
  };
}

export default useLoading;
