/**
 * HeroSection Component
 * =====================
 * 
 * PURPOSE: Establish identity, mood, and stakes within 5 seconds.
 * 
 * MOTION CHOREOGRAPHY:
 * T+0.0s  → Background particle field activates
 * T+0.3s  → Logo edges begin drawing (SVG stroke)
 * T+0.8s  → Logo fill fades in
 * T+1.2s  → Tagline types in
 * T+2.0s  → Scroll indicator pulses
 */

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAPContext } from '../motion/useGSAPContext';
import { easing, timing } from '../../lib/gsap/easing';
import './HeroSection.css';

export function HeroSection({ id }) {
  const sectionRef = useRef(null);
  const logoRef = useRef(null);
  const taglineRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  
  useGSAPContext(() => {
    const tl = gsap.timeline({ defaults: { ease: easing.dramatic } });
    
    // Logo entrance
    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: timing.long }
    );
    
    // Tagline entrance
    tl.fromTo(
      taglineRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: timing.medium },
      '-=0.3' // Overlap slightly
    );
    
    // Scroll indicator pulse (infinite loop)
    tl.fromTo(
      scrollIndicatorRef.current,
      { opacity: 0 },
      { opacity: 1, duration: timing.short },
      '-=0.2'
    );
    
    // Continuous pulse for scroll indicator
    gsap.to(scrollIndicatorRef.current, {
      y: 8,
      repeat: -1,
      yoyo: true,
      duration: 1,
      ease: 'sine.inOut',
      delay: 2,
    });
  }, { scope: sectionRef });
  
  return (
    <section id={id} ref={sectionRef} className="hero-section section">
      {/* Background ambient layer */}
      <div className="hero-ambient" aria-hidden="true">
        <div className="ambient-gradient" />
      </div>
      
      {/* Main content */}
      <div className="hero-content">
        <h1 ref={logoRef} className="hero-logo text-hero">
          <span className="logo-accent">JaZeR</span>
        </h1>
        
        <p ref={taglineRef} className="hero-tagline text-secondary">
          Musical Journey · Knowledge System · Creative Evolution
        </p>
      </div>
      
      {/* Scroll indicator */}
      <div ref={scrollIndicatorRef} className="hero-scroll-indicator">
        <span className="scroll-text text-small text-secondary">Scroll to explore</span>
        <div className="scroll-arrow">↓</div>
      </div>
    </section>
  );
}
