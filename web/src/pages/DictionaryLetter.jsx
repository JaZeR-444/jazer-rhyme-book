import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Heart,
  ArrowUpDown,
  Filter,
  Grid3x3,
  List,
  Layers,
  SlidersHorizontal
} from 'lucide-react';
import { Breadcrumbs, EmptyState, FavoriteButton, Badge } from '../components/ui';
import { Autocomplete } from '../components/ui/Autocomplete';
import { VirtualWordGrid } from '../components/ui/VirtualWordGrid';
import { SkeletonGrid } from '../components/ui/SkeletonCard';
import { FilterPanel } from '../components/dictionary/FilterPanel';
import { useDictionaryWords } from '../lib/hooks';
import { useFavorites } from '../lib/FavoritesContext';
import { useFilters } from '../lib/FilterContext';
import { useState, useMemo } from 'react';
import './DictionaryLetter.css';

const SORT_OPTIONS = [
  { value: 'az', label: 'A → Z' },
  { value: 'za', label: 'Z → A' },
  { value: 'favorites', label: 'Favorites First' },
  { value: 'syllables_asc', label: 'Syllables (Low → High)' },
  { value: 'syllables_desc', label: 'Syllables (High → Low)' }
];

const VIEW_MODES = [
  { value: 'grid', label: 'Grid', icon: Grid3x3 },
  { value: 'list', label: 'List', icon: List },
  { value: 'grouped', label: 'Grouped', icon: Layers }
];

