/**
 * RapDictionaryExplorer Component
 * Displays ALL words from Rap Dictionary
 */

import { useEffect, useMemo, useState } from 'react';
import { 
  words, 
  letterGroups, 
  letters, 
  totalWords, 
  searchWords,
  getRandomWords 
} from '../../lib/data/rapDictionary';
import './RapDictionaryExplorer.css';

export function RapDictionaryExplorer({ id }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState(null);
  const [visibleCount, setVisibleCount] = useState(50);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setVisibleCount(50);
  }, [debouncedQuery, activeLetter]);
  
  const filteredWords = useMemo(() => {
    if (debouncedQuery) {
      return searchWords(debouncedQuery, 200);
    }
    if (activeLetter) {
      return letterGroups[activeLetter] || [];
    }
    return getRandomWords(50);
  }, [debouncedQuery, activeLetter]);

  const visibleWords = filteredWords.slice(0, visibleCount);
  const hasMore = filteredWords.length > visibleCount;
  
  return (
    <section id={id} className="dictionary-explorer section">
      <header className="dictionary-header">
        <h2 className="text-h1">Rap Dictionary</h2>
        <p className="text-secondary">
          {totalWords.toLocaleString()} words across {letters.length} letters
        </p>
      </header>
      
      <div className="dictionary-search">
        <input
          type="text"
          placeholder="Search words..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="letter-filters">
        <button
          className={`letter-btn ${activeLetter === null ? 'active' : ''}`}
          onClick={() => setActiveLetter(null)}
        >
          All
        </button>
        {letters.map((letter) => (
          <button
            key={letter}
            className={`letter-btn ${activeLetter === letter ? 'active' : ''}`}
            onClick={() => setActiveLetter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>
      
      <p className="results-count text-small text-secondary">
        Showing {Math.min(visibleWords.length, filteredWords.length)} of {filteredWords.length} words
        {activeLetter && ` starting with ${activeLetter}`}
        {debouncedQuery && ` matching "${debouncedQuery}"`}
      </p>
      
      <div className="words-grid">
        {visibleWords.map((entry) => (
          <article key={entry.id} className="word-card glass">
            <header className="word-header">
              <h3 className="word-title">{entry.word}</h3>
              {entry.partOfSpeech && (
                <span className="word-pos text-micro">{entry.partOfSpeech}</span>
              )}
            </header>
            
            {entry.definition && (
              <p className="word-definition text-small">{entry.definition}</p>
            )}
          </article>
        ))}
      </div>

      {filteredWords.length === 0 && (
        <div className="dictionary-empty text-small text-secondary">
          No words match your filters.
        </div>
      )}

      {hasMore && (
        <div className="dictionary-results-footer">
          <button
            type="button"
            className="dictionary-show-more"
            onClick={() => setVisibleCount((count) => count + 50)}
          >
            Show more
          </button>
        </div>
      )}
    </section>
  );
}
