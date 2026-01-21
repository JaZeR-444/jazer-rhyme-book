/**
 * analyzeDictionarySearch.js
 *
 * Utility function for semantic search analysis in the Dictionary page.
 * Matches user queries against dictionary words and ranks results by relevance.
 */

import { getRhymeScheme } from './rhymeFinder';

/**
 * Analyze user search query and find matching dictionary words
 * @param {string} text - The search query text
 * @param {object} index - The search index containing words array
 * @param {string|null} syllableFilter - Optional filter: '1', '2', or '3+'
 * @returns {array} Sorted array of matching words (max 20)
 */
export function analyzeDictionarySearch(text, index, syllableFilter = null) {
  try {
    if (!text || !index) return [];

    if (!index || !index.words) return [];

    // 1. Tokenize
    const stopWords = new Set(['the', 'and', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'of', 'is', 'are', 'was', 'were', 'it', 'that', 'this', 'force']);
    const tokens = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(t => t.length > 2 && !stopWords.has(t));

    const uniqueTokens = [...new Set(tokens)];
    const results = [];
    const seenIds = new Set();

    index.words.forEach(word => {
      try {
        if (seenIds.has(word.name)) return;
        let score = 0;
        let matchedKeyword = null;

        // Direct name match
        const nameLower = (word.name || '').toLowerCase();
        if (uniqueTokens.includes(nameLower) || nameLower.includes(text.toLowerCase())) {
            score += 10;
            matchedKeyword = 'Direct Match';
        }

        // Definition match
        if (word.d) {
            const defLower = word.d.toLowerCase();
            const matches = uniqueTokens.filter(t => defLower.includes(t));
            if (matches.length > 0) {
                score += matches.length * 3;
                matchedKeyword = matchedKeyword || `Matches: "${matches[0]}"`;
            }
        }

        // Rap Definition match
        if (word.rd) {
            const rdLower = word.rd.toLowerCase();
            const matches = uniqueTokens.filter(t => rdLower.includes(t));
            if (matches.length > 0) {
                score += matches.length * 4;
                matchedKeyword = matchedKeyword || `Matches rap context: "${matches[0]}"`;
            }
        }

        // Synonyms match
        if (word.syn && Array.isArray(word.syn)) {
            word.syn.forEach(syn => {
                if (uniqueTokens.includes(syn.toLowerCase())) {
                    score += 5;
                    matchedKeyword = matchedKeyword || `Synonym: "${syn}"`;
                }
            });
        }

        if (score > 0) {
            // Apply syllable filter if active
            if (syllableFilter) {
                const wordSyllables = word.syllables || getRhymeScheme(word.name).syllables;

                if (syllableFilter === '1' && wordSyllables !== 1) return;
                if (syllableFilter === '2' && wordSyllables !== 2) return;
                if (syllableFilter === '3+' && wordSyllables < 3) return;
            }

            results.push({
                name: word.name,
                link: `/dictionary/${word.letter}/${word.name}`,
                matchedKeyword,
                score,
                notes: word.rd || word.d || ''
            });
            seenIds.add(word.name);
        }
      } catch (innerErr) {
        // Skip problem word
      }
    });

    return results.sort((a, b) => b.score - a.score).slice(0, 20);
  } catch (err) {
    console.error('Search analysis failed:', err);
    return [];
  }
}
