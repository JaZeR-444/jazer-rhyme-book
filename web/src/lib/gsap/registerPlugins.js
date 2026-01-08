/**
 * GSAP Plugin Registration
 * ========================
 * 
 * CONSTRAINT: Register all plugins once at app initialization.
 * PATTERN: Import this file in main.jsx before any component renders.
 * 
 * Available Plugins:
 * - ScrollTrigger: Scroll-driven animations, pinning, scrubbing
 * - ScrollToPlugin: Smooth scroll navigation
 * 
 * Note: SplitText requires GSAP Club membership. If not available,
 * use CSS-based text splitting or a free alternative like splitting.js
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register plugins globally
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Configure ScrollTrigger defaults
ScrollTrigger.defaults({
  toggleActions: 'play none none reverse',
  markers: false, // Set to true during development
});

// Export for potential direct usage
export { gsap, ScrollTrigger, ScrollToPlugin };
