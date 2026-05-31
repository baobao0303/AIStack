// Custom useDebounce Hook (SPEC_CORE_FE)
import { useState, useEffect } from 'react';

/**
 * Return a debounced value that only updates after delay time has elapsed since the last update.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
