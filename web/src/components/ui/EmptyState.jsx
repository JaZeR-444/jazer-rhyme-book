import { Button } from './Button';
import './EmptyState.css';

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
