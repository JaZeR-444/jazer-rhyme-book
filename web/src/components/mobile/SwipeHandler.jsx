/**
 * useSwipeGesture Hook
 * Detects and handles swipe gestures on touch devices
 */

import { useEffect, useRef } from 'react';

const DEFAULT_OPTIONS = {
  threshold: 50, // Minimum distance for a swipe
  restraint: 100, // Maximum perpendicular distance
  timeThreshold: 500, // Maximum time for a swipe
  velocityThreshold: 0.3, // Minimum velocity
};

export function useSwipeGesture(onSwipe, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    };

    const handleTouchEnd = (e) => {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const velocity = distance / deltaTime;

      // Determine if it's a valid swipe
      if (deltaTime > opts.timeThreshold) return;
      if (velocity < opts.velocityThreshold) return;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Horizontal swipe
      if (absX > absY && absX > opts.threshold && absY < opts.restraint) {
        const direction = deltaX > 0 ? 'right' : 'left';
        onSwipe(direction, absX, deltaTime, velocity);
      }
      // Vertical swipe
      else if (absY > absX && absY > opts.threshold && absX < opts.restraint) {
        const direction = deltaY > 0 ? 'down' : 'up';
        onSwipe(direction, absY, deltaTime, velocity);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipe, opts.threshold, opts.restraint, opts.timeThreshold, opts.velocityThreshold]);
}

/**
 * SwipeHandler Component
 * Wraps children with swipe detection
 */
export default function SwipeHandler({ children, onSwipe, options }) {
  useSwipeGesture(onSwipe, options);
  return <>{children}</>;
}
