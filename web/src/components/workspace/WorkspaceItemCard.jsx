import { Link } from 'react-router-dom';
import { BookOpen, Database, Tag, X, Pin, ExternalLink, Network } from 'lucide-react';
import { Badge } from '../ui';
import './WorkspaceItemCard.css';

const TYPE_CONFIG = {
  word: {
    icon: BookOpen,
    color: '#00CED1',
    label: 'Word'
  },
  entity: {
    icon: Database,
    color: '#5D3FD3',
    label: 'Entity'
  },
  domain: {
    icon: Tag,
    color: '#FF00FF',
    label: 'Domain'
  }
};

/**
 * WorkspaceItemCard - Enhanced card for workspace items
 */
export function WorkspaceItemCard({
  item,
  connections = [],
  onRemove,
  onPin,
  isPinned = false,
  onClick
}) {
  const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.word;
  const Icon = config.icon;

  return (
    <div 
      className={`workspace-item-card ${isPinned ? 'is-pinned' : ''}`}
      style={{ '--item-color': config.color }}
      onClick={onClick}
    >
      {/* Type Indicator */}
      <div className="workspace-item-card__type" style={{ background: config.color }}>
        <Icon size={14} />
      </div>

      {/* Main Content */}
      <div className="workspace-item-card__content">
        <div className="workspace-item-card__header">
          <span className="workspace-item-card__label">{config.label}</span>
          {connections.length > 0 && (
            <Badge size="sm" variant="outline" className="workspace-item-card__connections">
              <Network size={10} />
              {connections.length}
            </Badge>
          )}
        </div>

        <h4 className="workspace-item-card__title">{item.title}</h4>
        
        {item.subtitle && (
          <p className="workspace-item-card__subtitle">{item.subtitle}</p>
        )}

        {item.notes && (
          <p className="workspace-item-card__notes">
            <span className="workspace-item-card__notes-label">Note:</span> {item.notes}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="workspace-item-card__actions">
        {item.link && (
          <Link 
            to={item.link} 
            className="workspace-item-card__action"
            title="View Details"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={14} />
          </Link>
        )}
        {onPin && (
          <button
            className={`workspace-item-card__action ${isPinned ? 'is-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onPin();
            }}
            title={isPinned ? 'Unpin' : 'Pin'}
          >
            <Pin size={14} />
          </button>
        )}
        {onRemove && (
          <button
            className="workspace-item-card__action workspace-item-card__action--danger"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            title="Remove"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Glow Effect */}
      <div className="workspace-item-card__glow" />
    </div>
  );
}
