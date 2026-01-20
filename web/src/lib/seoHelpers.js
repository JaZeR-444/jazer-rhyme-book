/**
 * SEO Helper Utilities
 * Dynamic meta tags, structured data, and Open Graph integration
 */

/**
 * Update document meta tags dynamically
 */
export const updateMetaTags = ({
  title,
  description,
  keywords,
  author,
  image,
  url,
  type = 'website',
  twitterCard = 'summary_large_image',
  canonical
}) => {
  // Update title
  if (title) {
    document.title = title;
    updateOrCreateMeta('og:title', title);
    updateOrCreateMeta('twitter:title', title);
  }

  // Update description
  if (description) {
    updateOrCreateMeta('description', description);
    updateOrCreateMeta('og:description', description);
    updateOrCreateMeta('twitter:description', description);
  }

  // Update keywords
  if (keywords) {
    updateOrCreateMeta('keywords', keywords);
  }

  // Update author
  if (author) {
    updateOrCreateMeta('author', author);
  }

  // Update image
  if (image) {
    updateOrCreateMeta('og:image', image);
    updateOrCreateMeta('twitter:image', image);
  }

  // Update URL
  if (url) {
    updateOrCreateMeta('og:url', url);
    updateOrCreateMeta('twitter:url', url);
  }

  // Update type
  updateOrCreateMeta('og:type', type);
  updateOrCreateMeta('twitter:card', twitterCard);

  // Update canonical URL
  if (canonical) {
    updateCanonicalLink(canonical);
  }
};

/**
 * Update or create meta tag
 */
const updateOrCreateMeta = (name, content) => {
  // Check if it's an Open Graph or Twitter tag
  const attribute = name.startsWith('og:') || name.startsWith('twitter:') 
    ? 'property' 
    : 'name';

  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

/**
 * Update canonical link
 */
const updateCanonicalLink = (href) => {
  let link = document.querySelector('link[rel="canonical"]');
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  
  link.setAttribute('href', href);
};

/**
 * Generate structured data (JSON-LD)
 */
export const generateStructuredData = (type, data) => {
  switch (type) {
    case 'Website':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: data.name,
        url: data.url,
        description: data.description,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${data.url}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      };
    
    case 'Article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.headline,
        description: data.description,
        image: data.image,
        datePublished: data.datePublished,
        dateModified: data.dateModified,
        author: {
          '@type': 'Person',
          name: data.author
        },
        publisher: {
          '@type': 'Organization',
          name: data.publisherName,
          logo: {
            '@type': 'ImageObject',
            url: data.publisherLogo
          }
        }
      };
    
    case 'BreadcrumbList':
      if (!data.items || !Array.isArray(data.items)) return null;
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      };
    
    case 'FAQPage':
      if (!data.questions || !Array.isArray(data.questions)) return null;
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.questions.map(q => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.answer
          }
        }))
      };

    case 'CreativeWork':
      return {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: data.name,
        description: data.description,
        creator: {
          '@type': 'Person',
          name: data.creator
        },
        keywords: data.keywords,
        inLanguage: 'en'
      };
      
    default:
      return null;
  }
};

/**
 * Inject structured data into page
 */
export const injectStructuredData = (type, data) => {
  const schema = generateStructuredData(type, data);
  if (!schema) return;

  // Remove existing schema of same type
  const existingSchema = document.querySelector(`script[type="application/ld+json"][data-schema="${type}"]`);
  if (existingSchema) {
    existingSchema.remove();
  }

  // Create new schema script
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-schema', type);
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};

/**
 * Generate meta tags for dictionary word pages
 */
export const generateWordPageMeta = (word, rhymes = [], syllables = 0) => {
  const title = `${word} - Rhymes, Syllables & More | JaZeR Rhyme Book`;
  const description = `Explore "${word}" with ${rhymes.length} rhyming words, ${syllables} syllables, and comprehensive lyrical analysis. Perfect for rappers, poets, and songwriters.`;
  const url = `${window.location.origin}/dictionary/word/${encodeURIComponent(word)}`;
  
  return {
    title,
    description,
    keywords: `${word}, rhymes, syllables, rap dictionary, hip hop, lyrics, ${rhymes.slice(0, 10).join(', ')}`,
    url,
    canonical: url,
    type: 'article',
    image: `${window.location.origin}/og-image-word.png`
  };
};

/**
 * Generate meta tags for domain pages
 */
export const generateDomainPageMeta = (domain, entityCount = 0) => {
  const title = `${domain} - Hip Hop Encyclopedia | JaZeR Rhyme Book`;
  const description = `Discover ${entityCount} artists, albums, and cultural references in ${domain}. Comprehensive hip hop knowledge base for lyricists.`;
  const url = `${window.location.origin}/domains/${encodeURIComponent(domain)}`;
  
  return {
    title,
    description,
    keywords: `${domain}, hip hop, rap, artists, albums, culture, encyclopedia`,
    url,
    canonical: url,
    type: 'website'
  };
};

/**
 * Generate sitemap data (for static generation)
 */
export const generateSitemapUrls = (pages) => {
  return pages.map(page => ({
    loc: `${window.location.origin}${page.path}`,
    lastmod: page.lastModified || new Date().toISOString().split('T')[0],
    changefreq: page.changefreq || 'weekly',
    priority: page.priority || 0.5
  }));
};

/**
 * Generate robots.txt content
 */
export const generateRobotsTxt = (sitemapUrl) => {
  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: ${sitemapUrl}`;
};

/**
 * Preconnect to external resources for faster loading
 */
export const setupPreconnect = (domains) => {
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

/**
 * Setup DNS prefetch for external resources
 */
export const setupDNSPrefetch = (domains) => {
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
};

/**
 * Default meta tags for the application
 */
export const DEFAULT_META = {
  title: 'JaZeR Rhyme Book - Advanced Rhyme Dictionary & Writing Studio',
  description: 'Professional rhyme dictionary, hip hop encyclopedia, and writing studio for rappers, poets, and songwriters. Explore 10,000+ words, beats, and cultural references.',
  keywords: 'rhyme dictionary, rap dictionary, hip hop, lyrics, songwriting, beats, poetry, wordplay, freestyle',
  author: 'JaZeR',
  image: '/og-image.png',
  url: window.location.origin,
  type: 'website',
  twitterCard: 'summary_large_image'
};

/**
 * Initialize SEO defaults on app load
 */
export const initializeSEO = () => {
  updateMetaTags(DEFAULT_META);
  
  // Setup preconnect for CDNs
  setupPreconnect([
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ]);

  // Inject website schema
  injectStructuredData('Website', {
    name: 'JaZeR Rhyme Book',
    url: window.location.origin,
    description: DEFAULT_META.description
  });
};
