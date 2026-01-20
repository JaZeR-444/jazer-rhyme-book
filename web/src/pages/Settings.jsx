import { useState } from 'react';
import { Settings as SettingsIcon, Palette, Layout, Filter, Download, Upload, RotateCcw, Check } from 'lucide-react';
import { useUserPreferences } from '../lib/UserPreferencesContext';
import { Card, Button } from '../components/ui';
import './Settings.css';

export function Settings() {
  const {
    preferences,
    updateTheme,
    updateLayout,
    updateContent,
    exportPreferences,
    importPreferences,
    resetToDefaults,
    colorSchemes,
  } = useUserPreferences();

  const [activeTab, setActiveTab] = useState('theme'); // 'theme' | 'layout' | 'content'
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleFileImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importPreferences(file);
      setImportSuccess(true);
      setImportError(null);
      setTimeout(() => setImportSuccess(false), 3000);
    } catch (err) {
      setImportError(err.message);
      setImportSuccess(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      resetToDefaults();
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-page__header">
        <div className="settings-page__title-section">
          <SettingsIcon size={32} className="text-accent-primary" />
          <div>
            <h1 className="settings-page__title">Settings</h1>
            <p className="settings-page__description">
              Customize your JaZeR Rhyme Book experience
            </p>
          </div>
        </div>

        <div className="settings-page__actions">
          <Button
            variant="ghost"
            size="sm"
            icon={<Download size={16} />}
            onClick={exportPreferences}
            title="Export your settings"
          >
            Export
          </Button>
          <label className="settings-import-btn">
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              style={{ display: 'none' }}
            />
            <Button
              variant="ghost"
              size="sm"
              icon={<Upload size={16} />}
              as="span"
              title="Import settings from file"
            >
              Import
            </Button>
          </label>
          <Button
            variant="ghost"
            size="sm"
            icon={<RotateCcw size={16} />}
            onClick={handleReset}
            title="Reset to defaults"
          >
            Reset
          </Button>
        </div>
      </div>

      {importError && (
        <div className="settings-alert settings-alert--error">
          ⚠️ {importError}
        </div>
      )}

      {importSuccess && (
        <div className="settings-alert settings-alert--success">
          <Check size={16} /> Settings imported successfully!
        </div>
      )}

      <div className="settings-tabs">
        <button
          className={`settings-tab ${activeTab === 'theme' ? 'active' : ''}`}
          onClick={() => setActiveTab('theme')}
        >
          <Palette size={18} />
          <span>Theme</span>
        </button>
        <button
          className={`settings-tab ${activeTab === 'layout' ? 'active' : ''}`}
          onClick={() => setActiveTab('layout')}
        >
          <Layout size={18} />
          <span>Layout</span>
        </button>
        <button
          className={`settings-tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          <Filter size={18} />
          <span>Content</span>
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'theme' && (
          <div className="settings-section fade-in">
            <Card className="settings-card">
              <h2 className="settings-card__title">Color Scheme</h2>
              <p className="settings-card__description">
                Choose a color scheme that suits your style
              </p>
              <div className="color-scheme-grid">
                {Object.keys(colorSchemes).map(scheme => (
                  <button
                    key={scheme}
                    className={`color-scheme-option ${preferences.theme.colorScheme === scheme ? 'active' : ''}`}
                    onClick={() => updateTheme({ colorScheme: scheme, accentColor: null })}
                    style={{
                      '--preview-primary': colorSchemes[scheme].primary,
                      '--preview-secondary': colorSchemes[scheme].secondary,
                      '--preview-accent': colorSchemes[scheme].accent,
                    }}
                  >
                    <div className="color-scheme-preview">
                      <div className="color-swatch" style={{ background: colorSchemes[scheme].primary }} />
                      <div className="color-swatch" style={{ background: colorSchemes[scheme].secondary }} />
                      <div className="color-swatch" style={{ background: colorSchemes[scheme].accent }} />
                    </div>
                    <span className="color-scheme-name">{scheme}</span>
                    {preferences.theme.colorScheme === scheme && (
                      <Check size={16} className="color-scheme-check" />
                    )}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="settings-card">
              <h2 className="settings-card__title">Custom Accent Color</h2>
              <p className="settings-card__description">
                Override the primary accent color with your own
              </p>
              <div className="custom-color-picker">
                <input
                  type="color"
                  value={preferences.theme.accentColor || colorSchemes[preferences.theme.colorScheme].primary}
                  onChange={(e) => updateTheme({ accentColor: e.target.value })}
                  className="color-input"
                />
                <div className="custom-color-info">
                  <span className="custom-color-value">
                    {preferences.theme.accentColor || 'Using scheme default'}
                  </span>
                  {preferences.theme.accentColor && (
                    <button
                      className="custom-color-reset"
                      onClick={() => updateTheme({ accentColor: null })}
                    >
                      Reset to default
                    </button>
                  )}
                </div>
              </div>
            </Card>

            <Card className="settings-card">
              <h2 className="settings-card__title">Font Size</h2>
              <p className="settings-card__description">
                Adjust text size across the entire application
              </p>
              <div className="font-size-options">
                {['small', 'medium', 'large'].map(size => (
                  <button
                    key={size}
                    className={`font-size-option ${preferences.theme.fontSize === size ? 'active' : ''}`}
                    onClick={() => updateTheme({ fontSize: size })}
                  >
                    <span className={`font-size-preview font-size-preview--${size}`}>Aa</span>
                    <span className="font-size-label">{size}</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="settings-card">
              <h2 className="settings-card__title">Font Family</h2>
              <p className="settings-card__description">
                Choose your preferred typeface
              </p>
              <div className="font-family-options">
                {[
                  { value: 'sans', label: 'Sans-serif', preview: 'The quick brown fox' },
                  { value: 'serif', label: 'Serif', preview: 'The quick brown fox' },
                  { value: 'mono', label: 'Monospace', preview: 'The quick brown fox' },
                ].map(font => (
                  <button
                    key={font.value}
                    className={`font-family-option ${preferences.theme.fontFamily === font.value ? 'active' : ''}`}
                    onClick={() => updateTheme({ fontFamily: font.value })}
                  >
                    <span className={`font-family-preview font-family-preview--${font.value}`}>
                      {font.preview}
                    </span>
                    <span className="font-family-label">{font.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="settings-section fade-in">
            <Card className="settings-card">
              <h2 className="settings-card__title">Grid Density</h2>
              <p className="settings-card__description">
                Control spacing and padding throughout the app
              </p>
              <div className="grid-density-options">
                {[
                  { value: 'compact', label: 'Compact', desc: 'Tight spacing, more content' },
                  { value: 'comfortable', label: 'Comfortable', desc: 'Balanced spacing' },
                  { value: 'spacious', label: 'Spacious', desc: 'Generous spacing, easier to read' },
                ].map(density => (
                  <button
                    key={density.value}
                    className={`grid-density-option ${preferences.layout.gridDensity === density.value ? 'active' : ''}`}
                    onClick={() => updateLayout({ gridDensity: density.value })}
                  >
                    <div className="grid-density-visual">
                      <div className={`density-demo density-demo--${density.value}`}>
                        <div className="density-block" />
                        <div className="density-block" />
                        <div className="density-block" />
                      </div>
                    </div>
                    <div className="grid-density-info">
                      <span className="grid-density-label">{density.label}</span>
                      <span className="grid-density-desc">{density.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="settings-card">
              <h2 className="settings-card__title">Default Landing Page</h2>
              <p className="settings-card__description">
                Choose which page you see when opening the app
              </p>
              <select
                className="settings-select"
                value={preferences.layout.defaultPage}
                onChange={(e) => updateLayout({ defaultPage: e.target.value })}
              >
                <option value="/">Home</option>
                <option value="/dictionary">Dictionary</option>
                <option value="/domains">Domains</option>
                <option value="/studio">Writing Studio</option>
                <option value="/search">Search</option>
              </select>
            </Card>

            <Card className="settings-card">
              <h2 className="settings-card__title">Auto-Save Frequency</h2>
              <p className="settings-card__description">
                How often to auto-save your work (in milliseconds)
              </p>
              <div className="autosave-options">
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={preferences.layout.autoSaveFrequency}
                  onChange={(e) => updateLayout({ autoSaveFrequency: parseInt(e.target.value) })}
                  className="autosave-slider"
                />
                <span className="autosave-value">{preferences.layout.autoSaveFrequency}ms</span>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="settings-section fade-in">
            <Card className="settings-card">
              <h2 className="settings-card__title">Content Filtering</h2>
              <p className="settings-card__description">
                Control what content is displayed
              </p>
              <label className="settings-checkbox">
                <input
                  type="checkbox"
                  checked={preferences.content.hideExplicit}
                  onChange={(e) => updateContent({ hideExplicit: e.target.checked })}
                />
                <span>Hide explicit content</span>
              </label>
            </Card>

            <Card className="settings-card">
              <h2 className="settings-card__title">Default Syllable Filter</h2>
              <p className="settings-card__description">
                Automatically filter dictionary words by syllable count
              </p>
              <div className="syllable-filter-options">
                {[null, '1', '2', '3+'].map(filter => (
                  <button
                    key={filter || 'all'}
                    className={`syllable-filter-option ${preferences.content.defaultSyllableFilter === filter ? 'active' : ''}`}
                    onClick={() => updateContent({ defaultSyllableFilter: filter })}
                  >
                    {filter || 'All'}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="settings-card">
              <h2 className="settings-card__title">Preferred Era</h2>
              <p className="settings-card__description">
                Filter entities by default era
              </p>
              <select
                className="settings-select"
                value={preferences.content.preferredEra || ''}
                onChange={(e) => updateContent({ preferredEra: e.target.value || null })}
              >
                <option value="">All Eras</option>
                <option value="1970s">1970s</option>
                <option value="1980s">1980s</option>
                <option value="1990s">1990s</option>
                <option value="2000s">2000s</option>
                <option value="2010s">2010s</option>
                <option value="2020s">2020s</option>
              </select>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}


export default Settings;
