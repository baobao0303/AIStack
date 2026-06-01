import { useState, useEffect } from 'react';

/**
 * Custom React hook to dynamically determine the number of grid columns 
 * based on the window's responsive breakpoints.
 * Resolves Next.js hydration safety with a fallback for SSR.
 */
export function useResponsiveColumns() {
  // Safe SSR default
  const [columns, setColumns] = useState(4);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumns(1); // Mobile
      } else if (width < 1024) {
        setColumns(2); // Tablet
      } else if (width < 1280) {
        setColumns(3); // Small Laptop
      } else {
        setColumns(4); // Large Laptop / Desktop
      }
    };

    // Initialize columns
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return columns;
}
