import { useEffect } from 'react';
import { soundManager } from '../lib/SoundManager';
import { useLocation } from 'react-router-dom';

export function HapticFeedback() {
  const location = useLocation();

  // Route change sound
  useEffect(() => {
    soundManager.playHover(); // Subtle tick on navigation
  }, [location]);

  // Global Click Listener
  useEffect(() => {
    const handleClick = (e) => {
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
  }, []);

  return null; // Headless component
}
