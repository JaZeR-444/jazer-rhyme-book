import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3-force';
import { X, Maximize2, ZoomIn, ZoomOut, Locate } from 'lucide-react';
import './WorkspaceGraphD3.css';

/**
 * WorkspaceGraphD3 - Force-directed graph using D3
 */
export function WorkspaceGraphD3({ items = [], onNodeClick, onClose, isOpen }) {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const simulationRef = useRef(null);

  const TYPE_COLORS = {
    word: '#00CED1',
    entity: '#5D3FD3',
    domain: '#FF00FF'
  };

  useEffect(() => {
    if (!isOpen || items.length === 0) return;

    // Create nodes from items
    const nodeData = items.map(item => ({
      id: `${item.type}-${item.id}`,
      type: item.type,
      label: item.title,
      x: Math.random() * 600,
      y: Math.random() * 400,
      connections: 0
    }));

    // Create links based on relationships
    const linkData = [];
    items.forEach((item, i) => {
      // Connect words to entities/domains, entities to domains, etc.
      items.forEach((otherItem, j) => {
        if (i < j && shouldConnect(item, otherItem)) {
          linkData.push({
            source: `${item.type}-${item.id}`,
            target: `${otherItem.type}-${otherItem.id}`,
            strength: 1
          });
          nodeData[i].connections++;
          nodeData[j].connections++;
        }
      });
    });

    setNodes(nodeData);
    setLinks(linkData);

    // Setup D3 force simulation
    const simulation = d3.forceSimulation(nodeData)
      .force('link', d3.forceLink(linkData).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(400, 250))
      .force('collision', d3.forceCollide().radius(30));

    simulation.on('tick', () => {
      setNodes([...nodeData]);
    });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [items, isOpen]);

  // Helper: Determine if two items should be connected
  const shouldConnect = (item1, item2) => {
    // Connect if they share section
    if (item1.sectionId && item1.sectionId === item2.sectionId) return true;
    
    // Connect if types are compatible
    if (item1.type === 'word' && item2.type === 'entity') return Math.random() > 0.7;
    if (item1.type === 'entity' && item2.type === 'domain') return Math.random() > 0.7;
    
    return false;
  };

  // Draw on canvas
  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 500;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);

    // Draw links
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    links.forEach(link => {
      const source = nodes.find(n => n.id === link.source.id || n.id === link.source);
      const target = nodes.find(n => n.id === link.target.id || n.id === link.target);
      if (!source || !target) return;

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(node => {
      const radius = 8 + (node.connections * 2);
      
      // Glow
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius + 10);
      gradient.addColorStop(0, `${TYPE_COLORS[node.type]}80`);
      gradient.addColorStop(1, `${TYPE_COLORS[node.type]}00`);
      ctx.fillStyle = gradient;
      ctx.fillRect(node.x - radius - 10, node.y - radius - 10, (radius + 10) * 2, (radius + 10) * 2);

      // Node circle
      ctx.fillStyle = TYPE_COLORS[node.type];
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Label
      ctx.fillStyle = '#fff';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + radius + 15);
    });

    ctx.restore();
  }, [nodes, links, transform]);

  const handleZoomIn = () => {
    setTransform(t => ({ ...t, k: Math.min(t.k * 1.2, 3) }));
  };

  const handleZoomOut = () => {
    setTransform(t => ({ ...t, k: Math.max(t.k / 1.2, 0.5) }));
  };

  const handleReset = () => {
    setTransform({ x: 0, y: 0, k: 1 });
    simulationRef.current?.alpha(1).restart();
  };

  if (!isOpen) return null;

  return (
    <div className="workspace-graph-d3-modal">
      <div className="workspace-graph-d3-overlay" onClick={onClose} />
      <div className="workspace-graph-d3-content">
        <div className="workspace-graph-d3-header">
          <div className="workspace-graph-d3-title">
            <Maximize2 size={20} />
            <h3>Relationship Map</h3>
            <span className="workspace-graph-d3-count">
              {nodes.length} items • {links.length} connections
            </span>
          </div>
          <div className="workspace-graph-d3-controls">
            <button onClick={handleZoomIn} title="Zoom In">
              <ZoomIn size={16} />
            </button>
            <button onClick={handleZoomOut} title="Zoom Out">
              <ZoomOut size={16} />
            </button>
            <button onClick={handleReset} title="Reset View">
              <Locate size={16} />
            </button>
          </div>
          <button className="workspace-graph-d3-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="workspace-graph-d3-canvas-wrapper">
          {nodes.length > 0 ? (
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="workspace-graph-d3-canvas"
            />
          ) : (
            <div className="workspace-graph-d3-empty">
              <p>No items in workspace.</p>
              <p className="workspace-graph-d3-hint">
                Add items to see their relationships visualized.
              </p>
            </div>
          )}
        </div>

        <div className="workspace-graph-d3-legend">
          <div className="workspace-graph-d3-legend-title">Types:</div>
          <div className="workspace-graph-d3-legend-items">
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <div key={type} className="workspace-graph-d3-legend-item">
                <div
                  className="workspace-graph-d3-legend-color"
                  style={{ backgroundColor: color }}
                />
                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
