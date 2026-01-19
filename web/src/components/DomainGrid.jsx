import { Link } from 'react-router-dom';
import { Database, Sparkles, Tag } from 'lucide-react';
import './DomainGrid.css';

// Domain metadata with descriptions and categories
const DOMAIN_METADATA = {
  'music': { category: 'Creative Arts', description: 'Music production, theory, and culture' },
  'lingo': { category: 'Culture & Society', description: 'Slang, terminology, and street language' },
  'people': { category: 'Culture & Society', description: 'Notable figures and personas' },
  'places': { category: 'Geography', description: 'Locations and urban spaces' },
  'tech': { category: 'Technology', description: 'Computing, software, and digital tools' },
  'cinema': { category: 'Creative Arts', description: 'Films, directors, and movie culture' },
  'fashion': { category: 'Creative Arts', description: 'Clothing, style, and designers' },
  'brands': { category: 'Business', description: 'Companies and commercial identities' },
  'internet-culture': { category: 'Technology', description: 'Memes, trends, and online phenomena' },
  'writing-tools': { category: 'Creative Arts', description: 'Literary devices and techniques' },
  'history': { category: 'Knowledge', description: 'Historical events and eras' },
  'sports': { category: 'Culture & Society', description: 'Athletics and competitive activities' },
  'vehicles': { category: 'Technology', description: 'Transportation and automobiles' },
  'weapons-objects': { category: 'Culture & Society', description: 'Tools, weapons, and artifacts' },
  'philosophy-ideas': { category: 'Knowledge', description: 'Concepts and ideologies' },
  'emotions-states': { category: 'Knowledge', description: 'Feelings and mental conditions' },
  'aesthetics-visuals': { category: 'Creative Arts', description: 'Visual styles and art movements' },
  'business-economics': { category: 'Business', description: 'Commerce and economic systems' },
  'science-future': { category: 'Technology', description: 'Scientific concepts and innovation' },
  'mythology-legend': { category: 'Knowledge', description: 'Myths, legends, and folklore' },
  'architecture-spaces': { category: 'Creative Arts', description: 'Buildings and spatial design' },
  'rituals-symbols': { category: 'Culture & Society', description: 'Ceremonies and symbolic acts' },
  'time-energy': { category: 'Knowledge', description: 'Temporal and energetic concepts' },
  'media-platforms': { category: 'Technology', description: 'Social networks and content platforms' }
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

export function DomainGrid({ domains, stats = {} }) {
  return (
    <div className="domain-grid">
      {domains.map((domain) => {
        const metadata = DOMAIN_METADATA[domain] || {};
        const displayName = domain.split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');

        return (
          <Link
            key={domain}
            to={`/domains/${domain}`}
            className="domain-card"
          >
            {/* Category Badge */}
            {metadata.category && (
              <div className="domain-card__category">
                <Tag size={12} />
                <span>{metadata.category}</span>
              </div>
            )}

            {/* Icon */}
            <div className="domain-card__icon">
              {DOMAIN_ICONS[domain] || <Database size={32} />}
            </div>

            {/* Name */}
            <h3 className="domain-card__name">{displayName}</h3>

            {/* Description */}
            {metadata.description && (
              <p className="domain-card__description">
                {metadata.description}
              </p>
            )}

            {/* Entity Count */}
            {stats[domain] && (
              <div className="domain-card__stats">
                <span className="domain-card__count">
                  {stats[domain]} {stats[domain] === 1 ? 'entity' : 'entities'}
                </span>
              </div>
            )}

            {/* Footer */}
            <div className="domain-card__footer">
              <span className="domain-card__explore">
                Explore <Sparkles size={14} />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// Export metadata for use in filtering
export { DOMAIN_METADATA };
