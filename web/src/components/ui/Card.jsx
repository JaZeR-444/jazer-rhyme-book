import './Card.css';

export function Card({ children, className = '', variant = 'default', hover = false, glow = false }) {
  const classes = [
    'card',
    `card--${variant}`,
    hover && 'card--hover',
    glow && 'card--glow',
    className
  ].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
}

export function CardHeader({ children, className = '' }) {
  return <div className={`card__header ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }) {
  return <div className={`card__body ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`card__footer ${className}`}>{children}</div>;
}
