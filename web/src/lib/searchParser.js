/**
 * Advanced search query parser
 * Supports:
 * - tag:value - filter by tag
 * - era:value - filter by era
 * - domain:value - filter by domain
 * - syllables:N - filter by syllable count
 * - "exact phrase" - exact match
 * - AND/OR/NOT - boolean operators
 */

export function parseSearchQuery(query) {
  if (!query || typeof query !== 'string') {
    return {
      keywords: [],
      filters: {},
      exactPhrases: [],
      operators: [],
    };
  }

  const result = {
    keywords: [],
    filters: {
      tags: [],
      eras: [],
      domains: [],
      syllables: null,
    },
    exactPhrases: [],
    operators: [], // AND, OR, NOT
  };

  // Extract exact phrases (quoted text)
  const phraseRegex = /"([^"]+)"/g;
  let match;
  let cleanedQuery = query;

  while ((match = phraseRegex.exec(query)) !== null) {
    result.exactPhrases.push(match[1]);
    cleanedQuery = cleanedQuery.replace(match[0], '');
  }

  // Extract filters (key:value)
  const filterRegex = /(tag|era|domain|syllables):([^\s]+)/gi;
  while ((match = filterRegex.exec(cleanedQuery)) !== null) {
    const key = match[1].toLowerCase();
    const value = match[2];

    if (key === 'tag') {
      result.filters.tags.push(value);
    } else if (key === 'era') {
      result.filters.eras.push(value);
    } else if (key === 'domain') {
      result.filters.domains.push(value);
    } else if (key === 'syllables') {
      const syllableCount = parseInt(value);
      if (!isNaN(syllableCount)) {
        result.filters.syllables = syllableCount;
      }
    }

    cleanedQuery = cleanedQuery.replace(match[0], '');
  }

  // Extract operators and remaining keywords
  const tokens = cleanedQuery
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 0);

  for (const token of tokens) {
    const upperToken = token.toUpperCase();
    if (upperToken === 'AND' || upperToken === 'OR' || upperToken === 'NOT') {
      result.operators.push(upperToken);
    } else {
      result.keywords.push(token);
    }
  }

  return result;
}

/**
 * Apply parsed query to filter entities
 */
