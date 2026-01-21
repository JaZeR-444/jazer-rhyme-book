/**
 * VirtualWordGrid Component
 * Virtualized grid using @tanstack/react-virtual for performant rendering of large word lists
 *
 * @param {Object} props
 * @param {Array<{name:string,syllables?:number,complexity?:string}>} props.words - Word data to render
 * @param {string} props.letter - Current dictionary letter for routing
 * @returns {JSX.Element}
 */
import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Link } from 'react-router-dom';
import './VirtualWordGrid.css';

export function VirtualWordGrid({ words, letter }) {
  const [columnCount, setColumnCount] = useState(4);
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

  const CARD_WIDTH = 250;
  const CARD_HEIGHT = 140;
  const GAP = 16;

  const rowCount = useMemo(
    () => Math.ceil(words.length / columnCount),
    [words.length, columnCount]
  );

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => containerRef.current,
    estimateSize: () => CARD_HEIGHT + GAP,
    overscan: 4,
  });

  const totalHeight = rowVirtualizer.getTotalSize();
  const items = rowVirtualizer.getVirtualItems();

  return (
    <div ref={containerRef} className="virtual-word-grid">
      <div
        style={{
          height: totalHeight,
          position: 'relative',
        }}
      >
        {items.map((virtualRow) => {
          const rowIndex = virtualRow.index;
          const rowWords = words.slice(
            rowIndex * columnCount,
            rowIndex * columnCount + columnCount
          );

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
                display: 'grid',
                gridTemplateColumns: `repeat(${columnCount}, minmax(${CARD_WIDTH}px, 1fr))`,
                gap: `${GAP}px`,
                padding: `${GAP / 2}px`,
                boxSizing: 'border-box',
              }}
            >
              {rowWords.map((word) => (
                <Link
                  key={word.name}
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
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

VirtualWordGrid.propTypes = {
  words: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      syllables: PropTypes.number,
      complexity: PropTypes.string
    })
  ).isRequired,
  letter: PropTypes.string.isRequired
};
