import { Link } from 'react-router-dom';
import { Database, Sparkles } from 'lucide-react';
import './DomainGrid.css';

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
      {domains.map((domain) => (
        <Link
          key={domain}
          to={`/domains/${domain}`}
          className="domain-card"
        >
          <div className="domain-card__icon">
            {DOMAIN_ICONS[domain] || <Database size={32} />}
          </div>
          <h3 className="domain-card__name">
            {domain.split('-').map(word =>
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </h3>
          {stats[domain] && (
            <div className="domain-card__stats">
              <span className="domain-card__count">
                {stats[domain]} {stats[domain] === 1 ? 'entity' : 'entities'}
              </span>
            </div>
          )}
          <div className="domain-card__footer">
            <span className="domain-card__explore">
              Explore <Sparkles size={14} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
