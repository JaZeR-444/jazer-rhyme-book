import React from 'react';
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
    if (process.env.NODE_ENV === 'development') {
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
    // Example: Sentry.captureException(error, { extra: errorInfo });
    
    // For now, log to localStorage for debugging
    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        message: String(error?.message || error || 'Unknown error'),
        stack: String(error?.stack || ''),
        componentStack: String(errorInfo?.componentStack || ''),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      const existingLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      existingLogs.push(errorLog);
      
      // Keep only last 10 errors
      if (existingLogs.length > 10) {
        existingLogs.shift();
      }

      localStorage.setItem('errorLogs', JSON.stringify(existingLogs));
    } catch (e) {
      // Silently fail
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
    window.location.href = '/';
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
        <div className={`error-boundary error-boundary--${level}`}>
          <div className="error-boundary__content">
            <div className="error-boundary__icon">⚠️</div>
            <h1 className="error-boundary__title">Oops! Something went wrong</h1>
            <p className="error-boundary__message">
              We apologize for the inconvenience. An unexpected error occurred.
            </p>

            {process.env.NODE_ENV === 'development' && error && (
              <details className="error-boundary__details">
                <summary>Error Details (Development Only)</summary>
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
                  Try Again
                </button>
              )}
              
              <button 
                className="error-boundary__button error-boundary__button--secondary"
                onClick={this.handleReload}
              >
                Reload Page
              </button>

              {level === 'route' && (
                <button 
                  className="error-boundary__button error-boundary__button--tertiary"
                  onClick={this.handleGoHome}
                >
                  Go to Home
                </button>
              )}
            </div>

            {errorCount >= 3 && (
              <p className="error-boundary__warning">
                Multiple errors detected. Please try reloading the page or clearing your browser cache.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for easy use
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  return (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
};

// Default export
export default ErrorBoundary;
