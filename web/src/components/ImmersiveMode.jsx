import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { X, Maximize2, Music, Lightbulb, Sparkles } from 'lucide-react';
import { StudioPlayer } from './StudioPlayer';
import { GhostModule } from './GhostModule';
import './ImmersiveMode.css';

const VIBE_PRESETS = {
  focus: {
    name: 'Deep Focus',
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    accent: '#00FFFF',
    icon: '🎯'
  },
  creative: {
    name: 'Creative Flow',
    background: 'linear-gradient(135deg, #1a0033, #330066, #660099)',
    accent: '#FF00FF',
    icon: '✨'
  },
  energy: {
    name: 'High Energy',
    background: 'linear-gradient(135deg, #ff0080, #ff8c00, #ffd700)',
    accent: '#FFD700',
    icon: '⚡'
  },
  chill: {
    name: 'Chill Vibes',
    background: 'linear-gradient(135deg, #0a192f, #172a45, #1e3a5f)',
    accent: '#64FFDA',
    icon: '🌊'
  },
  midnight: {
    name: 'Midnight Oil',
    background: 'linear-gradient(135deg, #000000, #1a1a2e, #16213e)',
    accent: '#0F3460',
    icon: '🌙'
  }
};

export function ImmersiveMode({ 
  isOpen, 
  onClose, 
  writingText, 
  onTextChange,
  currentLine,
  currentWord,
  dictionaryIndex,
  onInsertRhyme 
}) {
  const [currentVibe, setCurrentVibe] = useState('focus');
  const [showPlayer, setShowPlayer] = useState(false);
  const [showGhost, setShowGhost] = useState(true);
  const [showVibeSelector, setShowVibeSelector] = useState(false);
  const [scanlineActive, setScanlineActive] = useState(true);

  // Memoize particle positions to avoid visual jitter on re-renders
  const particles = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${10 + Math.random() * 20}s`
    }));
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.ctrlKey && e.key === 'm') setShowPlayer(prev => !prev);
      if (e.ctrlKey && e.key === 'g') setShowGhost(prev => !prev);
      if (e.ctrlKey && e.key === 'v') setShowVibeSelector(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const vibe = VIBE_PRESETS[currentVibe];

  return (
    <div 
      className="immersive-mode" 
      style={{ 
        background: vibe.background,
        '--accent-color': vibe.accent 
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Immersive Writing Mode: ${vibe.name}`}
    >
      {/* Animated Scanlines */}
      {scanlineActive && <div className="immersive-mode__scanlines" aria-hidden="true" />}

      {/* Floating Particles */}
      <div className="immersive-mode__particles" aria-hidden="true">
        {particles.map((p) => (
          <div 
            key={p.id} 
            className="particle" 
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration
            }}
          />
        ))}
      </div>

      {/* Top Control Bar */}
      <div className="immersive-mode__topbar">
        <div className="immersive-mode__vibe-indicator">
          <span className="vibe-icon" aria-hidden="true">{vibe.icon}</span>
          <span className="vibe-name">{vibe.name}</span>
        </div>

        <div className="immersive-mode__controls">
          <button 
            className={`control-btn ${showVibeSelector ? 'active' : ''}`}
            onClick={() => setShowVibeSelector(!showVibeSelector)}
            title="Change Vibe (Ctrl+V)"
            aria-label="Change Vibe"
            aria-pressed={showVibeSelector}
          >
            <Lightbulb size={18} aria-hidden="true" />
          </button>
          
          <button 
            className={`control-btn ${showPlayer ? 'active' : ''}`}
            onClick={() => setShowPlayer(!showPlayer)}
            title="Toggle Music (Ctrl+M)"
            aria-label="Toggle Music"
            aria-pressed={showPlayer}
          >
            <Music size={18} aria-hidden="true" />
          </button>

          <button 
            className={`control-btn ${showGhost ? 'active' : ''}`}
            onClick={() => setShowGhost(!showGhost)}
            title="Toggle Ghost Assistant (Ctrl+G)"
            aria-label="Toggle Ghost Assistant"
            aria-pressed={showGhost}
          >
            <Sparkles size={18} aria-hidden="true" />
          </button>

          <button 
            className={`control-btn ${scanlineActive ? 'active' : ''}`}
            onClick={() => setScanlineActive(!scanlineActive)}
            title="Toggle Scanlines"
            aria-label="Toggle Scanlines"
            aria-pressed={scanlineActive}
          >
            <Maximize2 size={18} aria-hidden="true" />
          </button>

          <button 
            className="control-btn close-btn"
            onClick={onClose}
            title="Exit Immersive Mode (Esc)"
            aria-label="Exit Immersive Mode"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Vibe Selector Panel */}
      {showVibeSelector && (
        <div className="immersive-mode__vibe-panel glass-dark">
          <h3>Select Your Vibe</h3>
          <div className="vibe-grid" role="radiogroup">
            {Object.entries(VIBE_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                role="radio"
                aria-checked={currentVibe === key}
                className={`vibe-card ${currentVibe === key ? 'active' : ''}`}
                onClick={() => {
                  setCurrentVibe(key);
                  setShowVibeSelector(false);
                }}
                style={{ background: preset.background }}
              >
                <span className="vibe-card__icon" aria-hidden="true">{preset.icon}</span>
                <span className="vibe-card__name">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Writing Area */}
      <div className="immersive-mode__content">
        <textarea
          className="immersive-editor"
          value={writingText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Let your creativity flow..."
          autoFocus
          spellCheck="true"
          aria-label="Lyrics editor"
        />
      </div>

      {/* Studio Player - Bottom */}
      {showPlayer && (
        <div className="immersive-mode__player">
          <StudioPlayer />
        </div>
      )}

      {/* Ghost Assistant - Side Panel */}
      {showGhost && (
        <div className="immersive-mode__ghost">
          <GhostModule
            currentLine={currentLine}
            currentWord={currentWord}
            dictionaryIndex={dictionaryIndex}
            onInsertRhyme={onInsertRhyme}
            compact={true}
          />
        </div>
      )}

      {/* Ambient Glow Effect */}
      <div 
        className="immersive-mode__glow" 
        style={{ 
          boxShadow: `0 0 200px 100px ${vibe.accent}33`,
          background: `radial-gradient(circle at 50% 50%, ${vibe.accent}15, transparent 70%)`
        }}
        aria-hidden="true"
      />
    </div>
  );
}

ImmersiveMode.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  writingText: PropTypes.string,
  onTextChange: PropTypes.func.isRequired,
  currentLine: PropTypes.string,
  currentWord: PropTypes.string,
  dictionaryIndex: PropTypes.shape({
    words: PropTypes.array
  }),
  onInsertRhyme: PropTypes.func.isRequired
};