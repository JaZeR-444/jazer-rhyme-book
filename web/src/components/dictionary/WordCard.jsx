/**
 * WordCard Component
 * Reusable word card with quick actions
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DraggableCard } from '../workspace/DraggableCard';
import './WordCard.css';

export function WordCard({
  word,
  letter,
  variant = 'grid',
  showQuickActions = true,
  QuickActionsComponent,
  enableDrag = true
}) {
  const [isHovered, setIsHovered] = useState(false);

  const dragItem = {
    id: word.name.toLowerCase(),
    type: 'word',
    name: word.name,
    letter: letter,
    data: word
  };

  const content = (
    <div
      className={`word-card word-card--${variant}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/dictionary/${letter}/${word.name.toLowerCase()}`}
        className="word-card__link"
      >
        <div className="word-card__content">
          <h3 className="word-card__name">{word.name}</h3>

          <div className="word-card__meta">
            {word.syllables && (
              <span className="word-card__badge">
                {word.syllables} {word.syllables === 1 ? 'syllable' : 'syllables'}
              </span>
            )}

            {word.complexity && (
              <span className={`word-card__complexity word-card__complexity--${word.complexity}`}>
                {word.complexity}
              </span>
            )}

            {word.tags && word.tags.length > 0 && (
              <div className="word-card__tags">
                {word.tags.slice(0, 2).map((tag, idx) => (
                  <span key={idx} className="word-card__tag">
                    {tag}
                  </span>
                ))}
                {word.tags.length > 2 && (
                  <span className="word-card__tag-more">
                    +{word.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Quick Actions - Will be rendered if provided */}
      {showQuickActions && QuickActionsComponent && isHovered && (
        <div className="word-card__actions">
          {QuickActionsComponent}
        </div>
      )}
    </div>
  );

  if (!enableDrag) {
    return content;
  }

  return (
    <DraggableCard item={dragItem}>
      {content}
    </DraggableCard>
  );
}
