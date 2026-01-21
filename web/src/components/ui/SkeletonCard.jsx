/**
 * SkeletonCard Component
 * Loading placeholder with shimmer animation
 *
 * @param {Object} props
 * @param {string} [props.variant='grid'] - Layout variant
 * @returns {JSX.Element}
 */
import PropTypes from 'prop-types';
import './SkeletonCard.css';

export function SkeletonCard({ variant = 'grid' }) {
  return (
    <div 
      className={`skeleton-card skeleton-card--${variant}`}
      role="status"
      aria-busy="true"
      aria-label="Loading content..."
    >
      <div className="skeleton-card__title skeleton-shimmer" />
      <div className="skeleton-card__meta">
        <div className="skeleton-card__badge skeleton-shimmer" />
        <div className="skeleton-card__badge skeleton-shimmer" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 12, variant = 'grid' }) {
  return (
    <div className={`skeleton-grid skeleton-grid--${variant}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} variant={variant} />
      ))}
    </div>
  );
}

SkeletonCard.propTypes = {
  variant: PropTypes.string
};

SkeletonGrid.propTypes = {
  count: PropTypes.number,
  variant: PropTypes.string
};
