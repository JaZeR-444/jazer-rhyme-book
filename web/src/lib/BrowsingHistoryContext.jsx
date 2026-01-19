/**
 * Browsing History Context
 * Tracks last 20 viewed dictionary words with localStorage persistence
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BrowsingHistoryContext = createContext(null);

const STORAGE_KEY = 'jazer-dictionary-history';
const MAX_HISTORY_ITEMS = 20;

export function BrowsingHistoryProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
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

  const value = {
    history,
    addToHistory,
    getRecentWords,
    clearHistory,
    getHistoryForLetter,
    historyCount: history.length,
    isLoaded
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
