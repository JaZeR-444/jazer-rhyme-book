/**
 * Browsing History Context
 * Tracks last 20 viewed dictionary words with localStorage persistence
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BrowsingHistoryContext = createContext(null);

const STORAGE_KEY = 'jazer-dictionary-history';
const PAGE_HISTORY_KEY = 'jazer-page-history';
const MAX_HISTORY_ITEMS = 20;
const MAX_PAGE_HISTORY_ITEMS = 15;

export function BrowsingHistoryProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [pageHistory, setPageHistory] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
      const pageStored = localStorage.getItem(PAGE_HISTORY_KEY);
      if (pageStored) {
        setPageHistory(JSON.parse(pageStored));
      }
    } catch (e) {
      console.error('Error loading browsing history:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (e) {
        console.error('Error saving browsing history:', e);
      }
    }
  }, [history, isLoaded]);

  // Save page history to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(PAGE_HISTORY_KEY, JSON.stringify(pageHistory));
      } catch (e) {
        console.error('Error saving page history:', e);
      }
    }
  }, [pageHistory, isLoaded]);

  const addToHistory = useCallback((word, letter) => {
    setHistory(prev => {
      // Remove existing entry for this word if it exists
      const filtered = prev.filter(h => !(h.word === word && h.letter === letter));

      // Add new entry at the beginning
      const newEntry = {
        word,
        letter,
        viewedAt: Date.now(),
        url: `/dictionary/${letter}/${word}`
      };

      // Keep only the most recent MAX_HISTORY_ITEMS
      const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY_ITEMS);

      return updated;
    });
  }, []);

  const getRecentWords = useCallback((limit = 10) => {
    return history.slice(0, limit);
  }, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const getHistoryForLetter = useCallback((letter) => {
    return history.filter(h => h.letter === letter);
  }, [history]);

  const addToPageHistory = useCallback((path, label, icon = null) => {
    setPageHistory(prev => {
      const filtered = prev.filter(h => h.path !== path);
      const newEntry = {
        path,
        label,
        icon,
        viewedAt: Date.now()
      };
      return [newEntry, ...filtered].slice(0, MAX_PAGE_HISTORY_ITEMS);
    });
  }, []);

  const getRecentPages = useCallback((limit = 10) => {
    return pageHistory.slice(0, limit);
  }, [pageHistory]);

  const clearPageHistory = useCallback(() => {
    setPageHistory([]);
  }, []);

  const value = {
    history,
    addToHistory,
    getRecentWords,
    clearHistory,
    getHistoryForLetter,
    historyCount: history.length,
    isLoaded,
    pageHistory,
    addToPageHistory,
    getRecentPages,
    clearPageHistory,
    pageHistoryCount: pageHistory.length
  };

  return (
    <BrowsingHistoryContext.Provider value={value}>
      {children}
    </BrowsingHistoryContext.Provider>
  );
}

export function useBrowsingHistory() {
  const context = useContext(BrowsingHistoryContext);
  if (!context) {
    throw new Error('useBrowsingHistory must be used within a BrowsingHistoryProvider');
  }
  return context;
}
