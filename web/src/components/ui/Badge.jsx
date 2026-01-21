import PropTypes from 'prop-types';
import './Badge.css';

/**
 * Badge - Small status or label indicator
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Badge text/content
 * @param {'default'|'primary'|'secondary'|'success'|'error'|'warning'|'info'|'neon'|'outline'|'glass'} [props.variant='default'] - Visual style
 * @param {'xs'|'sm'|'md'|'lg'} [props.size='md'] - Badge size
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {JSX.Element} Badge component
 * 
 * @example
 * <Badge variant="success" size="sm">Active</Badge>
 * <Badge variant="error">Offline</Badge>
 * <Badge variant="neon">New</Badge>
 */
export function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const classes = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    className
  ].filter(Boolean).join(' ');

  return <span className={classes}>{children}</span>;
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'error', 'warning', 'info', 'neon', 'outline', 'glass']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  className: PropTypes.string
};