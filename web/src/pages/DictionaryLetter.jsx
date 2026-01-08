import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { Breadcrumbs, SearchBar, LoadingState, EmptyState } from '../components/ui';
import { useDictionaryWords } from '../lib/hooks';
import { useState } from 'react';
import './DictionaryLetter.css';

export function DictionaryLetter() {
  const { letter } = useParams();
  const { words, loading, error } = useDictionaryWords(letter);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWords = words.filter(word =>
    word.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingState message={`Loading words for ${letter}...`} />;
  }

  if (error) {
    return (
      <div className="dictionary-letter">
        <EmptyState
          icon={<Search size={48} />}
          title="Error Loading Words"
          description={error.message}
          action={() => window.history.back()}
          actionLabel="Go Back"
        />
      </div>
    );
  }

  return (
    <div className="dictionary-letter">
      <div className="dictionary-letter__header">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Dictionary', path: '/dictionary' },
          { label: `Letter ${letter}`, path: `/dictionary/${letter}` }
        ]} />

        <div className="dictionary-letter__title-row">
          <Link to="/dictionary" className="dictionary-letter__back">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="dictionary-letter__title">Letter {letter}</h1>
        </div>

        <p className="dictionary-letter__count">
          {filteredWords.length} {filteredWords.length === 1 ? 'word' : 'words'}
        </p>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Search words..."
          className="dictionary-letter__search"
        />
      </div>

      {filteredWords.length > 0 ? (
        <div className="dictionary-letter__grid">
          {filteredWords.map((word) => (
            <Link
              key={word.name}
              to={`/dictionary/${letter}/${word.name.toLowerCase()}`}
              className="word-card"
            >
              <div className="word-card__name">{word.name}</div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Search size={48} />}
          title="No Words Found"
          description={`No words match "${searchQuery}"`}
        />
      )}
    </div>
  );
}
