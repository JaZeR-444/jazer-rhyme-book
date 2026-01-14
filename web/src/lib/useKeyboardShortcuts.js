import { useEffect } from 'react';

/**
 * Hook to register keyboard shortcuts
 * @param {Object} shortcuts - Map of key combinations to handlers
 * @param {boolean} enabled - Whether shortcuts are enabled
 */
export function useKeyboardShortcuts(shortcuts, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Build key combination string
      const parts = [];
      if (event.ctrlKey || event.metaKey) parts.push('ctrl');
      if (event.altKey) parts.push('alt');
      if (event.shiftKey) parts.push('shift');

      // Normalize key
      const key = event.key.toLowerCase();
      parts.push(key);

      const combo = parts.join('+');

      // Also check for simple key presses
      const simpleKey = key;

      // Check if any registered shortcut matches
      if (shortcuts[combo]) {
        event.preventDefault();
        shortcuts[combo](event);
      } else if (shortcuts[simpleKey]) {
        event.preventDefault();
        shortcuts[simpleKey](event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

/**
 * Global keyboard shortcuts configuration
 */
export const SHORTCUTS = {
  // Navigation
  SEARCH: { keys: ['/', 'ctrl+k'], description: 'Open search' },
  WORKSPACE: { keys: ['w'], description: 'Toggle Verse Board' },
  HOME: { keys: ['g+h'], description: 'Go to home' },
  DOMAINS: { keys: ['g+d'], description: 'Go to domains' },
  DICTIONARY: { keys: ['g+w'], description: 'Go to dictionary' },
  STUDIO: { keys: ['g+s'], description: 'Open Writing Studio' },

  // Actions
  PIN: { keys: ['p'], description: 'Pin current item' },
  COPY: { keys: ['c'], description: 'Copy to clipboard' },
  EXPORT: { keys: ['ctrl+e'], description: 'Export workspace' },
  GRAPH: { keys: ['g+r'], description: 'View relationship graph' },

  // Utility
  ESCAPE: { keys: ['escape'], description: 'Close modal/drawer' },
  HELP: { keys: ['?', 'shift+/'], description: 'Show keyboard shortcuts' },
};

/**
 * Format keyboard shortcut for display
 */
export function formatShortcut(keys) {
  if (!Array.isArray(keys)) keys = [keys];

  return keys[0]
    .split('+')
    .map(k => {
      if (k === 'ctrl') return '⌘/Ctrl';
      if (k === 'alt') return '⌥/Alt';
      if (k === 'shift') return '⇧';
      if (k === 'escape') return 'Esc';
      return k.toUpperCase();
    })
    .join(' + ');
}
