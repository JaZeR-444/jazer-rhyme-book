/**
 * ScrollContainer Component
 * =========================
 * 
 * Provides scroll-aware context for GSAP ScrollTrigger animations.
 * Ensures ScrollTrigger is initialized and handles refresh on resize.
 */

import { useLayoutEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function ScrollContainer({ children, className = '' }) {
  const containerRef = useRef(null);
  
  useLayoutEffect(() => {
    // Refresh ScrollTrigger calculations after DOM is ready
    ScrollTrigger.refresh();
    
    // Handle window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div ref={containerRef} className={`scroll-container ${className}`}>
      {children}
    </div>
  );
}
