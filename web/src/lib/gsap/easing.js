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
