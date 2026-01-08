import { Link } from 'react-router-dom';
import { Badge } from './ui';
import './EntityCard.css';

export function EntityCard({ entity, domain }) {
  return (
    <Link
      to={`/entities/${domain}/${entity.id}`}
      className="entity-card"
    >
      <div className="entity-card__header">
        <h3 className="entity-card__name">{entity.name}</h3>
        <Badge variant="outline" size="sm">{entity.type}</Badge>
      </div>

      {entity.one_liner && (
        <p className="entity-card__description">{entity.one_liner}</p>
      )}

      {entity.tags && entity.tags.length > 0 && (
        <div className="entity-card__tags">
          {entity.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} size="sm" variant="default">
              {tag}
            </Badge>
          ))}
          {entity.tags.length > 3 && (
            <span className="entity-card__more-tags">
              +{entity.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {entity.era && (
        <div className="entity-card__meta">
          <span className="entity-card__era">{entity.era}</span>
        </div>
      )}
    </Link>
  );
}
