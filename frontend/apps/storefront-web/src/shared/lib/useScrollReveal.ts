'use client';

import { useEffect } from 'react';

/**
 * Reveals elements tagged with `.reveal-on-scroll` by adding `visibleClassName`
 * when they enter the viewport. Re-runs whenever any of `deps` change.
 */
export function useScrollReveal(visibleClassName: string, deps: unknown[] = []): void {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(visibleClassName);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    // Reveal elements already in view on mount (observer only fires on change).
    const timeoutId = window.setTimeout(() => {
      elements.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add(visibleClassName);
        }
      });
    }, 100);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
