/**
 * UsageGallery.jsx
 * 
 * Displays real-world usage examples from lyrics, famous bars, and literature
 */

import React, { useState, useMemo } from 'react';
import { Quote, ExternalLink, Filter, Search, Star, Copy, Check } from 'lucide-react';
import './UsageGallery.css';

const EXAMPLE_TYPES = {
  lyric: {
    label: 'Song Lyrics',
    icon: '🎵',
    color: '#FF6B6B'
  },
  verse: {
    label: 'Rap Verse',
    icon: '🎤',
    color: '#4ECDC4'
  },
  hook: {
    label: 'Hook/Chorus',
    icon: '🔄',
    color: '#45B7D1'
  },
  freestyle: {
    label: 'Freestyle',
    icon: '🎯',
    color: '#96CEB4'
  },
  literature: {
    label: 'Literature',
    icon: '📚',
    color: '#FFEAA7'
  },
  poetry: {
    label: 'Poetry',
    icon: '✍️',
    color: '#DDA0DD'
  }
};

const SAMPLE_EXAMPLES = [
  {
    id: 1,
    word: 'flow',
    text: "My flow's so cold, it could freeze a fire",
    artist: 'Sample Artist',
    source: 'Cold Flow',
    type: 'verse',
    year: 2023,
    rating: 5,
    context: 'Describing rap delivery style'
  },
  {
    id: 2,
    word: 'rhyme',
    text: "Every rhyme I write is a work of art",
    artist: 'Wordsmith MC',
    source: 'Artistic Expression',
    type: 'lyric',
    year: 2022,
    rating: 4,
    context: 'Creative metaphor for lyricism'
  },
  {
    id: 3,
    word: 'beat',
    text: "When the beat drops, the crowd goes wild",
    artist: 'DJ Rhythm',
    source: 'Club Anthem',
    type: 'hook',
    year: 2023,
    rating: 5,
    context: 'Describing musical impact'
  }
];

export default function UsageGallery({ 
  word, 
  examples = SAMPLE_EXAMPLES,
  showSearch = true,
  showFilters = true,
  maxExamples = 20
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [copiedId, setCopiedId] = useState(null);

  // Filter and sort examples
  const filteredExamples = useMemo(() => {
    let filtered = examples.filter(example => {
      if (word && !example.word.toLowerCase().includes(word.toLowerCase())) {
        return false;
      }
      
      if (searchQuery && !example.text.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !example.artist.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !example.source.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      if (selectedType !== 'all' && example.type !== selectedType) {
        return false;
      }
      
      return true;
    });

    // Sort examples
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'year':
          return b.year - a.year;
        case 'artist':
          return a.artist.localeCompare(b.artist);
        default:
          return 0;
      }
    });

    return filtered.slice(0, maxExamples);
  }, [examples, word, searchQuery, selectedType, sortBy, maxExamples]);

  const handleCopyExample = async (example) => {
    try {
      const copyText = `"${example.text}" - ${example.artist}`;
      await navigator.clipboard.writeText(copyText);
      setCopiedId(example.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getTypeConfig = (type) => EXAMPLE_TYPES[type] || EXAMPLE_TYPES.lyric;

  if (examples.length === 0) {
    return (
      <div className="usage-gallery usage-gallery--empty">
        <div className="empty-state">
          <Quote size={32} className="empty-icon" />
          <h4>No Usage Examples Found</h4>
          <p>Examples for this word haven't been added yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="usage-gallery">
      <div className="gallery-header">
        <div className="header-title">
          <Quote size={20} className="title-icon" />
          <h3>Usage Examples {word && <span className="word-highlight">"{word}"</span>}</h3>
          <span className="example-count">({filteredExamples.length})</span>
        </div>

        {(showSearch || showFilters) && (
          <div className="gallery-controls">
            {showSearch && (
              <div className="search-container">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search examples..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            )}

            {showFilters && (
              <div className="filter-controls">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="type-filter"
                >
                  <option value="all">All Types</option>
                  {Object.entries(EXAMPLE_TYPES).map(([type, config]) => (
                    <option key={type} value={type}>
                      {config.icon} {config.label}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-filter"
                >
                  <option value="rating">Rating</option>
                  <option value="year">Year</option>
                  <option value="artist">Artist</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="examples-grid">
        {filteredExamples.map(example => {
          const typeConfig = getTypeConfig(example.type);
          
          return (
            <div key={example.id} className="example-card">
              <div className="example-header">
                <div className="example-type">
                  <span 
                    className="type-badge"
                    style={{ backgroundColor: `${typeConfig.color}20`, color: typeConfig.color }}
                  >
                    {typeConfig.icon} {typeConfig.label}
                  </span>
                </div>
                
                <div className="example-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={`rating-star ${i < example.rating ? 'filled' : ''}`}
                    />
                  ))}
                </div>
              </div>

              <blockquote className="example-text">
                "{example.text}"
              </blockquote>

              <div className="example-meta">
                <div className="meta-info">
                  <div className="artist-info">
                    <strong>{example.artist}</strong>
                    <span className="source-name">"{example.source}"</span>
                  </div>
                  {example.year && (
                    <span className="example-year">({example.year})</span>
                  )}
                </div>

                <div className="example-actions">
                  <button
                    onClick={() => handleCopyExample(example)}
                    className={`action-btn copy-btn ${copiedId === example.id ? 'copied' : ''}`}
                    title="Copy example"
                  >
                    {copiedId === example.id ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                  
                  {example.link && (
                    <button
                      onClick={() => window.open(example.link, '_blank')}
                      className="action-btn external-btn"
                      title="View source"
                    >
                      <ExternalLink size={14} />
                    </button>
                  )}
                </div>
              </div>

              {example.context && (
                <div className="example-context">
                  <small>{example.context}</small>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredExamples.length === 0 && searchQuery && (
        <div className="no-results">
          <p>No examples found for "{searchQuery}"</p>
          <button
            onClick={() => setSearchQuery('')}
            className="clear-search-btn"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}

export function FeaturedUsage({ examples, title = "Featured Usage" }) {
  const featuredExamples = examples
    .filter(ex => ex.rating >= 4)
    .slice(0, 3);

  if (featuredExamples.length === 0) {
    return null;
  }

  return (
    <div className="featured-usage">
      <h4 className="featured-title">{title}</h4>
      
      <div className="featured-examples">
        {featuredExamples.map(example => {
          const typeConfig = getTypeConfig(example.type);
          
          return (
            <div key={example.id} className="featured-example">
              <div className="featured-quote">
                <Quote size={16} className="quote-icon" />
                <span className="quote-text">"{example.text}"</span>
              </div>
              
              <div className="featured-attribution">
                <span className="featured-artist">— {example.artist}</span>
                <span 
                  className="featured-type"
                  style={{ color: typeConfig.color }}
                >
                  {typeConfig.icon} {typeConfig.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getTypeConfig(type) {
  return EXAMPLE_TYPES[type] || EXAMPLE_TYPES.lyric;
}