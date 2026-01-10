/**
 * Logo Component
 * Reusable logo component with different sizes and variants
 */

import PropTypes from 'prop-types';

export function Logo({ variant = 'full', size = 'medium', className = '' }) {
  const sizes = {
    small: { full: '200px', icon: '32px' },
    medium: { full: '350px', icon: '48px' },
    large: { full: '450px', icon: '64px' },
    xlarge: { full: '600px', icon: '80px' },
  };

  const basePath = import.meta.env.BASE_URL || '/';
  const logoSrc = variant === 'icon' ? `${basePath}icon.svg` : `${basePath}logo.svg`;
  const altText = variant === 'icon' ? 'JaZeR Master Hub Icon' : 'JaZeR Rhyme Book Logo';
  const maxWidth = sizes[size]?.[variant] || sizes.medium[variant];

  return (
    <img
      src={logoSrc}
      alt={altText}
      className={`logo logo-${variant} logo-${size} ${className}`}
      style={{ 
        maxWidth, 
        width: '100%', 
        height: 'auto',
        display: 'block'
      }}
    />
  );
}

Logo.propTypes = {
  variant: PropTypes.oneOf(['full', 'icon']),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  className: PropTypes.string,
};
