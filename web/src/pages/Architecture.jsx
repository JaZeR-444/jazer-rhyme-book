import { useState } from 'react';
import { usePageTitle } from '../lib/usePageTitle';
import { Card } from '../components/ui';
import { Database, FileText, Search, Share2, Layers, Cpu, ArrowDown } from 'lucide-react';
import './Architecture.css';

export function Architecture() {
  usePageTitle('Architecture');
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
    <div className="architecture-page" role="main" aria-label="Architecture - System schematic and technical overview">
      <div className="architecture-page__header">
        <h1 className="architecture-page__title">System Architecture</h1>
        <p className="architecture-page__subtitle">
          MAIN FRAME // SCHEMATIC VIEW v2.0
        </p>
      </div>

      <div className="blueprint-grid">
        <Card className="blueprint-diagram">
          <div className="blueprint-svg-container">
            <svg viewBox="0 0 600 800" className="blueprint-svg">
              {/* Grid Background */}
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

              {/* Connecting Lines */}
              <path 
                d="M 300 180 L 300 230" 
                stroke="var(--accent-primary-dim)" 
                strokeWidth="2" 
                strokeDasharray="5,5"
                className="connector-line"
              />
               <path 
                d="M 300 350 L 300 400" 
                stroke="var(--accent-primary-dim)" 
                strokeWidth="2" 
                strokeDasharray="5,5" 
                className="connector-line"
              />
               <path 
                d="M 300 520 L 300 570" 
                stroke="var(--accent-primary-dim)" 
                strokeWidth="2" 
                strokeDasharray="5,5" 
                className="connector-line"
              />

              {/* Layers */}
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
                    {/* Layer Box */}
                    <rect 
                      x="0" 
                      y="0" 
                      width="400" 
                      height="100" 
                      rx="8" 
                      fill="rgba(10, 20, 30, 0.9)" 
                      stroke={isActive ? layer.color : 'var(--border-visible)'}
                      strokeWidth={isActive ? 2 : 1}
                      filter={isActive ? 'url(#glow)' : ''}
                      className="blueprint-rect"
                    />
                    
                    {/* Icon Circle */}
                    <circle cx="50" cy="50" r="25" fill={isActive ? 'rgba(255,255,255,0.1)' : 'transparent'} stroke={layer.color} />
                    
                    {/* Text */}
                    <text x="90" y="45" fill={layer.color} fontSize="14" fontWeight="bold" fontFamily="monospace">
                      {layer.title}
                    </text>
                    <text x="90" y="70" fill="var(--text-secondary)" fontSize="12" fontFamily="monospace">
                      {layer.path}
                    </text>

                    {/* Status Indicator */}
                    <circle cx="380" cy="20" r="4" fill={isActive ? '#00ff00' : '#333'} />
                  </g>
                );
              })}
            </svg>
          </div>
        </Card>

        {/* Info Panel */}
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
           {/* Decorative scanning line */}
           {activeLayer && <div className="blueprint-scanline" style={{ background: activeInfo.color }}></div>}
        </Card>
      </div>
    </div>
  );
}

export default Architecture;
