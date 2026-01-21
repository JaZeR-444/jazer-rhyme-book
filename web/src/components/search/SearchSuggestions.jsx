import { Lightbulb, Clock, TrendingUp, Sparkles } from 'lucide-react';
import './SearchSuggestions.css';

/**
 * SearchSuggestions - Smart suggestions and corrections
 */
export function SearchSuggestions({ 
  query, 
  suggestions = {},
  onSelectSuggestion
}) {
  const { corrections = [], related = [], popular = [], recent = [] } = suggestions;

  const hasAnySuggestions = corrections.length > 0 || 
                            related.length > 0 || 
                            popular.length > 0 || 
                            recent.length > 0;

  if (!hasAnySuggestions) return null;

  return (
    <div className="search-suggestions">
      {/* Did You Mean? */}
      {corrections.length > 0 && (
        <div className="search-suggestions__section">
          <div className="search-suggestions__header">
            <Lightbulb size={16} />
            <span>Did you mean?</span>
          </div>
          <div className="search-suggestions__list">
            {corrections.map((correction, index) => (
              <button
                key={index}
                className="search-suggestion search-suggestion--correction"
                onClick={() => onSelectSuggestion?.(correction)}
              >
                {correction}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Related Searches */}
      {related.length > 0 && (
        <div className="search-suggestions__section">
          <div className="search-suggestions__header">
            <Sparkles size={16} />
            <span>Related</span>
          </div>
          <div className="search-suggestions__list">
            {related.map((term, index) => (
              <button
                key={index}
                className="search-suggestion search-suggestion--related"
                onClick={() => onSelectSuggestion?.(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Searches */}
      {popular.length > 0 && (
        <div className="search-suggestions__section">
          <div className="search-suggestions__header">
            <TrendingUp size={16} />
            <span>Popular</span>
          </div>
          <div className="search-suggestions__list">
            {popular.map((term, index) => (
              <button
                key={index}
                className="search-suggestion search-suggestion--popular"
                onClick={() => onSelectSuggestion?.(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {recent.length > 0 && (
        <div className="search-suggestions__section">
          <div className="search-suggestions__header">
            <Clock size={16} />
            <span>Recent</span>
          </div>
          <div className="search-suggestions__list">
            {recent.map((term, index) => (
              <button
                key={index}
                className="search-suggestion search-suggestion--recent"
                onClick={() => onSelectSuggestion?.(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Helper: Calculate Levenshtein distance for typo detection
 * Optimized with early termination and dictionary limits
 */
export function getDidYouMean(query, dictionary, maxResults = 3) {
  if (!query || query.length < 2) return [];
  if (!dictionary || dictionary.length === 0) return [];

  const maxDistance = Math.floor(query.length / 3); // Allow 1 typo per 3 chars
  const suggestions = [];
  const queryLower = query.toLowerCase();
  
  // Limit dictionary size for performance
  const limitedDict = dictionary.slice(0, 5000);

  for (const word of limitedDict) {
    const wordLower = word.toLowerCase();
    
    // Skip if too different in length
    if (Math.abs(wordLower.length - queryLower.length) > maxDistance * 2) {
      continue;
    }
    
    const distance = levenshteinDistance(queryLower, wordLower);
    if (distance > 0 && distance <= maxDistance) {
      suggestions.push({ word, distance });
      
      // Early exit if we have enough good suggestions
      if (suggestions.length >= maxResults * 3) break;
    }
  }

  // Sort by distance and return top results
  return suggestions
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxResults)
    .map(s => s.word);
}

function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}
