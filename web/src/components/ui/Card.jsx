import PropTypes from 'prop-types';
import './Card.css';

/**
 * Card - Container component with multiple visual variants
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {'default'|'outline'|'solid'|'neon'|'glass'} [props.variant='default'] - Visual style variant
 * @param {boolean} [props.hover=false] - Enable hover effect
 * @param {boolean} [props.glow=false] - Enable glow effect
 * @param {boolean} [props.glass=false] - Enable glassmorphism effect
 * @param {'default'|'subtle'|'heavy'|'frosted'} [props.glassVariant='default'] - Glassmorphism intensity
 * @returns {JSX.Element} Card component
 * 
 * @example
 * <Card variant="glass" glassVariant="heavy">
 *   <CardHeader>Title</CardHeader>
 *   <CardBody>Content</CardBody>
 *   <CardFooter>Actions</CardFooter>
 * </Card>
 */
export function Card({ 
  children, 
  className = '', 
  variant = 'default', 
  hover = false, 
  glow = false,
  glass = false,
  glassVariant = 'default' // 'subtle' | 'heavy' | 'frosted'
}) {
  const classes = [
    'card',
    `card--${variant}`,
    hover && 'card--hover',
    glow && 'card--glow',
    glass && 'glass',
    glass && glassVariant !== 'default' && `glass--${glassVariant}`,
    className
  ].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
}

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'outline', 'solid', 'neon', 'glass']),
  hover: PropTypes.bool,
  glow: PropTypes.bool,
  glass: PropTypes.bool,
  glassVariant: PropTypes.oneOf(['default', 'subtle', 'heavy', 'frosted'])
};

/**
 * CardHeader - Card header section
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Header content
 * @param {string} [props.className=''] - Additional CSS classes
 */
export function CardHeader({ children, className = '' }) {
  return <div className={`card__header ${className}`}>{children}</div>;
}

CardHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

/**
 * CardBody - Card body/content section
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Body content
 * @param {string} [props.className=''] - Additional CSS classes
 */
export function CardBody({ children, className = '' }) {
  return <div className={`card__body ${className}`}>{children}</div>;
}

CardBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

/**
 * CardFooter - Card footer section
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Footer content
 * @param {string} [props.className=''] - Additional CSS classes
 */
export function CardFooter({ children, className = '' }) {
  return <div className={`card__footer ${className}`}>{children}</div>;
}

CardFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};