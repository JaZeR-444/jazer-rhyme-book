import { Search, TrendingUp, Sparkles, Lightbulb } from 'lucide-react';
import { useSearchHistory } from '../../contexts/SearchHistoryContext';
import './EmptyState.css';

/**
 * EmptyState - Helpful state when no search results
 */
export function EmptyState({ query, onSuggestionClick }) {
  const { getTrendingSearches } = useSearchHistory();
  
  // Get real trending searches or fallback to defaults
  const trendingSearches = getTrendingSearches(5);
  const trending = trendingSearches.length > 0 
    ? trendingSearches.map(item => item.query)
    : ['fire', 'love', 'flow', 'dream', 'night'];
    
  const tips = [
    'Try using synonyms or related words',
    'Check your spelling',
    'Use fewer or different keywords',
    'Search for specific entities or domains'
  ];

  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="empty-state__icon" aria-hidden="true">
        <Search size={48} />
      </div>

      <h3 className="empty-state__title">
        {query ? `No results for "${query}"` : 'Start Searching'}
      </h3>

      <p className="empty-state__description">
        {query 
          ? "We couldn't find what you're looking for. Try these suggestions:"
          : "Search for words, entities, or domains to get started"
        }
      </p>

      {/* Search Tips */}
      {query && (
        <div className="empty-state__section">
          <div className="empty-state__section-header">
            <Lightbulb size={18} aria-hidden="true" />
            <span>Search Tips</span>
          </div>
          <ul className="empty-state__tips">
            {tips.map((tip, index) => (
              <li key={`tip-${index}`} className="empty-state__tip">{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Trending Searches */}
      <div className="empty-state__section">
        <div className="empty-state__section-header">
          <TrendingUp size={18} aria-hidden="true" />
          <span>{trendingSearches.length > 0 ? 'Trending Searches' : 'Popular Searches'}</span>
        </div>
        <div className="empty-state__trending" role="group" aria-label="Suggested search terms">
          {trending.map((term, index) => (
            <button
              key={`trend-${term}-${index}`}
              className="empty-state__trend"
              onClick={() => onSuggestionClick?.(term)}
              aria-label={`Search for ${term}`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Random Exploration */}
      <div className="empty-state__section">
        <div className="empty-state__section-header">
          <Sparkles size={18} aria-hidden="true" />
          <span>Explore</span>
        </div>
        <button
          className="empty-state__random"
          onClick={() => {
            const randomWord = trending[Math.floor(Math.random() * trending.length)];
            onSuggestionClick?.(randomWord);
          }}
          aria-label="Search for a random term"
        >
          🎲 Surprise Me
        </button>
      </div>
    </div>
  );
}
