import { useRef, useEffect } from 'react';
import { prefetchManager } from '../lib/prefetchManager';

export function usePrefetch(url, options = {}) {
  const { trigger = 'hover', enabled = true } = options;
  const elementRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!enabled || !elementRef.current || !url) return;

    const element = elementRef.current;

    if (trigger === 'hover') {
      const handleMouseEnter = () => {
        prefetchManager.prefetchOnHover(url);
      };

      element.addEventListener('mouseenter', handleMouseEnter, { once: true });

      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
      };
    }

    if (trigger === 'visible') {
      if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        prefetchManager.prefetchOnHover(url);
        return;
      }

      observerRef.current = prefetchManager.prefetchOnVisible(element, url);

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }
  }, [url, trigger, enabled]);

  return elementRef;
}

export function usePrefetchMultiple(urls, options = {}) {
  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const uniqueUrls = Array.from(new Set((urls || []).filter(Boolean)));

    uniqueUrls.forEach((url) => {
      prefetchManager.prefetchOnHover(url);
    });
  }, [urls, enabled]);
}