export function DictionaryLetter() {
  const { letter } = useParams();
  const navigate = useNavigate();

  const safeLetter = String(letter || '').toUpperCase();
  const { words, loading, error } = useDictionaryWords(safeLetter);
  const { getFavoritesForLetter, isFavorite } = useFavorites();
  const { filters } = useFilters();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('az');
  const [syllableFilter, setSyllableFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grouped');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const letterFavorites = getFavoritesForLetter(safeLetter);

  const availableSyllables = useMemo(() => {
    const counts = new Set((words || []).map((w) => w?.syllables).filter(Boolean));
    return Array.from(counts).sort((a, b) => a - b);
  }, [words]);

  const availableTags = useMemo(() => {
    const tagsSet = new Set();
    (words || []).forEach((w) => {
      if (Array.isArray(w?.tags)) w.tags.forEach((t) => tagsSet.add(t));
    });
    return Array.from(tagsSet).sort();
  }, [words]);

  const availablePartsOfSpeech = useMemo(() => {
    const posSet = new Set();
    (words || []).forEach((w) => {
      const pos = w?.partOfSpeech;
      if (pos && pos !== 'unknown') posSet.add(pos);
    });
    return Array.from(posSet).sort();
  }, [words]);

  const searchIndex = useMemo(() => {
    return (words || []).map((w) => ({
      name: w?.name,
      link: `/dictionary/${safeLetter}/${String(w?.name || '').toLowerCase()}`
    }));
  }, [words, safeLetter]);

  const filteredAndSortedWords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let result = (words || []).filter((w) => {
      const name = String(w?.name || '');
      if (!name) return false;

      const nameLower = name.toLowerCase();
      const matchesSearch = !q || nameLower.includes(q);

      // legacy filters (keep)
      const matchesSyllables =
        syllableFilter === 'all' || (w?.syllables ?? 0) === parseInt(syllableFilter, 10);
      const matchesTag =
        tagFilter === 'all' || (Array.isArray(w?.tags) && w.tags.includes(tagFilter));

      // new filters (robust against missing data)
      const syl = w?.syllables;
      const matchesSyllableRange =
        syl == null
          ? true
          : syl >= filters.syllableRange[0] && syl <= filters.syllableRange[1];

      const matchesLengthRange =
        name.length >= filters.lengthRange[0] && name.length <= filters.lengthRange[1];

      const pos = w?.partOfSpeech || 'unknown';
      const matchesPartsOfSpeech =
        !filters.partsOfSpeech.length || filters.partsOfSpeech.includes(pos);

      const matchesTags =
        !filters.tags.length ||
        (Array.isArray(w?.tags) && w.tags.some((t) => filters.tags.includes(t)));

      const matchesHasRhymes = !filters.hasRhymes || Boolean(w?.hasRhymes);
      const matchesHasExamples = !filters.hasExamples || Boolean(w?.hasExamples);

      const complexity = w?.complexity || 'All';
      const matchesComplexity = filters.complexity === 'All' || complexity === filters.complexity;

      return (
        matchesSearch &&
        matchesSyllables &&
        matchesTag &&
        matchesSyllableRange &&
        matchesLengthRange &&
        matchesPartsOfSpeech &&
        matchesTags &&
        matchesHasRhymes &&
        matchesHasExamples &&
        matchesComplexity
      );
    });

    switch (sortBy) {
      case 'za':
        result = [...result].sort((a, b) => String(b?.name).localeCompare(String(a?.name)));
        break;
      case 'favorites':
        result = [...result].sort((a, b) => {
          const aName = String(a?.name || '');
          const bName = String(b?.name || '');
          const aFav = isFavorite(aName, safeLetter);
          const bFav = isFavorite(bName, safeLetter);
          if (aFav && !bFav) return -1;
          if (!aFav && bFav) return 1;
          return aName.localeCompare(bName);
        });
        break;
      case 'syllables_asc':
        result = [...result].sort((a, b) => (a?.syllables || 0) - (b?.syllables || 0));
        break;
      case 'syllables_desc':
        result = [...result].sort((a, b) => (b?.syllables || 0) - (a?.syllables || 0));
        break;
      case 'az':
      default:
        result = [...result].sort((a, b) => String(a?.name).localeCompare(String(b?.name)));
    }

    return result;
  }, [words, searchQuery, sortBy, syllableFilter, tagFilter, safeLetter, isFavorite, filters]);

  const groupedWords = useMemo(() => {
    if (viewMode !== 'grouped') return null;

    const groups = {};
    filteredAndSortedWords.forEach((w) => {
      const name = String(w?.name || '');
      const prefix = name.slice(0, 2).toLowerCase();
      if (!groups[prefix]) groups[prefix] = [];
      groups[prefix].push(w);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([prefix, list]) => ({
        prefix: prefix.toUpperCase(),
        words: list.sort((a, b) => String(a?.name).localeCompare(String(b?.name)))
      }));
  }, [filteredAndSortedWords, viewMode]);

  if (loading) {
    return (
      <div className="dictionary-letter">
        <div className="dictionary-letter__header">
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Dictionary', path: '/dictionary' },
              { label: `Letter ${safeLetter}`, path: `/dictionary/${safeLetter}` }
            ]}
          />
          <div className="dictionary-letter__title-row">
            <Link to="/dictionary" className="dictionary-letter__back" aria-label="Back to Dictionary">
              <ArrowLeft size={24} aria-hidden="true" />
            </Link>
            <h1 className="dictionary-letter__title">{safeLetter}</h1>
          </div>
        </div>
        <SkeletonGrid count={12} variant="grid" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dictionary-letter">
        <EmptyState
          icon={<Search size={48} />}
          title="Error Loading Words"
          description={error?.message || 'Something went wrong.'}
          action={() => window.history.back()}
          actionLabel="Go Back"
        />
      </div>
    );
  }

  return (
    <div className="dictionary-letter">
      <div className="dictionary-letter__header">
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Dictionary', path: '/dictionary' },
            { label: `Letter ${safeLetter}`, path: `/dictionary/${safeLetter}` }
          ]}
        />

        <div className="dictionary-letter__title-row">
          <Link to="/dictionary" className="dictionary-letter__back" aria-label="Back to Dictionary">
            <ArrowLeft size={24} aria-hidden="true" />
          </Link>
          <h1 className="dictionary-letter__title">{safeLetter}</h1>
        </div>

        <div className="dictionary-letter__stats">
          <span className="dictionary-letter__count">
            {filteredAndSortedWords.length} {filteredAndSortedWords.length === 1 ? 'word' : 'words'}
          </span>

          {letterFavorites.length > 0 && (
            <Link to="/dictionary/favorites" className="dictionary-letter__favorites-link">
              <Heart size={16} fill="currentColor" aria-hidden="true" />
              {letterFavorites.length} saved
            </Link>
          )}
        </div>

        <div className="dictionary-letter__controls">
          <button
            type="button"
            className="dictionary-letter__filter-toggle"
            onClick={() => setIsFilterPanelOpen(true)}
            title="Open filters"
            aria-label="Open filters"
          >
            <SlidersHorizontal size={20} aria-hidden="true" />
            <span>Filters</span>
          </button>

          <Autocomplete
            value={searchQuery}
            onChange={setSearchQuery}
            onSelect={(result) => result?.link && navigate(result.link)}
            searchIndex={searchIndex}
            placeholder="Search words..."
          />

          <div className="dictionary-letter__filters">
            {availableTags.length > 0 && (
              <div className="dictionary-letter__filter">
                <Filter size={16} aria-hidden="true" />
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="dictionary-letter__select"
                  aria-label="Filter by tag"
                >
                  <option value="all">All Tags</option>
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {availableSyllables.length > 0 && (
              <div className="dictionary-letter__filter">
                <Filter size={16} aria-hidden="true" />
                <select
                  value={syllableFilter}
                  onChange={(e) => setSyllableFilter(e.target.value)}
                  className="dictionary-letter__select"
                  aria-label="Filter by syllables"
                >
                  <option value="all">All Syllables</option>
                  {availableSyllables.map((count) => (
                    <option key={count} value={count}>
                      {count} Syllable{count > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="dictionary-letter__sort">
              <ArrowUpDown size={16} aria-hidden="true" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="dictionary-letter__select"
                aria-label="Sort words"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="dictionary-letter__view-modes">
          {VIEW_MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                type="button"
                key={mode.value}
                className={`view-mode-btn ${viewMode === mode.value ? 'active' : ''}`}
                onClick={() => setViewMode(mode.value)}
                title={mode.label}
                aria-label={`Switch to ${mode.label} view`}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {filteredAndSortedWords.length > 0 ? (
        <>
          {viewMode === 'grid' && (
            <>
              {filteredAndSortedWords.length > 100 ? (
                <div style={{ height: '80vh' }}>
                  <VirtualWordGrid words={filteredAndSortedWords} letter={safeLetter} />
                </div>
              ) : (
                <div className="dictionary-letter__grid">
                  {filteredAndSortedWords.map((w) => (
                    <div key={w.name} className="word-card">
                      <Link
                        to={`/dictionary/${safeLetter}/${String(w.name).toLowerCase()}`}
                        className="word-card__link"
                      >
                        <span className="word-card__name">{w.name}</span>
                      </Link>
                      <FavoriteButton word={w.name} letter={safeLetter} size={18} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {viewMode === 'list' && (
            <div className="dictionary-letter__list">
              {filteredAndSortedWords.map((w) => (
                <div key={w.name} className="word-list-item">
                  <Link
                    to={`/dictionary/${safeLetter}/${String(w.name).toLowerCase()}`}
                    className="word-list-item__link"
                  >
                    <div className="word-list-item__main">
                      <span className="word-list-item__name">{w.name}</span>
                      {w.syllables ? (
                        <Badge variant="outline" size="sm">
                          {w.syllables} syl
                        </Badge>
                      ) : null}
                    </div>

                    {Array.isArray(w.tags) && w.tags.length > 0 ? (
                      <div className="word-list-item__tags">
                        {w.tags.map((tag, idx) => (
                          <Badge key={idx} size="xs" variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </Link>

                  <FavoriteButton word={w.name} letter={safeLetter} size={18} />
                </div>
              ))}
            </div>
          )}

          {viewMode === 'grouped' && groupedWords && (
            <div className="dictionary-letter__grouped">
              {groupedWords.map(({ prefix, words: list }) => (
                <div key={prefix} className="word-group">
                  <div className="word-group__header">
                    <h3 className="word-group__prefix">{prefix}</h3>
                    <Badge variant="secondary" size="sm">
                      {list.length}
                    </Badge>
                  </div>

                  <div className="word-group__items">
                    {list.map((w) => (
                      <div key={w.name} className="word-group-item">
                        <Link
                          to={`/dictionary/${safeLetter}/${String(w.name).toLowerCase()}`}
                          className="word-group-item__link"
                        >
                          <span className="word-group-item__name">{w.name}</span>

                          <div className="word-group-item__meta">
                            {w.syllables ? (
                              <Badge variant="outline" size="xs">
                                {w.syllables}
                              </Badge>
                            ) : null}

                            {Array.isArray(w.tags) && w.tags.length > 0 ? (
                              <>
                                {w.tags.slice(0, 2).map((tag, idx) => (
                                  <Badge key={idx} size="xs" variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </>
                            ) : null}
                          </div>
                        </Link>

                        <FavoriteButton word={w.name} letter={safeLetter} size={16} />
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

      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        availablePartsOfSpeech={availablePartsOfSpeech}
        availableTags={availableTags}
      />
    </div>
  );
}

export default DictionaryLetter;
