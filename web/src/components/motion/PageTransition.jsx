import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { gsap } from '../../lib/gsap';
import './PageTransition.css';

/**
 * PageTransition - Provides smooth GSAP-based transitions between routes
 * Supports multiple transition types: fade, slide, glitch, scale
 */
export function PageTransition({ children, type = 'fade' }) {
  const containerRef = useRef(null);
  const location = useLocation();
  const prevLocationRef = useRef(location.pathname);

  useEffect(() => {
    if (!containerRef.current) return;

    const isInitialLoad = prevLocationRef.current === location.pathname;
    if (isInitialLoad) {
      prevLocationRef.current = location.pathname;
      return;
    }

    const container = containerRef.current;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Exit animation
    const exitAnimation = () => {
      if (prefersReducedMotion) {
        return gsap.to(container, {
          opacity: 0,
          duration: 0.1,
          ease: 'none'
        });
      }

      switch (type) {
        case 'slide':
          return gsap.to(container, {
            x: -50,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in'
          });
        
        case 'glitch':
          const tl = gsap.timeline();
          tl.to(container, {
            opacity: 0,
            duration: 0.1,
            repeat: 2,
            yoyo: true
          })
          .to(container, {
            scaleX: 0.98,
            skewX: 2,
            duration: 0.1
          })
          .to(container, {
            scaleX: 1,
            skewX: 0,
            opacity: 0,
            duration: 0.15
          });
          return tl;
        
        case 'scale':
          return gsap.to(container, {
            scale: 0.95,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in'
          });
        
        case 'fade':
        default:
          return gsap.to(container, {
            opacity: 0,
            duration: 0.2,
            ease: 'power2.in'
          });
      }
    };

    // Enter animation
    const enterAnimation = () => {
      if (prefersReducedMotion) {
        return gsap.fromTo(container,
          { opacity: 0 },
          { 
            opacity: 1, 
            duration: 0.1,
            ease: 'none'
          }
        );
      }

      switch (type) {
        case 'slide':
          return gsap.fromTo(container,
            { x: 50, opacity: 0 },
            { 
              x: 0, 
              opacity: 1, 
              duration: 0.4,
              ease: 'power2.out'
            }
          );
        
        case 'glitch':
          const tl = gsap.timeline();
          tl.set(container, { opacity: 0, scaleX: 1.02, skewX: -2 })
            .to(container, {
              opacity: 1,
              duration: 0.1,
              repeat: 2,
              yoyo: true
            })
            .to(container, {
              scaleX: 1,
              skewX: 0,
              duration: 0.2,
              ease: 'power2.out'
            });
          return tl;
        
        case 'scale':
          return gsap.fromTo(container,
            { scale: 1.05, opacity: 0 },
            { 
              scale: 1, 
              opacity: 1, 
              duration: 0.4,
              ease: 'power2.out'
            }
          );
        
        case 'fade':
        default:
          return gsap.fromTo(container,
            { opacity: 0 },
            { 
              opacity: 1, 
              duration: 0.3,
              ease: 'power2.out'
            }
          );
      }
    };

    // Run exit then enter
    exitAnimation().then(() => {
      window.scrollTo(0, 0);
      enterAnimation();
    });

    prevLocationRef.current = location.pathname;
  }, [location.pathname, type]);

  return (
    <div
      ref={containerRef}
      className="page-transition"
      role="region"
      aria-label="Page content"
    >
      {children}
    </div>
  );
}

PageTransition.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['fade', 'slide', 'glitch', 'scale'])
};

/**
 * withPageTransition - HOC to wrap pages with transition
 */
export function withPageTransition(Component, transitionType = 'fade') {
  return function TransitionedPage(props) {
    return (
      <PageTransition type={transitionType}>
        <Component {...props} />
      </PageTransition>
    );
  };
}
