import { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import Fuse from 'fuse.js';
import { SearchBar, LoadingState, EmptyState, Badge, Button } from '../components/ui';
import { EntityCard } from '../components/EntityCard';
import { Link } from 'react-router-dom';
import { useSearchIndex } from '../lib/hooks';
import { domainNames } from '../lib/data/knowledgeHub';
import './Search.css';

export function Search() {
  const { searchIndex, loading } = useSearchIndex();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'entity', 'word'
  const [domainFilter, setDomainFilter] = useState([]);
  const [tagFilter, setTagFilter] = useState([]);
  const [eraFilter, setEraFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState([]);

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

  // Perform search with filters
  useEffect(() => {
    if (!query || !entityFuse || !wordFuse) {
      setResults([]);
      return;
    }

    let entityResults = typeFilter !== 'word' ? entityFuse.search(query).map(r => r.item) : [];
    const wordResults = typeFilter !== 'entity' ? wordFuse.search(query).map(r => r.item) : [];

    // Apply domain filter
    if (domainFilter.length > 0) {
      entityResults = entityResults.filter(e => domainFilter.includes(e.domain));
    }

    // Apply tag filter
    if (tagFilter.length > 0) {
      entityResults = entityResults.filter(e => 
        e.tags && tagFilter.some(tag => e.tags.includes(tag))
      );
    }

    // Apply era filter
    if (eraFilter !== 'all') {
      entityResults = entityResults.filter(e => e.era === eraFilter);
    }

    setResults([...entityResults, ...wordResults]);
  }, [query, typeFilter, domainFilter, tagFilter, eraFilter, entityFuse, wordFuse]);

  if (loading) {
    return <LoadingState message="Building search index..." />;
  }

  return (
    <div className="search-page">
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

        <div className="search-page__filters">
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
          <div className="search-page__advanced-filters">
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
        <div style={{ // Quick inline style for empty spacer to keep hero centered vertically if needed 
            marginTop: '2rem' 
        }}>
           {/* Visual space or featured tags could go here */}
        </div>
      ) : results.length > 0 ? (
        <div className="search-page__results">
          <p className="search-page__count">
            Found {results.length} results for "{query}"
          </p>

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
