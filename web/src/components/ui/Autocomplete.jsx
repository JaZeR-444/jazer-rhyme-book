/**
 * Autocomplete Component
 * Smart search with suggestions, keyboard navigation, and search history
 */
import PropTypes from 'prop-types';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Clock, X } from 'lucide-react';
import './Autocomplete.css';

const STORAGE_KEY = 'jazer-search-history';
const MAX_HISTORY = 5;
const DEBOUNCE_MS = 300;

/**
 * Autocomplete - Smart search with history and keyboard navigation
 *
 * @param {Object} props
 * @param {string} props.value - Current input value
 * @param {function} props.onChange - Change handler for the input
 * @param {function} [props.onSelect] - Called when a result is selected
 * @param {Array<{name:string,letter?:string,d?:string}>} props.searchIndex - Searchable data set
 * @param {string} [props.placeholder] - Input placeholder text
 * @returns {JSX.Element}
 */
export function Autocomplete({
  value,
  onChange,
  onSelect,
  searchIndex = [],
  placeholder = 'Search...'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [searchMode, setSearchMode] = useState('semantic');
  const [debouncedValue, setDebouncedValue] = useState(value);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Load search history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSearchHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading search history:', e);
    }
  }, []);

  // Save search history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory));
    } catch (e) {
      console.error('Error saving search history:', e);
    }
  }, [searchHistory]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [value]);

  // Perform search when debounced value changes
  useEffect(() => {
    if (!debouncedValue || debouncedValue.length < 2) {
      setResults([]);
      return;
    }

    const query = debouncedValue.toLowerCase();
    let searchResults = [];

    if (searchMode === 'exact') {
      searchResults = searchIndex.filter(item =>
        item.name.toLowerCase().includes(query)
      );
    } else {
      // Semantic search: prioritize starts-with, then contains
      const startsWith = searchIndex.filter(item =>
        item.name.toLowerCase().startsWith(query)
      );
      const contains = searchIndex.filter(item =>
        item.name.toLowerCase().includes(query) &&
        !item.name.toLowerCase().startsWith(query)
      );
      searchResults = [...startsWith, ...contains];
    }

    // Add match score
    searchResults = searchResults.map(item => ({
      ...item,
      score: calculateMatchScore(item.name.toLowerCase(), query)
    }));

    setResults(searchResults.slice(0, 8));
  }, [debouncedValue, searchIndex, searchMode]);

  const calculateMatchScore = (itemName, query) => {
    if (itemName === query) return 100;
    if (itemName.startsWith(query)) return 80;
    if (itemName.includes(query)) return 60;
    return 40;
  };

  const addToHistory = useCallback((query) => {
    setSearchHistory(prev => {
      const filtered = prev.filter(h => h !== query);
      return [query, ...filtered].slice(0, MAX_HISTORY);
    });
  }, []);

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const handleSelect = (result) => {
    addToHistory(result.name);
    onSelect?.(result);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && results[highlightedIndex]) {
          handleSelect(results[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;

    return (
      <>
        {text.slice(0, index)}
        <mark className="autocomplete__highlight">
          {text.slice(index, index + query.length)}
        </mark>
        {text.slice(index + query.length)}
      </>
    );
  };

  return (
    <div className="autocomplete" ref={dropdownRef}>
      <div className="autocomplete__input-wrapper">
        <Search className="autocomplete__icon" size={18} />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="autocomplete__input"
        />
        {value && (
          <button
            className="autocomplete__clear"
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Mode Toggle */}
      <div className="autocomplete__mode-toggle">
        <button
          className={`autocomplete__mode-btn ${searchMode === 'exact' ? 'active' : ''}`}
          onClick={() => setSearchMode('exact')}
        >
          Exact
        </button>
        <button
          className={`autocomplete__mode-btn ${searchMode === 'semantic' ? 'active' : ''}`}
          onClick={() => setSearchMode('semantic')}
        >
          Semantic
        </button>
      </div>

      {isOpen && (value || searchHistory.length > 0) && (
        <div className="autocomplete__dropdown glass">
          {/* Search History */}
          {!value && searchHistory.length > 0 && (
            <div className="autocomplete__section">
              <div className="autocomplete__section-header">
                <span>Recent Searches</span>
                <button
                  className="autocomplete__clear-history"
                  onClick={clearHistory}
                >
                  Clear
                </button>
              </div>
              {searchHistory.map((query, idx) => (
                <button
                  key={idx}
                  className="autocomplete__item"
                  onClick={() => {
                    onChange(query);
                    setIsOpen(false);
                  }}
                >
                  <Clock size={14} />
                  <span>{query}</span>
                </button>
              ))}
            </div>
          )}

          {/* Results */}
          {value && results.length > 0 && (
            <div className="autocomplete__section">
              <div className="autocomplete__section-header">
                <span>{results.length} Results</span>
              </div>
              {results.map((result, idx) => (
                <button
                  key={idx}
                  className={`autocomplete__item ${highlightedIndex === idx ? 'highlighted' : ''}`}
                  onClick={() => handleSelect(result)}
                >
                  <span>{highlightMatch(result.name, value)}</span>
                  <div className="autocomplete__match-score">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`autocomplete__score-bar ${i < Math.ceil((result.score / 100) * 5) ? 'filled' : ''}`}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Empty State */}
          {value && results.length === 0 && (
            <div className="autocomplete__empty">
              No results found for "{value}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

Autocomplete.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  searchIndex: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      letter: PropTypes.string,
      d: PropTypes.string
    })
  ),
  placeholder: PropTypes.string
};
