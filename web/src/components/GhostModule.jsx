import { useState, useEffect, useRef } from 'react';
import { 
  Mic2, 
  Music, 
  Play, 
  Pause, 
  Volume2, 
  Zap, 
  Activity,
  Layers
} from 'lucide-react';
import { getRhymeScheme, findRhymes, countSyllables as getSyllableCount } from '../lib/rhymeFinder';
import './GhostModule.css';

export function GhostModule({ currentLine, currentWord, dictionaryIndex, onInsertRhyme }) {
  // --- Beat Player State ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(new Audio('/beats/lofi-loop.mp3')); // Placeholder path

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
    // Simple word-based syllable counting for now
    // Ideally we sum up syllables of each word
    const words = currentLine.trim().split(/\s+/);
    let count = 0;
    words.forEach(w => {
      count += getSyllableCount(w); // ensure this function is exported from rhymeFinder
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
      // Find rhymes
      // We pass the entire dictionary word list
      // Note: dictionaryIndex.words might be huge, so we should rely on findRhymes optimization
      // Or pass a smaller set if possible. For now we assume typical dictionary size is OK for JS VM
      const results = findRhymes(currentWord, dictionaryIndex.words.map(w => w.name), {
        maxResults: 30,
        perfectOnly: false
      });
      
      setRhymes(results);
      setIsSearching(false);
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [currentWord, dictionaryIndex]);

  // 3. Audio Player Controls
  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = volume;
    
    // Cleanup
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
      // In a real app, we'd handle loading user beats here
      // For now, let's assume a default beat or just fail gracefully without crashing
      audioRef.current.play().catch(e => console.log("Audio play failed (maybe no source):", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="ghost-module glass-panel">
      <div className="ghost-module__header">
        <Zap size={16} /> Ghost Assistant
      </div>

      {/* Syllable Counter */}
      <div className="ghost-syllables">
        <div className="syllable-count-display">
          <span className="syllable-number">{syllableCount}</span>
          <span className="syllable-label">Syllables (Line)</span>
        </div>
        <div className="syllable-history">
          {/* Visual bar visualization could go here */}
          {[...Array(Math.min(syllableCount, 16))].map((_, i) => (
             <div key={i} className="syllable-bar active" style={{ height: `${Math.random() * 60 + 40}%` }}></div>
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
                      <div key={r.word} className="rhyme-chip" onClick={() => onInsertRhyme(r.word)}>
                        {r.word}
                        <span className="syllable-dot">• {r.syllables}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {rhymes.near.length > 0 && (
                <div className="rhyme-category">
                  <h4>Near</h4>
                  <div className="rhyme-chips">
                    {rhymes.near.map(r => (
                      <div key={r.word} className="rhyme-chip" onClick={() => onInsertRhyme(r.word)}>
                        {r.word}
                      </div>
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
           <button className="beat-btn" title="Upload Beat (Simulated)">
             <Music size={16} />
           </button>
           <button 
             className={`beat-btn beat-btn--large ${isPlaying ? 'is-playing' : ''}`}
             onClick={togglePlay}
           >
             {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
           </button>
           <div className="beat-volume relative group">
             <button className="beat-btn">
               <Volume2 size={16} />
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
         />
         <div className="beat-upload-label">
           Default Low-Fi Loop
         </div>
      </div>
    </div>
  );
}
