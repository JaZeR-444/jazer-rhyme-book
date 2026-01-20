import { History, X, TrendingUp, Clock } from 'lucide-react';
import { useSearchHistory } from '../../lib/SearchHistoryContext';
import { Card } from '../ui';
import './SearchHistory.css';

export function SearchHistory({ onSelectQuery, showTrending = true }) {
  const {
    getRecentSearches,
    getTrendingSearches,
    removeFromHistory,
    clearHistory,
  } = useSearchHistory();

  const recentSearches = getRecentSearches(10);
  const trendingSearches = showTrending ? getTrendingSearches() : [];

  const handleQueryClick = (query) => {
    if (onSelectQuery) {
      onSelectQuery(query);
    }
  };

  const handleRemove = (e, query) => {
    e.stopPropagation();
    removeFromHistory(query);
  };

  const formatTimestamp = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  if (recentSearches.length === 0 && trendingSearches.length === 0) {
    return null;
  }

  return (
    <div className="search-history">
      {recentSearches.length > 0 && (
        <Card className="search-history-section">
          <div className="search-history-header">
            <div className="search-history-title">
              <Clock size={18} />
              <h3>Recent Searches</h3>
            </div>
            <button
              className="search-history-clear"
              onClick={clearHistory}
              title="Clear all history"
            >
              Clear
            </button>
          </div>

          <div className="search-history-list">
            {recentSearches.map((item, idx) => (
              <button
                key={`${item.query}-${idx}`}
                className="search-history-item"
                onClick={() => handleQueryClick(item.query)}
              >
                <History size={14} className="search-history-icon" />
                <span className="search-history-query">{item.query}</span>
                <span className="search-history-time">
                  {formatTimestamp(item.timestamp)}
                </span>
                <button
                  className="search-history-remove"
                  onClick={(e) => handleRemove(e, item.query)}
                  title="Remove from history"
                >
                  <X size={14} />
                </button>
              </button>
            ))}
          </div>
        </Card>
      )}

      {showTrending && trendingSearches.length > 0 && (
        <Card className="search-history-section">
          <div className="search-history-header">
            <div className="search-history-title">
              <TrendingUp size={18} />
              <h3>Trending Searches</h3>
            </div>
          </div>

          <div className="search-history-list">
            {trendingSearches.map((item, idx) => (
              <button
                key={`${item.query}-${idx}`}
                className="search-history-item trending"
                onClick={() => handleQueryClick(item.query)}
              >
                <span className="trending-rank">#{idx + 1}</span>
                <span className="search-history-query">{item.query}</span>
                <span className="trending-count">{item.count} searches</span>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
