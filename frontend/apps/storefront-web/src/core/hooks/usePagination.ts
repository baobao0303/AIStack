// Custom usePagination Hook (SPEC_CORE_FE)
import { useState, useCallback } from 'react';

export interface UsePaginationResult {
  pageNumber: number;
  pageSize: number;
  setPageNumber: (page: number) => void;
  setPageSize: (size: number) => void;
  resetPagination: () => void;
  nextPage: () => void;
  prevPage: () => void;
  hasPrevPage: boolean;
  hasNextPage: (totalPages: number) => boolean;
}

/**
 * Hook to manage pagination state and utility helpers
 */
export function usePagination(initialPage = 1, initialSize = 10): UsePaginationResult {
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);

  const resetPagination = useCallback(() => {
    setPageNumber(initialPage);
    setPageSize(initialSize);
  }, [initialPage, initialSize]);

  const nextPage = useCallback(() => {
    setPageNumber((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPageNumber((prev) => Math.max(1, prev - 1));
  }, []);

  const hasPrevPage = pageNumber > 1;

  const hasNextPage = useCallback(
    (totalPages: number) => {
      return pageNumber < totalPages;
    },
    [pageNumber]
  );

  return {
    pageNumber,
    pageSize,
    setPageNumber,
    setPageSize,
    resetPagination,
    nextPage,
    prevPage,
    hasPrevPage,
    hasNextPage,
  };
}

export default usePagination;
