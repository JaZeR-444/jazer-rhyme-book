/**
 * GSAP Configuration
 * ==================
 * 
 * Centralized GSAP setup with all plugins registered.
 * Import this file anywhere you need GSAP functionality.
 * 
 * Available Plugins:
 * - ScrollTrigger: Scroll-driven animations, pinning, scrubbing
 * - ScrollToPlugin: Smooth scroll navigation
 * - Draggable: Drag-and-drop interactions
 * 
 * Usage:
 *   import { gsap, ScrollTrigger } from '../lib/gsap';
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Draggable } from 'gsap/Draggable';

// Register all plugins once
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable);

// Configure ScrollTrigger defaults
ScrollTrigger.defaults({
  toggleActions: 'play none none reverse',
  markers: false, // Set to true during development
});

// Respect user's motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.config({ nullTargetWarn: false });
  ScrollTrigger.config({ limitCallbacks: true });
}

// Export configured instance and plugins
export { gsap, ScrollTrigger, ScrollToPlugin, Draggable };
export default gsap;

