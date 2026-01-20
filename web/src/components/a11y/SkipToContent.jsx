/**
 * SkipToContent.jsx
 * 
 * Accessibility component for keyboard navigation - provides skip links
 */

import React from 'react';
import './SkipToContent.css';

export default function SkipToContent() {
  const handleSkipToMain = (e) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content') || 
                       document.querySelector('main') ||
                       document.querySelector('[role="main"]');
    
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSkipToNav = (e) => {
    e.preventDefault();
    const navigation = document.getElementById('main-navigation') ||
                      document.querySelector('nav') ||
                      document.querySelector('[role="navigation"]');
    
    if (navigation) {
      navigation.focus();
      navigation.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSkipToSearch = (e) => {
    e.preventDefault();
    const searchInput = document.getElementById('search-input') ||
                       document.querySelector('input[type="search"]') ||
                       document.querySelector('[aria-label*="search" i]');
    
    if (searchInput) {
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="skip-to-content" aria-label="Skip navigation links">
      <a 
        href="#main-content" 
        className="skip-link"
        onClick={handleSkipToMain}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleSkipToMain(e);
          }
        }}
      >
        Skip to main content
      </a>
      
      <a 
        href="#main-navigation"
        className="skip-link"
        onClick={handleSkipToNav}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleSkipToNav(e);
          }
        }}
      >
        Skip to navigation
      </a>
      
      <a 
        href="#search-input"
        className="skip-link"
        onClick={handleSkipToSearch}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleSkipToSearch(e);
          }
        }}
      >
        Skip to search
      </a>
    </div>
  );
}

export function FocusManager({ children, restoreFocus = true }) {
  const previousFocus = React.useRef(null);

  React.useEffect(() => {
    if (restoreFocus) {
      previousFocus.current = document.activeElement;
    }

    return () => {
      if (restoreFocus && previousFocus.current) {
        previousFocus.current.focus();
      }
    };
  }, [restoreFocus]);

  return <>{children}</>;
}

export function LiveRegion({ 
  children, 
  level = 'polite', 
  atomic = true,
  id = 'live-region' 
}) {
  return (
    <div
      id={id}
      aria-live={level}
      aria-atomic={atomic}
      aria-relevant="additions text"
      className="sr-only"
    >
      {children}
    </div>
  );
}

export function VisuallyHidden({ children, focusable = false, ...props }) {
  const className = focusable ? 'sr-only-focusable' : 'sr-only';
  
  return (
    <span className={className} {...props}>
      {children}
    </span>
  );
}

export function FocusTrap({ children, active = true, restoreFocus = true }) {
  const containerRef = React.useRef(null);
  const previousFocus = React.useRef(null);

  const getFocusableElements = () => {
    if (!containerRef.current) return [];
    
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input[type="text"]:not([disabled])',
      'input[type="radio"]:not([disabled])',
      'input[type="checkbox"]:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];
    
    return Array.from(
      containerRef.current.querySelectorAll(focusableSelectors.join(','))
    ).filter(el => {
      // Check if element is actually visible and focusable
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             !el.hasAttribute('aria-hidden');
    });
  };

  const handleTabKey = (e) => {
    if (!active || e.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  const handleEscapeKey = (e) => {
    if (active && e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      
      // Dispatch custom escape event for parent components to handle
      const escapeEvent = new CustomEvent('focustrap:escape', {
        bubbles: true,
        cancelable: true
      });
      
      containerRef.current?.dispatchEvent(escapeEvent);
    }
  };

  React.useEffect(() => {
    if (!active) return;

    // Store previous focus
    previousFocus.current = document.activeElement;

    // Focus first focusable element
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Add event listeners
    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
      
      // Restore previous focus
      if (restoreFocus && previousFocus.current) {
        previousFocus.current.focus();
      }
    };
  }, [active]);

  return (
    <div ref={containerRef} data-focus-trap={active ? 'active' : 'inactive'}>
      {children}
    </div>
  );
}

export function KeyboardNavigationHint({ 
  shortcuts = [],
  position = 'bottom-right',
  className = ''
}) {
  const [isVisible, setIsVisible] = React.useState(false);

  const positionClasses = {
    'top-left': 'keyboard-hint--top-left',
    'top-right': 'keyboard-hint--top-right',
    'bottom-left': 'keyboard-hint--bottom-left',
    'bottom-right': 'keyboard-hint--bottom-right'
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <button
        className="keyboard-hint-toggle"
        onClick={toggleVisibility}
        aria-label="Show keyboard shortcuts"
        aria-expanded={isVisible}
        title="Keyboard shortcuts (Press ? for help)"
      >
        ?
      </button>
      
      {isVisible && (
        <div 
          className={`keyboard-hint ${positionClasses[position]} ${className}`}
          role="dialog"
          aria-labelledby="keyboard-hint-title"
          aria-modal="false"
        >
          <FocusTrap active={isVisible}>
            <div className="keyboard-hint-content">
              <h3 id="keyboard-hint-title" className="keyboard-hint-title">
                Keyboard Shortcuts
              </h3>
              
              <button
                className="keyboard-hint-close"
                onClick={toggleVisibility}
                aria-label="Close shortcuts"
              >
                ×
              </button>
              
              <div className="keyboard-hint-list">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="keyboard-shortcut">
                    <kbd className="keyboard-key">{shortcut.key}</kbd>
                    <span className="keyboard-description">{shortcut.description}</span>
                  </div>
                ))}
                
                {shortcuts.length === 0 && (
                  <>
                    <div className="keyboard-shortcut">
                      <kbd className="keyboard-key">Tab</kbd>
                      <span className="keyboard-description">Navigate between elements</span>
                    </div>
                    <div className="keyboard-shortcut">
                      <kbd className="keyboard-key">Enter</kbd>
                      <span className="keyboard-description">Activate buttons and links</span>
                    </div>
                    <div className="keyboard-shortcut">
                      <kbd className="keyboard-key">Escape</kbd>
                      <span className="keyboard-description">Close dialogs and menus</span>
                    </div>
                    <div className="keyboard-shortcut">
                      <kbd className="keyboard-key">/</kbd>
                      <span className="keyboard-description">Focus search field</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </FocusTrap>
        </div>
      )}
      
      {isVisible && (
        <div 
          className="keyboard-hint-backdrop"
          onClick={toggleVisibility}
          aria-hidden="true"
        />
      )}
    </>
  );
}