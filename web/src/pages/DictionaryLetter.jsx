import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, Heart, ArrowUpDown, Filter } from 'lucide-react';
import { Breadcrumbs, SearchBar, LoadingState, EmptyState, FavoriteButton, Badge } from '../components/ui';
import { useDictionaryWords } from '../lib/hooks';
import { useFavorites } from '../lib/FavoritesContext';
import { useState, useMemo } from 'react';
import './DictionaryLetter.css';

const SORT_OPTIONS = [
  { value: 'az', label: 'A → Z' },
  { value: 'za', label: 'Z → A' },
  { value: 'favorites', label: 'Favorites First' },
  { value: 'syllables_asc', label: 'Syllables (Low → High)' },
  { value: 'syllables_desc', label: 'Syllables (High → Low)' },
];

export function DictionaryLetter() {
  const { letter } = useParams();
  const { words, loading, error } = useDictionaryWords(letter);
  const { getFavoritesForLetter, isFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('az');
  const [syllableFilter, setSyllableFilter] = useState('all');

  const letterFavorites = getFavoritesForLetter(letter);

  // Extract unique syllable counts
  const availableSyllables = useMemo(() => {
    const counts = new Set(words.map(w => w.syllables).filter(Boolean));
    return Array.from(counts).sort((a, b) => a - b);
  }, [words]);

  const filteredAndSortedWords = useMemo(() => {
    let result = words.filter(word => {
      const matchesSearch = word.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSyllables = syllableFilter === 'all' || word.syllables === parseInt(syllableFilter);
      return matchesSearch && matchesSyllables;
    });

    switch (sortBy) {
      case 'za':
        result = [...result].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'favorites':
        result = [...result].sort((a, b) => {
          const aFav = isFavorite(a.name, letter);
          const bFav = isFavorite(b.name, letter);
          if (aFav && !bFav) return -1;
          if (!aFav && bFav) return 1;
          return a.name.localeCompare(b.name);
        });
        break;
      case 'syllables_asc':
        result = [...result].sort((a, b) => (a.syllables || 0) - (b.syllables || 0));
        break;
      case 'syllables_desc':
        result = [...result].sort((a, b) => (b.syllables || 0) - (a.syllables || 0));
        break;
      case 'az':
      default:
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [words, searchQuery, sortBy, syllableFilter, letter, isFavorite]);

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
          <h1 className="dictionary-letter__title">{letter}</h1>
        </div>

        <div className="dictionary-letter__stats">
          <span className="dictionary-letter__count">
            {filteredAndSortedWords.length} {filteredAndSortedWords.length === 1 ? 'word' : 'words'}
          </span>
          {letterFavorites.length > 0 && (
            <Link to="/dictionary/favorites" className="dictionary-letter__favorites-link">
              <Heart size={16} fill="currentColor" />
              {letterFavorites.length} saved
            </Link>
          )}
        </div>

        <div className="dictionary-letter__controls">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search words..."
            className="dictionary-letter__search"
          />
          
          <div className="dictionary-letter__filters">
            {availableSyllables.length > 0 && (
              <div className="dictionary-letter__filter">
                <Filter size={16} />
                <select 
                  value={syllableFilter} 
                  onChange={(e) => setSyllableFilter(e.target.value)}
                  className="dictionary-letter__select"
                >
                  <option value="all">All Syllables</option>
                  {availableSyllables.map(count => (
                    <option key={count} value={count}>{count} Syllable{count > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="dictionary-letter__sort">
              <ArrowUpDown size={16} />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="dictionary-letter__select"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredAndSortedWords.length > 0 ? (
        <div className="dictionary-letter__grid">
          {filteredAndSortedWords.map((word) => (
            <div key={word.name} className="word-card">
              <Link
                to={`/dictionary/${letter}/${word.name.toLowerCase()}`}
                className="word-card__link"
              >
                <div className="word-card__main">
                  <span className="word-card__name">{word.name}</span>
                  {word.syllables && (
                    <Badge variant="outline" size="sm" className="word-card__syllables">
                      {word.syllables}
                    </Badge>
                  )}
                </div>
              </Link>
              <FavoriteButton word={word.name} letter={letter} size={18} />
            </div>
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
