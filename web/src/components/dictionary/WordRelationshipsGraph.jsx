/**
 * WordRelationshipsGraph.jsx
 * 
 * Interactive word relationships visualization using react-force-graph-2d
 * Shows connections between words, rhymes, synonyms, and semantic relationships
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Search, ZoomIn, ZoomOut, RotateCcw, Settings } from 'lucide-react';
import './WordRelationshipsGraph.css';

const RELATIONSHIP_TYPES = {
  rhyme: {
    color: '#FF6B6B',
    label: 'Rhymes',
    strength: 0.8
  },
  synonym: {
    color: '#4ECDC4', 
    label: 'Synonyms',
    strength: 0.6
  },
  similar: {
    color: '#45B7D1',
    label: 'Similar',
    strength: 0.4
  },
  domain: {
    color: '#96CEB4',
    label: 'Same Domain',
    strength: 0.3
  },
  semantic: {
    color: '#FFEAA7',
    label: 'Semantic',
    strength: 0.5
  }
};

const NODE_TYPES = {
  primary: {
    size: 12,
    color: '#FF6B6B',
    strokeColor: '#FF5252'
  },
  secondary: {
    size: 8,
    color: '#4ECDC4',
    strokeColor: '#26A69A'
  },
  tertiary: {
    size: 6,
    color: '#96CEB4',
    strokeColor: '#66BB6A'
  }
};

export default function WordRelationshipsGraph({ 
  centerWord, 
  words = [], 
  getRhymes,
  getSimilar,
  maxDepth = 2,
  maxNodes = 50,
  width = 600,
  height = 400
}) {
  const graphRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    showRhymes: true,
    showSynonyms: true,
    showSimilar: true,
    showDomain: false,
    linkDistance: 50,
    nodeStrength: -100,
    velocityDecay: 0.4
  });

  // Build graph data from center word
  useEffect(() => {
    if (!centerWord) return;

    buildGraphData(centerWord);
  }, [centerWord, words, settings, maxDepth, maxNodes]);

  const buildGraphData = useCallback((rootWord) => {
    const nodes = new Map();
    const links = [];
    const processed = new Set();

    // Add root node
    const rootNode = {
      id: rootWord.name,
      word: rootWord,
      type: 'primary',
      level: 0,
      x: 0,
      y: 0
    };
    nodes.set(rootWord.name, rootNode);

    function addConnectedNodes(currentWord, currentLevel) {
      if (currentLevel >= maxDepth || nodes.size >= maxNodes) return;
      
      const currentNodeId = currentWord.name;
      if (processed.has(currentNodeId)) return;
      processed.add(currentNodeId);

      // Get rhymes
      if (settings.showRhymes && getRhymes) {
        const rhymes = getRhymes(currentWord.name);
        if (rhymes?.perfect) {
          rhymes.perfect.slice(0, 5).forEach(rhyme => {
            if (rhyme.word !== currentWord.name && !nodes.has(rhyme.word)) {
              const rhymeWordData = words.find(w => w.name === rhyme.word);
              if (rhymeWordData) {
                const nodeType = currentLevel === 0 ? 'secondary' : 'tertiary';
                nodes.set(rhyme.word, {
                  id: rhyme.word,
                  word: rhymeWordData,
                  type: nodeType,
                  level: currentLevel + 1
                });

                links.push({
                  source: currentNodeId,
                  target: rhyme.word,
                  type: 'rhyme',
                  strength: RELATIONSHIP_TYPES.rhyme.strength
                });

                if (currentLevel < maxDepth - 1) {
                  addConnectedNodes(rhymeWordData, currentLevel + 1);
                }
              }
            }
          });
        }
      }

      // Get synonyms
      if (settings.showSynonyms && currentWord.syn) {
        currentWord.syn.slice(0, 3).forEach(synonym => {
          if (!nodes.has(synonym)) {
            const synWordData = words.find(w => w.name === synonym);
            if (synWordData) {
              const nodeType = currentLevel === 0 ? 'secondary' : 'tertiary';
              nodes.set(synonym, {
                id: synonym,
                word: synWordData,
                type: nodeType,
                level: currentLevel + 1
              });

              links.push({
                source: currentNodeId,
                target: synonym,
                type: 'synonym',
                strength: RELATIONSHIP_TYPES.synonym.strength
              });

              if (currentLevel < maxDepth - 1) {
                addConnectedNodes(synWordData, currentLevel + 1);
              }
            }
          }
        });
      }

      // Get similar words
      if (settings.showSimilar && getSimilar) {
        const similarWords = getSimilar(currentWord, words, null, 3);
        similarWords.forEach(similarWord => {
          if (!nodes.has(similarWord.name)) {
            const nodeType = currentLevel === 0 ? 'secondary' : 'tertiary';
            nodes.set(similarWord.name, {
              id: similarWord.name,
              word: similarWord,
              type: nodeType,
              level: currentLevel + 1
            });

            links.push({
              source: currentNodeId,
              target: similarWord.name,
              type: 'similar',
              strength: RELATIONSHIP_TYPES.similar.strength
            });

            if (currentLevel < maxDepth - 1) {
              addConnectedNodes(similarWord, currentLevel + 1);
            }
          }
        });
      }

      // Add domain connections
      if (settings.showDomain && currentWord.domain) {
        const domainWords = words.filter(w => 
          w.domain === currentWord.domain && 
          w.name !== currentWord.name &&
          !nodes.has(w.name)
        ).slice(0, 2);

        domainWords.forEach(domainWord => {
          const nodeType = currentLevel === 0 ? 'secondary' : 'tertiary';
          nodes.set(domainWord.name, {
            id: domainWord.name,
            word: domainWord,
            type: nodeType,
            level: currentLevel + 1
          });

          links.push({
            source: currentNodeId,
            target: domainWord.name,
            type: 'domain',
            strength: RELATIONSHIP_TYPES.domain.strength
          });
        });
      }
    }

    addConnectedNodes(rootWord, 0);

    setGraphData({
      nodes: Array.from(nodes.values()),
      links: links
    });
  }, [words, getRhymes, getSimilar, settings, maxDepth, maxNodes]);

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node);
    // Center the graph on the clicked node
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 1000);
    }
  }, []);

  const handleNodeHover = useCallback((node) => {
    // Highlight connected nodes and links
    if (!node) return;

    const connectedNodeIds = new Set();
    graphData.links.forEach(link => {
      if (link.source === node.id || link.target === node.id) {
        connectedNodeIds.add(link.source.id || link.source);
        connectedNodeIds.add(link.target.id || link.target);
      }
    });

    // Update node styles based on connection
    graphData.nodes.forEach(n => {
      n.highlighted = connectedNodeIds.has(n.id) || n.id === node.id;
    });
  }, [graphData]);

  const resetGraph = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400);
    }
  };

  const zoomIn = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom * 1.5, 400);
    }
  };

  const zoomOut = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom * 0.67, 400);
    }
  };

  const filteredNodes = graphData.nodes.filter(node =>
    !searchQuery || node.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLinks = graphData.links.filter(link => {
    const sourceMatch = !searchQuery || (typeof link.source === 'string' ? 
      link.source.toLowerCase().includes(searchQuery.toLowerCase()) :
      link.source.id.toLowerCase().includes(searchQuery.toLowerCase()));
    const targetMatch = !searchQuery || (typeof link.target === 'string' ?
      link.target.toLowerCase().includes(searchQuery.toLowerCase()) :
      link.target.id.toLowerCase().includes(searchQuery.toLowerCase()));
    return sourceMatch || targetMatch;
  });

  if (!centerWord) {
    return (
      <div className="word-graph-placeholder">
        <p>Select a word to see its relationships</p>
      </div>
    );
  }

  return (
    <div className="word-relationships-graph">
      <div className="graph-header">
        <div className="graph-title">
          <h3>Word Relationships: <span className="primary-word">{centerWord.name}</span></h3>
        </div>
        
        <div className="graph-controls">
          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Filter nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="control-buttons">
            <button onClick={zoomIn} title="Zoom In" className="control-btn">
              <ZoomIn size={16} />
            </button>
            <button onClick={zoomOut} title="Zoom Out" className="control-btn">
              <ZoomOut size={16} />
            </button>
            <button onClick={resetGraph} title="Reset View" className="control-btn">
              <RotateCcw size={16} />
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)} 
              title="Settings"
              className={`control-btn ${showSettings ? 'active' : ''}`}
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="graph-settings">
          <div className="setting-group">
            <label>Relationships:</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.showRhymes}
                  onChange={(e) => setSettings(prev => ({ ...prev, showRhymes: e.target.checked }))}
                />
                <span style={{ color: RELATIONSHIP_TYPES.rhyme.color }}>Rhymes</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={settings.showSynonyms}
                  onChange={(e) => setSettings(prev => ({ ...prev, showSynonyms: e.target.checked }))}
                />
                <span style={{ color: RELATIONSHIP_TYPES.synonym.color }}>Synonyms</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={settings.showSimilar}
                  onChange={(e) => setSettings(prev => ({ ...prev, showSimilar: e.target.checked }))}
                />
                <span style={{ color: RELATIONSHIP_TYPES.similar.color }}>Similar</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={settings.showDomain}
                  onChange={(e) => setSettings(prev => ({ ...prev, showDomain: e.target.checked }))}
                />
                <span style={{ color: RELATIONSHIP_TYPES.domain.color }}>Domain</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="graph-container" style={{ width, height }}>
        <ForceGraph2D
          ref={graphRef}
          graphData={{ nodes: filteredNodes, links: filteredLinks }}
          width={width}
          height={height}
          nodeId="id"
          nodeLabel="id"
          nodeColor={node => {
            const config = NODE_TYPES[node.type];
            return node.highlighted ? config.strokeColor : config.color;
          }}
          nodeVal={node => NODE_TYPES[node.type].size}
          linkColor={link => RELATIONSHIP_TYPES[link.type].color}
          linkWidth={link => link.strength * 3}
          linkDirectionalParticles={link => link.type === 'rhyme' ? 2 : 0}
          linkDirectionalParticleSpeed={0.01}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          cooldownTicks={100}
          d3AlphaDecay={0.02}
          d3VelocityDecay={settings.velocityDecay}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.id;
            const fontSize = 12/globalScale;
            ctx.font = `${fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = node.highlighted ? '#ffffff' : '#333333';
            ctx.fillText(label, node.x, node.y + NODE_TYPES[node.type].size + 5);
          }}
        />
      </div>

      {selectedNode && (
        <div className="node-info-panel">
          <h4>{selectedNode.word.name}</h4>
          {selectedNode.word.one_liner && (
            <p className="node-description">{selectedNode.word.one_liner}</p>
          )}
          <div className="node-meta">
            <span>Type: {selectedNode.type}</span>
            <span>Level: {selectedNode.level}</span>
            {selectedNode.word.syllables && (
              <span>Syllables: {selectedNode.word.syllables}</span>
            )}
          </div>
        </div>
      )}

      <div className="graph-legend">
        <h5>Relationship Types:</h5>
        <div className="legend-items">
          {Object.entries(RELATIONSHIP_TYPES).map(([type, config]) => (
            <div key={type} className="legend-item">
              <div 
                className="legend-color"
                style={{ backgroundColor: config.color }}
              ></div>
              <span>{config.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}