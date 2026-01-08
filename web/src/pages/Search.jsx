import { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon, Filter } from 'lucide-react';
import Fuse from 'fuse.js';
import { SearchBar, LoadingState, EmptyState, Badge, Button } from '../components/ui';
import { EntityCard } from '../components/EntityCard';
import { Link } from 'react-router-dom';
import { useSearchIndex } from '../lib/hooks';
import './Search.css';

export function Search() {
  const { searchIndex, loading } = useSearchIndex();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'entity', 'word'
  const [results, setResults] = useState([]);

  // Create Fuse instances
  const entityFuse = useMemo(() => {
    if (!searchIndex?.entities) return null;
    return new Fuse(searchIndex.entities, {
      keys: ['name', 'id', 'tags', 'one_liner', 'aliases'],
      threshold: 0.3,
      includeScore: true
    });
  }, [searchIndex]);

  const wordFuse = useMemo(() => {
    if (!searchIndex?.words) return null;
    return new Fuse(searchIndex.words, {
      keys: ['name'],
      threshold: 0.3,
      includeScore: true
    });
  }, [searchIndex]);

  // Perform search
  useEffect(() => {
    if (!query || !entityFuse || !wordFuse) {
      setResults([]);
      return;
    }

    const entityResults = typeFilter !== 'word' ? entityFuse.search(query).map(r => r.item) : [];
    const wordResults = typeFilter !== 'entity' ? wordFuse.search(query).map(r => r.item) : [];

    setResults([...entityResults, ...wordResults]);
  }, [query, typeFilter, entityFuse, wordFuse]);

  if (loading) {
    return <LoadingState message="Building search index..." />;
  }

  return (
    <div className="search-page">
      <div className="search-page__header">
        <h1 className="search-page__title">Search</h1>
        <p className="search-page__description">
          Search across all domains and dictionary
        </p>

        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
          placeholder="Search entities, words, tags..."
          className="search-page__search"
        />

        <div className="search-page__filters">
          <Button
            variant={typeFilter === 'all' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setTypeFilter('all')}
          >
            All
          </Button>
          <Button
            variant={typeFilter === 'entity' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setTypeFilter('entity')}
          >
            Entities
          </Button>
          <Button
            variant={typeFilter === 'word' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setTypeFilter('word')}
          >
            Dictionary
          </Button>
        </div>
      </div>

      {query === '' ? (
        <EmptyState
          icon={<SearchIcon size={48} />}
          title="Start Searching"
          description="Enter a query to search across all domains and dictionary"
        />
      ) : results.length > 0 ? (
        <div className="search-page__results">
          <p className="search-page__count">
            Found {results.length} {results.length === 1 ? 'result' : 'results'}
          </p>

          <div className="search-page__grid">
            {results.map((result, idx) => {
              if (result._type === 'entity') {
                return <EntityCard key={idx} entity={result} domain={result.domain} />;
              } else {
                return (
                  <Link
                    key={idx}
                    to={`/dictionary/${result.letter}/${result.name.toLowerCase()}`}
                    className="search-word-card"
                  >
                    <Badge size="sm" variant="purple">Dictionary</Badge>
                    <div className="search-word-card__name">{result.name}</div>
                    <div className="search-word-card__meta">Letter {result.letter}</div>
                  </Link>
                );
              }
            })}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<SearchIcon size={48} />}
          title="No Results"
          description={`No results found for "${query}"`}
        />
      )}
    </div>
  );
}
