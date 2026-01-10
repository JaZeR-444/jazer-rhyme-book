/**
 * Favorite Button Component
 * Animated heart button for favoriting words
 */
import { Heart } from 'lucide-react';
import { useFavorites } from '../../lib/FavoritesContext';
import PropTypes from 'prop-types';
import './FavoriteButton.css';

export function FavoriteButton({ word, letter, size = 20, showLabel = false }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(word, letter);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(word, letter);
  };

  return (
    <button
      className={`favorite-btn ${favorited ? 'favorite-btn--active' : ''}`}
      onClick={handleClick}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        size={size} 
        fill={favorited ? 'currentColor' : 'none'}
        className="favorite-btn__icon"
      />
      {showLabel && (
        <span className="favorite-btn__label">
          {favorited ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}

FavoriteButton.propTypes = {
  word: PropTypes.string.isRequired,
  letter: PropTypes.string.isRequired,
  size: PropTypes.number,
  showLabel: PropTypes.bool
};
