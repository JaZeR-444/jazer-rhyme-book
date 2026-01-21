import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PropTypes from 'prop-types';
import './BackButton.css';

/**
 * BackButton - A reusable navigation button for going back in history or to a specific path
 */
export function BackButton({ 
  to, 
  label = 'Back', 
  className = '', 
  variant = 'ghost',
  showLabel = true
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (to) {
      // If 'to' is provided, we use Link-like behavior
      return;
    }
    
    // Default behavior is going back in history
    e.preventDefault();
    navigate(-1);
  };

  // If 'to' is provided, we render a Link-like button but styled as BackButton
  // Otherwise we render a button that triggers navigate(-1)
  const Component = to ? 'a' : 'button';
  const props = to ? { href: to, onClick: (e) => { e.preventDefault(); navigate(to); } } : { onClick: handleClick };

  return (
    <Component
      className={`back-button back-button--${variant} ${className}`}
      aria-label={label}
      {...props}
    >
      <ArrowLeft size={20} aria-hidden="true" />
      {showLabel && <span className="back-button__label">{label}</span>}
    </Component>
  );
}

BackButton.propTypes = {
  to: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['ghost', 'outline', 'solid', 'neon']),
  showLabel: PropTypes.bool
};
