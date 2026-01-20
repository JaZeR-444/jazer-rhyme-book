import { useState, useRef, useEffect } from 'react';
import { gsap } from '../../lib/gsap';
import './HoverCard.css';

/**
 * HoverCard - Card with interactive data-readout overlay on hover
 * Displays contextual information with smooth animations
 */
export function HoverCard({
  children,
  overlay,
  className = '',
  variant = 'default', // 'default' | 'minimal' | 'detailed'
  position = 'center', // 'center' | 'top' | 'bottom'
  disabled = false,
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false);
  const overlayRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!overlayRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isHovered) {
      if (prefersReducedMotion) {
        gsap.set(overlayRef.current, { opacity: 1, y: 0 });
      } else {
        const tl = gsap.timeline();
        
        // Scan line effect
        tl.fromTo(overlayRef.current,
          { opacity: 0, y: 20, scaleY: 0.8 },
          { 
            opacity: 1, 
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease: 'power2.out'
          }
        );

        // Content fade in
        tl.fromTo(overlayRef.current.querySelectorAll('.hover-card__overlay-item'),
          { opacity: 0, x: -10 },
          {
            opacity: 1,
            x: 0,
            duration: 0.2,
            stagger: 0.05,
            ease: 'power2.out'
          },
          '-=0.15'
        );
      }
    } else {
      if (prefersReducedMotion) {
        gsap.set(overlayRef.current, { opacity: 0 });
      } else {
        gsap.to(overlayRef.current, {
          opacity: 0,
          y: 10,
          duration: 0.2,
          ease: 'power2.in'
        });
      }
    }
  }, [isHovered]);

  const classes = [
    'hover-card',
    `hover-card--${variant}`,
    `hover-card--${position}`,
    isHovered && 'hover-card--hovered',
    disabled && 'hover-card--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={cardRef}
      className={classes}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
      {...props}
    >
      <div className="hover-card__content">
        {children}
      </div>

      {overlay && (
        <div 
          ref={overlayRef}
          className="hover-card__overlay"
          aria-hidden={!isHovered}
        >
          {typeof overlay === 'function' ? overlay({ isHovered }) : overlay}
        </div>
      )}
    </div>
  );
}

/**
 * HoverCardOverlay - Structured overlay content component
 */
export function HoverCardOverlay({ title, items, footer }) {
  return (
    <div className="hover-card__overlay-content">
      {title && (
        <div className="hover-card__overlay-title">{title}</div>
      )}
      
      {items && items.length > 0 && (
        <div className="hover-card__overlay-list">
          {items.map((item, index) => (
            <div key={index} className="hover-card__overlay-item">
              {item.label && (
                <span className="hover-card__overlay-label">{item.label}:</span>
              )}
              <span className="hover-card__overlay-value">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {footer && (
        <div className="hover-card__overlay-footer">{footer}</div>
      )}
    </div>
  );
}

/**
 * EntityHoverCard - Pre-configured for entity display
 */
export function EntityHoverCard({ entity, children, ...props }) {
  const overlay = (
    <HoverCardOverlay
      title={entity.name}
      items={[
        { label: 'Domain', value: entity.domain },
        { label: 'Category', value: entity.category },
        entity.tags && { label: 'Tags', value: entity.tags.slice(0, 3).join(', ') },
        entity.vibe && { label: 'Vibe', value: `${entity.vibe}/10` }
      ].filter(Boolean)}
      footer={`Click to explore ${entity.name}`}
    />
  );

  return (
    <HoverCard overlay={overlay} variant="detailed" {...props}>
      {children}
    </HoverCard>
  );
}

/**
 * WordHoverCard - Pre-configured for dictionary words
 */
export function WordHoverCard({ word, children, ...props }) {
  const overlay = (
    <HoverCardOverlay
      title={word.word}
      items={[
        { label: 'Syllables', value: word.syllables },
        word.rhymeFamily && { label: 'Rhyme', value: word.rhymeFamily },
        word.phonetic && { label: 'IPA', value: word.phonetic },
        word.definition && { label: 'Type', value: word.definition.substring(0, 30) + '...' }
      ].filter(Boolean)}
      footer="Click for full definition"
    />
  );

  return (
    <HoverCard overlay={overlay} variant="minimal" {...props}>
      {children}
    </HoverCard>
  );
}
