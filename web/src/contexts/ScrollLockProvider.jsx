import { createContext, useContext, useCallback, useRef } from 'react';

/**
 * ScrollLockContext - Context for managing body scroll lock state
 * Prevents body scrolling when modals, dialogs, or bottom sheets are open
 */
const ScrollLockContext = createContext();

/**
 * ScrollLockProvider - Provides scroll lock functionality to child components
 *
 * @param {ReactNode} children - Child components
 */
export function ScrollLockProvider({ children }) {
  const lockCountRef = useRef(0);

  const lock = useCallback(() => {
    lockCountRef.current += 1;

    if (lockCountRef.current === 1) {
      // Store original overflow value
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.body.setAttribute('data-scroll-locked', 'true');
      document.body.setAttribute(
        'data-original-overflow',
        originalOverflow || 'auto'
      );

      // Prevent iOS Safari rubber band effect
      if (typeof window !== 'undefined') {
        document.addEventListener('touchmove', preventScroll, {
          passive: false,
        });
      }
    }
  }, []);

  const unlock = useCallback(() => {
    lockCountRef.current = Math.max(0, lockCountRef.current - 1);

    if (lockCountRef.current === 0) {
      const originalOverflow =
        document.body.getAttribute('data-original-overflow') || 'auto';
      document.body.style.overflow = originalOverflow;
      document.body.removeAttribute('data-scroll-locked');
      document.body.removeAttribute('data-original-overflow');

      // Re-enable touch scroll
      if (typeof window !== 'undefined') {
        document.removeEventListener('touchmove', preventScroll);
      }
    }
  }, []);

  const value = {
    lock,
    unlock,
    isLocked: lockCountRef.current > 0,
  };

  return (
    <ScrollLockContext.Provider value={value}>
      {children}
    </ScrollLockContext.Provider>
  );
}

/**
 * useScrollLock - Hook to access scroll lock functionality
 *
 * @returns {Object} - { lock, unlock, isLocked }
 * @throws {Error} - If used outside ScrollLockProvider
 */
export function useScrollLock() {
  const context = useContext(ScrollLockContext);

  if (!context) {
    throw new Error('useScrollLock must be used within ScrollLockProvider');
  }

  return context;
}

/**
 * Prevent default scroll behavior
 * Used to prevent iOS rubber band effect
 */
function preventScroll(event) {
  if (event.target.closest('[data-allow-scroll]')) {
    return;
  }
  event.preventDefault();
}
