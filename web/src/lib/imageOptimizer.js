/**
 * Image Optimization Utilities
 * Handles lazy loading, responsive images, and WebP support
 */

export const createImageLoader = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            const srcset = img.dataset.srcset;
            
            if (src) img.src = src;
            if (srcset) img.srcset = srcset;
            
            img.classList.remove('lazy');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01,
      }
    );

    document.querySelectorAll('img.lazy').forEach(img => {
      imageObserver.observe(img);
    });

    return imageObserver;
  }
  
  // Fallback for browsers without IntersectionObserver
  document.querySelectorAll('img.lazy').forEach(img => {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    if (src) img.src = src;
    if (srcset) img.srcset = srcset;
    img.classList.remove('lazy');
  });
};

export const getOptimizedImageUrl = (url, width = 800) => {
  if (!url) return '';
  
  // If URL is already optimized or is a data URL, return as-is
  if (url.includes('?') || url.startsWith('data:')) return url;
  
  // Add width parameter for potential CDN optimization
  return `${url}?w=${width}&auto=format,compress`;
};

export const supportsWebP = () => {
  const elem = document.createElement('canvas');
  if (elem.getContext && elem.getContext('2d')) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

export const preloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

export const preloadCriticalImages = (urls) => {
  return Promise.all(urls.map(url => preloadImage(url)));
};
