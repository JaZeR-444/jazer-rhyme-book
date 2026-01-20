import { useState, useEffect } from 'react';
import { Music, Play, Pause, Heart, Filter, Search, Tag } from 'lucide-react';
import { getAllBeats, deleteBeat } from '../../lib/audioProcessing';
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

  useEffect(() => {
    loadBeats();
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

  const handlePlayPreview = (beatId) => {
    if (playing === beatId) {
      setPlaying(null);
    } else {
      setPlaying(beatId);
      // TODO: Implement actual audio preview
    }
  };

  const handleToggleFavorite = async (beatId) => {
    setBeats(prev => prev.map(beat => 
      beat.id === beatId ? { ...beat, favorite: !beat.favorite } : beat
    ));
    // TODO: Persist to IndexedDB
  };

  const handleDelete = async (beatId) => {
    if (confirm('Delete this beat? This cannot be undone.')) {
      try {
        await deleteBeat(beatId);
        setBeats(prev => prev.filter(beat => beat.id !== beatId));
      } catch (err) {
        console.error('Failed to delete beat:', err);
      }
    }
  };

  return (
    <div className="beat-library-manager">
      <div className="library-header">
        <div className="header-title">
          <Music size={20} />
          <h2>Beat Library</h2>
          <span className="beat-count">{sortedBeats.length} beats</span>
        </div>

        <div className="library-controls">
          <div className="search-bar">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search beats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="dateAdded">Recently Added</option>
            <option value="name">Name</option>
            <option value="bpm">BPM</option>
          </select>

          <button 
            className={`filter-btn ${filters.favorites ? 'active' : ''}`}
            onClick={() => setFilters(prev => ({ ...prev, favorites: !prev.favorites }))}
          >
            <Heart size={16} fill={filters.favorites ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <div className="mood-filter">
          <Tag size={14} />
          <select 
            value={filters.mood}
            onChange={(e) => setFilters(prev => ({ ...prev, mood: e.target.value }))}
          >
            <option value="all">All Moods</option>
            <option value="energetic">Energetic</option>
            <option value="chill">Chill</option>
            <option value="dark">Dark</option>
            <option value="uplifting">Uplifting</option>
          </select>
        </div>

        <div className="bpm-filter">
          <span>BPM: {filters.bpmRange[0]} - {filters.bpmRange[1]}</span>
          <input
            type="range"
            min="60"
            max="180"
            value={filters.bpmRange[0]}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              bpmRange: [parseInt(e.target.value), prev.bpmRange[1]] 
            }))}
          />
          <input
            type="range"
            min="60"
            max="180"
            value={filters.bpmRange[1]}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              bpmRange: [prev.bpmRange[0], parseInt(e.target.value)] 
            }))}
          />
        </div>
      </div>

      <div className="beats-grid">
        {sortedBeats.length === 0 ? (
          <div className="empty-state">
            <Music size={48} />
            <p>No beats found</p>
            <small>Upload some beats to get started</small>
          </div>
        ) : (
          sortedBeats.map((beat) => (
            <div 
              key={beat.id} 
              className={`beat-card ${selectedBeatId === beat.id ? 'selected' : ''}`}
              onClick={() => onSelectBeat?.(beat)}
            >
              <div className="beat-info">
                <h3>{beat.name}</h3>
                <div className="beat-meta">
                  <span className="bpm-badge">{beat.bpm} BPM</span>
                  {beat.mood && <span className="mood-tag">{beat.mood}</span>}
                </div>
              </div>

              <div className="beat-actions">
                <button
                  className="action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPreview(beat.id);
                  }}
                >
                  {playing === beat.id ? <Pause size={16} /> : <Play size={16} />}
                </button>

                <button
                  className={`action-btn ${beat.favorite ? 'favorite' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(beat.id);
                  }}
                >
                  <Heart size={16} fill={beat.favorite ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
