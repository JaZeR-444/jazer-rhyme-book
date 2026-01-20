/**
 * PronunciationGuide.jsx
 * 
 * Displays pronunciation information with IPA format and Text-to-Speech functionality
 */

import React, { useState, useCallback } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';
import './PronunciationGuide.css';

// Simple IPA phoneme mapping for common English sounds
const IPA_MAPPING = {
  // Vowels
  'a': 'æ',  // cat
  'ah': 'ɑ',  // father
  'ai': 'eɪ', // day
  'au': 'aʊ', // now
  'aw': 'ɔ',  // saw
  'ay': 'eɪ', // say
  'e': 'ɛ',   // bed
  'ee': 'i',  // see
  'eh': 'ɛ',  // set
  'er': 'ər', // her
  'ey': 'eɪ', // hey
  'i': 'ɪ',   // bit
  'ie': 'aɪ', // pie
  'ih': 'ɪ',  // sit
  'iy': 'i',  // see
  'o': 'ɑ',   // hot
  'oh': 'oʊ', // go
  'oo': 'u',  // boot
  'ow': 'aʊ', // how
  'oy': 'ɔɪ', // boy
  'u': 'ʊ',   // put
  'uh': 'ʌ',  // but
  'uw': 'u',  // two
  
  // Consonants
  'b': 'b',   'p': 'p',   'v': 'v',   'f': 'f',
  'd': 'd',   't': 't',   'z': 'z',   's': 's',
  'g': 'g',   'k': 'k',   'zh': 'ʒ',  'sh': 'ʃ',
  'jh': 'dʒ', 'ch': 'tʃ', 'dh': 'ð',  'th': 'θ',
  'm': 'm',   'n': 'n',   'ng': 'ŋ',  'l': 'l',
  'r': 'r',   'w': 'w',   'y': 'j',   'h': 'h'
};

export default function PronunciationGuide({ 
  word, 
  pronunciation, 
  syllables = [],
  showIPA = true,
  showTTS = true,
  autoSpeak = false 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentUtterance, setCurrentUtterance] = useState(null);

  // Convert pronunciation to IPA format
  const convertToIPA = useCallback((phonemes) => {
    if (!phonemes) return '';
    
    return phonemes
      .toLowerCase()
      .split(/[-\s]+/)
      .map(phoneme => IPA_MAPPING[phoneme] || phoneme)
      .join('');
  }, []);

  // Text-to-Speech functionality
  const speak = useCallback((text, options = {}) => {
    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || playbackRate;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = isMuted ? 0 : (options.volume || 1.0);

    utterance.onstart = () => {
      setIsPlaying(true);
      setCurrentUtterance(utterance);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentUtterance(null);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsPlaying(false);
      setCurrentUtterance(null);
    };

    window.speechSynthesis.speak(utterance);
  }, [playbackRate, isMuted]);

  const stopSpeech = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentUtterance(null);
    }
  }, []);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      stopSpeech();
    } else {
      speak(word, { rate: playbackRate });
    }
  }, [isPlaying, word, speak, stopSpeech, playbackRate]);

  const speakSyllable = useCallback((syllable) => {
    speak(syllable, { rate: playbackRate * 0.8 });
  }, [speak, playbackRate]);

  // Auto-speak on mount if enabled
  React.useEffect(() => {
    if (autoSpeak && word) {
      setTimeout(() => speak(word), 500);
    }
  }, [autoSpeak, word, speak]);

  // Format pronunciation display
  const formatPronunciation = (pron) => {
    if (!pron) return '';
    return `/${pron}/`;
  };

  const ipaNotation = showIPA ? convertToIPA(pronunciation) : '';

  return (
    <div className="pronunciation-guide">
      <div className="pronunciation-header">
        <h4 className="pronunciation-title">Pronunciation</h4>
        
        {showTTS && (
          <div className="tts-controls">
            <button 
              onClick={togglePlayback}
              disabled={!window.speechSynthesis}
              className={`tts-btn tts-btn--play ${isPlaying ? 'playing' : ''}`}
              title={isPlaying ? 'Stop' : 'Play pronunciation'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`tts-btn tts-btn--mute ${isMuted ? 'muted' : ''}`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            <button
              onClick={() => speak(word, { rate: 0.6 })}
              className="tts-btn tts-btn--slow"
              title="Speak slowly"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="pronunciation-display">
        {pronunciation && (
          <div className="phonetic-spelling">
            <label>Phonetic:</label>
            <span className="phonetic-text">
              {formatPronunciation(pronunciation)}
            </span>
          </div>
        )}

        {showIPA && ipaNotation && (
          <div className="ipa-notation">
            <label>IPA:</label>
            <span className="ipa-text">
              /{ipaNotation}/
            </span>
          </div>
        )}

        {syllables && syllables.length > 0 && (
          <div className="syllable-breakdown">
            <label>Syllables ({syllables.length}):</label>
            <div className="syllables-container">
              {syllables.map((syllable, index) => (
                <button
                  key={index}
                  onClick={() => speakSyllable(syllable)}
                  className="syllable-button"
                  disabled={!showTTS || !window.speechSynthesis}
                  title={`Pronounce "${syllable}"`}
                >
                  {syllable}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {showTTS && (
        <div className="tts-settings">
          <div className="setting-group">
            <label htmlFor="playback-rate">Speech Rate:</label>
            <input
              id="playback-rate"
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={playbackRate}
              onChange={(e) => setPlaybackRate(Number(e.target.value))}
              className="rate-slider"
            />
            <span className="rate-value">{playbackRate.toFixed(1)}x</span>
          </div>
        </div>
      )}

      {!window.speechSynthesis && (
        <div className="tts-unavailable">
          <p>Text-to-speech is not available in your browser.</p>
        </div>
      )}
    </div>
  );
}

export function PronunciationComparison({ words }) {
  if (!words || words.length < 2) {
    return null;
  }

  return (
    <div className="pronunciation-comparison">
      <h4>Compare Pronunciations</h4>
      
      <div className="comparison-grid">
        {words.map((wordData, index) => (
          <div key={index} className="comparison-item">
            <h5 className="word-name">{wordData.name}</h5>
            <PronunciationGuide
              word={wordData.name}
              pronunciation={wordData.pronunciation}
              syllables={wordData.syllableArray}
              showIPA={true}
              showTTS={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RhymePronunciationGroup({ rhymes, title = "Rhyme Group" }) {
  const [expandedWord, setExpandedWord] = useState(null);

  if (!rhymes || rhymes.length === 0) {
    return null;
  }

  return (
    <div className="rhyme-pronunciation-group">
      <h4>{title}</h4>
      
      <div className="rhyme-list">
        {rhymes.map((rhyme, index) => (
          <div key={index} className="rhyme-item">
            <button
              onClick={() => setExpandedWord(expandedWord === index ? null : index)}
              className={`rhyme-word-btn ${expandedWord === index ? 'expanded' : ''}`}
            >
              <span className="word-text">{rhyme.word}</span>
              <span className="phonetic-preview">
                /{rhyme.pronunciation || 'N/A'}/
              </span>
            </button>
            
            {expandedWord === index && (
              <div className="expanded-pronunciation">
                <PronunciationGuide
                  word={rhyme.word}
                  pronunciation={rhyme.pronunciation}
                  syllables={rhyme.syllables}
                  showIPA={true}
                  showTTS={true}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}