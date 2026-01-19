import { useState } from 'react';
import { Card, Badge, Button, MarkdownRenderer } from '../components/ui';
import { Database, Code, Cpu, ExternalLink, FileText, Search, Share2, Layers } from 'lucide-react';
import './About.css';
import './Architecture.css';
import './Docs.css';

const docsContent = `
## Essential Commands

Running these commands will help you maintain the knowledge base.

\`\`\`bash
# Validate integrity of all entity files
npm run validate

# Rebuild search indexes and relations
npm run build

# Start local development server
cd web && npm run dev
\`\`\`

## Contributing Knowledge

### 1. Adding an Entity
Navigate to \`data/<domain>/entities/\` and create a JSON file. The filename should match the ID.

**File:** \`drake.json\`
\`\`\`json
{
  "id": "drake",
  "type": "artist",
  "name": "Drake",
  "one_liner": "Dominant force in modern hip-hop blending R&B sensibilities.",
  "tags": ["toronto", "ovo", "melodic-rap"],
  "era": "2010s"
}
\`\`\`

### 2. Validation
Always run the validation script before committing.
> **Note:** The CI/CD pipeline will fail if validation errors are present.

### 3. Tag Management
Tags are centralized in \`_meta/tags.json\`. If you need a new tag, add it there first, then use it in your entity files.

## Schema Reference

| Field | Type | Description |
|-------|------|-------------|
| \`id\` | slug | Unique identifier (kebab-case) |
| \`type\` | string | Must match domain types |
| \`name\` | string | Display name |
| \`tags\` | array | List of valid tags |
| \`related_ids\` | array | Direct connections to other entities |

`;

