import { useState, useEffect } from 'react';
import { Layout, Plus, Sparkles, Search } from 'lucide-react';
import './TemplatesLibrary.css';

const BUILT_IN_TEMPLATES = [
  {
    id: '16-bar-verse',
    name: '16 Bar Verse',
    description: 'Standard hip-hop verse structure',
    structure: '16 lines',
    content: Array(16).fill('').join('\n')
  },
  {
    id: 'chorus-template',
    name: 'Chorus (8 bars)',
    description: 'Catchy hook structure',
    structure: '8 lines, repeated',
    content: Array(8).fill('').join('\n')
  },
  {
    id: 'aabb-rhyme',
    name: 'AABB Rhyme Scheme',
    description: 'Couplet rhyme pattern',
    structure: 'AA BB CC...',
    content: Array(16).fill('').join('\n')
  },
  {
    id: 'abab-rhyme',
    name: 'ABAB Rhyme Scheme',
    description: 'Alternating rhyme pattern',
    structure: 'AB AB AB...',
    content: Array(16).fill('').join('\n')
  },
  {
    id: 'triplet-flow',
    name: 'Triplet Flow',
    description: 'Migos-style triplet pattern',
    structure: '3-syllable groups',
    content: Array(12).fill('').join('\n')
  }
];

export function TemplatesLibrary({ onSelectTemplate, onClose, open = false }) {
  const [templates, setTemplates] = useState(BUILT_IN_TEMPLATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [customTemplates, setCustomTemplates] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('jazer_custom_templates');
    if (saved) {
      try {
        setCustomTemplates(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load custom templates:', e);
      }
    }
  }, []);

  const filteredTemplates = [...BUILT_IN_TEMPLATES, ...customTemplates].filter(
    t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (template) => {
    onSelectTemplate?.(template.content);
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="templates-library-overlay" onClick={onClose}>
      <div className="templates-library" onClick={(e) => e.stopPropagation()}>
        <div className="templates-header">
          <Layout size={20} />
          <h3>Templates Library</h3>
        </div>

        <div className="templates-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="templates-grid">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="template-card"
              onClick={() => handleSelect(template)}
            >
              <div className="template-icon">
                <Sparkles size={20} />
              </div>
              <div className="template-info">
                <h4>{template.name}</h4>
                <p>{template.description}</p>
                <span className="template-structure">{template.structure}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="templates-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
