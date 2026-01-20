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
  Plus
} from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';
import { gsap } from '../lib/gsap';
import { Draggable } from 'gsap/Draggable';
import { tracks } from '../lib/data/tracks';
import './StudioPlayer.css';

// -------------------------
// Beat Library (from your tracks)
// -------------------------
const BEAT_LIBRARY = tracks.map((track, index) => ({
  id: `track-${index}`,
  name: track.title,
  url: track.src,
  bpm: 90 + (index % 50), // Placeholder BPM (keep if you don't have BPM metadata yet)
  genre: 'JaZeR'
}));

// Mini shape: "circle" or "square"
const MINI_SHAPE = 'circle';

// Storage keys (versioned)
const STORAGE_KEY = 'studioPlayer.v2';
const FAV_KEY = 'studioPlayer.favs.v1';

// Snap padding (px)
const SNAP_PAD = 16;

// Keyboard seek/volume increments
const SEEK_SMALL = 5; // seconds
const SEEK_LARGE = 15; // seconds
const VOL_STEP = 0.05; // 5%

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
  // -------------------------
  // Persisted defaults (lazy init)
  // -------------------------
  const persisted = useMemo(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return safeParse(raw) || {};
  }, []);

  const persistedFavs = useMemo(() => {
    const raw = localStorage.getItem(FAV_KEY);
    const parsed = safeParse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
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

  const [favorites, setFavorites] = useState(persistedFavs); // Set of track ids
  const [menuActiveIndex, setMenuActiveIndex] = useState(() => {
    const idx = typeof persisted.currentTrackIndex === 'number' ? persisted.currentTrackIndex : 0;
    return clamp(idx, 0, BEAT_LIBRARY.length - 1);
  });

  // -------------------------
  // Refs
  // -------------------------
  const playerRef = useRef(null);
  const bodyRef = useRef(null);
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const draggableRef = useRef(null);

  // For keeping playback on next/prev or selection
  const resumeAfterLoadRef = useRef(false);

  // Crossfade / smooth load volumes
  const preLoadTargetVolRef = useRef(volume);

  // Throttle audio time updates
  const timeRef = useRef(0);
  const rafRef = useRef(null);

  // Track queue (indices)
  const queueRef = useRef([]);

  // Shuffle bag (indices)
  const shuffleBagRef = useRef([]);

  // Resize observer
  const resizeObsRef = useRef(null);

  // Mini long-press (open tracks)
  const miniPressTimerRef = useRef(null);

  const currentTrack = useMemo(() => {
    return BEAT_LIBRARY[currentTrackIndex] || BEAT_LIBRARY[0];
  }, [currentTrackIndex]);

  // -------------------------
  // Persist state (settings + position)
  // -------------------------
  const persistState = (extra = {}) => {
    const el = playerRef.current;
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
    } catch {
      // no-op
    }
  };

  useEffect(() => {
    persistState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex, volume, isMuted, isCollapsed, isShuffle]);

  useEffect(() => {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(favorites)));
    } catch {
      // no-op
    }
  }, [favorites]);

  // -------------------------
  // GSAP Draggable + restore position + snap-to-edges + persist
  // -------------------------
  useEffect(() => {
    if (!playerRef.current) return;

    gsap.registerPlugin(Draggable);

    // Restore saved position before creating Draggable (best-effort)
    const saved = safeParse(localStorage.getItem(STORAGE_KEY));
    if (saved?.pos && typeof saved.pos.x === 'number' && typeof saved.pos.y === 'number') {
      gsap.set(playerRef.current, { x: saved.pos.x, y: saved.pos.y });
    }

    const snapToEdges = (x, y) => {
      const el = playerRef.current;
      if (!el) return { x, y };

      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Distances to edges (using rect in viewport coordinates)
      const distLeft = rect.left;
      const distRight = vw - rect.right;
      const distTop = rect.top;
      const distBottom = vh - rect.bottom;

      const minDist = Math.min(distLeft, distRight, distTop, distBottom);

      // Compute target using current transform x/y (Draggable space)
      let tx = x;
      let ty = y;

      if (minDist === distLeft) {
        // Snap left
        tx = x - distLeft + SNAP_PAD;
      } else if (minDist === distRight) {
        // Snap right
        tx = x + distRight - SNAP_PAD;
      } else if (minDist === distTop) {
        // Snap top
        ty = y - distTop + SNAP_PAD;
      } else {
        // Snap bottom
        ty = y + distBottom - SNAP_PAD;
      }

      return { x: tx, y: ty };
    };

    draggableRef.current = Draggable.create(playerRef.current, {
      type: 'x,y',
      bounds: 'body',
      inertia: true,
      edgeResistance: 0.65,
      cursor: 'grab',
      activeCursor: 'grabbing',
      dragClickables: true,
      allowContextMenu: true,
      trigger: playerRef.current,
      handle: '.studio-player__drag-handle',
      onDragStart: () => {
        gsap.to(playerRef.current, {
          scale: 1.02,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
          duration: 0.2
        });
      },
      onDragEnd: function onDragEnd() {
        const snapped = snapToEdges(this.x, this.y);
        gsap.to(playerRef.current, {
          x: snapped.x,
          y: snapped.y,
          scale: 1,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
          duration: 0.22,
          ease: 'power2.out',
          onComplete: () => {
            // Sync draggable internals to snapped position
            try {
              this.update();
            } catch {
              // no-op
            }
            persistState({ pos: snapped });
          }
        });
      }
    })[0];

    return () => {
      if (draggableRef.current) draggableRef.current.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------
  // Create WaveSurfer ONCE (do not destroy on collapse)
  // -------------------------
  useEffect(() => {
    if (!waveformRef.current) return;

    let isMounted = true;

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#8B5CF6',
      progressColor: '#00FFFF',
      cursorColor: '#FF0080',
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 40,
      normalize: true,
      backend: 'WebAudio',
      autoplay: false,
      interact: true
    });

    const onReady = () => {
      if (!isMounted) return;

      setLoadError(null);
      setDuration(ws.getDuration() || 0);

      // Sync volume (fade in after load if we faded out)
      const targetVol = isMuted ? 0 : volume;
      const fadeInTo = clamp(targetVol, 0, 1);

      setIsLoading(false);

      // Ensure time state is consistent
      const ct = ws.getCurrentTime() || 0;
      timeRef.current = ct;
      setCurrentTime(ct);

      // Crossfade in
      try {
        const fromVol = 0;
        ws.setVolume(fromVol);
        gsap.to({ v: fromVol }, {
          v: fadeInTo,
          duration: 0.15,
          ease: 'power2.out',
          onUpdate: function () {
            ws.setVolume(this.targets()[0].v);
          }
        });
      } catch {
        ws.setVolume(fadeInTo);
      }

      // Resume if requested
      if (resumeAfterLoadRef.current) {
        resumeAfterLoadRef.current = false;
        ws.play().catch(() => setIsPlaying(false));
      } else {
        ws.pause();
        setIsPlaying(false);
      }
    };

    const onAudioProcess = () => {
      // Throttle React updates via rAF
      const ct = ws.getCurrentTime() || 0;
      timeRef.current = ct;

      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (!isMounted) return;
        setCurrentTime(timeRef.current);
      });
    };

    const onPlay = () => isMounted && setIsPlaying(true);
    const onPause = () => isMounted && setIsPlaying(false);
    const onFinish = () => isMounted && setIsPlaying(false);

    const onError = (e) => {
      if (!isMounted) return;
      setIsLoading(false);
      setIsPlaying(false);
      setLoadError('Audio failed to load. Try retry.');
      // Keep volume reasonable
      try {
        ws.pause();
      } catch {
        // no-op
      }
    };

    ws.on('ready', onReady);
    ws.on('audioprocess', onAudioProcess);
    ws.on('play', onPlay);
    ws.on('pause', onPause);
    ws.on('finish', onFinish);
    ws.on('error', onError);

    // Double-click waveform to restart
    const wfEl = waveformRef.current;
    const onDblClick = () => {
      try {
        ws.seekTo(0);
        timeRef.current = 0;
        setCurrentTime(0);
      } catch {
        // no-op
      }
    };
    wfEl?.addEventListener('dblclick', onDblClick);

    wavesurferRef.current = ws;

    return () => {
      isMounted = false;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      try {
        wfEl?.removeEventListener('dblclick', onDblClick);
      } catch {
        // no-op
      }

      try {
        ws.un('ready', onReady);
        ws.un('audioprocess', onAudioProcess);
        ws.un('play', onPlay);
        ws.un('pause', onPause);
        ws.un('finish', onFinish);
        ws.un('error', onError);
      } catch {
        // no-op
      }

      try {
        ws.pause();
        ws.destroy();
      } catch {
        // no-op
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------
  // ResizeObserver: redraw waveform on size changes
  // -------------------------
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    const ws = wavesurferRef.current;
    if (!ws) return;

    if (typeof ResizeObserver === 'undefined') return;

    resizeObsRef.current = new ResizeObserver(() => {
      try {
        ws.drawBuffer?.();
      } catch {
        // no-op
      }
    });

    resizeObsRef.current.observe(el);

    return () => {
      try {
        resizeObsRef.current?.disconnect();
      } catch {
        // no-op
      }
      resizeObsRef.current = null;
    };
  }, []);

  // -------------------------
  // Load track when index changes (no re-create)
  // + smooth fade out before load (crossfade)
  // -------------------------
  useEffect(() => {
    const ws = wavesurferRef.current;
    if (!ws || !currentTrack?.url) return;

    setIsLoading(true);
    setLoadError(null);
    setCurrentTime(0);
    setDuration(0);
    timeRef.current = 0;

    // Fade out quickly before load to avoid clicks
    preLoadTargetVolRef.current = isMuted ? 0 : volume;

    try {
      const startVol = clamp(preLoadTargetVolRef.current, 0, 1);
      const obj = { v: startVol };
      gsap.to(obj, {
        v: 0,
        duration: 0.12,
        ease: 'power2.out',
        onUpdate: () => {
          try {
            ws.setVolume(obj.v);
          } catch {
            // no-op
          }
        },
        onComplete: () => {
          try {
            ws.pause();
          } catch {
            // no-op
          }
          try {
            ws.load(currentTrack.url);
          } catch {
            setIsLoading(false);
            setIsPlaying(false);
            setLoadError('Audio failed to load. Try retry.');
          }
        }
      });
    } catch {
      try {
        ws.pause();
      } catch {
        // no-op
      }
      try {
        ws.load(currentTrack.url);
      } catch {
        setIsLoading(false);
        setIsPlaying(false);
        setLoadError('Audio failed to load. Try retry.');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex]);

  // -------------------------
  // Keep volume in sync (but do not fight crossfade)
  // -------------------------
  useEffect(() => {
    const ws = wavesurferRef.current;
    if (!ws) return;

    try {
      ws.setVolume(isMuted ? 0 : volume);
    } catch {
      // no-op
    }
  }, [volume, isMuted]);

  // -------------------------
  // Close track menu on outside click / Escape
  // -------------------------
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setShowTrackMenu(false);
    };

    const onPointerDown = (e) => {
      const root = playerRef.current;
      if (!root) return;
      if (!root.contains(e.target)) setShowTrackMenu(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, []);

  // -------------------------
  // Keyboard shortcuts (DAW style)
  // -------------------------
  useEffect(() => {
    const isTypingTarget = (t) => {
      if (!t) return false;
      const tag = t.tagName?.toLowerCase?.();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
      if (t.isContentEditable) return true;
      return false;
    };

    const seekBy = (deltaSec) => {
      const ws = wavesurferRef.current;
      if (!ws) return;

      const dur = ws.getDuration?.() || duration || 0;
      if (!dur) return;

      const ct = ws.getCurrentTime?.() || 0;
      const next = clamp(ct + deltaSec, 0, dur);
      const progress = dur ? next / dur : 0;

      try {
        ws.seekTo(progress);
        timeRef.current = next;
        setCurrentTime(next);
      } catch {
        // no-op
      }
    };

    const onKeyDown = (e) => {
      if (isTypingTarget(e.target)) return;

      // Space should not scroll the page
      if (e.key === ' ') e.preventDefault();

      // ESC already handled (closes menu)
      if (e.key === 'Escape') return;

      // Toggles / actions
      if (e.key === ' ') togglePlay();
      else if (e.key === 'm' || e.key === 'M') toggleMute();
      else if (e.key === 'n' || e.key === 'N') handleNextTrack();
      else if (e.key === 'p' || e.key === 'P') handlePrevTrack();
      else if (e.key === 's' || e.key === 'S') setIsShuffle((v) => !v);
      else if (e.key === 't' || e.key === 'T') setShowTrackMenu((v) => !v);
      else if (e.key === 'c' || e.key === 'C') toggleCollapseAnimated();
      else if (e.key === 'ArrowLeft') seekBy(e.shiftKey ? -SEEK_LARGE : -SEEK_SMALL);
      else if (e.key === 'ArrowRight') seekBy(e.shiftKey ? SEEK_LARGE : SEEK_SMALL);
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setVolume((v) => clamp(v + VOL_STEP, 0, 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setVolume((v) => clamp(v - VOL_STEP, 0, 1));
      }
    };

    document.addEventListener('keydown', onKeyDown, { passive: false });
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, isMuted, volume, isShuffle]);

  // -------------------------
  // Track menu keyboard navigation (listbox)
  // -------------------------
  useEffect(() => {
    if (!showTrackMenu) return;

    setMenuActiveIndex((i) => clamp(i, 0, BEAT_LIBRARY.length - 1));

    const onKeyDown = (e) => {
      if (e.key === 'Escape') return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMenuActiveIndex((i) => clamp(i + 1, 0, BEAT_LIBRARY.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMenuActiveIndex((i) => clamp(i - 1, 0, BEAT_LIBRARY.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleTrackSelect(menuActiveIndex);
      }
    };

    document.addEventListener('keydown', onKeyDown, { passive: false });
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTrackMenu, menuActiveIndex]);

  // -------------------------
  // Shuffle bag refill logic
  // -------------------------
  const refillShuffleBag = () => {
    const indices = Array.from({ length: BEAT_LIBRARY.length }, (_, i) => i).filter(
      (i) => i !== currentTrackIndex
    );
    shuffleBagRef.current = shuffleArray(indices);
  };

  // -------------------------
  // Actions
  // -------------------------
  const togglePlay = async () => {
    const ws = wavesurferRef.current;
    if (!ws || isLoading || loadError) return;

    try {
      if (ws.isPlaying()) ws.pause();
      else await ws.play();
    } catch {
      setIsPlaying(false);
    }
  };

  const toggleMute = () => setIsMuted((v) => !v);

  const retryLoad = () => {
    const ws = wavesurferRef.current;
    if (!ws || !currentTrack?.url) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      ws.load(currentTrack.url);
    } catch {
      setIsLoading(false);
      setIsPlaying(false);
      setLoadError('Audio failed to load. Try retry.');
    }
  };

  const handleTrackSelect = (index, { resumeIfPlaying = true } = {}) => {
    const ws = wavesurferRef.current;
    const wasPlaying = ws?.isPlaying?.() || false;

    // Pause before switching
    try {
      ws?.pause?.();
    } catch {
      // no-op
    }
    setIsPlaying(false);

    resumeAfterLoadRef.current = resumeIfPlaying && wasPlaying;
    setCurrentTrackIndex(clamp(index, 0, BEAT_LIBRARY.length - 1));
    setShowTrackMenu(false);
  };

  const enqueueTrack = (index, mode = 'queue') => {
    const idx = clamp(index, 0, BEAT_LIBRARY.length - 1);
    if (mode === 'next') queueRef.current.unshift(idx);
    else queueRef.current.push(idx);
  };

  const handleNextTrack = () => {
    const ws = wavesurferRef.current;
    const wasPlaying = ws?.isPlaying?.() || false;

    try {
      ws?.pause?.();
    } catch {
      // no-op
    }
    setIsPlaying(false);

    resumeAfterLoadRef.current = wasPlaying;

    // 1) Queue wins
    if (queueRef.current.length > 0) {
      const nextFromQueue = queueRef.current.shift();
      setCurrentTrackIndex(nextFromQueue);
      return;
    }

    // 2) Shuffle bag (no immediate repeats)
    if (isShuffle) {
      if (shuffleBagRef.current.length === 0) refillShuffleBag();
      const nextIndex = shuffleBagRef.current.shift();
      setCurrentTrackIndex(typeof nextIndex === 'number' ? nextIndex : currentTrackIndex);
      return;
    }

    // 3) Normal next
    setCurrentTrackIndex((i) => (i + 1) % BEAT_LIBRARY.length);
  };

  const handlePrevTrack = () => {
    const ws = wavesurferRef.current;
    const wasPlaying = ws?.isPlaying?.() || false;

    try {
      ws?.pause?.();
    } catch {
      // no-op
    }
    setIsPlaying(false);

    resumeAfterLoadRef.current = wasPlaying;

    setCurrentTrackIndex((i) => (i === 0 ? BEAT_LIBRARY.length - 1 : i - 1));
  };

  const toggleShuffle = () => {
    setIsShuffle((v) => {
      const next = !v;
      if (next) refillShuffleBag();
      else shuffleBagRef.current = [];
      return next;
    });
  };

  const toggleFavorite = (trackId) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) next.delete(trackId);
      else next.add(trackId);
      return next;
    });
  };

  const copyTrackName = async (name) => {
    try {
      await navigator.clipboard.writeText(name);
    } catch {
      // no-op (clipboard not available)
    }
  };

  // Collapse/expand animation polish (GSAP)
  const toggleCollapseAnimated = () => {
    setShowTrackMenu(false);

    const el = bodyRef.current;
    if (!el) {
      setIsCollapsed((v) => !v);
      return;
    }

    if (!isCollapsed) {
      // Collapsing: fade body out then collapse
      gsap.to(el, {
        opacity: 0,
        duration: 0.16,
        ease: 'power2.out',
        onComplete: () => {
          setIsCollapsed(true);
          gsap.set(el, { opacity: 0 });
        }
      });
    } else {
      // Expanding: expand then fade body in
      setIsCollapsed(false);
      gsap.set(el, { opacity: 0 });
      gsap.to(el, {
        opacity: 1,
        duration: 0.18,
        ease: 'power2.out',
        delay: 0.04
      });
    }
  };

  // Mini progress bar seek
  const handleMiniSeek = (e) => {
    const ws = wavesurferRef.current;
    if (!ws) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX ?? (e.touches?.[0]?.clientX ?? rect.left);
    const pct = clamp((x - rect.left) / rect.width, 0, 1);

    try {
      ws.seekTo(pct);
      const dur = ws.getDuration?.() || duration || 0;
      const nextTime = dur * pct;
      timeRef.current = nextTime;
      setCurrentTime(nextTime);
    } catch {
      // no-op
    }
  };

  // Mini play long-press opens track menu
  const onMiniPlayPointerDown = () => {
    miniPressTimerRef.current = window.setTimeout(() => {
      setShowTrackMenu(true);
    }, 420);
  };
  const onMiniPlayPointerUp = () => {
    if (miniPressTimerRef.current) {
      clearTimeout(miniPressTimerRef.current);
      miniPressTimerRef.current = null;
    }
  };

  // Ensure shuffle bag stays valid when toggling shuffle on and when track changes
  useEffect(() => {
    if (!isShuffle) return;
    if (shuffleBagRef.current.length === 0) refillShuffleBag();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShuffle, currentTrackIndex]);

  // Keep menu selection in sync when opening
  useEffect(() => {
    if (showTrackMenu) setMenuActiveIndex(currentTrackIndex);
  }, [showTrackMenu, currentTrackIndex]);

  // -------------------------
  // Render
  // -------------------------
  const bodyId = 'studio-player-body';
  const isFav = favorites.has(currentTrack?.id);

  return (
    <div
      ref={playerRef}
      className="studio-player glass-dark"
      data-state={isCollapsed ? 'mini' : 'expanded'}
      data-mini-shape={MINI_SHAPE}
      aria-label="Studio Player"
    >
      {/* Header: always visible */}
      <div className="studio-player__header">
        <button
          type="button"
          className="studio-player__drag-handle"
          aria-label="Drag player"
          title="Drag"
        >
          <GripVertical size={16} />
        </button>

        {!isCollapsed && (
          <div className="studio-player__header-center">
            <span className="studio-player__title">Studio Player</span>

            <button
              type="button"
              className="studio-player__track-chip"
              onClick={() => setShowTrackMenu((v) => !v)}
              aria-label="Select track"
              title="Select track"
            >
              <Music size={14} />
              <span className="studio-player__track-chip-name">{currentTrack?.name || 'Track'}</span>
              <ChevronDown size={14} className={`studio-player__chev ${showTrackMenu ? 'is-open' : ''}`} />
            </button>
          </div>
        )}

        <button
          type="button"
          className="studio-player__collapse-btn"
          onClick={toggleCollapseAnimated}
          aria-label={isCollapsed ? 'Expand player' : 'Collapse player'}
          aria-expanded={!isCollapsed}
          aria-controls={bodyId}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {/* Track menu (listbox + keyboard nav + queue actions) */}
      {showTrackMenu && (
        <div className="track-menu" aria-label="Track list">
          <div className="track-menu__top">
            <span className="track-menu__title">Tracks</span>

            <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
              <button
                type="button"
                className="track-menu__close"
                onClick={() => {
                  enqueueTrack(menuActiveIndex, 'next');
                  setShowTrackMenu(false);
                }}
                aria-label="Play next (queue at front)"
                title="Play next"
              >
                <Plus size={14} />
              </button>

              <button
                type="button"
                className="track-menu__close"
                onClick={() => {
                  enqueueTrack(menuActiveIndex, 'queue');
                  setShowTrackMenu(false);
                }}
                aria-label="Queue track"
                title="Queue"
              >
                <Plus size={14} />
              </button>

              <button
                type="button"
                className="track-menu__close"
                onClick={() => setShowTrackMenu(false)}
                aria-label="Close track menu"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div
            role="listbox"
            aria-activedescendant={`track-option-${menuActiveIndex}`}
            tabIndex={0}
            style={{ overflow: 'auto' }}
          >
            {BEAT_LIBRARY.map((track, index) => {
              const active = index === currentTrackIndex;
              const focused = index === menuActiveIndex;

              return (
                <button
                  key={track.id}
                  id={`track-option-${index}`}
                  role="option"
                  aria-selected={active}
                  type="button"
                  className={`track-menu__item ${active ? 'active' : ''}`}
                  style={{
                    outline: focused ? '2px solid rgba(0,255,255,0.35)' : 'none',
                    outlineOffset: '-2px'
                  }}
                  onMouseEnter={() => setMenuActiveIndex(index)}
                  onFocus={() => setMenuActiveIndex(index)}
                  onClick={() => handleTrackSelect(index)}
                >
                  <span className="track-name">{track.name}</span>
                  <span className="track-info">
                    {track.bpm} BPM • {track.genre}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MINI UI: visible when collapsed */}
      <div className="studio-player__mini" aria-hidden={!isCollapsed}>
        <div className="studio-player__mini-row">
          <button
            type="button"
            className="studio-player__btn mini-btn"
            onClick={handlePrevTrack}
            aria-label="Previous track"
            title="Previous"
          >
            <SkipBack size={16} />
          </button>

          <button
            type="button"
            className="studio-player__btn mini-play"
            onPointerDown={onMiniPlayPointerDown}
            onPointerUp={onMiniPlayPointerUp}
            onPointerCancel={onMiniPlayPointerUp}
            onPointerLeave={onMiniPlayPointerUp}
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            title={isPlaying ? 'Pause' : 'Play (long-press: tracks)'}
            disabled={!!loadError}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button
            type="button"
            className="studio-player__btn mini-btn"
            onClick={handleNextTrack}
            aria-label="Next track"
            title="Next"
          >
            <SkipForward size={16} />
          </button>
        </div>

        {/* Mini seek bar + time */}
        <div
          style={{
            marginTop: 8,
            width: '100%',
            height: 10,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.08)',
            position: 'relative',
            cursor: 'pointer'
          }}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.max(1, Math.round(duration))}
          aria-valuenow={Math.round(currentTime)}
          onMouseDown={handleMiniSeek}
          onTouchStart={(e) => {
            e.preventDefault();
            handleMiniSeek(e.touches[0]);
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${duration ? clamp(currentTime / duration, 0, 1) * 100 : 0}%`,
              borderRadius: 999,
              background: 'var(--brand-gradient)',
              opacity: 0.75
            }}
          />
        </div>
        <div style={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, opacity: 0.75, fontFamily: 'var(--font-mono)' }}>
            {formatTime(currentTime)}
          </span>
          <span style={{ fontSize: 10, opacity: 0.6, fontFamily: 'var(--font-mono)' }}>
            {formatTime(duration)}
          </span>
        </div>

        <div className="studio-player__mini-row studio-player__mini-row--bottom">
          <button
            type="button"
            className="studio-player__btn mini-btn"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="volume-slider mini-volume"
            aria-label="Volume"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(volume * 100)}
          />

          <button
            type="button"
            className={`studio-player__btn mini-btn ${isShuffle ? 'active' : ''}`}
            onClick={toggleShuffle}
            aria-label={isShuffle ? 'Shuffle on' : 'Shuffle off'}
            title={isShuffle ? 'Shuffle on' : 'Shuffle off'}
          >
            <Shuffle size={16} />
          </button>
        </div>

        <button
          type="button"
          className="studio-player__mini-track"
          onClick={() => setShowTrackMenu((v) => !v)}
          aria-label="Open track list"
          title="Tracks"
        >
          <Music size={14} />
        </button>

        {/* Mini: loading / error indicators */}
        {isLoading && !loadError && <div className="studio-player__mini-loading" aria-label="Loading" />}
        {loadError && (
          <button
            type="button"
            onClick={retryLoad}
            aria-label="Retry load"
            title={loadError}
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 6,
              transform: 'translateX(-50%)',
              width: 10,
              height: 10,
              borderRadius: 999,
              background: 'rgba(255,0,128,0.9)',
              border: '1px solid rgba(255,255,255,0.25)',
              cursor: 'pointer'
            }}
          />
        )}
      </div>

      {/* EXPANDED BODY: still mounted even in mini mode, but visually hidden to keep WaveSurfer alive */}
      <div ref={bodyRef} id={bodyId} className="studio-player__body" aria-hidden={isCollapsed}>
        <div className="studio-player__main">
          <div className="studio-player__transport">
            <button
              type="button"
              className="studio-player__btn"
              onClick={handlePrevTrack}
              aria-label="Previous track"
              title="Previous"
            >
              <SkipBack size={16} />
            </button>

            <button
              type="button"
              className="studio-player__btn play-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              title={isPlaying ? 'Pause' : 'Play'}
              disabled={!!loadError}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <button
              type="button"
              className="studio-player__btn"
              onClick={handleNextTrack}
              aria-label="Next track"
              title="Next"
            >
              <SkipForward size={16} />
            </button>

            <button
              type="button"
              className={`studio-player__btn ${isShuffle ? 'active' : ''}`}
              onClick={toggleShuffle}
              aria-label={isShuffle ? 'Shuffle on' : 'Shuffle off'}
              title={isShuffle ? 'Shuffle on' : 'Shuffle off'}
            >
              <Shuffle size={16} />
            </button>
          </div>

          <div className="studio-player__wave-wrap">
            <div className="studio-player__wave-top">
              <span className="studio-player__time">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <span className="studio-player__bpm">{currentTrack?.bpm} BPM</span>

              {isLoading && !loadError && <span className="studio-player__loading">Loading…</span>}
              {loadError && (
                <button
                  type="button"
                  onClick={retryLoad}
                  style={{
                    padding: '2px 8px',
                    borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.18)',
                    background: 'rgba(255,0,128,0.12)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: 11
                  }}
                  aria-label="Retry audio load"
                  title="Retry"
                >
                  Retry
                </button>
              )}
            </div>

            {/* Waveform (dblclick to restart handled in effect) */}
            <div className="studio-player__waveform" ref={waveformRef} />
          </div>

          <div className="studio-player__volume">
            <button
              type="button"
              className="studio-player__btn"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="volume-slider"
              aria-label="Volume"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(volume * 100)}
            />
          </div>
        </div>

        {/* Now Playing / utility row */}
        <div
          style={{
            marginTop: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10
          }}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 0 }}>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 999,
                border: '1px solid var(--border-subtle)',
                background: 'var(--surface-2)',
                color: 'var(--text-secondary)',
                fontSize: 11,
                whiteSpace: 'nowrap'
              }}
            >
              {currentTrack?.genre || 'Genre'}
            </span>

            <span
              style={{
                padding: '2px 8px',
                borderRadius: 999,
                border: '1px solid var(--border-subtle)',
                background: 'var(--surface-2)',
                color: 'var(--text-secondary)',
                fontSize: 11,
                whiteSpace: 'nowrap'
              }}
            >
              Queue: {queueRef.current.length}
            </span>

            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: 12,
                color: 'var(--text-primary)',
                fontWeight: 600
              }}
              title={currentTrack?.name}
            >
              {currentTrack?.name}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button
              type="button"
              className={`studio-player__btn ${isFav ? 'active' : ''}`}
              onClick={() => toggleFavorite(currentTrack?.id)}
              aria-label={isFav ? 'Unfavorite track' : 'Favorite track'}
              title={isFav ? 'Unfavorite' : 'Favorite'}
            >
              <Star size={16} />
            </button>

            <button
              type="button"
              className="studio-player__btn"
              onClick={() => copyTrackName(currentTrack?.name || '')}
              aria-label="Copy track name"
              title="Copy track name"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="studio-player__status-line" />
    </div>
  );
}
