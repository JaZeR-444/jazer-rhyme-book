/**
 * Dictionary Favorites Page
 * Shows all favorited words
 */
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { usePageTitle } from '../lib/usePageTitle';
import { Breadcrumbs, EmptyState } from '../components/ui';
import { FavoriteButton } from '../components/ui/FavoriteButton';
import { useFavorites } from '../contexts/FavoritesContext';
import './DictionaryFavorites.css';

export function DictionaryFavorites() {
  usePageTitle('Favorites');
  const { favorites, favoritesCount } = useFavorites();

  const safeFavorites = Array.isArray(favorites) ? favorites : [];
  const sortedFavorites = [...safeFavorites].sort((a, b) => (b?.addedAt || 0) - (a?.addedAt || 0));

  return (
    <div className="dictionary-favorites" role="main" aria-label="Dictionary favorites - Your saved words">
      <div className="dictionary-favorites__header">
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Dictionary', path: '/dictionary' },
            { label: 'Favorites', path: '/dictionary/favorites' }
          ]}
        />

        <div className="dictionary-favorites__title-row">
          <Link to="/dictionary" className="dictionary-favorites__back" aria-label="Back to Dictionary">
            <ArrowLeft size={24} aria-hidden="true" />
          </Link>

          <h1 className="dictionary-favorites__title">
            <Heart size={32} className="dictionary-favorites__icon" aria-hidden="true" />
            Favorites
          </h1>
        </div>

        <p className="dictionary-favorites__count">
          {favoritesCount || 0} saved {(favoritesCount || 0) === 1 ? 'word' : 'words'}
        </p>
      </div>

      {sortedFavorites.length > 0 ? (
        <div className="dictionary-favorites__grid">
          {sortedFavorites.map((fav) => {
            const l = String(fav?.letter || '').toLowerCase();
            const w = String(fav?.word || '');
            const routeLetter = l || w.charAt(0).toLowerCase();

            return (
              <div key={`${fav.letter}-${fav.word}`} className="favorite-word-card">
                <Link
                  to={`/dictionary/${routeLetter}/${w.toLowerCase()}`}
                  className="favorite-word-card__link"
                >
                  <span className="favorite-word-card__letter">{String(fav.letter || '').toUpperCase()}</span>
                  <span className="favorite-word-card__name">{w}</span>
                </Link>

                <FavoriteButton word={w} letter={String(fav.letter || '').toUpperCase()} size={18} />
              </div>
            );
          })}
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

export default DictionaryFavorites;
