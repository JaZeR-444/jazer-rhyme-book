import PropTypes from 'prop-types';
import './LoadingState.css';

/**
 * LoadingState - Full screen or container-level loading component with cyberpunk styling
 */
export function LoadingState({ message = 'ACCESSING MAINFRAME...', size = 'md' }) {
  return (
    <div 
      className={`loading-state loading-state--${size}`} 
      role="status" 
      aria-live="polite"
      aria-label={message}
    >
      <div className="mainframe-loader" aria-hidden="true">
        <div className="mainframe-loader__bar"></div>
        <div className="mainframe-loader__bar"></div>
        <div className="mainframe-loader__bar"></div>
        <div className="mainframe-loader__scan"></div>
      </div>
      <p className="loading-state__message" data-text={message}>{message}</p>
    </div>
  );
}

LoadingState.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl'])
};

/**
 * LoadingSpinner - Lightweight inline loading indicator
 */
export function LoadingSpinner({ size = 'md', className = '', label = 'Loading...' }) {
    return (
        <div 
          className={`loading-spinner-wrapper ${className}`} 
          role="status" 
          aria-label={label}
        >
             <div className="mainframe-loader mainframe-loader--small" aria-hidden="true">
                <div className="mainframe-loader__bar"></div>
                <div className="mainframe-loader__bar"></div>
             </div>
        </div>
    );
}

LoadingSpinner.propTypes = {
  size: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string
};

/**
 * RouteLoading - Specialized loader for top-level page transitions
 */
export function RouteLoading() {
  return (
    <div className="route-loading-overlay">
      <LoadingState message="INITIALIZING..." size="lg" />
    </div>
  );
}