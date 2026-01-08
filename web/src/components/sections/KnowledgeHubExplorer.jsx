/**
 * KnowledgeHubExplorer Component
 * Displays ALL real entities from data folders
 */

import { useState, useMemo } from 'react';
import { 
  entities, 
  domains, 
  domainNames, 
  stats, 
  searchEntities,
  getRandomEntities 
} from '../../lib/data/knowledgeHub';
import './KnowledgeHubExplorer.css';

export function KnowledgeHubExplorer({ id }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDomain, setActiveDomain] = useState(null);
  
  const filteredEntities = useMemo(() => {
    if (searchQuery) {
      return searchEntities(searchQuery, { domain: activeDomain, limit: 100 });
    }
    if (activeDomain) {
      return domains[activeDomain] || [];
    }
    return getRandomEntities(50);
  }, [searchQuery, activeDomain]);
  
  return (
    <section id={id} className="hub-explorer section">
      <header className="hub-header">
        <h2 className="text-h1">Knowledge Hub</h2>
        <p className="text-secondary">
          {stats.totalEntities.toLocaleString()} entities across {stats.totalDomains} domains
        </p>
      </header>
      
      <div className="hub-search">
        <input
          type="text"
          placeholder="Search entities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="domain-filters">
        <button
          className={`domain-btn ${activeDomain === null ? 'active' : ''}`}
          onClick={() => setActiveDomain(null)}
        >
          All ({stats.totalEntities})
        </button>
        {domainNames.map((domain) => (
          <button
            key={domain}
            className={`domain-btn ${activeDomain === domain ? 'active' : ''}`}
            onClick={() => setActiveDomain(domain)}
          >
            {domain.replace(/-/g, ' ')} ({stats.byDomain[domain]})
          </button>
        ))}
      </div>
      
      <p className="results-count text-small text-secondary">
        Showing {filteredEntities.length} {activeDomain ? `in ${activeDomain}` : 'entities'}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>
      
      <div className="entity-grid">
        {filteredEntities.map((entity) => (
          <article key={entity.id} className="entity-card glass">
            <header className="entity-header">
              <h3 className="entity-name">{entity.name}</h3>
              <span className="entity-domain text-micro">{entity.domain}</span>
            </header>
            
            {entity.aliases && entity.aliases.length > 0 && (
              <div className="entity-aliases">
                {entity.aliases.slice(0, 3).map((alias) => (
                  <span key={alias} className="alias text-micro">{alias}</span>
                ))}
              </div>
            )}
            
            {entity.one_liner && (
              <p className="entity-liner text-small">{entity.one_liner}</p>
            )}
            
            {entity.era && (
              <span className="entity-era text-micro text-accent">{entity.era}</span>
            )}
            
            {entity.tags && entity.tags.length > 0 && (
              <div className="entity-tags">
                {entity.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="tag text-micro">{tag}</span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
