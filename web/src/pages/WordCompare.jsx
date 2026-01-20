import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, GitCompare, Share2, Copy, Check } from 'lucide-react';
import { useDictionaryIndex } from '../lib/hooks';
import { CompareSelect } from '../components/ui/CompareSelect';
import { Card, LoadingState } from '../components/ui';
import { VibeRadarChart } from '../components/discovery';
import './WordCompare.css';

export function WordCompare() {
  const navigate = useNavigate();
  const { words, loading, error } = useDictionaryIndex();
  const [word1, setWord1] = useState(null);
  const [word2, setWord2] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopyComparison = () => {
    if (!word1 || !word2) return;

    const text = `# Word Comparison: ${word1.name} vs ${word2.name}

## ${word1.name}
- **Letter:** ${word1.letter}
- **Syllables:** ${word1.syllables || 'N/A'}
- **Definition:** ${word1.d || 'N/A'}
- **Rap Definition:** ${word1.rd || 'N/A'}
- **Tags:** ${word1.t?.join(', ') || 'None'}

## ${word2.name}
- **Letter:** ${word2.letter}
- **Syllables:** ${word2.syllables || 'N/A'}
- **Definition:** ${word2.d || 'N/A'}
- **Rap Definition:** ${word2.rd || 'N/A'}
- **Tags:** ${word2.t?.join(', ') || 'None'}

---
Compared using JaZeR Rhyme Book`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!word1 || !word2) return;
    const url = `/dictionary/compare?w1=${word1.name}&w2=${word2.name}`;
    navigator.clipboard.writeText(window.location.origin + url);
  };

  if (loading) {
    return <LoadingState message="Loading words..." />;
  }

  if (error) {
    return (
      <div className="word-compare">
        <div className="word-compare__error">
          <p>Error loading words: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="word-compare">
      <div className="word-compare__header">
        <Link to="/dictionary" className="word-compare__back">
          <ArrowLeft size={20} />
          <span>Back to Dictionary</span>
        </Link>
        <h1 className="word-compare__title">
          <GitCompare size={24} />
          Compare Words
        </h1>
      </div>

      <div className="word-compare__selectors">
        <CompareSelect
          words={words}
          selectedWord={word1}
          onSelect={setWord1}
          placeholder="Select first word..."
          label="First Word"
        />
        <div className="word-compare__vs">VS</div>
        <CompareSelect
          words={words}
          selectedWord={word2}
          onSelect={setWord2}
          placeholder="Select second word..."
          label="Second Word"
        />
      </div>

      {word1 && word2 && (
        <>
          <VibeRadarChart word1={word1} word2={word2} />

          <div className="word-compare__actions">
            <button
              className="word-compare__action-btn"
              onClick={handleCopyComparison}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              <span>{copied ? 'Copied!' : 'Copy Comparison'}</span>
            </button>
            <button
              className="word-compare__action-btn"
              onClick={handleShare}
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </div>

          <div className="word-compare__table">
            <div className="compare-table">
              {/* Header Row */}
              <div className="compare-table__row compare-table__header">
                <div className="compare-table__cell compare-table__cell--label"></div>
                <div className="compare-table__cell compare-table__cell--word1">
                  <span className="compare-table__word-letter">{word1.letter}</span>
                  <span className="compare-table__word-name">{word1.name}</span>
                  <Link
                    to={`/dictionary/${word1.letter}/${word1.name.toLowerCase()}`}
                    className="compare-table__view-link"
                  >
                    View
                  </Link>
                </div>
                <div className="compare-table__cell compare-table__cell--word2">
                  <span className="compare-table__word-letter">{word2.letter}</span>
                  <span className="compare-table__word-name">{word2.name}</span>
                  <Link
                    to={`/dictionary/${word2.letter}/${word2.name.toLowerCase()}`}
                    className="compare-table__view-link"
                  >
                    View
                  </Link>
                </div>
              </div>

              {/* Syllables Row */}
              <div className="compare-table__row">
                <div className="compare-table__cell compare-table__cell--label">
                  Syllables
                </div>
                <div className="compare-table__cell compare-table__cell--word1">
                  {word1.syllables || '—'}
                </div>
                <div className="compare-table__cell compare-table__cell--word2">
                  {word2.syllables || '—'}
                </div>
              </div>

              {/* Rhyme Row */}
              <div className="compare-table__row">
                <div className="compare-table__cell compare-table__cell--label">
                  Rhyme
                </div>
                <div className="compare-table__cell compare-table__cell--word1">
                  {word1.rhyme || '—'}
                </div>
                <div className="compare-table__cell compare-table__cell--word2">
                  {word2.rhyme || '—'}
                </div>
              </div>

              {/* Definition Row */}
              <div className="compare-table__row">
                <div className="compare-table__cell compare-table__cell--label">
                  Definition
                </div>
                <div className="compare-table__cell compare-table__cell--word1">
                  {word1.d || '—'}
                </div>
                <div className="compare-table__cell compare-table__cell--word2">
                  {word2.d || '—'}
                </div>
              </div>

              {/* Rap Definition Row */}
              <div className="compare-table__row">
                <div className="compare-table__cell compare-table__cell--label">
                  Rap Definition
                </div>
                <div className="compare-table__cell compare-table__cell--word1">
                  {word1.rd || '—'}
                </div>
                <div className="compare-table__cell compare-table__cell--word2">
                  {word2.rd || '—'}
                </div>
              </div>

              {/* Tags Row */}
              <div className="compare-table__row">
                <div className="compare-table__cell compare-table__cell--label">
                  Tags
                </div>
                <div className="compare-table__cell compare-table__cell--word1">
                  <div className="compare-table__tags">
                    {word1.t && word1.t.length > 0 ? (
                      word1.t.map((tag, idx) => (
                        <span key={idx} className="compare-table__tag">{tag}</span>
                      ))
                    ) : (
                      <span className="compare-table__no-data">No tags</span>
                    )}
                  </div>
                </div>
                <div className="compare-table__cell compare-table__cell--word2">
                  <div className="compare-table__tags">
                    {word2.t && word2.t.length > 0 ? (
                      word2.t.map((tag, idx) => (
                        <span key={idx} className="compare-table__tag">{tag}</span>
                      ))
                    ) : (
                      <span className="compare-table__no-data">No tags</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Synonyms Row */}
              <div className="compare-table__row">
                <div className="compare-table__cell compare-table__cell--label">
                  Synonyms
                </div>
                <div className="compare-table__cell compare-table__cell--word1">
                  {word1.syn && word1.syn.length > 0 ? (
                    word1.syn.join(', ')
                  ) : (
                    '—'
                  )}
                </div>
                <div className="compare-table__cell compare-table__cell--word2">
                  {word2.syn && word2.syn.length > 0 ? (
                    word2.syn.join(', ')
                  ) : (
                    '—'
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!word1 || !word2 ? (
        <div className="word-compare__empty">
          <GitCompare size={48} className="word-compare__empty-icon" />
          <h2>Select Two Words to Compare</h2>
          <p>Choose words from the dropdowns above to see a side-by-side comparison</p>
        </div>
      ) : null}
    </div>
  );
}


export default WordCompare;
