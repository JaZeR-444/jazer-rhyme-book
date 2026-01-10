import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Activity } from 'lucide-react';
import './StudioPlayer.css';

export function StudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [visualizerData, setVisualizerData] = useState(new Array(20).fill(10));
  
  // Simulation loop for visualizer
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setVisualizerData(prev => 
          prev.map(() => Math.max(20, Math.random() * 100))
        );
      }, 100);
    } else {
      setVisualizerData(new Array(20).fill(10));
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
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
