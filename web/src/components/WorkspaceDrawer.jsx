import { X, ChevronUp, ChevronDown, Pin, Trash2, ExternalLink } from 'lucide-react';
import { useWorkspace } from '../lib/WorkspaceContext';
import { Link } from 'react-router-dom';
import { Badge } from './ui';
import './WorkspaceDrawer.css';

export function WorkspaceDrawer() {
  const { items, removeItem, isOpen, toggleWorkspace, clearWorkspace } = useWorkspace();

  if (items.length === 0 && !isOpen) return null;

  return (
    <div className={`workspace-drawer ${isOpen ? 'is-open' : ''}`}>
      <button 
        className="workspace-drawer__toggle"
        onClick={toggleWorkspace}
      >
        <span className="workspace-drawer__label">
          <Pin size={14} className="workspace-pin-icon" />
          Verse Board
          <Badge variant="secondary" size="sm" className="workspace-count">
            {items.length}
          </Badge>
        </span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      <div className="workspace-drawer__content">
        <div className="workspace-drawer__header">
          <h3>Pinned Items</h3>
          <button 
            className="workspace-drawer__clear"
            onClick={clearWorkspace}
            disabled={items.length === 0}
          >
            Clear All
          </button>
        </div>

        {items.length === 0 ? (
          <div className="workspace-drawer__empty">
            <p>Pin words and entities here to build your verse.</p>
          </div>
        ) : (
          <div className="workspace-drawer__grid">
            {items.map((item) => (
              <div key={`${item.type}-${item.id}`} className="workspace-item">
                <div className="workspace-item__main">
                  <div className="workspace-item__type">
                    {item.type === 'word' ? 'Word' : 'Entity'}
                  </div>
                  <Link to={item.link} className="workspace-item__title">
                    {item.title}
                  </Link>
                  {item.subtitle && (
                    <div className="workspace-item__subtitle">{item.subtitle}</div>
                  )}
                </div>
                <div className="workspace-item__actions">
                  <Link to={item.link} className="workspace-action" title="View Details">
                    <ExternalLink size={14} />
                  </Link>
                  <button 
                    className="workspace-action workspace-action--danger"
                    onClick={() => removeItem(item.id, item.type)}
                    title="Remove Pin"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
