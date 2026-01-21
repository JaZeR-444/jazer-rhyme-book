import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { 
  Music, 
  Play, 
  Pause, 
  Volume2, 
  Zap
} from 'lucide-react';
import { findRhymes, countSyllables as getSyllableCount } from '../lib/rhymeFinder';
import './GhostModule.css';

export function GhostModule({ currentLine, currentWord, dictionaryIndex, onInsertRhyme }) {
  // --- Beat Player State ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(new Audio('/audio/lofi-loop.mp3')); // Using /audio/ path which seems to exist

  // --- Rhyme Engine State ---
  const [rhymes, setRhymes] = useState({ perfect: [], near: [], assonance: [] });
  const [isSearching, setIsSearching] = useState(false);

  // --- Syllable State ---
  const [syllableCount, setSyllableCount] = useState(0);

  // 1. Syllable Counter Effect
  useEffect(() => {
    if (!currentLine) {
      setSyllableCount(0);
      return;
    }
    const words = currentLine.trim().split(/\s+/);
    let count = 0;
    words.forEach(w => {
      count += getSyllableCount(w);
    });
    setSyllableCount(count);
  }, [currentLine]);

  // 2. Rhyme Lookup Effect (Debounced)
  useEffect(() => {
    if (!currentWord || !dictionaryIndex || !dictionaryIndex.words) {
      setRhymes({ perfect: [], near: [], assonance: [] });
      return;
    }

    if (currentWord.length < 2) return;

    setIsSearching(true);
    const timer = setTimeout(() => {
      const results = findRhymes(currentWord, dictionaryIndex.words.map(w => w.name), {
        maxResults: 30,
        perfectOnly: false
      });
      
      setRhymes(results);
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [currentWord, dictionaryIndex]);

  // 3. Audio Player Controls
  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = volume;
    
    return () => {
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed (maybe no source):", e));
    }
    setIsPlaying(!isPlaying);
  };

  // Deterministic bar height based on index to avoid jitter
  const getBarHeight = (i) => {
    const pattern = [60, 40, 80, 50, 70, 30, 90, 45, 65, 55, 75, 35, 85, 40, 60, 50];
    return pattern[i % pattern.length];
  };

  return (
    <div className="ghost-module glass-panel" role="complementary" aria-label="Ghost Assistant">
      <div className="ghost-module__header">
        <Zap size={16} aria-hidden="true" /> Ghost Assistant
      </div>

      {/* Syllable Counter */}
      <div className="ghost-syllables">
        <div className="syllable-count-display">
          <span className="syllable-number" aria-label={`${syllableCount} syllables in current line`}>
            {syllableCount}
          </span>
          <span className="syllable-label">Syllables</span>
        </div>
        <div className="syllable-history" aria-hidden="true">
          {[...Array(16)].map((_, i) => (
             <div 
               key={i} 
               className={`syllable-bar ${i < syllableCount ? 'active' : ''}`} 
               style={{ height: `${getBarHeight(i)}%` }}
             ></div>
          ))}
        </div>
      </div>

      {/* Rhyme Engine */}
      <div className="ghost-rhymes">
        <div className="rhyme-header">
          <span className="rhyme-label">Rhymes for:</span>
          <span className="current-word">"{currentWord || '...'}"</span>
        </div>
        
        <div className="rhyme-list custom-scrollbar">
          {!currentWord ? (
            <div className="ghost-empty">Type to see rhymes...</div>
          ) : isSearching ? (
             <div className="ghost-empty">Thinking...</div>
          ) : (
            <>
              {rhymes.perfect.length > 0 && (
                <div className="rhyme-category">
                  <h4>Perfect</h4>
                  <div className="rhyme-chips">
                    {rhymes.perfect.map(r => (
                      <button 
                        key={r.word} 
                        className="rhyme-chip" 
                        onClick={() => onInsertRhyme(r.word)}
                        aria-label={`Insert ${r.word}, ${r.syllables} syllables`}
                      >
                        {r.word}
                        <span className="syllable-dot">• {r.syllables}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {rhymes.near.length > 0 && (
                <div className="rhyme-category">
                  <h4>Near</h4>
                  <div className="rhyme-chips">
                    {rhymes.near.map(r => (
                      <button 
                        key={r.word} 
                        className="rhyme-chip" 
                        onClick={() => onInsertRhyme(r.word)}
                        aria-label={`Insert ${r.word}`}
                      >
                        {r.word}
                      </button>
                    ))}
                  </div>
                </div>
              )}

               {rhymes.perfect.length === 0 && rhymes.near.length === 0 && (
                 <div className="ghost-empty">No rhymes found.</div>
               )}
            </>
          )}
        </div>
      </div>

      {/* Beat Player */}
      <div className="ghost-beat-player">
         <div className="beat-controls">
           <button className="beat-btn" aria-label="Beat options" title="Beat options">
             <Music size={16} aria-hidden="true" />
           </button>
           <button 
             className={`beat-btn beat-btn--large ${isPlaying ? 'is-playing' : ''}`}
             onClick={togglePlay}
             aria-label={isPlaying ? "Pause beat" : "Play beat"}
           >
             {isPlaying ? <Pause size={24} aria-hidden="true" /> : <Play size={24} className="ml-1" aria-hidden="true" />}
           </button>
           <div className="beat-volume">
             <button className="beat-btn" aria-label="Volume">
               <Volume2 size={16} aria-hidden="true" />
             </button>
           </div>
         </div>
         <input 
           type="range" 
           min="0" 
           max="1" 
           step="0.01" 
           value={volume}
           onChange={(e) => setVolume(parseFloat(e.target.value))}
           className="volume-slider" 
           aria-label="Volume control"
         />
         <div className="beat-upload-label" aria-hidden="true">
           Default Low-Fi Loop
         </div>
      </div>
    </div>
  );
}

GhostModule.propTypes = {
  currentLine: PropTypes.string,
  currentWord: PropTypes.string,
  dictionaryIndex: PropTypes.shape({
    words: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired
    }))
  }),
  onInsertRhyme: PropTypes.func.isRequired
};