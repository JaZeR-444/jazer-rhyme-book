/**
 * Favorites Context
 * Manages favorited words with localStorage persistence
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FavoritesContext = createContext(null);

const STORAGE_KEY = 'jazer-rhyme-book-favorites';

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading favorites:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch (e) {
        console.error('Error saving favorites:', e);
      }
    }
  }, [favorites, isLoaded]);

  const addFavorite = useCallback((word, letter) => {
    setFavorites(prev => {
      // Check if already exists
      if (prev.some(f => f.word === word && f.letter === letter)) {
        return prev;
      }
      return [...prev, { word, letter, addedAt: Date.now() }];
    });
  }, []);

  const removeFavorite = useCallback((word, letter) => {
    setFavorites(prev => prev.filter(f => !(f.word === word && f.letter === letter)));
  }, []);

  const toggleFavorite = useCallback((word, letter) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.word === word && f.letter === letter);
      if (exists) {
        return prev.filter(f => !(f.word === word && f.letter === letter));
      }
      return [...prev, { word, letter, addedAt: Date.now() }];
    });
  }, []);

  const isFavorite = useCallback((word, letter) => {
    return favorites.some(f => f.word === word && f.letter === letter);
  }, [favorites]);

  const getFavoritesForLetter = useCallback((letter) => {
    return favorites.filter(f => f.letter === letter);
  }, [favorites]);

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavoritesForLetter,
    favoritesCount: favorites.length,
    isLoaded
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
