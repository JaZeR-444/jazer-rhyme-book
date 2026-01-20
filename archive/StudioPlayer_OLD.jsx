import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Activity, Music, SkipForward, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';
import './StudioPlayer.css';

// Beat Library
const BEAT_LIBRARY = [
  {
    id: 'beat-1',
    name: 'Lo-Fi Flow',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    bpm: 90,
    genre: 'Lo-Fi'
  },
  {
    id: 'beat-2',
    name: 'Boom Bap Classic',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    bpm: 95,
    genre: 'Boom Bap'
  },
  {
    id: 'beat-3',
    name: 'Trap Energy',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    bpm: 140,
    genre: 'Trap'
  },
  {
    id: 'beat-4',
    name: 'Chill Vibes',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    bpm: 85,
    genre: 'Chill'
  }
];

export function StudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showTrackMenu, setShowTrackMenu] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const playerRef = useRef(null);

  const currentTrack = BEAT_LIBRARY[currentTrackIndex];
  
  // Initialize WaveSurfer on mount
  useEffect(() => {
    if (!waveformRef.current) return;

    const wavesurfer = WaveSurfer.create({
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
    });

    wavesurfer.load(currentTrack.url);

    wavesurfer.on('ready', () => {
      setDuration(wavesurfer.getDuration());
      wavesurfer.setVolume(volume);
    });

    wavesurfer.on('audioprocess', () => {
      setCurrentTime(wavesurfer.getCurrentTime());
    });

    wavesurfer.on('finish', () => {
      setIsPlaying(false);
      // Auto-advance to next track
      handleNextTrack();
    });

    wavesurferRef.current = wavesurfer;

    return () => {
      wavesurfer.destroy();
    };
  }, [currentTrackIndex]);
  
  // Handle volume changes
  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const handleTrackSelect = (index) => {
    setCurrentTrackIndex(index);
    setShowTrackMenu(false);
    setIsPlaying(false);
  };

  const handleNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % BEAT_LIBRARY.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(false);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.studio-player__controls')) return;
    setIsDragging(true);
    const rect = playerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      ref={playerRef}
      className={`studio-player glass-dark ${isCollapsed ? 'collapsed' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: 'none'
      }}
    >
      <div className="studio-player__header" onMouseDown={handleMouseDown}>
        <GripVertical size={16} className="studio-player__drag-handle" />
        <span className="studio-player__title">Studio Player</span>
        <button 
          className="studio-player__collapse-btn" 
          onClick={toggleCollapse}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="studio-player__controls">
        <button className="studio-player__btn play-btn" onClick={togglePlay}>
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <div className="studio-player__info">
          <div className="studio-player__meta">
            <button
              className="studio-player__track-selector"
              onClick={() => setShowTrackMenu(!showTrackMenu)}
              title="Select Track"
            >
              <Music size={12} />
              <span>{currentTrack.name}</span>
            </button>

            {showTrackMenu && (
              <div className="track-menu">
                {BEAT_LIBRARY.map((track, index) => (
                  <button
                    key={track.id}
                    className={`track-menu__item ${index === currentTrackIndex ? 'active' : ''}`}
                    onClick={() => handleTrackSelect(index)}
                  >
                    <span className="track-name">{track.name}</span>
                    <span className="track-info">{track.bpm} BPM • {track.genre}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="studio-player__stats">
            <span className="studio-player__bpm">{currentTrack.bpm} BPM</span>
            <span className="studio-player__time">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="studio-player__waveform" ref={waveformRef}></div>

        <div className="studio-player__volume">
          <button className="studio-player__btn" onClick={toggleMute}>
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
          />
        </div>

        <button
          className="studio-player__btn"
          onClick={handleNextTrack}
          title="Next Track"
        >
          <SkipForward size={16} />
        </button>
        </div>
      )}
      
      <div className="studio-player__status-line"></div>
    </div>
  );
}
