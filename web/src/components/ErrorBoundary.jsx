import React from 'react';
import PropTypes from 'prop-types';
import './ErrorBoundary.css';

/**
 * Production-grade error boundary with recovery options
 * Catches JavaScript errors anywhere in the component tree
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      try {
        console.error('Error caught by boundary:', String(error?.message || error));
        if (errorInfo?.componentStack) {
          console.error('Component stack:', String(errorInfo.componentStack));
        }
      } catch (e) {
        // Silently fail if console.error fails
      }
    }

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Optional: Send to error tracking service (e.g., Sentry)
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // Implement error tracking service integration here
    
    // For now, log to localStorage for debugging (max 10 entries)
    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        message: String(error?.message || error || 'Unknown error').slice(0, 500),
        stack: String(error?.stack || '').slice(0, 1000),
        componentStack: String(errorInfo?.componentStack || '').slice(0, 1000),
        url: window.location.href.slice(0, 200)
      };

      const existingLogs = JSON.parse(localStorage.getItem('jazer_error_logs') || '[]');
      existingLogs.push(errorLog);
      
      // Keep only last 10 errors
      if (existingLogs.length > 10) {
        existingLogs.shift();
      }

      localStorage.setItem('jazer_error_logs', JSON.stringify(existingLogs));
    } catch (e) {
      // Silently fail (e.g. storage full)
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    // Use hash-routing aware navigation if needed, or standard home
    window.location.href = window.location.pathname + (window.location.hash ? '#/' : '');
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorCount } = this.state;
      const { fallback, level = 'app' } = this.props;

      // Use custom fallback if provided
      if (fallback) {
        return fallback({
          error,
          errorInfo,
          reset: this.handleReset,
          reload: this.handleReload
        });
      }

      // Default error UI
      return (
        <div className={`error-boundary error-boundary--${level}`} role="alert" aria-live="assertive">
          <div className="error-boundary__content">
            <div className="error-boundary__icon" aria-hidden="true">⚠️</div>
            <h1 className="error-boundary__title">Oops! System Error</h1>
            <p className="error-boundary__message">
              The mainframe encountered an unexpected exception during processing.
            </p>

            {import.meta.env.DEV && error && (
              <details className="error-boundary__details">
                <summary>Diagnostic Data (Dev Only)</summary>
                <pre className="error-boundary__stack">
                  <strong>Error:</strong> {error.toString()}
                  {'\n\n'}
                  <strong>Stack Trace:</strong>
                  {error.stack}
                  {errorInfo && (
                    <>
                      {'\n\n'}
                      <strong>Component Stack:</strong>
                      {errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}

            <div className="error-boundary__actions">
              {errorCount < 3 && (
                <button 
                  className="error-boundary__button error-boundary__button--primary"
                  onClick={this.handleReset}
                >
                  Attempt Recovery
                </button>
              )}
              
              <button 
                className="error-boundary__button error-boundary__button--secondary"
                onClick={this.handleReload}
              >
                Reboot Session
              </button>

              <button 
                className="error-boundary__button error-boundary__button--tertiary"
                onClick={this.handleGoHome}
              >
                Return to Base
              </button>
            </div>

            {errorCount >= 3 && (
              <p className="error-boundary__warning">
                Critical instability detected. Please clear browser cache or contact support if the issue persists.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  onError: PropTypes.func,
  showDetails: PropTypes.bool
};

ErrorBoundary.defaultProps = {
  fallback: null,
  onError: null,
  showDetails: false
};

// Functional wrapper for easy use
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  return (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
};

export default ErrorBoundary;