import PropTypes from 'prop-types';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';
import './AccessibilitySettings.css';

/**
 * AccessibilitySettings - Toggles user accessibility preferences
 *
 * @returns {JSX.Element} Panel with high-contrast and reduced-motion controls
 */

export default function AccessibilitySettings() {
  const { preferences, toggleHighContrast, toggleReducedMotion } = useUserPreferences();

  const getMotionLabel = () => {
    if (preferences.theme.reducedMotion === null) return 'Auto';
    if (preferences.theme.reducedMotion === true) return 'Reduced';
    return 'Full';
  };

  return (
    <div className="accessibility-settings">
      <h3 className="accessibility-settings__title">Accessibility</h3>
      
      <div className="accessibility-settings__options">
        {/* High Contrast Toggle */}
        <div className="accessibility-option">
          <div className="accessibility-option__info">
            <label htmlFor="high-contrast-toggle" className="accessibility-option__label">
              High Contrast Mode
            </label>
            <p className="accessibility-option__description">
              WCAG AAA compliant high contrast color scheme for better visibility
            </p>
          </div>
          <button
            id="high-contrast-toggle"
            className={`toggle-button ${preferences.theme.highContrast ? 'toggle-button--active' : ''}`}
            onClick={toggleHighContrast}
            aria-pressed={preferences.theme.highContrast}
            aria-label={`High contrast mode ${preferences.theme.highContrast ? 'enabled' : 'disabled'}`}
          >
            <span className="toggle-button__slider" />
            <span className="toggle-button__label">
              {preferences.theme.highContrast ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        {/* Reduced Motion Toggle */}
        <div className="accessibility-option">
          <div className="accessibility-option__info">
            <label htmlFor="reduced-motion-toggle" className="accessibility-option__label">
              Motion Preference
            </label>
            <p className="accessibility-option__description">
              Control animations and transitions. Auto respects your system preference.
            </p>
          </div>
          <button
            id="reduced-motion-toggle"
            className="motion-toggle-button"
            onClick={toggleReducedMotion}
            aria-label={`Motion preference: ${getMotionLabel()}`}
          >
            {getMotionLabel()}
          </button>
        </div>
      </div>

      <div className="accessibility-settings__info">
        <p className="info-text">
          <strong>Note:</strong> These settings are saved locally and will persist across sessions.
        </p>
      </div>
    </div>
  );
}

AccessibilitySettings.propTypes = {};