export function applySearchFilters(entities, parsedQuery) {
  if (!entities || !Array.isArray(entities)) {
    return [];
  }

  return entities.filter(entity => {
    // Apply domain filter
    if (parsedQuery.filters.domains.length > 0) {
      if (!parsedQuery.filters.domains.includes(entity.domain)) {
        return false;
      }
    }

    // Apply tag filter
    if (parsedQuery.filters.tags.length > 0) {
      if (!entity.tags || !parsedQuery.filters.tags.some(tag => entity.tags.includes(tag))) {
        return false;
      }
    }

    // Apply era filter
    if (parsedQuery.filters.eras.length > 0) {
      if (!entity.era || !parsedQuery.filters.eras.includes(entity.era)) {
        return false;
      }
    }

    // Apply keyword matching
    if (parsedQuery.keywords.length > 0) {
      const searchableText = [
        entity.name,
        entity.one_liner,
        entity.aliases?.join(' '),
        entity.tags?.join(' '),
      ].filter(Boolean).join(' ').toLowerCase();

      const hasMatch = parsedQuery.keywords.some(keyword =>
        searchableText.includes(keyword.toLowerCase())
      );

      if (!hasMatch) {
        return false;
      }
    }

    // Apply exact phrase matching
    if (parsedQuery.exactPhrases.length > 0) {
      const searchableText = [
        entity.name,
        entity.one_liner,
        entity.aliases?.join(' '),
      ].filter(Boolean).join(' ').toLowerCase();

      const hasMatch = parsedQuery.exactPhrases.some(phrase =>
        searchableText.includes(phrase.toLowerCase())
      );

      if (!hasMatch) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Apply filters to dictionary words
 */
export function applyWordFilters(words, parsedQuery) {
  if (!words || !Array.isArray(words)) {
    return [];
  }

  return words.filter(word => {
    // Apply syllable filter
    if (parsedQuery.filters.syllables !== null) {
      if (word.syllables !== parsedQuery.filters.syllables) {
        return false;
      }
    }

    // Apply keyword matching
    if (parsedQuery.keywords.length > 0) {
      const searchableText = [
        word.name,
        word.d, // definition
        word.rd, // rap definition
        word.syn?.join(' '), // synonyms
      ].filter(Boolean).join(' ').toLowerCase();

      const hasMatch = parsedQuery.keywords.some(keyword =>
        searchableText.includes(keyword.toLowerCase())
      );

      if (!hasMatch) {
        return false;
      }
    }

    // Apply exact phrase matching
    if (parsedQuery.exactPhrases.length > 0) {
      const searchableText = [
        word.name,
        word.d,
        word.rd,
      ].filter(Boolean).join(' ').toLowerCase();

      const hasMatch = parsedQuery.exactPhrases.some(phrase =>
        searchableText.includes(phrase.toLowerCase())
      );

      if (!hasMatch) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Generate search suggestions based on partial query
 */
export function generateSearchSuggestions(partialQuery, entities, words) {
  const suggestions = [];

  // Detect if user is typing a filter
  const filterMatch = partialQuery.match(/(tag|era|domain|syllables):([^\s]*)/i);
  if (filterMatch) {
    const filterType = filterMatch[1].toLowerCase();
    const partialValue = filterMatch[2].toLowerCase();

    if (filterType === 'tag' && entities) {
      const allTags = new Set();
      entities.forEach(e => {
        if (e.tags) {
          e.tags.forEach(tag => allTags.add(tag));
        }
      });

      Array.from(allTags)
        .filter(tag => tag.toLowerCase().includes(partialValue))
        .slice(0, 5)
        .forEach(tag => {
          suggestions.push({
            type: 'filter',
            value: `tag:${tag}`,
            label: `Filter by tag: ${tag}`,
          });
        });
    } else if (filterType === 'era') {
      const eras = ['1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];
      eras
        .filter(era => era.toLowerCase().includes(partialValue))
        .forEach(era => {
          suggestions.push({
            type: 'filter',
            value: `era:${era}`,
            label: `Filter by era: ${era}`,
          });
        });
    } else if (filterType === 'domain' && entities) {
      const allDomains = new Set(entities.map(e => e.domain).filter(Boolean));
      Array.from(allDomains)
        .filter(domain => domain.toLowerCase().includes(partialValue))
        .slice(0, 5)
        .forEach(domain => {
          suggestions.push({
            type: 'filter',
            value: `domain:${domain}`,
            label: `Filter by domain: ${domain}`,
          });
        });
    } else if (filterType === 'syllables') {
      [1, 2, 3, 4, 5].forEach(num => {
        suggestions.push({
          type: 'filter',
          value: `syllables:${num}`,
          label: `${num} syllable words`,
        });
      });
    }
  }

  return suggestions;
}

/**
 * Build a human-readable description of the search query
 */
export function describeSearchQuery(parsedQuery) {
  const parts = [];

  if (parsedQuery.keywords.length > 0) {
    parts.push(`Keywords: ${parsedQuery.keywords.join(', ')}`);
  }

  if (parsedQuery.exactPhrases.length > 0) {
    parts.push(`Exact: "${parsedQuery.exactPhrases.join('", "')}"`);
  }

  if (parsedQuery.filters.tags.length > 0) {
    parts.push(`Tags: ${parsedQuery.filters.tags.join(', ')}`);
  }

  if (parsedQuery.filters.eras.length > 0) {
    parts.push(`Eras: ${parsedQuery.filters.eras.join(', ')}`);
  }

  if (parsedQuery.filters.domains.length > 0) {
    parts.push(`Domains: ${parsedQuery.filters.domains.join(', ')}`);
  }

  if (parsedQuery.filters.syllables !== null) {
    parts.push(`Syllables: ${parsedQuery.filters.syllables}`);
  }

  return parts.length > 0 ? parts.join(' | ') : 'All results';
}
