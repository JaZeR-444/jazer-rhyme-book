import { Link } from 'react-router-dom';
import { Badge, GenerativeArt } from './ui';
import { Pin } from 'lucide-react';
import { useWorkspace } from '../lib/WorkspaceContext';
import './EntityCard.css';

export function EntityCard({ entity, domain }) {
  const { isPinned, addItem, removeItem } = useWorkspace();
  const pinned = isPinned(entity.id, 'entity');

  const handlePin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (pinned) {
      removeItem(entity.id, 'entity');
    } else {
      addItem({
        id: entity.id,
        type: 'entity',
        title: entity.name,
        subtitle: entity.type,
        link: `/entities/${domain}/${entity.id}`
      });
    }
  };

  return (
    <Link
      to={`/entities/${domain}/${entity.id}`}
      className="entity-card"
    >
      <div className="entity-card__bg">
         <GenerativeArt seed={entity.id} />
      </div>
      <div className="entity-card__content">
      <div className="entity-card__header">
        <h3 className="entity-card__name">{entity.name}</h3>
        <button 
          className={`entity-pin-btn ${pinned ? 'is-pinned' : ''}`}
          onClick={handlePin}
          title={pinned ? "Remove from Verse Board" : "Pin to Verse Board"}
        >
          <Pin size={14} fill={pinned ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="entity-card__type">
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
      </div>
    </Link>
  );
}
