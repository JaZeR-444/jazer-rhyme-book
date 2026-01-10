/**
 * Dictionary Favorites Page
 * Shows all favorited words
 */
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';
import { Breadcrumbs, EmptyState, Card } from '../components/ui';
import { FavoriteButton } from '../components/ui/FavoriteButton';
import { useFavorites } from '../lib/FavoritesContext';
import './DictionaryFavorites.css';

export function DictionaryFavorites() {
  const { favorites, favoritesCount } = useFavorites();

  // Sort by most recently added
  const sortedFavorites = [...favorites].sort((a, b) => b.addedAt - a.addedAt);

  return (
    <div className="dictionary-favorites">
      <div className="dictionary-favorites__header">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Dictionary', path: '/dictionary' },
          { label: 'Favorites', path: '/dictionary/favorites' }
        ]} />

        <div className="dictionary-favorites__title-row">
          <Link to="/dictionary" className="dictionary-favorites__back">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="dictionary-favorites__title">
            <Heart size={32} className="dictionary-favorites__icon" />
            Favorites
          </h1>
        </div>

        <p className="dictionary-favorites__count">
          {favoritesCount} saved {favoritesCount === 1 ? 'word' : 'words'}
        </p>
      </div>

      {sortedFavorites.length > 0 ? (
        <div className="dictionary-favorites__grid">
          {sortedFavorites.map((fav) => (
            <div key={`${fav.letter}-${fav.word}`} className="favorite-word-card">
              <Link
                to={`/dictionary/${fav.letter}/${fav.word.toLowerCase()}`}
                className="favorite-word-card__link"
              >
                <span className="favorite-word-card__letter">{fav.letter}</span>
                <span className="favorite-word-card__name">{fav.word}</span>
              </Link>
              <FavoriteButton word={fav.word} letter={fav.letter} size={18} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Heart size={48} />}
          title="No Favorites Yet"
          description="Click the heart icon on any word to save it to your favorites."
        />
      )}
    </div>
  );
}
