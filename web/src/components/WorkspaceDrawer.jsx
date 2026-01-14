import { useState } from 'react';
import { X, ChevronUp, ChevronDown, Pin, Trash2, ExternalLink, Download, Plus, Edit3, GripVertical, FolderPlus, Network } from 'lucide-react';
import { useWorkspace } from '../lib/WorkspaceContext';
import { Link } from 'react-router-dom';
import { Badge } from './ui';
import { WorkspaceGraph } from './WorkspaceGraph';
import './WorkspaceDrawer.css';

export function WorkspaceDrawer() {
  const {
    items,
    sections,
    removeItem,
    updateItemSection,
    updateItemNotes,
    clearWorkspace,
    clearSection,
    addSection,
    isOpen,
    toggleWorkspace,
    exportWorkspace
  } = useWorkspace();

  const [editingNotes, setEditingNotes] = useState(null);
  const [notesText, setNotesText] = useState('');
  const [showNewSection, setShowNewSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [showGraph, setShowGraph] = useState(false);

  if (items.length === 0 && !isOpen) return null;

  const handleExport = () => {
    const text = exportWorkspace();
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verse-board-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const startEditingNotes = (item) => {
    setEditingNotes(`${item.id}-${item.type}`);
    setNotesText(item.notes || '');
  };

  const saveNotes = (id, type) => {
    updateItemNotes(id, type, notesText);
    setEditingNotes(null);
  };

  const handleAddSection = () => {
    if (newSectionName.trim()) {
      addSection(newSectionName.trim());
      setNewSectionName('');
      setShowNewSection(false);
    }
  };

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
          <div className="workspace-drawer__actions">
            <button
              className="workspace-drawer__action"
              onClick={() => setShowGraph(true)}
              disabled={items.length === 0}
              title="View Relationship Map"
            >
              <Network size={14} />
            </button>
            <button
              className="workspace-drawer__action"
              onClick={handleExport}
              disabled={items.length === 0}
              title="Export to Markdown"
            >
              <Download size={14} />
            </button>
            <button
              className="workspace-drawer__action"
              onClick={() => setShowNewSection(!showNewSection)}
              title="Add Section"
            >
              <FolderPlus size={14} />
            </button>
            <button
              className="workspace-drawer__clear"
              onClick={clearWorkspace}
              disabled={items.length === 0}
            >
              Clear All
            </button>
          </div>
        </div>

        {showNewSection && (
          <div className="workspace-new-section">
            <input
              type="text"
              placeholder="Section name..."
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSection()}
              autoFocus
            />
            <button onClick={handleAddSection}>Add</button>
            <button onClick={() => setShowNewSection(false)}>Cancel</button>
          </div>
        )}

        {items.length === 0 ? (
          <div className="workspace-drawer__empty">
            <p>Pin words and entities here to build your verse.</p>
          </div>
        ) : (
          <div className="workspace-drawer__sections">
            {sections.map((section) => {
              const sectionItems = items.filter((i) => i.sectionId === section.id);
              if (sectionItems.length === 0) return null;

              return (
                <div key={section.id} className="workspace-section">
                  <div className="workspace-section__header" style={{ borderLeftColor: section.color }}>
                    <h4>{section.name}</h4>
                    <Badge size="sm" variant="secondary">
                      {sectionItems.length}
                    </Badge>
                    {section.id !== 'general' && (
                      <button
                        className="workspace-section__clear"
                        onClick={() => clearSection(section.id)}
                        title="Clear Section"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>

                  <div className="workspace-section__items">
                    {sectionItems.map((item) => (
                      <div key={`${item.type}-${item.id}`} className="workspace-item">
                        <div className="workspace-item__drag">
                          <GripVertical size={14} />
                        </div>
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

                          {/* Section selector */}
                          <select
                            className="workspace-item__section-select"
                            value={item.sectionId}
                            onChange={(e) => updateItemSection(item.id, item.type, e.target.value)}
                          >
                            {sections.map((s) => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>

                          {/* Notes */}
                          {editingNotes === `${item.id}-${item.type}` ? (
                            <div className="workspace-item__notes-edit">
                              <textarea
                                value={notesText}
                                onChange={(e) => setNotesText(e.target.value)}
                                placeholder="Add notes..."
                                autoFocus
                              />
                              <button onClick={() => saveNotes(item.id, item.type)}>Save</button>
                              <button onClick={() => setEditingNotes(null)}>Cancel</button>
                            </div>
                          ) : (
                            <div className="workspace-item__notes">
                              {item.notes ? (
                                <p onClick={() => startEditingNotes(item)}>{item.notes}</p>
                              ) : (
                                <button
                                  className="workspace-item__add-notes"
                                  onClick={() => startEditingNotes(item)}
                                >
                                  <Plus size={12} /> Add notes
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="workspace-item__actions">
                          <Link to={item.link} className="workspace-action" title="View Details">
                            <ExternalLink size={14} />
                          </Link>
                          <button
                            className="workspace-action"
                            onClick={() => startEditingNotes(item)}
                            title="Edit Notes"
                          >
                            <Edit3 size={14} />
                          </button>
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
                </div>
              );
            })}
          </div>
        )}
      </div>

      <WorkspaceGraph isOpen={showGraph} onClose={() => setShowGraph(false)} />
    </div>
  );
}
