import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, Keyboard } from 'lucide-react';
import { SHORTCUTS, formatShortcut } from '../lib/useKeyboardShortcuts';
import './KeyboardShortcutsHelp.css';

export function KeyboardShortcutsHelp({ isOpen, onClose }) {
  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = {
    Navigation: ['SEARCH', 'WORKSPACE', 'HOME', 'DOMAINS', 'DICTIONARY', 'STUDIO'],
    Actions: ['PIN', 'COPY', 'EXPORT', 'GRAPH'],
    Utility: ['ESCAPE', 'HELP'],
  };

  return (
    <div className="shortcuts-modal" role="dialog" aria-modal="true" aria-labelledby="shortcuts-title">
      <div className="shortcuts-overlay" onClick={onClose} role="presentation" />
      <div className="shortcuts-content">
        <div className="shortcuts-header">
          <div className="shortcuts-title-wrapper">
            <Keyboard size={24} aria-hidden="true" />
            <h2 id="shortcuts-title">Keyboard Shortcuts</h2>
          </div>
          <button 
            className="shortcuts-close" 
            onClick={onClose}
            aria-label="Close shortcuts help"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="shortcuts-body">
          {Object.entries(categories).map(([category, shortcutKeys]) => (
            <section key={category} className="shortcuts-category" aria-labelledby={`cat-${category}`}>
              <h3 id={`cat-${category}`} className="shortcuts-category-title">{category}</h3>
              <div className="shortcuts-list">
                {shortcutKeys.map((key) => {
                  const shortcut = SHORTCUTS[key];
                  if (!shortcut) return null;
                  
                  return (
                    <div key={key} className="shortcuts-item">
                      <span className="shortcuts-description">
                        {shortcut.description}
                      </span>
                      <kbd className="shortcuts-keys" aria-label={`Keys: ${formatShortcut(shortcut.keys)}`}>
                        {formatShortcut(shortcut.keys)}
                      </kbd>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="shortcuts-footer">
          <p>Press <kbd aria-hidden="true">?</kbd> to toggle this help panel</p>
        </div>
      </div>
    </div>
  );
}

KeyboardShortcutsHelp.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};