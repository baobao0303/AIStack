'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { ViewType } from '@tiem-nha-zit/shared';
import { useAppStore } from '../store/app.store';

/**
 * Custom hook to prefetch Next.js routes on hover.
 * Returns a callback that can be bound to `onMouseEnter` on custom navigation buttons.
 */
export function usePrefetchOnHover() {
  const router = useRouter();

  const prefetchView = useCallback(
    (view: ViewType) => {
      let path = '';
      if (view === 'home') {
        path = '/';
      } else if (view === 'login') {
        path = '/sign-in';
      } else if (view === 'catalog') {
        path = '/product';
      } else if (view === 'detail') {
        const selectedProduct = useAppStore.getState().selectedProduct;
        path = `/product/${selectedProduct?.id || 'prod-5'}`;
      } else {
        path = `/${view}`;
      }

      if (path) {
        router.prefetch(path);
      }
    },
    [router]
  );

  const prefetchRoute = useCallback(
    (route: string) => {
      if (route) {
        router.prefetch(route);
      }
    },
    [router]
  );

  return { prefetchView, prefetchRoute };
}
