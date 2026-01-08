import './LoadingState.css';

export function LoadingState({ message = 'Loading...', size = 'md' }) {
  return (
    <div className={`loading-state loading-state--${size}`}>
      <div className="loading-state__spinner" />
      <p className="loading-state__message">{message}</p>
    </div>
  );
}

export function LoadingSpinner({ size = 'md', className = '' }) {
  return (
    <div className={`loading-spinner loading-spinner--${size} ${className}`}>
      <div className="loading-spinner__ring" />
    </div>
  );
}
