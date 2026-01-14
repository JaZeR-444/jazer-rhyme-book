import { X, Keyboard } from 'lucide-react';
import { SHORTCUTS, formatShortcut } from '../lib/useKeyboardShortcuts';
import './KeyboardShortcutsHelp.css';

export function KeyboardShortcutsHelp({ isOpen, onClose }) {
  if (!isOpen) return null;

  const categories = {
    Navigation: ['SEARCH', 'WORKSPACE', 'HOME', 'DOMAINS', 'DICTIONARY', 'STUDIO'],
    Actions: ['PIN', 'COPY', 'EXPORT', 'GRAPH'],
    Utility: ['ESCAPE', 'HELP'],
  };

  return (
    <div className="shortcuts-modal">
      <div className="shortcuts-overlay" onClick={onClose} />
      <div className="shortcuts-content">
        <div className="shortcuts-header">
          <div className="shortcuts-title">
            <Keyboard size={24} />
            <h2>Keyboard Shortcuts</h2>
          </div>
          <button className="shortcuts-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="shortcuts-body">
          {Object.entries(categories).map(([category, shortcutKeys]) => (
            <div key={category} className="shortcuts-category">
              <h3 className="shortcuts-category-title">{category}</h3>
              <div className="shortcuts-list">
                {shortcutKeys.map((key) => {
                  const shortcut = SHORTCUTS[key];
                  return (
                    <div key={key} className="shortcuts-item">
                      <span className="shortcuts-description">
                        {shortcut.description}
                      </span>
                      <kbd className="shortcuts-keys">
                        {formatShortcut(shortcut.keys)}
                      </kbd>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="shortcuts-footer">
          <p>Press <kbd>?</kbd> to toggle this help panel</p>
        </div>
      </div>
    </div>
  );
}
