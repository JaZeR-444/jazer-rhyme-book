import { createContext, useContext, useState, useEffect } from 'react';
import { soundManager } from '../lib/SoundManager';

const UserPreferencesContext = createContext();

const SOUND_STORAGE_KEY = 'jazer_sound_enabled';

const getDefaultSoundPreference = () => {
  if (typeof window === 'undefined') return true;
  try {
    const stored = localStorage.getItem(SOUND_STORAGE_KEY);
    if (stored === null) return true;
    return stored === 'true';
  } catch {
    return true;
  }
};

// Default preferences
const DEFAULT_PREFERENCES = {
  theme: {
    colorScheme: 'purple', // 'purple' | 'blue' | 'green' | 'pink' | 'orange'
    accentColor: null, // Custom hex color, null = use scheme default
    fontSize: 'medium', // 'small' | 'medium' | 'large'
    fontFamily: 'sans', // 'sans' | 'serif' | 'mono'
    highContrast: false, // Enable WCAG AAA high contrast mode
    reducedMotion: null, // null = auto-detect, true/false = override
  },
  layout: {
    gridDensity: 'comfortable', // 'compact' | 'comfortable' | 'spacious'
    sidebarPosition: 'left', // 'left' | 'right' | 'bottom'
    defaultPage: '/', // Default landing page
    autoSaveFrequency: 500, // Auto-save delay in ms
  },
  content: {
    hideExplicit: false,
    defaultSyllableFilter: null, // null | '1' | '2' | '3+'
    preferredDomains: [], // Array of domain names
    preferredEra: null, // null | '1970s' | '1980s' | etc.
  },
  audio: {
    soundEnabled: getDefaultSoundPreference(),
  },
};

// Color scheme definitions
const COLOR_SCHEMES = {
  purple: {
    primary: '#8B5CF6',
    secondary: '#EC4899',
    accent: '#00FFFF',
    accentGlow: 'rgba(0, 255, 255, 0.2)',
  },
  blue: {
    primary: '#3B82F6',
    secondary: '#06B6D4',
    accent: '#60A5FA',
    accentGlow: 'rgba(96, 165, 250, 0.2)',
  },
  green: {
    primary: '#10B981',
    secondary: '#34D399',
    accent: '#6EE7B7',
    accentGlow: 'rgba(110, 231, 183, 0.2)',
  },
  pink: {
    primary: '#EC4899',
    secondary: '#F472B6',
    accent: '#FBCFE8',
    accentGlow: 'rgba(251, 207, 232, 0.2)',
  },
  orange: {
    primary: '#F59E0B',
    secondary: '#FB923C',
    accent: '#FCD34D',
    accentGlow: 'rgba(252, 211, 77, 0.2)',
  },
};

// Font size multipliers
const FONT_SIZES = {
  small: 0.875,
  medium: 1,
  large: 1.125,
};

// Grid density spacing
const GRID_DENSITY = {
  compact: {
    cardPadding: '12px',
    cardGap: '12px',
    sectionSpacing: '24px',
  },
  comfortable: {
    cardPadding: '16px',
    cardGap: '16px',
    sectionSpacing: '32px',
  },
  spacious: {
    cardPadding: '24px',
    cardGap: '24px',
    sectionSpacing: '48px',
  },
};

