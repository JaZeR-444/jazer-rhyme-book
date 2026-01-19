/**
 * Filter Context
 * Manages dictionary filter preferences with localStorage persistence
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FilterContext = createContext(null);

const STORAGE_KEY = 'jazer-dictionary-filters';

const DEFAULT_FILTERS = {
  syllableRange: [1, 8],
  lengthRange: [1, 20],
  partsOfSpeech: [],
  tags: [],
  hasRhymes: false,
  hasExamples: false,
  complexity: 'All'
};

export function FilterProvider({ children }) {
  const [filters, setFiltersState] = useState(DEFAULT_FILTERS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load filters from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all keys exist
        setFiltersState({ ...DEFAULT_FILTERS, ...parsed });
      }
    } catch (e) {
      console.error('Error loading filters:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever filters change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
      } catch (e) {
        console.error('Error saving filters:', e);
      }
    }
  }, [filters, isLoaded]);

  const setFilters = useCallback((newFilters) => {
    setFiltersState(newFilters);
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const updateFilter = useCallback((key, value) => {
    setFiltersState(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const isDefaultFilters = useCallback(() => {
    return JSON.stringify(filters) === JSON.stringify(DEFAULT_FILTERS);
  }, [filters]);

  const value = {
    filters,
    setFilters,
    resetFilters,
    updateFilter,
    isDefaultFilters,
    defaultFilters: DEFAULT_FILTERS,
    isLoaded
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
