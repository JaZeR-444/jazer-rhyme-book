import { useCallback, useEffect, useRef, createContext, useContext, useState } from 'react';
import { gsap } from '../../lib/gsap';
import './HapticFeedback.css';

/**
 * HapticFeedback - Visual and haptic feedback system
 * Provides multi-sensory feedback for interactions
 */

// Vibration patterns
const PATTERNS = {
  light: [10],
  medium: [20],
  heavy: [30],
  success: [10, 50, 10],
  error: [50, 100, 50],
  warning: [20, 50, 20, 50, 20],
  click: [5],
  doubleClick: [5, 50, 5]
};

// Sound effects (using Web Audio API)
class SoundFeedback {
  constructor() {
    this.audioContext = null;
    this.enabled = false;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this;
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  play(type = 'click') {
    if (!this.enabled || !this.audioContext) return;

    const frequencies = {
      click: 800,
      hover: 600,
      success: 1000,
      error: 400,
      warning: 700
    };

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequencies[type] || 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }
}

const soundFeedback = new SoundFeedback();

/**
 * useHaptic - Hook for haptic/visual feedback
 */
export function useHaptic(options = {}) {
  const {
    enableVibration = true,
    enableSound = false,
    enableVisual = true
  } = options;

  const vibrate = useCallback((pattern = 'light') => {
    if (!enableVibration) return;
    
    if (navigator.vibrate && PATTERNS[pattern]) {
      navigator.vibrate(PATTERNS[pattern]);
    }
  }, [enableVibration]);

  const playSound = useCallback((type = 'click') => {
    if (!enableSound) return;
    
    soundFeedback.init().play(type);
  }, [enableSound]);

  const trigger = useCallback((type = 'click', options = {}) => {
    const {
      vibrate: shouldVibrate = true,
      sound: shouldSound = false,
      visual: shouldVisual = true
    } = options;

    if (shouldVibrate) vibrate(type);
    if (shouldSound) playSound(type);
    
    return shouldVisual;
  }, [vibrate, playSound]);

  return { vibrate, playSound, trigger };
}

/**
 * HapticButton - Button with built-in haptic feedback
 */
export function HapticButton({ 
  children, 
  onClick,
  hapticType = 'click',
  enableSound = false,
  className = '',
  ...props 
}) {
  const { trigger } = useHaptic({ enableSound });
  const buttonRef = useRef(null);

  const handleClick = (e) => {
    trigger(hapticType, { sound: enableSound });
    
    // Visual ripple effect
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'haptic-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      buttonRef.current.appendChild(ripple);

      gsap.fromTo(ripple,
        { scale: 0, opacity: 0.6 },
        { 
          scale: 2, 
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => ripple.remove()
        }
      );
    }

    onClick?.(e);
  };

  return (
    <button
      ref={buttonRef}
      className={`haptic-button ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * VisualFeedback - Standalone visual feedback component
 */
export function VisualFeedback({ type = 'success', message, onClose, duration = 3000 }) {
  const feedbackRef = useRef(null);

  useEffect(() => {
    if (!feedbackRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => onClose?.()
    });

    tl.fromTo(feedbackRef.current,
      { y: -20, opacity: 0, scale: 0.9 },
      { 
        y: 0, 
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.7)'
      }
    )
    .to(feedbackRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.3,
      delay: duration / 1000,
      ease: 'power2.in'
    });

    return () => tl.kill();
  }, [duration, onClose]);

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div 
      ref={feedbackRef}
      className={`visual-feedback visual-feedback--${type}`}
      role="status"
      aria-live="polite"
    >
      <span className="visual-feedback__icon">{icons[type]}</span>
      <span className="visual-feedback__message">{message}</span>
    </div>
  );
}

/**
 * FeedbackProvider - Context provider for global feedback
 */
const FeedbackContext = createContext();

export function FeedbackProvider({ children }) {
  const [feedback, setFeedback] = useState(null);

  const showFeedback = useCallback((type, message, duration = 3000) => {
    setFeedback({ type, message, duration });
  }, []);

  const hideFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  return (
    <FeedbackContext.Provider value={{ showFeedback, hideFeedback }}>
      {children}
      {feedback && (
        <VisualFeedback
          type={feedback.type}
          message={feedback.message}
          duration={feedback.duration}
          onClose={hideFeedback}
        />
      )}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within FeedbackProvider');
  }
  return context;
}

// Export sound controller for global access
export { soundFeedback };
