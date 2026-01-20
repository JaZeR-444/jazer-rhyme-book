import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Mobile Gesture Hooks
 * Implements swipe-to-go-back and long-press gestures
 */

export const useSwipeNavigation = (enabled = true) => {
  const navigate = useNavigate();
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const isSwiping = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      isSwiping.current = false;
    };

    const handleTouchMove = (e) => {
      if (isSwiping.current) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      // Detect horizontal swipe from left edge (go back gesture)
      if (
        touchStartRef.current.x < 50 && // Started near left edge
        deltaX > 100 && // Swipe right
        Math.abs(deltaY) < 50 // Mostly horizontal
      ) {
        isSwiping.current = true;
        navigate(-1);
      }
    };

    const handleTouchEnd = () => {
      isSwiping.current = false;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, navigate]);
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

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
};

// Pull to refresh gesture
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
  };
};
