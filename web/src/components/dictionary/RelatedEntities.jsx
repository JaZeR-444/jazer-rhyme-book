import { Link } from 'react-router-dom';
import { ExternalLink, Database, ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { useDomains } from '../../lib/hooks';
import './RelatedEntities.css';

function RelatedEntityCard({ entity }) {
  const domainIcon = <Database size={14} />;

  return (
    <Link to={`/entities/${entity.domain}/${entity.id}`} className="related-entity-card glass">
      <div className="related-entity-card__icon">
        {entity.icon || domainIcon}
      </div>
      <div className="related-entity-card__content">
        <span className="related-entity-card__domain">{entity.domain}</span>
        <h4 className="related-entity-card__name">{entity.name}</h4>
        {entity.description && (
          <p className="related-entity-card__description">
            {entity.description.length > 60
              ? entity.description.substring(0, 60) + '...'
              : entity.description}
          </p>
        )}
      </div>
      <ArrowRight size={14} className="related-entity-card__arrow" />
    </Link>
  );
}

export function RelatedEntities({ wordData, manualEntities = [] }) {
  const { domains, loading: domainsLoading } = useDomains();

  // Combine manual entities with auto-suggested ones
  const relatedEntities = useMemo(() => {
    const entities = [...manualEntities];

    // Auto-suggest entities based on word tags
    if (wordData?.t && wordData.t.length > 0) {
      // This would need access to entity data by tag
      // For now, we'll implement a simpler version that suggests by domain name matching
      const wordTags = wordData.t.map(t => t.toLowerCase());

      // Suggest domains that match word tags
      domains.forEach(domain => {
        const domainLower = domain.toLowerCase();
        if (wordTags.some(tag => domainLower.includes(tag) || tag.includes(domainLower))) {
          // Add a placeholder suggestion
          // In a real implementation, we'd query entities by domain and tag
        }
      });
    }

    return entities;
  }, [wordData, manualEntities, domains]);

  if (domainsLoading) {
    return (
      <section className="related-entities">
        <div className="related-entities__loading">
          <span>Loading related entities...</span>
        </div>
      </section>
    );
  }

  // If no manual entities and no auto-suggestions, don't show the section
  if (relatedEntities.length === 0) {
    return null;
  }

  return (
    <section className="related-entities">
      <div className="related-entities__header">
        <Database size={18} className="related-entities__icon" />
        <h3 className="related-entities__title">Related Entities</h3>
      </div>

      <div className="related-entities__grid">
        {relatedEntities.map((entity, idx) => (
          <RelatedEntityCard key={idx} entity={entity} />
        ))}
      </div>
    </section>
  );
}

// Utility function to extract related_entities from markdown frontmatter
export function parseRelatedEntities(frontmatter) {
  if (!frontmatter) return [];

  // Support multiple formats:
  // related_entities: [music/kendrick-lamar, tech/apple]
  // related_entities:
  //   - domain: music
  //     id: kendrick-lamar
  // related_entities: "music/kendrick-lamar, tech/apple"

  if (frontmatter.related_entities) {
    const entities = frontmatter.related_entities;

    if (typeof entities === 'string') {
      // Comma-separated string
      return entities.split(',').map(s => {
        const [domain, id] = s.trim().split('/');
        return { domain, id };
      });
    }

    if (Array.isArray(entities)) {
      return entities.map(e => {
        if (typeof e === 'string') {
          const [domain, id] = e.split('/');
          return { domain, id };
        }
        return e; // Already an object
      });
    }
  }

  return [];
}
