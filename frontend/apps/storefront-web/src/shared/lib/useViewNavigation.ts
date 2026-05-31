'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ViewType } from '../model/types';

import { useAppStore } from '../../core/stores/app.store';

/**
 * Maps the legacy `ViewType` tab names to App Router paths and returns a stable
 * navigation callback. Centralizes the route mapping that was previously
 * duplicated inline in every route page.
 */
export function useViewNavigation(): (view: ViewType) => void {
  const router = useRouter();

  return useCallback(
    (view: ViewType) => {
      if (view === 'home') {
        router.push('/');
      } else if (view === 'login') {
        router.push('/sign-in');
      } else if (view === 'catalog') {
        router.push('/product');
      } else if (view === 'detail') {
        const selectedProduct = useAppStore.getState().selectedProduct;
        router.push(`/product/${selectedProduct?.id || 'prod-5'}`);
      } else {
        router.push(`/${view}`);
      }
    },
    [router]
  );
}
