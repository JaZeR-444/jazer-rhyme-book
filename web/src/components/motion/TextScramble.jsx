import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';

/**
 * TextScramble - GSAP-powered text scramble entrance effect
 * Creates a "decoding" animation for text
 */
export function TextScramble({ 
  children, 
  as: Component = 'span',
  duration = 0.8,
  delay = 0,
  chars = '!<>-_\\/[]{}—=+*^?#________',
  className = ''
}) {
  const textRef = useRef(null);
  const originalTextRef = useRef('');

  useEffect(() => {
    if (!textRef.current) return;
    
    const element = textRef.current;
    originalTextRef.current = element.textContent;
    const text = originalTextRef.current;
    const length = text.length;
    
    const tl = gsap.timeline({ delay });
    
    // Scramble phase
    tl.to({}, {
      duration: duration * 0.7,
      onUpdate: function() {
        const progress = this.progress();
        const revealIndex = Math.floor(progress * length);
        
        let scrambled = '';
        for (let i = 0; i < length; i++) {
          if (i < revealIndex) {
            scrambled += text[i];
          } else if (text[i] === ' ') {
            scrambled += ' ';
          } else {
            scrambled += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        element.textContent = scrambled;
      }
    })
    // Final reveal
    .to({}, {
      duration: duration * 0.3,
      onComplete: () => {
        element.textContent = text;
      }
    });

    return () => {
      tl.kill();
    };
  }, [children, duration, delay, chars]);

  return (
    <Component ref={textRef} className={`text-scramble ${className}`}>
      {children}
    </Component>
  );
}

/**
 * ScrambleReveal - Alternative scramble with stagger for multiple elements
 */
export function ScrambleReveal({ 
  children, 
  stagger = 0.1,
  ...props 
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll('[data-scramble]');
    
    elements.forEach((el, index) => {
      const text = el.textContent;
      const tl = gsap.timeline({ delay: index * stagger });
      
      tl.to({}, {
        duration: 0.6,
        onUpdate: function() {
          const progress = this.progress();
          const revealIndex = Math.floor(progress * text.length);
          
          let scrambled = '';
          for (let i = 0; i < text.length; i++) {
            if (i < revealIndex) {
              scrambled += text[i];
            } else {
              scrambled += '!<>-_\\/[]{}—=+*^?#'[Math.floor(Math.random() * 20)];
            }
          }
          el.textContent = scrambled;
        },
        onComplete: () => {
          el.textContent = text;
        }
      });
    });
  }, [children, stagger]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}
