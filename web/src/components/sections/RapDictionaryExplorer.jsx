/**
 * RapDictionaryExplorer Component
 * Displays ALL words from Rap Dictionary
 */

import { useState, useMemo } from 'react';
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
  const [activeLetter, setActiveLetter] = useState(null);
  
  const filteredWords = useMemo(() => {
    if (searchQuery) {
      return searchWords(searchQuery, 100);
    }
    if (activeLetter) {
      return letterGroups[activeLetter] || [];
    }
    return getRandomWords(50);
  }, [searchQuery, activeLetter]);
  
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
        Showing {filteredWords.length} words
        {activeLetter && ` starting with ${activeLetter}`}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>
      
      <div className="words-grid">
        {filteredWords.map((entry) => (
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
    </section>
  );
}
