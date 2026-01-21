/**
 * FatalErrorScreen.jsx
 * Fallback error UI when the React application fails to render
 * Displays error information and recovery options
 */

import PropTypes from 'prop-types';
import './FatalErrorScreen.css';

export function FatalErrorScreen({ title, error }) {
  return (
    <div className="fatal-error-screen" role="alert" aria-live="assertive">
      <div className="fatal-error-screen__content">
        <div className="fatal-error-screen__icon" aria-hidden="true">
          ⚠️
        </div>

        <h1 className="fatal-error-screen__title">{title}</h1>

        <p className="fatal-error-screen__message">
          An unexpected error occurred while loading the application.
          Please try refreshing the page or contact support if the problem persists.
        </p>

        {error && import.meta.env.DEV && (
          <details className="fatal-error-screen__details">
            <summary className="fatal-error-screen__summary">
              Diagnostic Information (Development Only)
            </summary>
            <pre className="fatal-error-screen__error-details">
              {error.stack || error.message || String(error)}
            </pre>
          </details>
        )}

        <div className="fatal-error-screen__actions">
          <button
            className="fatal-error-screen__button fatal-error-screen__button--primary"
            onClick={() => window.location.reload()}
            aria-label="Reload the application"
          >
            Reload Application
          </button>

          <button
            className="fatal-error-screen__button fatal-error-screen__button--secondary"
            onClick={() => window.location.href = '/'}
            aria-label="Return to home page"
          >
            Go to Home
          </button>
        </div>

        <p className="fatal-error-screen__footer">
          If this problem continues, please clear your browser cache and try again.
        </p>
      </div>
    </div>
  );
}

FatalErrorScreen.propTypes = {
  title: PropTypes.string,
  error: PropTypes.oneOfType([
    PropTypes.instanceOf(Error),
    PropTypes.shape({
      message: PropTypes.string,
      stack: PropTypes.string
    })
  ])
};

FatalErrorScreen.defaultProps = {
  title: 'Application Error',
  error: null
};

export default FatalErrorScreen;