export function UserPreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem('jazer_user_preferences');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all keys exist
        return {
          theme: { ...DEFAULT_PREFERENCES.theme, ...parsed.theme },
          layout: { ...DEFAULT_PREFERENCES.layout, ...parsed.layout },
          content: { ...DEFAULT_PREFERENCES.content, ...parsed.content },
          audio: { ...DEFAULT_PREFERENCES.audio, ...parsed.audio },
        };
      } catch (err) {
        console.error('Failed to parse user preferences:', err);
        return DEFAULT_PREFERENCES;
      }
    }
    return DEFAULT_PREFERENCES;
  });

  // Persist to localStorage whenever preferences change
  useEffect(() => {
    localStorage.setItem('jazer_user_preferences', JSON.stringify(preferences));
    applyPreferencesToDOM(preferences);
  }, [preferences]);

  // Apply preferences to DOM on mount and changes
  useEffect(() => {
    applyPreferencesToDOM(preferences);
  }, []);

  useEffect(() => {
    soundManager.setEnabled(preferences.audio.soundEnabled);
  }, [preferences.audio.soundEnabled]);

  const applyPreferencesToDOM = (prefs) => {
    const root = document.documentElement;

    // Apply high contrast mode
    if (prefs.theme.highContrast) {
      root.setAttribute('data-theme', 'high-contrast');
    } else {
      root.removeAttribute('data-theme');
    }

    // Apply reduced motion override
    if (prefs.theme.reducedMotion !== null) {
      root.setAttribute('data-motion', prefs.theme.reducedMotion ? 'reduced' : 'normal');
    } else {
      root.removeAttribute('data-motion');
    }

    // Apply color scheme
    const scheme = COLOR_SCHEMES[prefs.theme.colorScheme] || COLOR_SCHEMES.purple;
    root.style.setProperty('--accent-primary', prefs.theme.accentColor || scheme.primary);
    root.style.setProperty('--accent-secondary', scheme.secondary);
    root.style.setProperty('--accent-neon', scheme.accent);
    root.style.setProperty('--accent-primary-glow', prefs.theme.accentColor ? `${prefs.theme.accentColor}33` : scheme.accentGlow);

    // Apply font size
    const fontMultiplier = FONT_SIZES[prefs.theme.fontSize] || 1;
    root.style.setProperty('--font-size-multiplier', fontMultiplier.toString());
    root.style.fontSize = `${fontMultiplier * 16}px`;

    // Apply font family
    const fontFamilies = {
      sans: 'var(--font-sans)',
      serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
      mono: 'var(--font-mono)',
    };
    root.style.setProperty('--font-body', fontFamilies[prefs.theme.fontFamily] || fontFamilies.sans);

    // Apply grid density
    const density = GRID_DENSITY[prefs.layout.gridDensity] || GRID_DENSITY.comfortable;
    root.style.setProperty('--card-padding', density.cardPadding);
    root.style.setProperty('--card-gap', density.cardGap);
    root.style.setProperty('--section-spacing', density.sectionSpacing);

    // Apply sidebar position class to body
    document.body.className = document.body.className.replace(/sidebar-(left|right|bottom)/g, '');
    document.body.classList.add(`sidebar-${prefs.layout.sidebarPosition}`);
  };

  const updateTheme = (updates) => {
    setPreferences(prev => ({
      ...prev,
      theme: { ...prev.theme, ...updates }
    }));
  };

  const updateLayout = (updates) => {
    setPreferences(prev => ({
      ...prev,
      layout: { ...prev.layout, ...updates }
    }));
  };

  const updateContent = (updates) => {
    setPreferences(prev => ({
      ...prev,
      content: { ...prev.content, ...updates }
    }));
  };

  const updateAudio = (updates) => {
    setPreferences(prev => ({
      ...prev,
      audio: { ...prev.audio, ...updates }
    }));
  };

  const exportPreferences = () => {
    const dataStr = JSON.stringify(preferences, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jazer-preferences-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importPreferences = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          // Validate structure
          if (imported.theme && imported.layout && imported.content) {
            setPreferences({
              theme: { ...DEFAULT_PREFERENCES.theme, ...imported.theme },
              layout: { ...DEFAULT_PREFERENCES.layout, ...imported.layout },
              content: { ...DEFAULT_PREFERENCES.content, ...imported.content },
              audio: { ...DEFAULT_PREFERENCES.audio, ...imported.audio },
            });
            resolve();
          } else {
            reject(new Error('Invalid preferences file format'));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const resetToDefaults = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  const toggleHighContrast = () => {
    updateTheme({ highContrast: !preferences.theme.highContrast });
  };

  const toggleReducedMotion = () => {
    const current = preferences.theme.reducedMotion;
    // Cycle: null -> true -> false -> null
    if (current === null) {
      updateTheme({ reducedMotion: true });
    } else if (current === true) {
      updateTheme({ reducedMotion: false });
    } else {
      updateTheme({ reducedMotion: null });
    }
  };

  const value = {
    preferences,
    updateTheme,
    updateLayout,
    updateContent,
    updateAudio,
    exportPreferences,
    importPreferences,
    resetToDefaults,
    toggleHighContrast,
    toggleReducedMotion,
    colorSchemes: COLOR_SCHEMES,
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within UserPreferencesProvider');
  }
  return context;
}
