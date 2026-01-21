import PropTypes from 'prop-types';
import { Button } from './Button';
import './EmptyState.css';

/**
 * EmptyState - Reusable empty/diagnostic placeholder
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.icon] - Optional decorative icon
 * @param {string} [props.title] - Title text
 * @param {string} [props.description] - Supporting copy
 * @param {function} [props.action] - Primary action handler
 * @param {string} [props.actionLabel] - Primary action label
 * @param {'default'|'diagnostic'} [props.variant] - Visual style
 * @returns {JSX.Element}
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  actionLabel,
  variant = 'default' // 'default' | 'diagnostic'
}) {
  return (
    <div className={`empty-state empty-state--${variant}`}>
      <div className="empty-state__scan-line"></div>
      {icon && <div className="empty-state__icon">{icon}</div>}
      <div className="empty-state__content">
        {title && <h3 className="empty-state__title">{title}</h3>}
        {description && <p className="empty-state__description">{description}</p>}
        {variant === 'diagnostic' && (
           <div className="empty-state__tech-data">
             <span>ERR_NO_DATA_FOUND</span>
             <span>SECTOR_UNREACHABLE</span>
           </div>
        )}
      </div>
      {action && actionLabel && (
        <Button onClick={action} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.func,
  actionLabel: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'diagnostic'])
};
