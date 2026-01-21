/**
 * Accessibility Utilities for AAA Compliance
 */

// Focus management for modal/dialog components
export const createFocusTrap = (element) => {
  if (!element) return null;

  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  // Handle case where no focusable elements exist
  if (focusableElements.length === 0) {
    console.warn('No focusable elements found in focus trap');
    return () => {}; // Return noop cleanup function
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  // Focus first element on trap creation
  requestAnimationFrame(() => {
    firstElement?.focus();
  });

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement?.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement?.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);

  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};

// Announce changes to screen readers
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Check color contrast ratio (WCAG AAA requires 7:1 for normal text)
export const getContrastRatio = (color1, color2) => {
  const parseColor = (color) => {
    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return [r, g, b];
    }
    
    // Handle rgb/rgba colors
    if (color.startsWith('rgb')) {
      const match = color.match(/\d+/g);
      if (!match || match.length < 3) {
        throw new Error(`Invalid color format: ${color}`);
      }
      return match.slice(0, 3).map(Number);
    }
    
    // Handle hsl/hsla colors
    if (color.startsWith('hsl')) {
      // Convert HSL to RGB
      const match = color.match(/\d+\.?\d*/g);
      if (!match || match.length < 3) {
        throw new Error(`Invalid color format: ${color}`);
      }
      const [h, s, l] = match.map(Number);
      return hslToRgb(h, s / 100, l / 100);
    }
    
    throw new Error(`Unsupported color format: ${color}. Use hex, rgb, rgba, hsl, or hsla.`);
  };

  const hslToRgb = (h, s, l) => {
    h = h / 360;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  const getLuminance = (rgb) => {
    const [r, g, b] = rgb.map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  try {
    const rgb1 = parseColor(color1);
    const rgb2 = parseColor(color2);
    
    const lum1 = getLuminance(rgb1);
    const lum2 = getLuminance(rgb2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  } catch (error) {
    console.error('Error calculating contrast ratio:', error.message);
    return 1; // Return minimum ratio on error
  }
};

// Keyboard navigation helper
export const handleArrowNavigation = (event, items, currentIndex, onSelect) => {
  const { key } = event;
  
  if (!['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(key)) return;
  
  event.preventDefault();
  
  let newIndex = currentIndex;
  
  switch (key) {
    case 'ArrowDown':
      newIndex = Math.min(currentIndex + 1, items.length - 1);
      break;
    case 'ArrowUp':
      newIndex = Math.max(currentIndex - 1, 0);
      break;
    case 'Enter':
      if (currentIndex >= 0 && items[currentIndex]) {
        onSelect(items[currentIndex]);
      }
      return;
    case 'Escape':
      onSelect(null);
      return;
  }
  
  return newIndex;
};

// Skip to main content link
let skipLinkAdded = false; // Guard against duplicates

export const addSkipLink = () => {
  // Prevent duplicate skip links
  if (skipLinkAdded || document.querySelector('.skip-link')) {
    return;
  }

  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  
  // Add to first position in body
  document.body.insertBefore(skipLink, document.body.firstChild);
  skipLinkAdded = true;
};

// Note: Skip link styling should be in global CSS
// .skip-link {
//   position: absolute;
//   top: -40px;
//   left: 0;
//   background: var(--surface-0, #000);
//   color: var(--text-primary, #fff);
//   padding: var(--space-sm, 8px);
//   text-decoration: none;
//   z-index: 10000;
//   transition: top var(--duration-short, 0.2s);
// }
// .skip-link:focus {
//   top: 0;
// }

// Reduced motion check
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// High contrast mode detection
export const prefersHighContrast = () => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};