export function About() {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeLayer, setActiveLayer] = useState(null);

  const layers = [
    {
      id: 'domains',
      title: 'DOMAINS LAYER',
      icon: <Database size={24} />,
      desc: 'High-level categorization buckets (music, tech, lingo). Maps to physical folders.',
      path: 'data/domains/[category]',
      color: 'var(--accent-primary)'
    },
    {
      id: 'entities',
      title: 'ENTITIES LAYER',
      icon: <FileText size={24} />,
      desc: 'Atomic knowledge units. Single source of truth for all concepts.',
      path: 'data/[category]/entities/[id].json',
      color: '#ff0055' // accented magenta
    },
    {
      id: 'indexes',
      title: 'INDEXES LAYER',
      icon: <Search size={24} />,
      desc: 'Generated lookup tables for O(1) access by tag, era, or alias.',
      path: 'data/[category]/indexes/*.json',
      color: '#00ff99' // accented green
    },
    {
      id: 'relations',
      title: 'RELATIONS LAYER',
      icon: <Share2 size={24} />,
      desc: 'Cross-domain semantic graph edges connecting entities.',
      path: '_meta/relations.json',
      color: '#ffcc00' // accented yellow
    }
  ];

  const getActiveInfo = () => {
    return layers.find(l => l.id === activeLayer) || {
      title: 'SYSTEM IDLE',
      desc: 'Hover over a system layer to view diagnostic data.',
      path: 'WAITING FOR INPUT...',
      icon: <Cpu size={24} />,
      color: 'var(--text-muted)'
    };
  };

  const activeInfo = getActiveInfo();

  return (
    <div className="about-page">
      <div className="about-page__header">
        <h1 className="about-page__title">The Mainframe</h1>
        <p className="about-page__tagline">
          A living ecosystem for creative intelligence, master flow, and structured knowledge.
        </p>
      </div>

      <div className="about-tabs">
        <button 
          className={`about-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`about-tab ${activeTab === 'architecture' ? 'active' : ''}`}
          onClick={() => setActiveTab('architecture')}
        >
          Architecture
        </button>
        <button 
          className={`about-tab ${activeTab === 'docs' ? 'active' : ''}`}
          onClick={() => setActiveTab('docs')}
        >
          Documentation
        </button>
      </div>

      <div className="about-content">
        {activeTab === 'overview' && (
          <div className="about-overview fade-in">
            <div className="about-grid">
              <Card className="about-card">
                <div className="about-accent" />
                <Database size={32} className="mb-4 text-accent-primary" />
                <h3>Knowledge Hub</h3>
                <p>
                  Solving the problem of fragmented creative knowledge. 
                  Centralized, validated, and AI-ready data for lyrics, culture, and concepts.
                </p>
              </Card>

              <Card className="about-card">
                <div className="about-accent" style={{ background: 'var(--gradient-secondary)' }} />
                <Code size={32} className="mb-4 text-accent-secondary" />
                <h3>Modern Stack</h3>
                <p>
                  Built with React 19, Vite 7, and GSAP. 
                  Engineered for performance, animations, and seamless user experience.
                </p>
              </Card>

              <Card className="about-card">
                <div className="about-accent" style={{ background: 'linear-gradient(90deg, #FF0080, #7928CA)' }} />
                <Cpu size={32} className="mb-4" style={{ color: '#FF0080' }} />
                <h3>AI Integration</h3>
                <p>
                  Designed as a high-fidelity data source for training personal AI assistants 
                  and enhancing creative workflows.
                </p>
              </Card>
            </div>

            <div className="about-footer">
              <h2>Open Source Intelligence</h2>
              <p className="text-secondary max-w-lg mx-auto mb-8">
                This project represents the convergence of music, technology, and information architecture.
                Created by JaZeR.
              </p>
              
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <Button variant="outline" onClick={() => window.open('https://github.com/StartHereEng/jazer-rhyme-book', '_blank')}>
                  <ExternalLink size={16} className="mr-2" />
                  View on GitHub
                </Button>
              </div>

              <div className="about-badges">
                <Badge variant="outline">v1.0.0</Badge>
                <Badge variant="success">Active</Badge>
                <Badge variant="secondary">2026</Badge>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="about-architecture fade-in">
            <div className="architecture-page">
              <div className="blueprint-grid">
                <Card className="blueprint-diagram">
                  <div className="blueprint-svg-container">
                    <svg viewBox="0 0 600 800" className="blueprint-svg">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 255, 255, 0.1)" strokeWidth="0.5"/>
                        </pattern>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />

                      <path d="M 300 180 L 300 230" stroke="var(--accent-primary-dim)" strokeWidth="2" strokeDasharray="5,5" className="connector-line" />
                      <path d="M 300 350 L 300 400" stroke="var(--accent-primary-dim)" strokeWidth="2" strokeDasharray="5,5" className="connector-line" />
                      <path d="M 300 520 L 300 570" stroke="var(--accent-primary-dim)" strokeWidth="2" strokeDasharray="5,5" className="connector-line" />

                      {layers.map((layer, index) => {
                        const yPos = 80 + (index * 170);
                        const isActive = activeLayer === layer.id;
                        
                        return (
                          <g 
                            key={layer.id} 
                            transform={`translate(100, ${yPos})`}
                            onMouseEnter={() => setActiveLayer(layer.id)}
                            onMouseLeave={() => setActiveLayer(null)}
                            className="blueprint-layer-group"
                            style={{ cursor: 'pointer' }}
                          >
                            <rect x="0" y="0" width="400" height="100" rx="8" fill="rgba(10, 20, 30, 0.9)" 
                              stroke={isActive ? layer.color : 'var(--border-visible)'} strokeWidth={isActive ? 2 : 1}
                              filter={isActive ? 'url(#glow)' : ''} className="blueprint-rect" />
                            <circle cx="50" cy="50" r="25" fill={isActive ? 'rgba(255,255,255,0.1)' : 'transparent'} stroke={layer.color} />
                            <text x="90" y="45" fill={layer.color} fontSize="14" fontWeight="bold" fontFamily="monospace">{layer.title}</text>
                            <text x="90" y="70" fill="var(--text-secondary)" fontSize="12" fontFamily="monospace">{layer.path}</text>
                            <circle cx="380" cy="20" r="4" fill={isActive ? '#00ff00' : '#333'} />
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </Card>

                <Card className={`blueprint-info ${activeLayer ? 'active' : ''}`} style={{ borderColor: activeInfo.color }}>
                  <div className="blueprint-info__header">
                    <div className="blueprint-info__icon" style={{ color: activeInfo.color }}>
                      {activeInfo.icon}
                    </div>
                    <h2 className="blueprint-info__title" style={{ color: activeInfo.color }}>
                      {activeInfo.title}
                    </h2>
                  </div>
                  <div className="blueprint-info__body">
                    <p className="blueprint-info__desc">{activeInfo.desc}</p>
                    <div className="blueprint-info__code">
                      <code>{activeInfo.path}</code>
                    </div>
                  </div>
                  {activeLayer && <div className="blueprint-scanline" style={{ background: activeInfo.color }}></div>}
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="about-docs fade-in">
            <div className="docs-page">
              <Card className="docs-card">
                <div className="docs-content">
                  <MarkdownRenderer content={docsContent} />
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
