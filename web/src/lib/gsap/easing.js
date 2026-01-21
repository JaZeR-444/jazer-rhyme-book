/**
 * Motion Easing Library
 * =====================
 * 
 * PRINCIPLE: Easing defines emotional tone.
 * - power2.out → Safe, predictable exits
 * - power4.out → Dramatic entrances (hero moments only)
 * - expo.out → Snappy, precise interactions
 * 
 * CONSTRAINT: Never use linear for UI motion.
 * 
 * USAGE:
 *   import { easing, timing } from '../lib/gsap/easing';
 *   gsap.to(element, { duration: timing.short, ease: easing.snap });
 */

export const easing = {
  // Standard transitions
  default: 'power3.inOut',
  
  // Exit animations
  out: 'power2.out',
  
  // Dramatic entrances (hero, section reveals)
  dramatic: 'power4.out',
  
  // Snappy interactions (hovers, clicks)
  snap: 'expo.out',
  
  // Playful reveals (cards, nodes)
  overshoot: 'back.out(1.2)',
  
  // Smooth deceleration
  smooth: 'circ.out',
};

/**
 * Timing Presets
 * 
 * PHILOSOPHY:
 * - Micro: Instant feedback, never noticed
 * - Short: Quick but visible
 * - Medium: Comfortable, readable
 * - Long: Cinematic, deliberate
 */
export const timing = {
  micro: 0.15,    // Hover states, toggles
  short: 0.3,     // Button clicks, small reveals
  medium: 0.5,    // Card transitions, text reveals
  long: 0.8,      // Section entrances
  cinematic: 1.2, // Hero animations only
};

/**
 * Stagger Presets
 * 
 * Used for sequential element reveals.
 */
export const stagger = {
  tight: 0.05,   // Fast cascade
  normal: 0.1,   // Standard spacing
  relaxed: 0.15, // Readable sequence
  dramatic: 0.2, // Emphasized entrance
};

/**
 * Helper function to apply motion preset
 * 
 * @param {string} preset - Preset name ('exit', 'entrance', 'snap', 'smooth')
 * @returns {Object} - GSAP animation config
 * 
 * @example
 *   gsap.to(element, { ...motionPreset('entrance'), x: 100 });
 */
export function motionPreset(preset) {
  const presets = {
    exit: { duration: timing.short, ease: easing.out },
    entrance: { duration: timing.medium, ease: easing.dramatic },
    snap: { duration: timing.micro, ease: easing.snap },
    smooth: { duration: timing.short, ease: easing.smooth },
    default: { duration: timing.short, ease: easing.default },
  };

  return presets[preset] || presets.default;
}

/**
 * Apply reduced motion preferences
 * 
 * @param {Object} config - GSAP animation config
 * @returns {Object} - Modified config if reduced motion preferred
 * 
 * @example
 *   gsap.to(element, withMotionPreference({ duration: 0.5, x: 100 }));
 */
export function withMotionPreference(config) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return { ...config, duration: 0, ease: 'none' };
  }
  return config;
}

