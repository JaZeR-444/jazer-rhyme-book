import { useEffect, useRef } from 'react';

/**
 * Hook to register keyboard shortcuts with enhanced features
 * @param {Object} shortcuts - Map of key combinations to handlers
 * @param {boolean} enabled - Whether shortcuts are enabled
 * @param {Object} options - Additional options
 */
export function useKeyboardShortcuts(shortcuts, enabled = true, options = {}) {
  const {
    preventDefault = true,
    capture = false,
    target = null,
    enableInInputs = false,
    sequence = false, // For sequences like 'g+h'
    sequenceTimeout = 1000
  } = options;

  const sequenceRef = useRef([]);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const targetElement = target || window;

    // Move handleSequence outside to avoid recreation
    const handleSequence = (event, simpleKey, combo) => {
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Add current key to sequence
      sequenceRef.current.push(simpleKey);

      // Set timeout to reset sequence
      timeoutRef.current = setTimeout(() => {
        sequenceRef.current = [];
      }, sequenceTimeout);

      // Check for sequence matches
      const sequenceStr = sequenceRef.current.join('+');
      
      if (shortcuts[sequenceStr]) {
        if (preventDefault) event.preventDefault();
        shortcuts[sequenceStr](event);
        sequenceRef.current = []; // Reset sequence after match
        clearTimeout(timeoutRef.current);
      }
    };

    const handleKeyDown = (event) => {
      // Don't trigger shortcuts when typing in inputs (unless explicitly enabled)
      const targetEl = event.target;
      const isInInput = (
        targetEl.tagName === 'INPUT' ||
        targetEl.tagName === 'TEXTAREA' ||
        targetEl.isContentEditable ||
        targetEl.getAttribute('role') === 'textbox'
      );

      if (isInInput && !enableInInputs) {
        // Allow some shortcuts even in inputs
        const allowedInInputs = ['escape', 'ctrl+k', 'ctrl+/'];
        const key = event.key.toLowerCase();
        const combo = buildKeyCombo(event);
        
        if (!allowedInInputs.includes(key) && !allowedInInputs.includes(combo)) {
          return;
        }
      }

      // Build key combination string
      const combo = buildKeyCombo(event);
      const simpleKey = event.key.toLowerCase();

      // Handle sequences (like 'g+h' for "go home")
      if (sequence) {
        handleSequence(event, simpleKey, combo);
        return;
      }

      // Check if any registered shortcut matches
      let matched = false;
      if (shortcuts[combo]) {
        if (preventDefault) event.preventDefault();
        shortcuts[combo](event);
        matched = true;
      } else if (shortcuts[simpleKey]) {
        if (preventDefault) event.preventDefault();
        shortcuts[simpleKey](event);
        matched = true;
      }

      // Show visual feedback for matched shortcuts
      if (matched && options.showFeedback) {
        showShortcutFeedback(combo || simpleKey);
      }
    };

    const buildKeyCombo = (event) => {
      const parts = [];
      if (event.ctrlKey || event.metaKey) parts.push('ctrl');
      if (event.altKey) parts.push('alt');
      if (event.shiftKey) parts.push('shift');

      const key = event.key.toLowerCase();
      parts.push(key);

      return parts.join('+');
    };

    targetElement.addEventListener('keydown', handleKeyDown, capture);
    
    return () => {
      targetElement.removeEventListener('keydown', handleKeyDown, capture);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [shortcuts, enabled, preventDefault, capture, target, enableInInputs, sequence, sequenceTimeout, options.showFeedback]);
}

/**
 * Show visual feedback for keyboard shortcuts
 * Ensures styles are only injected once
 */
function showShortcutFeedback(shortcut) {
  // Ensure feedback styles are injected only once
  if (!document.getElementById('keyboard-feedback-styles')) {
    const style = document.createElement('style');
    style.id = 'keyboard-feedback-styles';
    style.textContent = `
      .keyboard-shortcut-feedback {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-primary, #007bff);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.2s ease-out, fadeOut 0.3s ease-out 1.5s;
        pointer-events: none;
      }
      
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      
      @media (prefers-reduced-motion: reduce) {
        .keyboard-shortcut-feedback {
          animation: none;
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Create temporary feedback element
  const feedback = document.createElement('div');
  feedback.className = 'keyboard-shortcut-feedback';
  feedback.textContent = `Shortcut: ${shortcut}`;
  feedback.setAttribute('role', 'status');
  feedback.setAttribute('aria-live', 'polite');

  document.body.appendChild(feedback);

  // Remove after animation
  setTimeout(() => {
    if (feedback.parentNode) {
      feedback.parentNode.removeChild(feedback);
    }
  }, 2000);
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
 * 
 * @param {string|string[]} keys - Shortcut keys
 * @param {boolean} useUnicode - Use Unicode symbols (⌘/⌥/⇧) or ASCII fallbacks
 * @returns {string} - Formatted shortcut string
 */
export function formatShortcut(keys, useUnicode = true) {
  if (!Array.isArray(keys)) keys = [keys];

  return keys[0]
    .split('+')
    .map(k => {
      if (useUnicode) {
        if (k === 'ctrl') return '⌘/Ctrl';
        if (k === 'alt') return '⌥/Alt';
        if (k === 'shift') return '⇧';
        if (k === 'escape') return 'Esc';
      } else {
        // ASCII-safe fallbacks
        if (k === 'ctrl') return 'Ctrl';
        if (k === 'alt') return 'Alt';
        if (k === 'shift') return 'Shift';
        if (k === 'escape') return 'Esc';
      }
      return k.toUpperCase();
    })
    .join(' + ');
}
