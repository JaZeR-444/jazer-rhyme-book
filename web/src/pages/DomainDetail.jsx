import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import { Breadcrumbs, SearchBar, LoadingState, EmptyState, Badge, Button } from '../components/ui';
import { EntityCard } from '../components/EntityCard';
import { useDomainEntities, useDomainIndexes } from '../lib/hooks';
import { useState } from 'react';
import './DomainDetail.css';

export function DomainDetail() {
  const { domainId } = useParams();
  const { entities, loading, error } = useDomainEntities(domainId);
  const { indexes } = useDomainIndexes(domainId);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState(new Set());

  const domainName = domainId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Get all unique tags from indexes
  const allTags = indexes?.byTag ? Object.keys(indexes.byTag).sort() : [];

  // Filter entities
  const filteredEntities = entities.filter(entity => {
    const matchesSearch = searchQuery === '' ||
      entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entity.tags && entity.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesTags = selectedTags.size === 0 ||
      (entity.tags && entity.tags.some(tag => selectedTags.has(tag)));

    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setSelectedTags(newTags);
  };

  if (loading) {
    return <LoadingState message={`Loading ${domainName} entities...`} />;
  }

  if (error) {
    return (
      <div className="domain-detail">
        <EmptyState
          title="Error Loading Domain"
          description={error.message}
          action={() => window.history.back()}
          actionLabel="Go Back"
        />
      </div>
    );
  }

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
          {selectedTags.size > 0 && ` with ${selectedTags.size} filter${selectedTags.size > 1 ? 's' : ''}`}
        </p>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Search entities..."
          className="domain-detail__search"
        />
      </div>

      {allTags.length > 0 && (
        <div className="domain-detail__filters">
          <div className="domain-detail__filters-header">
            <Filter size={16} />
            <span>Filter by tags:</span>
          </div>
          <div className="domain-detail__tags">
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.has(tag) ? 'primary' : 'outline'}
                className="domain-detail__tag"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          {selectedTags.size > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTags(new Set())}
            >
              Clear filters
            </Button>
          )}
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
          description={
            searchQuery || selectedTags.size > 0
              ? "Try adjusting your search or filters"
              : "This domain has no entities yet"
          }
        />
      )}
    </div>
  );
}
