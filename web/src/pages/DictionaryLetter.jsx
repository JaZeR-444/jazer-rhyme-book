import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, Heart, ArrowUpDown, Filter, Grid3x3, List, Layers } from 'lucide-react';
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

const VIEW_MODES = [
  { value: 'grid', label: 'Grid', icon: Grid3x3 },
  { value: 'list', label: 'List', icon: List },
  { value: 'grouped', label: 'Grouped', icon: Layers },
];

export function DictionaryLetter() {
  const { letter } = useParams();
  const { words, loading, error } = useDictionaryWords(letter);
  const { getFavoritesForLetter, isFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('az');
  const [syllableFilter, setSyllableFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grouped');

  const letterFavorites = getFavoritesForLetter(letter);

  // Extract unique syllable counts
  const availableSyllables = useMemo(() => {
    const counts = new Set(words.map(w => w.syllables).filter(Boolean));
    return Array.from(counts).sort((a, b) => a - b);
  }, [words]);

  // Extract unique tags
  const availableTags = useMemo(() => {
    const tagsSet = new Set();
    words.forEach(word => {
      if (word.tags && Array.isArray(word.tags)) {
        word.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet).sort();
  }, [words]);

  const filteredAndSortedWords = useMemo(() => {
    let result = words.filter(word => {
      const matchesSearch = word.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSyllables = syllableFilter === 'all' || word.syllables === parseInt(syllableFilter);
      const matchesTag = tagFilter === 'all' || (word.tags && word.tags.includes(tagFilter));
      return matchesSearch && matchesSyllables && matchesTag;
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
  }, [words, searchQuery, sortBy, syllableFilter, tagFilter, letter, isFavorite]);

  // Group words for grouped view
  const groupedWords = useMemo(() => {
    if (viewMode !== 'grouped') return null;

    // Group by first two letters (Ab, Ac, Ad, etc.)
    const groups = {};
    filteredAndSortedWords.forEach(word => {
      const prefix = word.name.slice(0, 2).toLowerCase();
      if (!groups[prefix]) {
        groups[prefix] = [];
      }
      groups[prefix].push(word);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([prefix, words]) => ({
        prefix: prefix.toUpperCase(),
        words: words.sort((a, b) => a.name.localeCompare(b.name))
      }));
  }, [filteredAndSortedWords, viewMode]);

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
            {/* Tag Filter */}
            {availableTags.length > 0 && (
              <div className="dictionary-letter__filter">
                <Filter size={16} />
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="dictionary-letter__select"
                >
                  <option value="all">All Tags</option>
                  {availableTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Syllable Filter */}
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

            {/* Sort */}
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

        {/* View Mode Toggle */}
        <div className="dictionary-letter__view-modes">
          {VIEW_MODES.map(mode => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.value}
                className={`view-mode-btn ${viewMode === mode.value ? 'active' : ''}`}
                onClick={() => setViewMode(mode.value)}
                title={mode.label}
              >
                <Icon size={18} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {filteredAndSortedWords.length > 0 ? (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="dictionary-letter__grid">
              {filteredAndSortedWords.map((word) => (
                <div key={word.name} className="word-card">
                  <Link
                    to={`/dictionary/${letter}/${word.name.toLowerCase()}`}
                    className="word-card__link"
                  >
                    <span className="word-card__name">{word.name}</span>
                  </Link>
                  <FavoriteButton word={word.name} letter={letter} size={18} />
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="dictionary-letter__list">
              {filteredAndSortedWords.map((word) => (
                <div key={word.name} className="word-list-item">
                  <Link
                    to={`/dictionary/${letter}/${word.name.toLowerCase()}`}
                    className="word-list-item__link"
                  >
                    <div className="word-list-item__main">
                      <span className="word-list-item__name">{word.name}</span>
                      {word.syllables && (
                        <Badge variant="outline" size="sm">
                          {word.syllables} syl
                        </Badge>
                      )}
                    </div>
                    {word.tags && word.tags.length > 0 && (
                      <div className="word-list-item__tags">
                        {word.tags.map((tag, idx) => (
                          <Badge key={idx} size="xs" variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </Link>
                  <FavoriteButton word={word.name} letter={letter} size={18} />
                </div>
              ))}
            </div>
          )}

          {/* Grouped View */}
          {viewMode === 'grouped' && groupedWords && (
            <div className="dictionary-letter__grouped">
              {groupedWords.map(({ prefix, words }) => (
                <div key={prefix} className="word-group">
                  <div className="word-group__header">
                    <h3 className="word-group__prefix">{prefix}</h3>
                    <Badge variant="secondary" size="sm">{words.length}</Badge>
                  </div>
                  <div className="word-group__items">
                    {words.map((word) => (
                      <div key={word.name} className="word-group-item">
                        <Link
                          to={`/dictionary/${letter}/${word.name.toLowerCase()}`}
                          className="word-group-item__link"
                        >
                          <span className="word-group-item__name">{word.name}</span>
                          <div className="word-group-item__meta">
                            {word.syllables && (
                              <Badge variant="outline" size="xs">
                                {word.syllables}
                              </Badge>
                            )}
                            {word.tags && word.tags.length > 0 && (
                              <>
                                {word.tags.slice(0, 2).map((tag, idx) => (
                                  <Badge key={idx} size="xs" variant="secondary">{tag}</Badge>
                                ))}
                              </>
                            )}
                          </div>
                        </Link>
                        <FavoriteButton word={word.name} letter={letter} size={16} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={<Search size={48} />}
          title="No Words Found"
          description={searchQuery ? `No words match "${searchQuery}"` : 'No words in this category'}
        />
      )}
    </div>
  );
}
