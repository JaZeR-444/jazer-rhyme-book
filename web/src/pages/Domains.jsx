import { Search as SearchIcon, Filter } from 'lucide-react';
import { SearchBar, LoadingState, EmptyState } from '../components/ui';
import { DomainGrid, DOMAIN_METADATA } from '../components/DomainGrid';
import { useDomains } from '../lib/hooks';
import { useState } from 'react';
import './Domains.css';

export function Domains() {
  const { domains, loading, error } = useDomains();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Get unique categories
  const categories = [...new Set(Object.values(DOMAIN_METADATA).map(m => m.category))].filter(Boolean).sort();

  const filteredDomains = domains.filter(domain => {
    const matchesSearch = domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || DOMAIN_METADATA[domain]?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <LoadingState message="Loading domains..." />;
  }

  if (error) {
    return (
      <EmptyState
        icon={<SearchIcon size={48} />}
        title="Error Loading Domains"
        description={error.message}
      />
    );
  }

  return (
    <div className="domains-page">
      <div className="domains-page__header">
        <h1 className="domains-page__title">Knowledge Domains</h1>
        <p className="domains-page__description">
          Explore {domains.length} interconnected knowledge domains covering music, culture, technology, and more.
        </p>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Search domains..."
          className="domains-page__search"
        />

        {/* Category Filters */}
        <div className="domains-category-filters">
          <div className="category-filters-header">
            <Filter size={16} />
            <span>Filter by Category</span>
          </div>
          <div className="category-filters-buttons">
            <button
              className={`category-chip ${!selectedCategory ? 'active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredDomains.length > 0 ? (
        <DomainGrid domains={filteredDomains} />
      ) : (
        <EmptyState
          icon={<SearchIcon size={48} />}
          title="No Domains Found"
          description={`No domains match "${searchQuery}"`}
        />
      )}
    </div>
  );
}
