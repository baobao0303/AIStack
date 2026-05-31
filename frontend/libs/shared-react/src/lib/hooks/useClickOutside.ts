'use client';

import { useEffect } from 'react';

/**
 * Calls `onOutside` when a mousedown/touchstart occurs outside every element
 * whose id is listed in `insideIds`. Only active while `enabled` is true.
 */
export function useClickOutside(
  enabled: boolean,
  insideIds: string[],
  onOutside: () => void
): void {
  useEffect(() => {
    if (!enabled) return;

    function handle(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      const clickedInside = insideIds.some((id) => {
        const el = document.getElementById(id);
        return el?.contains(target);
      });
      if (!clickedInside) {
        onOutside();
      }
    }

    document.addEventListener('mousedown', handle);
    document.addEventListener('touchstart', handle);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('touchstart', handle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, onOutside, ...insideIds]);
}
