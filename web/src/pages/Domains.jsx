import { Search as SearchIcon } from 'lucide-react';
import { SearchBar, LoadingState, EmptyState } from '../components/ui';
import { DomainGrid } from '../components/DomainGrid';
import { useDomains } from '../lib/hooks';
import { useState } from 'react';
import './Domains.css';

export function Domains() {
  const { domains, loading, error } = useDomains();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDomains = domains.filter(domain =>
    domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
