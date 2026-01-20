import { useRef, useEffect, useState } from 'react';
import { gsap } from '../../lib/gsap';
import './MagneticButton.css';

/**
 * MagneticButton - Button that follows cursor with magnetic effect
 * Perfect for primary CTAs and interactive elements
 */
export function MagneticButton({ 
  children, 
  onClick,
  className = '',
  strength = 0.3,      // Magnetic strength (0-1)
  disabled = false,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  ...props 
}) {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || disabled) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from center
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Apply magnetic effect with strength multiplier
      const moveX = deltaX * strength;
      const moveY = deltaY * strength;

      gsap.to(button, {
        x: moveX,
        y: moveY,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      
      // Return to original position
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, disabled]);

  const classes = [
    'magnetic-button',
    `magnetic-button--${variant}`,
    `magnetic-button--${size}`,
    isHovered && 'magnetic-button--hovered',
    disabled && 'magnetic-button--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={buttonRef}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <span className="magnetic-button__content">
        {children}
      </span>
      {isHovered && (
        <span className="magnetic-button__glow" aria-hidden="true" />
      )}
    </button>
  );
}

/**
 * MagneticIconButton - Circular magnetic button for icons
 */
export function MagneticIconButton({ 
  icon, 
  label,
  strength = 0.4,
  ...props 
}) {
  return (
    <MagneticButton
      className="magnetic-button--icon"
      strength={strength}
      aria-label={label}
      {...props}
    >
      {icon}
    </MagneticButton>
  );
}
