import './LoadingState.css';

export function LoadingState({ message = 'ACCESSING MAINFRAME...', size = 'md' }) {
  return (
    <div className={`loading-state loading-state--${size}`}>
      <div className="mainframe-loader">
        <div className="mainframe-loader__bar"></div>
        <div className="mainframe-loader__bar"></div>
        <div className="mainframe-loader__bar"></div>
        <div className="mainframe-loader__scan"></div>
      </div>
      <p className="loading-state__message" data-text={message}>{message}</p>
    </div>
  );
}

export function LoadingSpinner({ size = 'md', className = '' }) {
    // Legacy spinner wrapper for backward compatibility, now uses mainframe style
    return (
        <div className={`loading-spinner-wrapper ${className}`}>
             <div className="mainframe-loader mainframe-loader--small">
                <div className="mainframe-loader__bar"></div>
                <div className="mainframe-loader__bar"></div>
             </div>
        </div>
    );
}
