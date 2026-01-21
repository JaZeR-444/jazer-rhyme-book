/**
 * Entity Likes Context
 * Manages liked entities with localStorage persistence
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const EntityLikesContext = createContext(null);

const STORAGE_KEY = 'jazer-rhyme-book-entity-likes';

export function EntityLikesProvider({ children }) {
  const [likes, setLikes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load likes from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLikes(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading entity likes:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever likes change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(likes));
      } catch (e) {
        console.error('Error saving entity likes:', e);
      }
    }
  }, [likes, isLoaded]);

  const addLike = useCallback((entityId, domain) => {
    setLikes(prev => {
      if (prev.some(l => l.entityId === entityId && l.domain === domain)) {
        return prev;
      }
      return [...prev, { entityId, domain, addedAt: Date.now() }];
    });
  }, []);

  const removeLike = useCallback((entityId, domain) => {
    setLikes(prev => prev.filter(l => !(l.entityId === entityId && l.domain === domain)));
  }, []);

  const toggleLike = useCallback((entityId, domain) => {
    setLikes(prev => {
      const exists = prev.some(l => l.entityId === entityId && l.domain === domain);
      if (exists) {
        return prev.filter(l => !(l.entityId === entityId && l.domain === domain));
      }
      return [...prev, { entityId, domain, addedAt: Date.now() }];
    });
  }, []);

  const isLiked = useCallback((entityId, domain) => {
    return likes.some(l => l.entityId === entityId && l.domain === domain);
  }, [likes]);

  const getLikesForDomain = useCallback((domain) => {
    return likes.filter(l => l.domain === domain);
  }, [likes]);

  const value = {
    likes,
    addLike,
    removeLike,
    toggleLike,
    isLiked,
    getLikesForDomain,
    likesCount: likes.length,
    isLoaded
  };

  return (
    <EntityLikesContext.Provider value={value}>
      {children}
    </EntityLikesContext.Provider>
  );
}

export function useEntityLikes() {
  const context = useContext(EntityLikesContext);
  if (!context) {
    throw new Error('useEntityLikes must be used within an EntityLikesProvider');
  }
  return context;
}
