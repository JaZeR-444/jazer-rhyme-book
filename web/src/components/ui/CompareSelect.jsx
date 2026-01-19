import { useState, useMemo } from 'react';
import { Search, X, Check } from 'lucide-react';
import './CompareSelect.css';

export function CompareSelect({
  words,
  selectedWord,
  onSelect,
  placeholder = "Search words...",
  label = "Select a word"
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredWords = useMemo(() => {
    if (!searchQuery.trim()) {
      return words.slice(0, 20);
    }

    const query = searchQuery.toLowerCase();
    return words.filter(word => {
      const name = word.name.toLowerCase();
      const letter = word.letter.toLowerCase();
      return name.includes(query) || letter.includes(query) ||
             (word.d && word.d.toLowerCase().includes(query));
    }).slice(0, 20);
  }, [words, searchQuery]);

  const handleSelect = (word) => {
    onSelect(word);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    onSelect(null);
    setSearchQuery('');
  };

  return (
    <div className="compare-select">
      <label className="compare-select__label">{label}</label>

      <div className="compare-select__input-wrapper">
        {selectedWord ? (
          <div className="compare-select__selected">
            <span className="compare-select__selected-letter">{selectedWord.letter}</span>
            <span className="compare-select__selected-name">{selectedWord.name}</span>
            <button
              className="compare-select__clear"
              onClick={handleClear}
              aria-label="Clear selection"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            className="compare-select__trigger"
            onClick={() => setIsOpen(true)}
          >
            <Search size={18} className="compare-select__search-icon" />
            <span>{placeholder}</span>
          </button>
        )}
      </div>

      {isOpen && (
        <>
          <div className="compare-select__overlay" onClick={() => setIsOpen(false)} />
          <div className="compare-select__dropdown">
            <div className="compare-select__search">
              <Search size={16} className="compare-select__dropdown-search-icon" />
              <input
                type="text"
                className="compare-select__search-input"
                placeholder="Search words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            <ul className="compare-select__list">
              {filteredWords.length === 0 ? (
                <li className="compare-select__empty">
                  No words found matching "{searchQuery}"
                </li>
              ) : (
                filteredWords.map((word, idx) => (
                  <li key={`${word.name}-${idx}`}>
                    <button
                      className="compare-select__option"
                      onClick={() => handleSelect(word)}
                    >
                      <span className="compare-select__option-letter">{word.letter}</span>
                      <span className="compare-select__option-name">{word.name}</span>
                      {selectedWord && selectedWord.name === word.name && (
                        <Check size={16} className="compare-select__check" />
                      )}
                    </button>
                  </li>
                ))
              )}
            </ul>

            <div className="compare-select__footer">
              <span>{words.length} words available</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
