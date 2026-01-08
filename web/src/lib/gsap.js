/**
 * GSAP Configuration
 * Register plugins and export configured GSAP instance
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins
gsap.registerPlugin(ScrollTrigger);

// Export configured instance
export { gsap, ScrollTrigger };
export default gsap;
