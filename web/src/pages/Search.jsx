import { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon, Filter, X, Info } from 'lucide-react';
import { usePageTitle } from '../lib/usePageTitle';
import Fuse from 'fuse.js';
import { SearchBar, LoadingState, EmptyState, Badge, Button } from '../components/ui';
import { EntityCard } from '../components/EntityCard';
import { SearchHistory } from '../components/search/SearchHistory';
import { Link } from 'react-router-dom';
import { useSearchIndex } from '../lib/hooks';
import { useSearchHistory } from '../contexts/SearchHistoryContext';
import { parseSearchQuery, applySearchFilters, applyWordFilters, describeSearchQuery } from '../lib/searchParser';
import { domainNames } from '../lib/data/knowledgeHub';
import './Search.css';

export function Search() {
  usePageTitle('Search');
  const { searchIndex, loading } = useSearchIndex();
  const { addToHistory } = useSearchHistory();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'entity', 'word'
  const [domainFilter, setDomainFilter] = useState([]);
  const [tagFilter, setTagFilter] = useState([]);
  const [eraFilter, setEraFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState([]);
  const [parsedQuery, setParsedQuery] = useState(null);

  // Extract unique tags and eras from entities
  const availableTags = useMemo(() => {
    if (!searchIndex?.entities) return [];
    const tags = new Set();
    searchIndex.entities.forEach(e => {
      if (e.tags) e.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [searchIndex]);

  const availableEras = useMemo(() => {
    if (!searchIndex?.entities) return [];
    const eras = new Set();
    searchIndex.entities.forEach(e => {
      if (e.era) eras.add(e.era);
    });
    return Array.from(eras).sort();
  }, [searchIndex]);

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

  // Perform search with filters and advanced syntax
  useEffect(() => {
    if (!query || !entityFuse || !wordFuse) {
      setResults([]);
      setParsedQuery(null);
      return;
    }

    // Parse the query for advanced syntax
    const parsed = parseSearchQuery(query);
    setParsedQuery(parsed);

    // Add to search history
    addToHistory(query);

    // Get base search results from Fuse
    let entityResults = typeFilter !== 'word' ? entityFuse.search(query).map(r => r.item) : [];
    let wordResults = typeFilter !== 'entity' ? wordFuse.search(query).map(r => r.item) : [];

    // Apply advanced filters from parsed query
    if (parsed.filters.domains.length > 0) {
      entityResults = entityResults.filter(e => parsed.filters.domains.includes(e.domain));
    }

    if (parsed.filters.tags.length > 0) {
      entityResults = entityResults.filter(e =>
        e.tags && parsed.filters.tags.some(tag => e.tags.includes(tag))
      );
    }

    if (parsed.filters.eras.length > 0) {
      entityResults = entityResults.filter(e => parsed.filters.eras.includes(e.era));
    }

    if (parsed.filters.syllables !== null) {
      wordResults = wordResults.filter(w => w.syllables === parsed.filters.syllables);
    }

    // Apply existing UI filters (backward compatibility)
    if (domainFilter.length > 0) {
      entityResults = entityResults.filter(e => domainFilter.includes(e.domain));
    }

    if (tagFilter.length > 0) {
      entityResults = entityResults.filter(e =>
        e.tags && tagFilter.some(tag => e.tags.includes(tag))
      );
    }

    if (eraFilter !== 'all') {
      entityResults = entityResults.filter(e => e.era === eraFilter);
    }

    setResults([...entityResults, ...wordResults]);
  }, [query, typeFilter, domainFilter, tagFilter, eraFilter, entityFuse, wordFuse, addToHistory]);

  if (loading) {
    return <LoadingState message="Building search index..." />;
  }

  return (
    <div className="search-page" role="main" aria-label="Search page - Find domains, entities, and words">
      <div className="search-page__header">
        <h1 className="search-page__title">Search Knowledge</h1>
        <p className="search-page__description">
          Explore domains, entities, and rhymes in one place.
        </p>

        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
          placeholder="Type to search..."
          className="search-page__search"
          autoFocus
        />

        <div className="search-page__filters" aria-label="Search filters - Filter by result type">
          <Button
            variant={typeFilter === 'all' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setTypeFilter('all')}
          >
            All Results
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
          
          <Button
            variant={showFilters ? 'primary' : 'ghost'}
            size="sm"
            icon={<Filter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Advanced Filters
          </Button>
        </div>

        {showFilters && (
          <div className="search-page__advanced-filters" aria-label="Advanced filters - Filter by domains, tags, and era">
            <div className="advanced-filter-section">
              <h3 className="advanced-filter-title">Domains</h3>
              <div className="filter-chips">
                {domainNames.map(domain => (
                  <Badge
                    key={domain}
                    className={`filter-chip ${domainFilter.includes(domain) ? 'active' : ''}`}
                    onClick={() => {
                      setDomainFilter(prev =>
                        prev.includes(domain)
                          ? prev.filter(d => d !== domain)
                          : [...prev, domain]
                      );
                    }}
                  >
                    {domain}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="advanced-filter-section">
              <h3 className="advanced-filter-title">Tags</h3>
              <div className="filter-chips">
                {availableTags.slice(0, 20).map(tag => (
                  <Badge
                    key={tag}
                    className={`filter-chip ${tagFilter.includes(tag) ? 'active' : ''}`}
                    onClick={() => {
                      setTagFilter(prev =>
                        prev.includes(tag)
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="advanced-filter-section">
              <h3 className="advanced-filter-title">Era</h3>
              <div className="filter-chips">
                <Badge
                  className={`filter-chip ${eraFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setEraFilter('all')}
                >
                  All Eras
                </Badge>
                {availableEras.map(era => (
                  <Badge
                    key={era}
                    className={`filter-chip ${eraFilter === era ? 'active' : ''}`}
                    onClick={() => setEraFilter(era)}
                  >
                    {era}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              size="sm"
              variant="ghost"
              icon={<X size={16} />}
              onClick={() => {
                setDomainFilter([]);
                setTagFilter([]);
                setEraFilter('all');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {query === '' ? (
        <div className="search-page__empty">
          <SearchHistory onSelectQuery={setQuery} />

          <div className="search-syntax-help">
            <div className="syntax-help-header">
              <Info size={18} />
              <h3>Advanced Search Syntax</h3>
            </div>
            <div className="syntax-help-examples">
              <div className="syntax-example">
                <code>tag:boom-bap</code>
                <span>Filter by tag</span>
              </div>
              <div className="syntax-example">
                <code>era:1990s</code>
                <span>Filter by era</span>
              </div>
              <div className="syntax-example">
                <code>domain:music</code>
                <span>Filter by domain</span>
              </div>
              <div className="syntax-example">
                <code>syllables:3</code>
                <span>Filter by syllable count</span>
              </div>
              <div className="syntax-example">
                <code>"exact phrase"</code>
                <span>Exact match search</span>
              </div>
            </div>
          </div>
        </div>
      ) : results.length > 0 ? (
        <div className="search-page__results" aria-label={`Search results - Found ${results.length} ${results.length === 1 ? 'result' : 'results'}`}>
          <div className="search-page__results-header">
            <p className="search-page__count">
              Found {results.length} results for "{query}"
            </p>
            {parsedQuery && (
              <p className="search-page__query-description">
                <Info size={14} />
                {describeSearchQuery(parsedQuery)}
              </p>
            )}
          </div>

          <div className="search-page__grid">
            {results.map((result, idx) => {
              // Unique key fallback
              const key = result.id || result.name + idx;
              
              if (result._type === 'entity') {
                return (
                    <div style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.05}s backwards` }} key={key}>
                        <EntityCard entity={result} domain={result.domain} />
                    </div>
                );
              } else {
                return (
                  <Link
                    key={key}
                    to={`/dictionary/${result.letter}/${result.name.toLowerCase()}`}
                    className="search-word-card"
                    style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.05}s backwards` }}
                  >
                    <div className="search-word-card__header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <Badge size="sm" variant="outline">Dictionary</Badge>
                        {/* Could put favorite button here if we had access */}
                    </div>
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
          title="No Data Found"
          description={`Search query "${query}" yielded zero matches in the index.`}
          variant="diagnostic"
        />
      )}
    </div>
  );
}


export default Search;
