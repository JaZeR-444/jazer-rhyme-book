import './Button.css';

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  icon = null,
  iconPosition = 'left',
  disabled = false,
  ...props
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    icon && 'btn--with-icon',
    className
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} disabled={disabled} {...props}>
      {icon && iconPosition === 'left' && <span className="btn__icon">{icon}</span>}
      <span className="btn__label">{children}</span>
      {icon && iconPosition === 'right' && <span className="btn__icon">{icon}</span>}
    </button>
  );
}
