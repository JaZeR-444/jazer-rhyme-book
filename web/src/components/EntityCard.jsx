import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Badge, GenerativeArt } from './ui';
import { EntityHoverCard } from './interactions';
import { useFeedback } from './interactions';
import { Pin, Heart } from 'lucide-react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useEntityLikes } from '../contexts/EntityLikesContext';
import { DraggableCard } from './workspace/DraggableCard';
import { memo } from 'react';
import './EntityCard.css';

// Memoize GenerativeArt to avoid expensive re-renders in lists
const MemoizedArt = memo(GenerativeArt);

/**
 * EntityCard - Displays a single entity with generative art, metadata, and actions
 *
 * @param {Object} props - Component props
 * @param {Object} props.entity - Entity data object
 * @param {string} props.entity.id - Unique entity identifier
 * @param {string} props.entity.name - Entity display name
 * @param {string} props.entity.type - Entity type/category
 * @param {string} [props.entity.one_liner] - Brief description
 * @param {string} props.domain - Domain ID the entity belongs to
 * @returns {JSX.Element} Entity card with preview, actions, and generative art
 */
export function EntityCard({ entity, domain }) {
  const { isPinned, addItem, removeItem } = useWorkspace();
  const { isLiked, toggleLike } = useEntityLikes();
  const { showFeedback } = useFeedback();
  const pinned = isPinned(entity.id, 'entity');
  const liked = isLiked(entity.id, domain);

  const handlePin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (pinned) {
      removeItem(entity.id, 'entity');
      showFeedback('info', `Removed ${entity.name} from workspace`);
    } else {
      addItem({
        id: entity.id,
        type: 'entity',
        title: entity.name,
        subtitle: entity.type,
        link: `/entities/${domain}/${entity.id}`
      });
      showFeedback('success', `Added ${entity.name} to workspace!`);
    }
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(entity.id, domain);
    showFeedback(liked ? 'info' : 'success', liked ? 'Removed from favorites' : 'Added to favorites');
  };

  const dragItem = {
    id: entity.id,
    type: 'entity',
    title: entity.name,
    subtitle: entity.type,
    link: `/entities/${domain}/${entity.id}`,
    data: entity,
    domain
  };

  return (
    <DraggableCard item={dragItem}>
      <EntityHoverCard
      entity={{
        name: entity.name,
        domain: domain,
        category: entity.type,
        tags: entity.tags,
        vibe: entity.vibe
      }}
    >
      <Link
        to={`/entities/${domain}/${entity.id}`}
        className={`entity-card ${liked ? 'is-liked' : ''}`}
      >
      {/* Liked indicator - small heart on the card */}
      {liked && (
        <div className="entity-card__liked-badge">
          <Heart size={10} fill="currentColor" />
        </div>
      )}
      
      <div className="entity-card__bg">
         <MemoizedArt seed={entity.id} />
      </div>
      <div className="entity-card__content">
      <div className="entity-card__header">
        <h3 className="entity-card__name">{entity.name}</h3>
        <div className="entity-card__actions">
          <button 
            className={`entity-like-btn ${liked ? 'is-liked' : ''}`}
            onClick={handleLike}
            title={liked ? "Remove like" : "Like this entity"}
            aria-label={liked ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={14} fill={liked ? "currentColor" : "none"} />
          </button>
          <button 
            className={`entity-pin-btn ${pinned ? 'is-pinned' : ''}`}
            onClick={handlePin}
            title={pinned ? "Remove from Verse Board" : "Pin to Verse Board"}
            aria-label={pinned ? "Remove from workspace" : "Add to workspace"}
          >
            <Pin size={14} fill={pinned ? "currentColor" : "none"} />
          </button>
        </div>
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
    </EntityHoverCard>
    </DraggableCard>
  );
}

EntityCard.propTypes = {
  entity: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    one_liner: PropTypes.string,
    era: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  domain: PropTypes.string.isRequired,
};

