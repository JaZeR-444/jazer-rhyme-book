import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Search, X, Loader } from 'lucide-react';
import './SmartSearchInput.css';

/**
 * SmartSearchInput - Debounced search input with loading states
 */
export function SmartSearchInput({
  onSearch,
  onClear,
  placeholder = "Search words, entities, domains...",
  debounceMs = 300,
  autoFocus = false,
  initialValue = ''
}) {
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Debounced search
  const debouncedSearch = useCallback((searchValue) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Show loading
    setIsLoading(true);

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      onSearch?.(searchValue);
      setIsLoading(false);
    }, debounceMs);
  }, [onSearch, debounceMs]);

  // Handle input change
  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    if (newValue.trim().length > 0) {
      debouncedSearch(newValue);
    } else {
      // Clear immediately if empty
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      setIsLoading(false);
      onClear?.();
    }
  };

  // Handle clear
  const handleClear = () => {
    setValue('');
    setIsLoading(false);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    onClear?.();
    inputRef.current?.focus();
  };

  // Keyboard shortcuts (scoped to component when mounted)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle shortcuts when input is not already focused
      // This prevents conflicts with CommandPalette
      if (!isFocused && (e.ctrlKey || e.metaKey) && e.key === 'k') {
        // Check if target is not already an input element
        const isInputElement = e.target instanceof HTMLInputElement || 
                              e.target instanceof HTMLTextAreaElement;
        if (!isInputElement && inputRef.current) {
          e.preventDefault();
          inputRef.current.focus();
        }
      }
      
      // Escape to clear (only when focused)
      if (e.key === 'Escape' && isFocused) {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused]);

  // Auto-focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={`smart-search-input ${isFocused ? 'smart-search-input--focused' : ''}`}>
      <div className="smart-search-input__icon">
        {isLoading ? (
          <Loader className="smart-search-input__loader" size={20} />
        ) : (
          <Search size={20} />
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        className="smart-search-input__field"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-label="Search"
        autoComplete="off"
        spellCheck="false"
      />

      {value && (
        <button
          className="smart-search-input__clear"
          onClick={handleClear}
          aria-label="Clear search"
          type="button"
        >
          <X size={18} />
        </button>
      )}

      {!isFocused && (
        <div className="smart-search-input__hint">
          <kbd>Ctrl</kbd> + <kbd>K</kbd>
        </div>
      )}
    </div>
  );
}

// Custom hook for managing search state
export function useSmartSearch(searchFn, options = {}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setResults(null);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const searchResults = await searchFn(searchQuery);
      setResults(searchResults);
      setQuery(searchQuery);
    } catch (err) {
      setError(err.message || 'Search failed');
      setResults(null);
    } finally {
      setIsSearching(false);
    }
  }, [searchFn]);

  const handleClear = useCallback(() => {
    setQuery('');
    setResults(null);
    setError(null);
  }, []);

  return {
    query,
    results,
    isSearching,
    error,
    handleSearch,
    handleClear
  };
}
