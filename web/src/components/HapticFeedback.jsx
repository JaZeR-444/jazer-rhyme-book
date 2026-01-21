import { useEffect } from 'react';
import { soundManager } from '../lib/SoundManager';
import { useLocation } from 'react-router-dom';
import { useUserPreferences } from '../contexts/UserPreferencesContext';

export function HapticFeedback() {
  const location = useLocation();
  const { preferences } = useUserPreferences();
  const soundEnabled = preferences?.audio?.soundEnabled ?? true;

  // Sync sound manager enabled state
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Route change sound
  useEffect(() => {
    if (!soundEnabled) return;
    
    // Slight delay to avoid double triggers on some clicks
    const timer = setTimeout(() => {
      soundManager.playHover();
    }, 50);
    
    return () => clearTimeout(timer);
  }, [location, soundEnabled]);

  // Global Click Listener
  useEffect(() => {
    if (!soundEnabled) return;

    const handleClick = (e) => {
      // Don't play sounds for clicks on inputs, textareas, or selects
      const tagName = e.target.tagName?.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') return;
      if (e.target.isContentEditable) return;

      // Play sound if clicking a button, link, or interactive element
      if (
        e.target.closest('button') || 
        e.target.closest('a') || 
        e.target.closest('[role="button"]') ||
        e.target.closest('.cmd-item')
      ) {
        soundManager.playClick();
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [soundEnabled]);

  return null; // Headless component
}