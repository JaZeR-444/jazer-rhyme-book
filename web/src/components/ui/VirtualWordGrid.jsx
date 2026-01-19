/**
 * VirtualWordGrid Component
 * Virtualized grid using react-window for performant rendering of large word lists
 */
import { useState, useEffect, useRef } from 'react';
import { FixedSizeGrid } from 'react-window';
import { Link } from 'react-router-dom';
import './VirtualWordGrid.css';

export function VirtualWordGrid({ words, letter }) {
  const [columnCount, setColumnCount] = useState(4);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  // Responsive columns based on window width
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setColumnCount(2);
      else if (width < 1024) setColumnCount(3);
      else setColumnCount(4);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Update dimensions when container size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const CARD_WIDTH = 250;
  const CARD_HEIGHT = 140;
  const GAP = 16;
  const rowCount = Math.ceil(words.length / columnCount);

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= words.length) return null;

    const word = words[index];

    return (
      <div style={{ ...style, padding: GAP / 2 }}>
        <Link
          to={`/dictionary/${letter}/${word.name}`}
          className="virtual-word-card"
        >
          <div className="virtual-word-card__content">
            <h3 className="virtual-word-card__title">{word.name}</h3>
            <div className="virtual-word-card__meta">
              {word.syllables && (
                <span className="virtual-word-card__badge">
                  {word.syllables} {word.syllables === 1 ? 'syllable' : 'syllables'}
                </span>
              )}
              {word.complexity && (
                <span className={`virtual-word-card__complexity virtual-word-card__complexity--${word.complexity}`}>
                  {word.complexity}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="virtual-word-grid">
      {dimensions.width > 0 && dimensions.height > 0 && (
        <FixedSizeGrid
          columnCount={columnCount}
          columnWidth={CARD_WIDTH + GAP}
          height={dimensions.height}
          rowCount={rowCount}
          rowHeight={CARD_HEIGHT + GAP}
          width={dimensions.width}
        >
          {Cell}
        </FixedSizeGrid>
      )}
    </div>
  );
}
