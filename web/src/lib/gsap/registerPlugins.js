/**
 * GSAP Plugin Registration (Legacy Re-export)
 * ============================================
 * 
 * This file now re-exports from the main gsap.js configuration.
 * All plugin registration happens in lib/gsap.js
 * 
 * @deprecated Import from '../gsap' instead for consistency
 * @see ../gsap.js for main configuration
 */

export { gsap, ScrollTrigger, ScrollToPlugin, Draggable } from '../gsap';

