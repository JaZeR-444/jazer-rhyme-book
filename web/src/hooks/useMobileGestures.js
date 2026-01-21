import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Mobile Gesture Hooks
 * Implements swipe-to-go-back and long-press gestures
 */

export const useSwipeNavigation = (options = {}) => {
  const {
    enabled = true,
    edgeThreshold = 50,
    swipeThreshold = 100,
    maxVerticalDelta = 50,
    ignoreSelectors = ['input', 'textarea', 'select', '[contenteditable="true"]', '[data-gesture-ignore="true"]'],
  } = options;
  const navigate = useNavigate();
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const isSwiping = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const isIgnoredTarget = (target) => {
      if (!target || !target.closest) return false;
      return ignoreSelectors.some((selector) => target.closest(selector));
    };

    const isInHorizontalScroller = (target) => {
      if (!target || !target.closest) return false;
      const scroller = target.closest('[data-horizontal-scroll="true"], .horizontal-scroll, .scroll-x');
      if (!scroller) return false;
      return scroller.scrollWidth > scroller.clientWidth;
    };

    const handleTouchStart = (e) => {
      if (isIgnoredTarget(e.target) || isInHorizontalScroller(e.target)) return;
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      isSwiping.current = false;
    };

    const handleTouchMove = (e) => {
      if (isIgnoredTarget(e.target) || isInHorizontalScroller(e.target)) return;
      if (isSwiping.current) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      // Detect horizontal swipe from left edge (go back gesture)
      if (
        touchStartRef.current.x < edgeThreshold && // Started near left edge
        deltaX > swipeThreshold && // Swipe right
        Math.abs(deltaY) < maxVerticalDelta // Mostly horizontal
      ) {
        isSwiping.current = true;
        navigate(-1);
      }
    };

    const handleTouchEnd = () => {
      isSwiping.current = false;
    };

    const handleTouchCancel = () => {
      isSwiping.current = false;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [enabled, navigate, edgeThreshold, swipeThreshold, maxVerticalDelta, ignoreSelectors]);
};

export const useLongPress = (callback, duration = 500) => {
  const timeoutRef = useRef(null);
  const targetRef = useRef(null);

  const start = useCallback((e) => {
    targetRef.current = e.currentTarget;
    timeoutRef.current = setTimeout(() => {
      callback(e);
      // Add haptic feedback if supported
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, duration);
  }, [callback, duration]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchCancel: clear,
  };
};

export const useSwipeActions = (onSwipeLeft, onSwipeRight, threshold = 75) => {
  const touchStart = useRef({ x: 0, y: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchMove = (e) => {
    touchEnd.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = () => {
    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;

    // Only trigger if swipe is mostly horizontal
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > threshold && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < -threshold && onSwipeLeft) {
        onSwipeLeft();
      }
    }
  };

  const handleTouchCancel = () => {
    touchStart.current = { x: 0, y: 0 };
    touchEnd.current = { x: 0, y: 0 };
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
  };
};

// Pull to refresh gesture
// Usage: attach to the root scroll container so preventDefault can work.
export const usePullToRefresh = (onRefresh, threshold = 80) => {
  const startY = useRef(0);
  const currentY = useRef(0);
  const isRefreshing = useRef(false);

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (window.scrollY === 0 && !isRefreshing.current) {
      currentY.current = e.touches[0].clientY;
      const pullDistance = currentY.current - startY.current;
      
      if (pullDistance > threshold) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = async () => {
    if (window.scrollY === 0 && !isRefreshing.current) {
      const pullDistance = currentY.current - startY.current;
      
      if (pullDistance > threshold) {
        isRefreshing.current = true;
        await onRefresh();
        isRefreshing.current = false;
      }
    }
    
    startY.current = 0;
    currentY.current = 0;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchEnd,
  };
};
