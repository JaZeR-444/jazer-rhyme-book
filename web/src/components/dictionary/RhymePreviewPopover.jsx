/**
 * RhymePreviewPopover Component
 * Modal overlay showing top 5 rhymes for a word
 */
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { X, ExternalLink } from 'lucide-react';
import './RhymePreviewPopover.css';

export function RhymePreviewPopover({
  word,
  letter,
  isOpen,
  onClose
}) {
  const [rhymes, setRhymes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    // Simulate loading rhyme data
    // In a real implementation, this would fetch from an API or data file
    setTimeout(() => {
      // Mock rhyme data
      const mockRhymes = [
        { word: 'sample1', letter: 'S' },
        { word: 'sample2', letter: 'S' },
        { word: 'sample3', letter: 'S' }
      ];
      setRhymes(mockRhymes);
      setLoading(false);
    }, 500);
  }, [isOpen, word]);

  if (!isOpen) return null;

  const popover = (
    <div className="rhyme-preview-overlay" onClick={onClose}>
      <div
        className="rhyme-preview-popover glass"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rhyme-preview-popover__header">
          <h3 className="rhyme-preview-popover__title">
            Rhymes with <span className="highlight">{word}</span>
          </h3>
          <button
            className="rhyme-preview-popover__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="rhyme-preview-popover__content">
          {loading ? (
            <div className="rhyme-preview-popover__loading">
              Loading rhymes...
            </div>
          ) : rhymes.length > 0 ? (
            <>
              <ul className="rhyme-preview-popover__list">
                {rhymes.slice(0, 5).map((rhyme, idx) => (
                  <li key={idx} className="rhyme-preview-popover__item">
                    <Link
                      to={`/dictionary/${rhyme.letter}/${rhyme.word.toLowerCase()}`}
                      className="rhyme-preview-popover__link"
                      onClick={onClose}
                    >
                      {rhyme.word}
                      <ExternalLink size={14} />
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                to={`/dictionary/${letter}/${word.toLowerCase()}`}
                className="rhyme-preview-popover__view-all"
                onClick={onClose}
              >
                View All Rhymes
              </Link>
            </>
          ) : (
            <div className="rhyme-preview-popover__empty">
              No rhymes found for "{word}"
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(popover, document.body);
}
