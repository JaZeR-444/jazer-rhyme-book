import { Link } from 'react-router-dom';
import { Database, Sparkles, Tag, Image as ImageIcon } from 'lucide-react';
import { HoverCard, HoverCardOverlay } from './interactions';
import { useState } from 'react';
import './DomainCard2.css';

// Rich media assets for each domain
const DOMAIN_MEDIA = {
  'music': {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    pattern: 'musical-notes',
    color: '#667eea'
  },
  'lingo': {
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    pattern: 'chat-bubbles',
    color: '#f093fb'
  },
  'people': {
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    pattern: 'silhouettes',
    color: '#4facfe'
  },
  'places': {
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    pattern: 'map-pins',
    color: '#43e97b'
  },
  'tech': {
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    pattern: 'circuit-board',
    color: '#fa709a'
  },
  'cinema': {
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    pattern: 'film-reel',
    color: '#30cfd0'
  },
  'fashion': {
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    pattern: 'fashion-grid',
    color: '#a8edea'
  },
  'brands': {
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    pattern: 'logos',
    color: '#ff9a9e'
  },
  'internet-culture': {
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    pattern: 'pixels',
    color: '#ffecd2'
  },
  'writing-tools': {
    gradient: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
    pattern: 'pen-strokes',
    color: '#ff6e7f'
  },
  'history': {
    gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    pattern: 'timeline',
    color: '#e0c3fc'
  },
  'sports': {
    gradient: 'linear-gradient(135deg, #f77062 0%, #fe5196 100%)',
    pattern: 'sports-icons',
    color: '#f77062'
  },
  'vehicles': {
    gradient: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
    pattern: 'tire-tracks',
    color: '#c471f5'
  },
  'weapons-objects': {
    gradient: 'linear-gradient(135deg, #868f96 0%, #596164 100%)',
    pattern: 'crossed-swords',
    color: '#868f96'
  },
  'philosophy-ideas': {
    gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    pattern: 'thought-clouds',
    color: '#fbc2eb'
  },
  'emotions-states': {
    gradient: 'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)',
    pattern: 'mood-faces',
    color: '#fdcbf1'
  },
  'aesthetics-visuals': {
    gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    pattern: 'paint-strokes',
    color: '#a1c4fd'
  },
  'business-economics': {
    gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    pattern: 'graph-lines',
    color: '#d299c2'
  },
  'science-future': {
    gradient: 'linear-gradient(135deg, #13547a 0%, #80d0c7 100%)',
    pattern: 'atom',
    color: '#13547a'
  },
  'mythology-legend': {
    gradient: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    pattern: 'runes',
    color: '#6a11cb'
  },
  'architecture-spaces': {
    gradient: 'linear-gradient(135deg, #37ecba 0%, #72afd3 100%)',
    pattern: 'blueprint',
    color: '#37ecba'
  },
  'rituals-symbols': {
    gradient: 'linear-gradient(135deg, #ebbba7 0%, #cfc7f8 100%)',
    pattern: 'symbols',
    color: '#ebbba7'
  },
  'time-energy': {
    gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    pattern: 'clock-spiral',
    color: '#f6d365'
  },
  'media-platforms': {
    gradient: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
    pattern: 'app-grid',
    color: '#ee9ca7'
  }
};

const DOMAIN_ICONS = {
  music: '🎵',
  lingo: '💬',
  people: '👥',
  places: '📍',
  tech: '💻',
  cinema: '🎬',
  fashion: '👕',
  brands: '🏢',
  'internet-culture': '🌐',
  'writing-tools': '✍️',
  history: '📜',
  sports: '⚽',
  vehicles: '🚗',
  'weapons-objects': '⚔️',
  'philosophy-ideas': '💭',
  'emotions-states': '😤',
  'aesthetics-visuals': '🎨',
  'business-economics': '💼',
  'science-future': '🚀',
  'mythology-legend': '🔮',
  'architecture-spaces': '🏛️',
  'rituals-symbols': '🎭',
  'time-energy': '⏰',
  'media-platforms': '📱'
};

export function DomainCard2({ 
  domain, 
  metadata = {}, 
  stats = {},
  showPreview = true 
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const media = DOMAIN_MEDIA[domain] || {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    pattern: 'default',
    color: '#667eea'
  };

  const displayName = domain.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const entityCount = stats[domain] || 0;

  return (
    <HoverCard
      variant="default"
      position="bottom"
      overlay={
        <HoverCardOverlay
          title={displayName}
          items={[
            { label: 'Category', value: metadata.category || 'Uncategorized' },
            { label: 'Entities', value: entityCount },
            { label: 'Type', value: 'Knowledge Domain' }
          ]}
          footer="Click to explore domain entities"
        />
      }
    >
      <Link
        to={`/domains/${domain}`}
        className="domain-card-2"
        style={{ '--domain-color': media.color }}
      >
        {/* Rich Media Preview Header */}
        {showPreview && (
          <div 
            className="domain-card-2__media"
            style={{ background: media.gradient }}
          >
            {/* Pattern Overlay */}
            <div 
              className="domain-card-2__pattern"
              data-pattern={media.pattern}
            />
            
            {/* Animated Glow */}
            <div className="domain-card-2__glow" />
            
            {/* Large Icon */}
            <div className="domain-card-2__media-icon">
              {DOMAIN_ICONS[domain] || <Database size={48} />}
            </div>

            {/* Category Badge in Media */}
            {metadata.category && (
              <div className="domain-card-2__media-badge">
                <Tag size={10} />
                <span>{metadata.category}</span>
              </div>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="domain-card-2__content">
          {/* Name */}
          <h3 className="domain-card-2__name">{displayName}</h3>

          {/* Description */}
          {metadata.description && (
            <p className="domain-card-2__description">
              {metadata.description}
            </p>
          )}

          {/* Stats Bar */}
          <div className="domain-card-2__stats-bar">
            <div className="domain-card-2__stat">
              <Database size={14} />
              <span>{entityCount}</span>
            </div>
            <div className="domain-card-2__explore">
              <span>Explore</span>
              <Sparkles size={14} />
            </div>
          </div>
        </div>

        {/* Hover Shine Effect */}
        <div className="domain-card-2__shine" />
      </Link>
    </HoverCard>
  );
}

export { DOMAIN_MEDIA, DOMAIN_ICONS };
