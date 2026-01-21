import { createContext, useContext, useState, useEffect } from 'react';

const SearchHistoryContext = createContext();

const MAX_HISTORY_ITEMS = 50;
const MAX_TRENDING_ITEMS = 10;

export function SearchHistoryProvider({ children }) {
  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem('jazer_search_history');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (err) {
        console.error('Failed to parse search history:', err);
        return [];
      }
    }
    return [];
  });

  const [searchCounts, setSearchCounts] = useState(() => {
    const stored = localStorage.getItem('jazer_search_counts');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (err) {
        console.error('Failed to parse search counts:', err);
        return {};
      }
    }
    return {};
  });

  // Persist history to localStorage
  useEffect(() => {
    localStorage.setItem('jazer_search_history', JSON.stringify(history));
  }, [history]);

  // Persist search counts to localStorage
  useEffect(() => {
    localStorage.setItem('jazer_search_counts', JSON.stringify(searchCounts));
  }, [searchCounts]);

  const addToHistory = (query) => {
    if (!query || !query.trim()) return;

    const normalizedQuery = query.trim();
    const timestamp = Date.now();

    // Update search counts for trending
    setSearchCounts(prev => ({
      ...prev,
      [normalizedQuery]: (prev[normalizedQuery] || 0) + 1
    }));

    setHistory(prev => {
      // Remove existing entry if it exists
      const filtered = prev.filter(item => item.query !== normalizedQuery);

      // Add to the beginning
      const newHistory = [
        { query: normalizedQuery, timestamp },
        ...filtered
      ];

      // Keep only MAX_HISTORY_ITEMS
      return newHistory.slice(0, MAX_HISTORY_ITEMS);
    });
  };

  const removeFromHistory = (query) => {
    setHistory(prev => prev.filter(item => item.query !== query));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const clearSearchCounts = () => {
    setSearchCounts({});
  };

  const getTrendingSearches = () => {
    // Get searches sorted by count
    const sorted = Object.entries(searchCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_TRENDING_ITEMS)
      .map(([query, count]) => ({ query, count }));

    return sorted;
  };

  const getRecentSearches = (limit = 10) => {
    return history.slice(0, limit);
  };

  const value = {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getTrendingSearches,
    getRecentSearches,
    clearSearchCounts,
  };

  return (
    <SearchHistoryContext.Provider value={value}>
      {children}
    </SearchHistoryContext.Provider>
  );
}

export function useSearchHistory() {
  const context = useContext(SearchHistoryContext);
  if (!context) {
    throw new Error('useSearchHistory must be used within SearchHistoryProvider');
  }
  return context;
}
