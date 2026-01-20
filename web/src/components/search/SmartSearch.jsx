import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2, TrendingUp, Clock, Hash, Sparkles } from 'lucide-react';
import { useDomains, useDictionaryIndex } from '../../lib/hooks';
import { useWorkspace } from '../../lib/WorkspaceContext';
import { Card, CardBody } from '../ui/Card';
import './SmartSearch.css';

const SmartSearch = ({ onSelect, placeholder = "Search words, domains, entities..." }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ words: [], entities: [], domains: [] });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [allEntities, setAllEntities] = useState([]);
  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const { domains } = useDomains();
  const { words: dictionaryWords } = useDictionaryIndex();
  const { recentSearches, addToRecent } = useWorkspace();

  // Load all entities from knowledge-hub
  useEffect(() => {
    const loadEntities = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data/knowledge-hub.json`);
        if (response.ok) {
          const data = await response.json();
          const entities = [];
          Object.keys(data.domains || {}).forEach(domain => {
            if (Array.isArray(data.domains[domain])) {
              data.domains[domain].forEach(entity => {
                entities.push({
                  ...entity,
                  domain,
                  description: entity.one_liner || ''
                });
              });
            }
          });
          setAllEntities(entities);
        }
      } catch (error) {
        console.warn('Failed to load entities:', error);
      }
    };
    loadEntities();
  }, []);

  // Levenshtein distance for "Did you mean?" suggestions
  const levenshteinDistance = (a, b) => {
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
    
    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[b.length][a.length];
  };

  // Generate smart suggestions
  const generateSuggestions = useCallback((searchQuery, searchResults) => {
    if (!searchQuery || searchQuery.length < 3) return [];
    
    const allTerms = [
      ...(dictionaryWords || []),
      ...(domains || []),
      ...(allEntities?.map(e => e.name) || [])
    ];
    
    const hasResults = searchResults.words.length + searchResults.entities.length + searchResults.domains.length > 0;
    
    if (hasResults) return [];
    
    const scored = allTerms
      .map(term => ({
        term,
        distance: levenshteinDistance(searchQuery.toLowerCase(), term.toLowerCase())
      }))
      .filter(item => item.distance <= 3 && item.distance > 0)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
    
    return scored.map(s => s.term);
  }, [dictionaryWords, domains, allEntities]);

  // Perform search
  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults({ words: [], entities: [], domains: [] });
      setSuggestions([]);
      return;
    }

    setLoading(true);
    
    try {
      const lowerQuery = searchQuery.toLowerCase();
      
      // Search words
      const wordResults = (dictionaryWords || [])
        .filter(word => word.toLowerCase().includes(lowerQuery))
        .slice(0, 5)
        .map(word => ({ word, type: 'word' }));
      
      // Search entities
      const entityResults = (allEntities || [])
        .filter(entity => 
          entity.name.toLowerCase().includes(lowerQuery) ||
          entity.description?.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 5)
        .map(entity => ({ ...entity, type: 'entity' }));
      
      // Search domains
      const domainResults = (domains || [])
        .filter(domain => 
          domain.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 3)
        .map(domain => ({ name: domain, id: domain, type: 'domain' }));
      
      const searchResults = {
        words: wordResults,
        entities: entityResults,
        domains: domainResults
      };
      
      setResults(searchResults);
      setSuggestions(generateSuggestions(searchQuery, searchResults));
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [dictionaryWords, allEntities, domains, generateSuggestions]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 150);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, performSearch]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    const totalResults = results.words.length + results.entities.length + results.domains.length;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(totalResults, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + totalResults) % Math.max(totalResults, 1));
    } else if (e.key === 'Enter' && totalResults > 0) {
      e.preventDefault();
      handleSelectResult(getAllResults()[selectedIndex]);
    } else if (e.key === 'Escape') {
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const getAllResults = () => [
    ...results.words,
    ...results.entities,
    ...results.domains
  ];

  const handleSelectResult = (result) => {
    if (!result) return;
    
    addToRecent({
      type: result.type,
      id: result.word || result.id || result.name,
      name: result.word || result.name,
      timestamp: Date.now()
    });
    
    if (onSelect) onSelect(result);
    setQuery('');
    setFocused(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  const clearSearch = () => {
    setQuery('');
    setResults({ words: [], entities: [], domains: [] });
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const totalResults = results.words.length + results.entities.length + results.domains.length;
  const showResults = focused && (query.length > 0 || recentSearches?.length > 0);

  return (
    <div className="smart-search">
      <div className="smart-search__input-wrapper">
        <Search className="smart-search__icon" size={20} />
        <input
          ref={inputRef}
          type="text"
          className="smart-search__input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          aria-label="Smart search"
        />
        {loading && <Loader2 className="smart-search__loader" size={18} />}
        {query && !loading && (
          <button
            className="smart-search__clear"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {showResults && (
        <Card className="smart-search__results" glass glassVariant="heavy">
          <CardBody>
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="smart-search__suggestions">
                <div className="smart-search__section-header">
                  <Sparkles size={14} />
                  <span>Did you mean?</span>
                </div>
                <div className="smart-search__suggestion-list">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      className="smart-search__suggestion"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {!query && recentSearches?.length > 0 && (
              <div className="smart-search__recent">
                <div className="smart-search__section-header">
                  <Clock size={14} />
                  <span>Recent</span>
                </div>
                <div className="smart-search__result-list">
                  {recentSearches.slice(0, 5).map((item, idx) => (
                    <button
                      key={idx}
                      className="smart-search__result-item"
                      onClick={() => handleSelectResult(item)}
                    >
                      <div className="smart-search__result-icon">
                        {item.type === 'word' && <Hash size={16} />}
                        {item.type === 'entity' && <TrendingUp size={16} />}
                      </div>
                      <span className="smart-search__result-name">{item.name}</span>
                      <span className="smart-search__result-type">{item.type}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {query && totalResults > 0 && (
              <>
                {/* Words */}
                {results.words.length > 0 && (
                  <div className="smart-search__category">
                    <div className="smart-search__section-header">
                      <Hash size={14} />
                      <span>Words ({results.words.length})</span>
                    </div>
                    <div className="smart-search__result-list">
                      {results.words.map((result, idx) => (
                        <button
                          key={idx}
                          className={`smart-search__result-item ${
                            selectedIndex === idx ? 'smart-search__result-item--selected' : ''
                          }`}
                          onClick={() => handleSelectResult(result)}
                        >
                          <div className="smart-search__result-icon smart-search__result-icon--word">
                            <Hash size={16} />
                          </div>
                          <div className="smart-search__result-content">
                            <span className="smart-search__result-name">{result.word}</span>
                            {result.syllables && (
                              <span className="smart-search__result-meta">
                                {result.syllables.join('·')}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Entities */}
                {results.entities.length > 0 && (
                  <div className="smart-search__category">
                    <div className="smart-search__section-header">
                      <TrendingUp size={14} />
                      <span>Entities ({results.entities.length})</span>
                    </div>
                    <div className="smart-search__result-list">
                      {results.entities.map((result, idx) => {
                        const globalIdx = results.words.length + idx;
                        return (
                          <button
                            key={idx}
                            className={`smart-search__result-item ${
                              selectedIndex === globalIdx ? 'smart-search__result-item--selected' : ''
                            }`}
                            onClick={() => handleSelectResult(result)}
                          >
                            <div className="smart-search__result-icon smart-search__result-icon--entity">
                              <TrendingUp size={16} />
                            </div>
                            <div className="smart-search__result-content">
                              <span className="smart-search__result-name">{result.name}</span>
                              {result.description && (
                                <span className="smart-search__result-meta">
                                  {result.description.slice(0, 60)}...
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Domains */}
                {results.domains.length > 0 && (
                  <div className="smart-search__category">
                    <div className="smart-search__section-header">
                      <Sparkles size={14} />
                      <span>Domains ({results.domains.length})</span>
                    </div>
                    <div className="smart-search__result-list">
                      {results.domains.map((result, idx) => {
                        const globalIdx = results.words.length + results.entities.length + idx;
                        return (
                          <button
                            key={idx}
                            className={`smart-search__result-item ${
                              selectedIndex === globalIdx ? 'smart-search__result-item--selected' : ''
                            }`}
                            onClick={() => handleSelectResult(result)}
                          >
                            <div className="smart-search__result-icon smart-search__result-icon--domain">
                              <Sparkles size={16} />
                            </div>
                            <div className="smart-search__result-content">
                              <span className="smart-search__result-name">{result.name}</span>
                              {result.description && (
                                <span className="smart-search__result-meta">
                                  {result.description.slice(0, 60)}...
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Empty State */}
            {query && totalResults === 0 && suggestions.length === 0 && !loading && (
              <div className="smart-search__empty">
                <Search size={32} className="smart-search__empty-icon" />
                <p>No results found for "{query}"</p>
                <p className="smart-search__empty-hint">Try different keywords or check spelling</p>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default SmartSearch;
