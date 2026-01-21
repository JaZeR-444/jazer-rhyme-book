import PropTypes from 'prop-types';
import './Button.css';

/**
 * Button - Primary UI button component with multiple variants and sizes
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button text content
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {'primary'|'secondary'|'ghost'|'outline'|'danger'|'glass'|'neon'} [props.variant='primary'] - Visual style variant
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Button size
 * @param {React.ReactNode} [props.icon=null] - Icon element to display
 * @param {'left'|'right'} [props.iconPosition='left'] - Position of icon relative to text
 * @param {boolean} [props.disabled=false] - Whether button is disabled
 * @param {string} [props['aria-label']] - Accessible label for screen readers (required for icon-only buttons)
 * @returns {JSX.Element} Button component
 * 
 * @example
 * // Primary button with text
 * <Button variant="primary">Click Me</Button>
 * 
 * @example
 * // Icon-only button (requires aria-label)
 * <Button icon={<Icon />} aria-label="Delete item" />
 * 
 * @example
 * // Button with icon and text
 * <Button variant="secondary" icon={<SaveIcon />} iconPosition="left">
 *   Save Changes
 * </Button>
 */
export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  icon = null,
  iconPosition = 'left',
  disabled = false,
  'aria-label': ariaLabel,
  ...props
}) {
  const isIconOnly = !children && icon;
  
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    icon && 'btn--with-icon',
    isIconOnly && 'btn--icon-only',
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classes} 
      disabled={disabled} 
      aria-label={ariaLabel || (isIconOnly ? 'Action' : undefined)}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="btn__icon" aria-hidden="true">{icon}</span>
      )}
      
      {children && <span className="btn__label">{children}</span>}
      
      {icon && iconPosition === 'right' && (
        <span className="btn__icon" aria-hidden="true">{icon}</span>
      )}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'outline', 'danger', 'glass', 'neon']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  disabled: PropTypes.bool,
  'aria-label': PropTypes.string
};