/**
 * useGSAPContext Hook
 * ===================
 * 
 * WHY THIS EXISTS:
 * React 18+ with Strict Mode double-invokes effects, causing GSAP animations
 * to stack and create glitches. This hook uses gsap.context() for automatic
 * cleanup, ensuring animations are properly reverted on unmount.
 * 
 * USAGE:
 * ```jsx
 * function MyComponent() {
 *   const container = useRef(null);
 *   
 *   useGSAPContext((ctx) => {
 *     gsap.to('.element', { opacity: 1 });
 *   }, { scope: container }); // Scopes selectors to container
 *   
 *   return <div ref={container}>...</div>;
 * }
 * ```
 * 
 * CONSTRAINT: Always prefer this over raw useEffect + gsap.to()
 */

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Creates a GSAP context that automatically cleans up on unmount.
 * 
 * @param {Function} callback - Animation setup function, receives gsap.context
 * @param {Object} options - Configuration options
 * @param {React.RefObject} options.scope - Ref to scope CSS selectors
 * @param {Array} options.deps - Dependencies array (like useEffect)
 * @returns {React.MutableRefObject} - The GSAP context ref
 */
export function useGSAPContext(callback, { scope = null, deps = [] } = {}) {
  const ctx = useRef(null);
  
  useLayoutEffect(() => {
    // Create context, optionally scoped to a DOM element
    ctx.current = gsap.context(callback, scope?.current);
    
    // Cleanup: revert all animations in this context
    return () => {
      if (ctx.current) {
        ctx.current.revert();
      }
    };
  }, deps);
  
  return ctx;
}

/**
 * Check if user prefers reduced motion.
 * 
 * @returns {boolean} True if user has reduced motion enabled
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
