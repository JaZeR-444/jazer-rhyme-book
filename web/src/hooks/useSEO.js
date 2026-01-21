import { useEffect } from 'react';

export function useSEO({ 
  title, 
  description, 
  image, 
  url, 
  canonicalUrl,
  type = 'website',
  keywords = [],
  author = 'JaZeR Rhyme Book'
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | JaZeR Rhyme Book` : 'JaZeR Rhyme Book - Hip Hop Dictionary & Writing Studio';
    const previousTitle = document.title;
    document.title = fullTitle;
    const effectiveUrl = url || canonicalUrl || window.location.href;

    const managed = [];

    const upsertMeta = (attr, key, content) => {
      const selector = `meta[${attr}="${key}"]`;
      let element = document.querySelector(selector);
      if (!content) {
        if (element && element.getAttribute('data-seo-managed') === 'true') {
          element.remove();
        }
        return;
      }

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
      element.setAttribute('data-seo-managed', 'true');
      managed.push(element);
    };

    upsertMeta('property', 'og:title', title || fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:image', image || '/logo.svg');
    upsertMeta('property', 'og:url', effectiveUrl);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:site_name', 'JaZeR Rhyme Book');

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title || fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image || '/logo.svg');
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'author', author);
    
    if (keywords.length > 0) {
      upsertMeta('name', 'keywords', keywords.join(', '));
    } else {
      upsertMeta('name', 'keywords', null);
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    const shouldManageCanonical = Boolean(canonicalUrl || url);
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', effectiveUrl);
    canonical.setAttribute('data-seo-managed', shouldManageCanonical ? 'true' : 'false');

    return () => {
      document.title = previousTitle;
      managed.forEach((element) => {
        if (element.parentNode && element.getAttribute('data-seo-managed') === 'true') {
          element.parentNode.removeChild(element);
        }
      });

      if (canonical && canonical.getAttribute('data-seo-managed') === 'true') {
        canonical.remove();
      }
    };
  }, [title, description, image, url, canonicalUrl, type, keywords, author]);
}

export function generateStructuredData(type, data) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };
}

export function useStructuredData(type, data, options = {}) {
  useEffect(() => {
    const { id } = options;
    const scriptId = id || `structured-data-${type}`;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(generateStructuredData(type, data));
    script.id = scriptId;
    
    const existing = document.getElementById(scriptId);
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      const element = document.getElementById(scriptId);
      if (element) {
        element.remove();
      }
    };
  }, [type, data, options]);
}
