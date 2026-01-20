import { useEffect } from 'react';

export function useSEO({ 
  title, 
  description, 
  image, 
  url, 
  type = 'website',
  keywords = [],
  author = 'JaZeR Rhyme Book'
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | JaZeR Rhyme Book` : 'JaZeR Rhyme Book - Hip Hop Dictionary & Writing Studio';
    document.title = fullTitle;

    const updateMeta = (property, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const updateMetaName = (name, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('og:title', title || fullTitle);
    updateMeta('og:description', description);
    updateMeta('og:image', image || '/logo.svg');
    updateMeta('og:url', url || window.location.href);
    updateMeta('og:type', type);
    updateMeta('og:site_name', 'JaZeR Rhyme Book');

    updateMetaName('twitter:card', 'summary_large_image');
    updateMetaName('twitter:title', title || fullTitle);
    updateMetaName('twitter:description', description);
    updateMetaName('twitter:image', image || '/logo.svg');
    updateMetaName('description', description);
    updateMetaName('author', author);
    
    if (keywords.length > 0) {
      updateMetaName('keywords', keywords.join(', '));
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url || window.location.href);

    return () => {
      document.title = 'JaZeR Rhyme Book';
    };
  }, [title, description, image, url, type, keywords, author]);
}

export function generateStructuredData(type, data) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };
}

export function useStructuredData(type, data) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(generateStructuredData(type, data));
    script.id = 'structured-data';
    
    const existing = document.getElementById('structured-data');
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      const element = document.getElementById('structured-data');
      if (element) {
        element.remove();
      }
    };
  }, [type, data]);
}
