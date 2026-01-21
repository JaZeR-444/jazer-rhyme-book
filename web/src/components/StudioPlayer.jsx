import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  SkipForward,
  SkipBack,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Shuffle,
  X,
  Star,
  Copy,
  Plus,
  Loader
} from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';
import { gsap } from '../lib/gsap';
import { Draggable } from 'gsap/Draggable';
import { tracks } from '../lib/data/tracks';
import './StudioPlayer.css';

// -------------------------
// Beat Library (from your tracks)
// -------------------------
// Optimization: We still map them but we could potentially lazy-load detailed metadata if needed
const BEAT_LIBRARY = tracks.map((track, index) => ({
  id: `track-${index}`,
  name: track.title,
  url: track.src,
  bpm: 90 + (index % 50),
  genre: 'JaZeR'
}));

const MINI_SHAPE = 'circle';
const STORAGE_KEY = 'jazer_studio_player_v2';
const FAV_KEY = 'jazer_studio_player_favs_v1';
const SNAP_PAD = 16;
const VOL_STEP = 0.05;

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function StudioPlayer() {
  const persisted = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return safeParse(raw) || {};
    } catch { return {}; }
  }, []);

  const persistedFavs = useMemo(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      const parsed = safeParse(raw);
      return Array.isArray(parsed) ? new Set(parsed) : new Set();
    } catch { return new Set(); }
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(
    typeof persisted.volume === 'number' ? clamp(persisted.volume, 0, 1) : 0.7
  );
  const [isMuted, setIsMuted] = useState(!!persisted.isMuted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => {
    const idx = typeof persisted.currentTrackIndex === 'number' ? persisted.currentTrackIndex : 0;
    return clamp(idx, 0, BEAT_LIBRARY.length - 1);
  });

  const [showTrackMenu, setShowTrackMenu] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(!!persisted.isCollapsed);
  const [isShuffle, setIsShuffle] = useState(!!persisted.isShuffle);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [hotkeysEnabled, setHotkeysEnabled] = useState(true);

  const [favorites, setFavorites] = useState(persistedFavs);
  const [menuActiveIndex, setMenuActiveIndex] = useState(currentTrackIndex);

  const playerRef = useRef(null);
  const bodyRef = useRef(null);
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const draggableRef = useRef(null);
  const resumeAfterLoadRef = useRef(false);
  const rafRef = useRef(null);
  const queueRef = useRef([]);
  const shuffleBagRef = useRef([]);
  const miniPressTimerRef = useRef(null);

  const currentTrack = useMemo(() => {
    return BEAT_LIBRARY[currentTrackIndex] || BEAT_LIBRARY[0];
  }, [currentTrackIndex]);

  const persistState = (extra = {}) => {
    const el = playerRef.current;
    if (!el) return;
    
    const drag = draggableRef.current;
    const x = drag?.x ?? gsap.getProperty(el, 'x') ?? 0;
    const y = drag?.y ?? gsap.getProperty(el, 'y') ?? 0;

    const payload = {
      currentTrackIndex,
      volume,
      isMuted,
      isCollapsed,
      isShuffle,
      pos: { x: Number(x) || 0, y: Number(y) || 0 },
      ...extra
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {}
  };

  useEffect(() => {
    persistState();
  }, [currentTrackIndex, volume, isMuted, isCollapsed, isShuffle]);

  useEffect(() => {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(favorites)));
    } catch (e) {}
  }, [favorites]);

  useEffect(() => {
    if (!playerRef.current) return;
    gsap.registerPlugin(Draggable);

    const saved = safeParse(localStorage.getItem(STORAGE_KEY));
    if (saved?.pos && typeof saved.pos.x === 'number' && typeof saved.pos.y === 'number') {
      gsap.set(playerRef.current, { x: saved.pos.x, y: saved.pos.y });
    }

    draggableRef.current = Draggable.create(playerRef.current, {
      type: 'x,y',
      bounds: 'body',
      inertia: true,
      trigger: playerRef.current,
      handle: '.studio-player__drag-handle',
      onDragEnd: function() {
        persistState({ pos: { x: this.x, y: this.y } });
      }
    })[0];

    return () => {
      if (draggableRef.current) draggableRef.current.kill();
    };
  }, []);

  useEffect(() => {
    if (!waveformRef.current) return;

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#8B5CF6',
      progressColor: '#00FFFF',
      height: 40,
      backend: 'WebAudio',
      normalize: true
    });

    ws.on('ready', () => {
      setDuration(ws.getDuration());
      setIsLoading(false);
      ws.setVolume(isMuted ? 0 : volume);
      if (resumeAfterLoadRef.current) {
        ws.play();
        resumeAfterLoadRef.current = false;
      }
    });

    ws.on('audioprocess', () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        setCurrentTime(ws.getCurrentTime());
        rafRef.current = null;
      });
    });

    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));
    ws.on('finish', () => handleNextTrack());
    ws.on('error', (err) => {
      console.error('WaveSurfer error:', err);
      setLoadError('Failed to load audio');
      setIsLoading(false);
    });

    wavesurferRef.current = ws;

    return () => {
      ws.destroy();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const ws = wavesurferRef.current;
    if (!ws || !currentTrack?.url) return;

    setIsLoading(true);
    setLoadError(null);
    ws.load(currentTrack.url);
  }, [currentTrackIndex]);

  useEffect(() => {
    const ws = wavesurferRef.current;
    if (ws) ws.setVolume(isMuted ? 0 : volume);
  }, [volume, isMuted]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    if (!hotkeysEnabled) return;

    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch(e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'm':
          toggleMute();
          break;
        case 'n':
          handleNextTrack();
          break;
        case 'p':
          handlePrevTrack();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotkeysEnabled, isPlaying, volume, isMuted]);

  const togglePlay = () => {
    const ws = wavesurferRef.current;
    if (!ws || isLoading) return;
    if (ws.isPlaying()) ws.pause();
    else ws.play();
  };

  const toggleMute = () => setIsMuted(prev => !prev);

  const handleNextTrack = () => {
    const ws = wavesurferRef.current;
    resumeAfterLoadRef.current = ws?.isPlaying() || false;
    
    if (isShuffle) {
      if (shuffleBagRef.current.length === 0) {
        const indices = Array.from({ length: BEAT_LIBRARY.length }, (_, i) => i);
        shuffleBagRef.current = shuffleArray(indices.filter(i => i !== currentTrackIndex));
      }
      setCurrentTrackIndex(shuffleBagRef.current.pop());
    } else {
      setCurrentTrackIndex(prev => (prev + 1) % BEAT_LIBRARY.length);
    }
  };

  const handlePrevTrack = () => {
    const ws = wavesurferRef.current;
    resumeAfterLoadRef.current = ws?.isPlaying() || false;
    setCurrentTrackIndex(prev => (prev === 0 ? BEAT_LIBRARY.length - 1 : prev - 1));
  };

  const toggleShuffle = () => setIsShuffle(prev => !prev);

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleTrackSelect = (index) => {
    const ws = wavesurferRef.current;
    resumeAfterLoadRef.current = ws?.isPlaying() || false;
    setCurrentTrackIndex(index);
    setShowTrackMenu(false);
  };

  if (!currentTrack) return null;

  const isFav = favorites.has(currentTrack.id);

  return (
    <div
      ref={playerRef}
      className="studio-player glass-dark"
      data-state={isCollapsed ? 'mini' : 'expanded'}
      data-mini-shape={MINI_SHAPE}
      role="region"
      aria-label="Studio Audio Player"
    >
      <div className="studio-player__header">
        <button
          className="studio-player__drag-handle"
          aria-label="Drag player"
          title="Drag"
        >
          <GripVertical size={16} aria-hidden="true" />
        </button>

        {!isCollapsed && (
          <div className="studio-player__header-center">
            <span className="studio-player__title">Studio Player</span>
            <button
              className="studio-player__track-chip"
              onClick={() => setShowTrackMenu(!showTrackMenu)}
              aria-label={`Current track: ${currentTrack.name}. Click to change.`}
              aria-expanded={showTrackMenu}
            >
              <Music size={14} aria-hidden="true" />
              <span className="studio-player__track-chip-name">{currentTrack.name}</span>
              <ChevronDown size={14} className={showTrackMenu ? 'is-open' : ''} aria-hidden="true" />
            </button>
          </div>
        )}

        <div className="studio-player__header-actions">
          {!isCollapsed && (
            <button
              className={`studio-player__hotkey-btn ${hotkeysEnabled ? 'active' : ''}`}
              onClick={() => setHotkeysEnabled(!hotkeysEnabled)}
              title={hotkeysEnabled ? "Disable Hotkeys" : "Enable Hotkeys"}
              aria-label={hotkeysEnabled ? "Disable keyboard shortcuts" : "Enable keyboard shortcuts"}
              aria-pressed={hotkeysEnabled}
            >
              <span style={{ fontSize: '10px', fontWeight: 'bold' }}>K</span>
            </button>
          )}
          <button
            className="studio-player__collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand player" : "Collapse player"}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <ChevronDown size={16} aria-hidden="true" /> : <ChevronUp size={16} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {showTrackMenu && !isCollapsed && (
        <div className="track-menu" role="dialog" aria-label="Track Selection">
          <div className="track-menu__header">
            <span>Select Track</span>
            <button onClick={() => setShowTrackMenu(false)} aria-label="Close menu">
              <X size={16} aria-hidden="true" />
            </button>
          </div>
          <div className="track-menu__list" role="listbox">
            {BEAT_LIBRARY.map((track, index) => (
              <button
                key={track.id}
                role="option"
                aria-selected={index === currentTrackIndex}
                className={`track-menu__item ${index === currentTrackIndex ? 'active' : ''}`}
                onClick={() => handleTrackSelect(index)}
              >
                <span className="track-name">{track.name}</span>
                <span className="track-info">{track.bpm} BPM</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="studio-player__body" aria-hidden={isCollapsed}>
        <div className="studio-player__main">
          <div className="studio-player__transport">
            <button onClick={handlePrevTrack} aria-label="Previous track">
              <SkipBack size={18} aria-hidden="true" />
            </button>
            <button 
              className="play-btn" 
              onClick={togglePlay} 
              aria-label={isPlaying ? "Pause" : "Play"}
              disabled={isLoading}
            >
              {isLoading ? <Loader className="spinning" size={20} /> : (isPlaying ? <Pause size={20} /> : <Play size={20} />)}
            </button>
            <button onClick={handleNextTrack} aria-label="Next track">
              <SkipForward size={18} aria-hidden="true" />
            </button>
            <button 
              className={isShuffle ? 'active' : ''} 
              onClick={toggleShuffle} 
              aria-label="Toggle shuffle"
              aria-pressed={isShuffle}
            >
              <Shuffle size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="studio-player__wave-wrap">
            <div className="studio-player__time">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <div className="studio-player__waveform" ref={waveformRef} />
          </div>

          <div className="studio-player__volume">
            <button onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
              {isMuted ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label="Volume"
            />
          </div>
        </div>

        <div className="studio-player__footer">
          <button 
            className={`fav-btn ${isFav ? 'active' : ''}`} 
            onClick={() => toggleFavorite(currentTrack.id)}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFav}
          >
            <Star size={16} fill={isFav ? "currentColor" : "none"} aria-hidden="true" />
          </button>
          <div className="now-playing">
            <span className="track-label">NOW PLAYING:</span>
            <span className="track-name">{currentTrack.name}</span>
          </div>
        </div>
      </div>

      {isCollapsed && (
        <div className="studio-player__mini">
          <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <div className="mini-progress">
            <div 
              className="mini-progress-fill" 
              style={{ width: `${(currentTime / duration) * 100}%` }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}