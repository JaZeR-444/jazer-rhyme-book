import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import './ScanningLines.css';

/**
 * ScanningLines - Cyber-themed animated scanning effect
 * Adds subtle horizontal lines that scan across the screen
 */
export function ScanningLines({ 
  intensity = 'subtle', // 'subtle' | 'medium' | 'high'
  speed = 'slow', // 'slow' | 'medium' | 'fast'
  color = 'primary', // 'primary' | 'secondary' | 'warm'
  count = 3
}) {
  const containerRef = useRef(null);
  const linesRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const lines = linesRef.current;
    const speedMap = { slow: 8, medium: 5, fast: 3 };
    const duration = speedMap[speed];

    lines.forEach((line, index) => {
      const delay = (index / count) * duration;
      
      gsap.fromTo(line,
        { 
          y: '-100%',
          opacity: 0 
        },
        {
          y: '100vh',
          opacity: [0, 1, 1, 0],
          duration: duration,
          delay: delay,
          ease: 'none',
          repeat: -1,
          repeatDelay: duration * (count - 1)
        }
      );
    });

    return () => {
      lines.forEach(line => gsap.killTweensOf(line));
    };
  }, [count, speed]);

  return (
    <div 
      ref={containerRef} 
      className={`scanning-lines scanning-lines--${intensity} scanning-lines--${color}`}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          ref={el => linesRef.current[i] = el}
          className="scanning-lines__line"
        />
      ))}
    </div>
  );
}
