import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Activity } from 'lucide-react';
import './StudioPlayer.css';

export function StudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [visualizerData, setVisualizerData] = useState(new Array(20).fill(10));
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  
  // Initialize audio on mount
  useEffect(() => {
    audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    
    // Setup Web Audio API for visualization
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      
      const source = audioContextRef.current.createMediaElementSource(audioRef.current);
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Real visualizer using audio analysis
  useEffect(() => {
    let animationId;
    if (isPlaying && analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      const updateVisualizer = () => {
        analyserRef.current.getByteFrequencyData(dataArray);
        const normalized = Array.from(dataArray.slice(0, 20)).map(val => Math.max(10, (val / 255) * 100));
        setVisualizerData(normalized);
        animationId = requestAnimationFrame(updateVisualizer);
      };
      
      updateVisualizer();
    } else {
      setVisualizerData(new Array(20).fill(10));
    }
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioContextRef.current?.resume();
        audioRef.current.play().catch(err => console.error('Playback failed:', err));
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="studio-player glass-dark">
      <div className="studio-player__controls">
        <button className="studio-player__btn play-btn" onClick={togglePlay}>
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <div className="studio-player__info">
          <span className="studio-player__label">STUDIO MODE</span>
          <span className="studio-player__track">Ambience: Lo-Fi Flow</span>
        </div>

        <div className="studio-player__visualizer">
          {visualizerData.map((height, i) => (
            <div 
              key={i} 
              className="visualizer-bar"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

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
      </div>
      
      <div className="studio-player__status-line"></div>
    </div>
  );
}
