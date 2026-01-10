import { Link } from 'react-router-dom';
import { BookOpen, Heart } from 'lucide-react';
import { LoadingState, EmptyState, Card } from '../components/ui';
import { useDictionaryLetters } from '../lib/hooks';
import { useFavorites } from '../lib/FavoritesContext';
import './Dictionary.css';

export function Dictionary() {
  const { letters, loading, error } = useDictionaryLetters();
  const { favoritesCount } = useFavorites();

  if (loading) {
    return <LoadingState message="Loading dictionary..." />;
  }

  if (error) {
    return (
      <EmptyState
        icon={<BookOpen size={48} />}
        title="Error Loading Dictionary"
        description={error.message}
      />
    );
  }

  return (
    <div className="dictionary-page">
      <div className="dictionary-page__header">
        <h1 className="dictionary-page__title">Rap Dictionary</h1>
        <p className="dictionary-page__description">
          Comprehensive A-Z word bank with definitions, usage examples, and cultural context.
        </p>
        
        {favoritesCount > 0 && (
          <Link to="/dictionary/favorites" className="dictionary-page__favorites-btn">
            <Heart size={20} fill="#ff4d6d" stroke="#ff4d6d" />
            <span className="dictionary-page__favorites-text">
              View {favoritesCount} Favorite {favoritesCount === 1 ? 'Word' : 'Words'}
            </span>
          </Link>
        )}
      </div>

      <div className="dictionary-page__letters">
        {letters.map(letter => (
          <Link
            key={letter}
            to={`/dictionary/${letter}`}
            className="letter-card"
          >
            <div className="letter-card__letter">{letter}</div>
            <div className="letter-card__label">Browse {letter}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
