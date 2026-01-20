import { Search, TrendingUp, Sparkles, Lightbulb } from 'lucide-react';
import './EmptyState.css';

/**
 * EmptyState - Helpful state when no search results
 */
export function EmptyState({ query, onSuggestionClick }) {
  const trending = ['fire', 'love', 'flow', 'dream', 'night'];
  const tips = [
    'Try using synonyms or related words',
    'Check your spelling',
    'Use fewer or different keywords',
    'Search for specific entities or domains'
  ];

  return (
    <div className="empty-state">
      <div className="empty-state__icon">
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
            <Lightbulb size={18} />
            <span>Search Tips</span>
          </div>
          <ul className="empty-state__tips">
            {tips.map((tip, index) => (
              <li key={index} className="empty-state__tip">{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Trending Searches */}
      <div className="empty-state__section">
        <div className="empty-state__section-header">
          <TrendingUp size={18} />
          <span>Trending Searches</span>
        </div>
        <div className="empty-state__trending">
          {trending.map((term, index) => (
            <button
              key={index}
              className="empty-state__trend"
              onClick={() => onSuggestionClick?.(term)}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Random Exploration */}
      <div className="empty-state__section">
        <div className="empty-state__section-header">
          <Sparkles size={18} />
          <span>Explore</span>
        </div>
        <button
          className="empty-state__random"
          onClick={() => {
            const randomWord = trending[Math.floor(Math.random() * trending.length)];
            onSuggestionClick?.(randomWord);
          }}
        >
          🎲 Surprise Me
        </button>
      </div>
    </div>
  );
}
