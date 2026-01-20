import { useState } from 'react';
import { Columns2, Plus, X } from 'lucide-react';
import './MultiColumnEditor.css';

export function MultiColumnEditor({ columns: initialColumns = [''], onChange, enabled = true }) {
  const [columns, setColumns] = useState(initialColumns);
  const [activeColumn, setActiveColumn] = useState(0);

  const handleTextChange = (index, value) => {
    const newColumns = [...columns];
    newColumns[index] = value;
    setColumns(newColumns);
    onChange?.(newColumns);
  };

  const addColumn = () => {
    const newColumns = [...columns, ''];
    setColumns(newColumns);
    onChange?.(newColumns);
    setActiveColumn(newColumns.length - 1);
  };

  const removeColumn = (index) => {
    if (columns.length <= 1) return;
    const newColumns = columns.filter((_, i) => i !== index);
    setColumns(newColumns);
    onChange?.(newColumns);
    setActiveColumn(Math.min(activeColumn, newColumns.length - 1));
  };

  if (!enabled) {
    return (
      <textarea
        value={columns[0] || ''}
        onChange={(e) => handleTextChange(0, e.target.value)}
        className="single-column-editor"
        placeholder="Start writing..."
      />
    );
  }

  return (
    <div className="multi-column-editor">
      <div className="column-tabs">
        <Columns2 size={16} />
        {columns.map((_, idx) => (
          <button
            key={idx}
            className={`column-tab ${activeColumn === idx ? 'active' : ''}`}
            onClick={() => setActiveColumn(idx)}
          >
            Column {idx + 1}
            {columns.length > 1 && (
              <button
                className="remove-column"
                onClick={(e) => {
                  e.stopPropagation();
                  removeColumn(idx);
                }}
              >
                <X size={12} />
              </button>
            )}
          </button>
        ))}
        <button className="add-column-btn" onClick={addColumn} title="Add column">
          <Plus size={16} />
        </button>
      </div>

      <div className="columns-container">
        {columns.map((text, idx) => (
          <div
            key={idx}
            className={`column ${activeColumn === idx ? 'active' : ''}`}
            style={{ display: activeColumn === idx ? 'block' : 'none' }}
          >
            <textarea
              value={text}
              onChange={(e) => handleTextChange(idx, e.target.value)}
              placeholder={`Column ${idx + 1}...`}
              className="column-textarea"
            />
          </div>
        ))}
      </div>

      <div className="column-stats">
        <span>{columns.length} column{columns.length !== 1 ? 's' : ''}</span>
        <span>
          {columns[activeColumn]?.split(/\s+/).filter(Boolean).length || 0} words
        </span>
      </div>
    </div>
  );
}
