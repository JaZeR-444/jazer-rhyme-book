import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllEntities } from '../lib/data/knowledgeHub';
import { Badge, Card } from './ui';
import './SimilarEntities.css';

export function SimilarEntities({ currentEntity, currentDomain, maxResults = 6 }) {
  const similar = useMemo(() => {
    if (!currentEntity || !currentEntity.tags) return [];

    const allEntities = getAllEntities();
    const currentTags = new Set(currentEntity.tags);

    // Calculate similarity score for each entity
    return allEntities
      .filter(({ entity }) => entity.id !== currentEntity.id) // Exclude current entity
      .map(({ entity, domain }) => {
        if (!entity.tags) return { entity, domain, score: 0, sharedTags: [] };

        // Count shared tags
        const sharedTags = entity.tags.filter(tag => currentTags.has(tag));
        const score = sharedTags.length;

        return { entity, domain, score, sharedTags };
      })
      .filter(item => item.score > 0) // Only include entities with at least 1 shared tag
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, maxResults);
  }, [currentEntity, maxResults]);

  if (similar.length === 0) {
    return null;
  }

  return (
    <Card className="similar-entities">
      <div className="similar-entities__header">
        <Sparkles size={20} aria-hidden="true" />
        <h3>Similar Entities</h3>
        <span className="similar-entities__count">{similar.length} found</span>
      </div>

      <div className="similar-entities__grid">
        {similar.map(({ entity, domain, score, sharedTags }) => (
          <Link
            key={`${domain}-${entity.id}`}
            to={`/entities/${domain}/${entity.id}`}
            className="similar-entity-card"
          >
            <div className="similar-entity-card__header">
              <div className="similar-entity-card__name">{entity.name}</div>
              <Badge size="xs" variant="secondary">{domain}</Badge>
            </div>

            {entity.one_liner && (
              <p className="similar-entity-card__description">{entity.one_liner}</p>
            )}

            <div className="similar-entity-card__tags">
              <span className="similar-entity-card__match">
                {score} shared tag{score > 1 ? 's' : ''}:
              </span>
              <div className="similar-entity-card__tag-list">
                {sharedTags.map((tag, idx) => (
                  <Badge key={idx} size="xs" variant="purple">{tag}</Badge>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
