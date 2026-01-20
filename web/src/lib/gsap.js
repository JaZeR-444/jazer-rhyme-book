/**
 * GSAP Configuration
 * Register plugins and export configured GSAP instance
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';

// Register plugins
gsap.registerPlugin(ScrollTrigger, Draggable);

// Export configured instance
export { gsap, ScrollTrigger, Draggable };
export default gsap;
