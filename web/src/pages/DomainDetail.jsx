import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Filter, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Breadcrumbs, SearchBar, LoadingState, EmptyState, Badge, Button, Card } from '../components/ui';
import { EntityCard } from '../components/EntityCard';
import { useDomainEntities, useDomainIndexes } from '../lib/hooks';
import { useState, useMemo } from 'react';
import './DomainDetail.css';

function FilterGroup({ title, items, selected, onToggle, expanded, onToggleExpand }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="filter-group">
      <button className="filter-group__header" onClick={onToggleExpand}>
        <span className="filter-group__title">{title}</span>
        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      
      {expanded && (
        <div className="filter-group__content">
          {items.map(item => (
            <label key={item} className="filter-item">
              <input
                type="checkbox"
                checked={selected.has(item)}
                onChange={() => onToggle(item)}
                className="filter-item__checkbox"
              />
              <span className="filter-item__label">{item}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export function DomainDetail() {
  const { domainId } = useParams();
  const { entities, loading, error } = useDomainEntities(domainId);
  const { indexes } = useDomainIndexes(domainId);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [selectedEras, setSelectedEras] = useState(new Set());
  const [selectedTypes, setSelectedTypes] = useState(new Set());
  
  // Collapsible state for filters - start collapsed
  const [expandedSections, setExpandedSections] = useState({
    eras: false,
    types: false,
    tags: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const domainName = domainId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Extract available filters
  const { allTags, allEras, allTypes } = useMemo(() => {
    const tags = new Set();
    const eras = new Set();
    const types = new Set();

    entities.forEach(entity => {
      if (entity.tags) entity.tags.forEach(t => tags.add(t));
      if (entity.era) eras.add(entity.era);
      if (entity.type) types.add(entity.type);
    });

    return {
      allTags: Array.from(tags).sort(),
      allEras: Array.from(eras).sort(),
      allTypes: Array.from(types).sort()
    };
  }, [entities]);

  // Filter entities
  const filteredEntities = useMemo(() => {
    return entities.filter(entity => {
      // Search
      const matchesSearch = searchQuery === '' ||
        entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entity.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (entity.tags && entity.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

      // Filters
      const matchesTags = selectedTags.size === 0 || 
        (entity.tags && entity.tags.some(tag => selectedTags.has(tag)));
      
      const matchesEras = selectedEras.size === 0 || 
        (entity.era && selectedEras.has(entity.era));
        
      const matchesTypes = selectedTypes.size === 0 || 
        (entity.type && selectedTypes.has(entity.type));

      return matchesSearch && matchesTags && matchesEras && matchesTypes;
    });
  }, [entities, searchQuery, selectedTags, selectedEras, selectedTypes]);

  const toggleFilter = (set, setter, item) => {
    const newSet = new Set(set);
    if (newSet.has(item)) newSet.delete(item);
    else newSet.add(item);
    setter(newSet);
  };

  const clearFilters = () => {
    setSelectedTags(new Set());
    setSelectedEras(new Set());
    setSelectedTypes(new Set());
    setSearchQuery('');
  };

  const hasActiveFilters = selectedTags.size > 0 || selectedEras.size > 0 || selectedTypes.size > 0 || searchQuery;

  if (loading) return <LoadingState message={`Loading ${domainName} entities...`} />;
  if (error) return <EmptyState title="Error" description={error.message} />;

  return (
    <div className="domain-detail">
      <div className="domain-detail__header">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Domains', path: '/domains' },
          { label: domainName, path: `/domains/${domainId}` }
        ]} />

        <div className="domain-detail__title-row">
          <Link to="/domains" className="domain-detail__back">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="domain-detail__title">{domainName}</h1>
        </div>

        <p className="domain-detail__count">
          {filteredEntities.length} {filteredEntities.length === 1 ? 'entity' : 'entities'}
        </p>
      </div>

      <div className="domain-detail__layout">
        <aside className="domain-detail__sidebar">
          <div className="filter-panel">
            <div className="filter-panel__header">
              <div className="filter-panel__title">
                <Filter size={16} /> Filters
              </div>
              {hasActiveFilters && (
                <button className="filter-panel__clear" onClick={clearFilters}>
                  Clear
                </button>
              )}
            </div>

            <div className="filter-panel__content">
              <FilterGroup 
                title="Eras" 
                items={allEras} 
                selected={selectedEras} 
                onToggle={(item) => toggleFilter(selectedEras, setSelectedEras, item)}
                expanded={expandedSections.eras}
                onToggleExpand={() => toggleSection('eras')}
              />
              
              <FilterGroup 
                title="Types" 
                items={allTypes} 
                selected={selectedTypes} 
                onToggle={(item) => toggleFilter(selectedTypes, setSelectedTypes, item)}
                expanded={expandedSections.types}
                onToggleExpand={() => toggleSection('types')}
              />

              <FilterGroup 
                title="Tags" 
                items={allTags} 
                selected={selectedTags} 
                onToggle={(item) => toggleFilter(selectedTags, setSelectedTags, item)}
                expanded={expandedSections.tags}
                onToggleExpand={() => toggleSection('tags')}
              />
            </div>
          </div>
        </aside>

        <main className="domain-detail__main">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder={`Search ${domainName}...`}
            className="domain-detail__search"
          />

          {hasActiveFilters && (
            <div className="active-filters">
              {[...selectedEras, ...selectedTypes, ...selectedTags].map(filter => (
                <Badge key={filter} variant="primary" className="active-filter-badge">
                  {filter}
                  <button 
                    onClick={() => {
                      if (selectedEras.has(filter)) toggleFilter(selectedEras, setSelectedEras, filter);
                      else if (selectedTypes.has(filter)) toggleFilter(selectedTypes, setSelectedTypes, filter);
                      else toggleFilter(selectedTags, setSelectedTags, filter);
                    }}
                    className="active-filter-remove"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {filteredEntities.length > 0 ? (
            <div className="domain-detail__grid">
              {filteredEntities.map(entity => (
                <EntityCard key={entity.id} entity={entity} domain={domainId} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Entities Found"
              description="Try adjusting your filters or search query."
              action={clearFilters}
              actionLabel="Clear All Filters"
            />
          )}
        </main>
      </div>
    </div>
  );
}


export default DomainDetail;
