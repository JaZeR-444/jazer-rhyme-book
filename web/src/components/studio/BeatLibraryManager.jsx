import { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, Heart, Search, Tag, Trash2, X } from 'lucide-react';
import { getAllBeats, deleteBeat, storeBeat } from '../../lib/audioProcessing';
import './BeatLibraryManager.css';

export function BeatLibraryManager({ onSelectBeat, selectedBeatId }) {
  const [beats, setBeats] = useState([]);
  const [playing, setPlaying] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    mood: 'all',
    bpmRange: [60, 180],
    favorites: false
  });
  const [sortBy, setSortBy] = useState('dateAdded');
  const audioRef = useRef(null);

  useEffect(() => {
    loadBeats();
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const loadBeats = async () => {
    try {
      const allBeats = await getAllBeats();
      setBeats(allBeats);
    } catch (err) {
      console.error('Failed to load beats:', err);
    }
  };

  const filteredBeats = beats.filter(beat => {
    if (searchQuery && !beat.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filters.mood !== 'all' && beat.mood !== filters.mood) {
      return false;
    }
    
    if (beat.bpm < filters.bpmRange[0] || beat.bpm > filters.bpmRange[1]) {
      return false;
    }
    
    if (filters.favorites && !beat.favorite) {
      return false;
    }
    
    return true;
  });

  const sortedBeats = [...filteredBeats].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'bpm':
        return a.bpm - b.bpm;
      case 'dateAdded':
      default:
        return new Date(b.dateAdded) - new Date(a.dateAdded);
    }
  });

  const handlePlayPreview = (beatId, e) => {
    if (e) e.stopPropagation();

    // If clicking the same beat, toggle off
    if (playing === beatId) {
      if (audioRef.current) audioRef.current.pause();
      setPlaying(null);
      return;
    }

    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Find the beat and play it
    const beat = beats.find(b => b.id === beatId);
    if (!beat || !beat.url) {
      console.error('Beat not found or missing audio URL');
      return;
    }

    setPlaying(beatId);

    try {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      audioRef.current.src = beat.url;
      audioRef.current.play().catch(error => {
        console.error('Failed to play audio:', error);
        setPlaying(null);
      });

      // Clear playing state when audio ends
      audioRef.current.onended = () => {
        setPlaying(null);
      };
    } catch (error) {
      console.error('Failed to initialize audio playback:', error);
      setPlaying(null);
    }
  };

  const handleToggleFavorite = async (beatId, e) => {
    if (e) e.stopPropagation();

    // Find the beat
    const beatIndex = beats.findIndex(b => b.id === beatId);
    if (beatIndex === -1) return;

    const originalBeat = beats[beatIndex];
    const updatedBeat = { ...originalBeat, favorite: !originalBeat.favorite };

    // Optimistic update
    const updatedBeats = [...beats];
    updatedBeats[beatIndex] = updatedBeat;
    setBeats(updatedBeats);

    // Persist to IndexedDB
    try {
      await storeBeat(updatedBeat);
    } catch (error) {
      console.error('Failed to save favorite to IndexedDB:', error);
      // Revert on error
      setBeats(beats);
    }
  };

  const handleDelete = async (beatId, e) => {
    if (e) e.stopPropagation();

    if (window.confirm('Delete this beat? This cannot be undone.')) {
      try {
        await deleteBeat(beatId);
        setBeats(prev => prev.filter(beat => beat.id !== beatId));
        if (playing === beatId) {
          if (audioRef.current) audioRef.current.pause();
          setPlaying(null);
        }
      } catch (err) {
        console.error('Failed to delete beat:', err);
      }
    }
  };

  return (
    <div className="beat-library-manager" role="region" aria-label="Beat Library">
      <div className="library-header">
        <div className="header-title">
          <Music size={20} aria-hidden="true" />
          <h2>Beat Library</h2>
          <span className="beat-count">{sortedBeats.length} beats</span>
        </div>

        <div className="library-controls">
          <div className="search-bar">
            <Search size={16} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search beats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search beats"
            />
          </div>

          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort beats by"
          >
            <option value="dateAdded">Recently Added</option>
            <option value="name">Name</option>
            <option value="bpm">BPM</option>
          </select>

          <button 
            className={`filter-btn ${filters.favorites ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, favorites: !prev.favorites }))}
            aria-label={filters.favorites ? "Show all beats" : "Show only favorites"}
            aria-pressed={filters.favorites}
          >
            <Heart size={16} fill={filters.favorites ? 'currentColor' : 'none'} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <div className="mood-filter">
          <Tag size={14} aria-hidden="true" />
          <select 
            value={filters.mood}
            onChange={(e) => setFilters(prev => ({ ...prev, mood: e.target.value }))}
            aria-label="Filter by mood"
          >
            <option value="all">All Moods</option>
            <option value="energetic">Energetic</option>
            <option value="chill">Chill</option>
            <option value="dark">Dark</option>
            <option value="uplifting">Uplifting</option>
          </select>
        </div>

        <div className="bpm-filter">
          <span id="bpm-label">BPM Range: {filters.bpmRange[0]} - {filters.bpmRange[1]}</span>
          <div className="range-inputs">
            <input
              type="range"
              min="60"
              max="180"
              value={filters.bpmRange[0]}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                bpmRange: [Math.min(parseInt(e.target.value), prev.bpmRange[1]), prev.bpmRange[1]] 
              }))}
              aria-labelledby="bpm-label"
              aria-label="Minimum BPM"
            />
            <input
              type="range"
              min="60"
              max="180"
              value={filters.bpmRange[1]}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                bpmRange: [prev.bpmRange[0], Math.max(parseInt(e.target.value), prev.bpmRange[0])] 
              }))}
              aria-labelledby="bpm-label"
              aria-label="Maximum BPM"
            />
          </div>
        </div>
      </div>

      <div className="beats-grid" role="list">
        {sortedBeats.length === 0 ? (
          <div className="empty-state">
            <Music size={48} aria-hidden="true" />
            <p>No beats found</p>
            <small>Upload some beats to get started</small>
          </div>
        ) : (
          sortedBeats.map((beat) => (
            <div 
              key={beat.id} 
              className={`beat-card ${selectedBeatId === beat.id ? 'selected' : ''} ${playing === beat.id ? 'playing' : ''}`}
              onClick={() => onSelectBeat?.(beat)}
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectBeat?.(beat);
                }
              }}
            >
              <div className="beat-info">
                <h3>{beat.name}</h3>
                <div className="beat-meta">
                  <span className="bpm-badge">{beat.bpm} BPM</span>
                  {beat.mood && beat.mood !== 'neutral' && <span className="mood-tag">{beat.mood}</span>}
                </div>
              </div>

              <div className="beat-actions">
                <button
                  className={`action-btn ${playing === beat.id ? 'active' : ''}`}
                  onClick={(e) => handlePlayPreview(beat.id, e)}
                  aria-label={playing === beat.id ? "Stop preview" : "Play preview"}
                >
                  {playing === beat.id ? <X size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
                </button>

                <button
                  className={`action-btn ${beat.favorite ? 'favorite' : ''}`}
                  onClick={(e) => handleToggleFavorite(beat.id, e)}
                  aria-label={beat.favorite ? "Remove from favorites" : "Add to favorites"}
                  aria-pressed={beat.favorite}
                >
                  <Heart size={16} fill={beat.favorite ? 'currentColor' : 'none'} aria-hidden="true" />
                </button>

                <button
                  className="action-btn delete-btn"
                  onClick={(e) => handleDelete(beat.id, e)}
                  aria-label="Delete beat"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}