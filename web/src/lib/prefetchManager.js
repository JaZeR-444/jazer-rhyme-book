/**
 * Prefetch Manager
 * Intelligently prefetches resources based on user behavior
 */

class PrefetchManager {
  constructor() {
    this.prefetchQueue = new Set();
    this.prefetched = new Set();
    this.observerOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.01,
    };
    this.maxPrefetchSize = 50; // Limit concurrent prefetches
  }

  // Prefetch on hover (desktop)
  prefetchOnHover(url) {
    if (this.prefetched.has(url) || this.prefetched.size >= this.maxPrefetchSize) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';
    
    link.onload = () => {
      this.prefetched.add(url);
    };

    link.onerror = () => {
      console.warn('Failed to prefetch:', url);
    };

    document.head.appendChild(link);
  }

  // Prefetch on visible (mobile)
  prefetchOnVisible(element, url) {
    if (!element || this.prefetched.has(url)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.prefetchOnHover(url);
          observer.disconnect();
        }
      });
    }, this.observerOptions);

    observer.observe(element);
    return observer;
  }

  // Predict next page based on current page
  predictNext(currentPath) {
    const predictions = {
      '/': ['/dictionary', '/domains', '/studio'],
      '/dictionary': ['/dictionary/a', '/dictionary/b', '/dictionary/c'],
      '/domains': ['/domains/music', '/domains/sports', '/domains/slang'],
    };

    // Handle dictionary letters
    if (currentPath.startsWith('/dictionary/')) {
      const letter = currentPath.split('/')[2];
      if (letter && letter.length === 1) {
        const charCode = letter.charCodeAt(0);
        const nextLetter = String.fromCharCode(charCode + 1);
        const prevLetter = String.fromCharCode(charCode - 1);
        
        this.prefetchOnHover(`#/dictionary/${nextLetter}`);
        this.prefetchOnHover(`#/dictionary/${prevLetter}`);
      }
    }

    const urls = predictions[currentPath] || [];
    urls.forEach((url) => {
      // Convert to hash URL if needed
      const hashUrl = url.startsWith('#') ? url : `#${url}`;
      this.prefetchOnHover(hashUrl);
    });
  }

  // Prefetch based on user behavior patterns
  prefetchBehavioral(userHistory) {
    // Simple Markov chain prediction
    if (userHistory.length < 2) return;

    const lastPage = userHistory[userHistory.length - 1];
    const transitions = this.calculateTransitions(userHistory);
    const nextPages = transitions[lastPage] || [];

    nextPages.slice(0, 3).forEach((page) => {
      this.prefetchOnHover(`#${page}`);
    });
  }

  // Calculate transition probabilities
  calculateTransitions(history) {
    const transitions = {};

    for (let i = 0; i < history.length - 1; i++) {
      const current = history[i];
      const next = history[i + 1];

      if (!transitions[current]) {
        transitions[current] = [];
      }
      transitions[current].push(next);
    }

    return transitions;
  }

  // Clear prefetched cache
  clearCache() {
    this.prefetched.clear();
    
    // Remove prefetch links
    const prefetchLinks = document.querySelectorAll('link[rel="prefetch"]');
    prefetchLinks.forEach((link) => link.remove());
  }

  // Get prefetch statistics
  getStats() {
    return {
      prefetched: this.prefetched.size,
      queued: this.prefetchQueue.size,
      maxSize: this.maxPrefetchSize,
    };
  }
}

export const prefetchManager = new PrefetchManager();

// Auto-initialize predictions on route changes
if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    const path = window.location.hash.slice(1);
    prefetchManager.predictNext(path);
  });
}
