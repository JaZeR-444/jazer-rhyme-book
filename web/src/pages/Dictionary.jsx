import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { LoadingState, EmptyState, Card } from '../components/ui';
import { useDictionaryLetters } from '../lib/hooks';
import './Dictionary.css';

export function Dictionary() {
  const { letters, loading, error } = useDictionaryLetters();

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
