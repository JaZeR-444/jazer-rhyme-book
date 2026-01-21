import { DomainCard2 } from './DomainCard2';
import PropTypes from 'prop-types';
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

export function DomainGrid({ domains, stats = {} }) {
  return (
    <div className="domain-grid">
      {domains.map((domain) => {
        const metadata = DOMAIN_METADATA[domain] || {};
        
        return (
          <DomainCard2
            key={domain}
            domain={domain}
            metadata={metadata}
            stats={stats}
            showPreview={true}
          />
        );
      })}
    </div>
  );
}

DomainGrid.propTypes = {
  domains: PropTypes.arrayOf(PropTypes.string).isRequired,
  stats: PropTypes.object
};

DomainGrid.defaultProps = {
  stats: {}
};

// Export metadata for use in filtering
export { DOMAIN_METADATA };
