import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3-force';
import { X, Maximize2, ZoomIn, ZoomOut, Locate } from 'lucide-react';
import './WorkspaceGraphD3.css';

/**
 * WorkspaceGraphD3 - Force-directed graph using D3
 * Optimized for deterministic rendering with responsive sizing
 */
export function WorkspaceGraphD3({ items = [], onNodeClick, onClose, isOpen }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const simulationRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  // Memoize color map to prevent recreation
  const TYPE_COLORS = useMemo(
    () => ({
      word: '#00CED1',
      entity: '#5D3FD3',
      domain: '#FF00FF',
    }),
    []
  );

  // Handle resizing
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight || 500
        });
      }
    };

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    updateDimensions();

    return () => resizeObserver.disconnect();
  }, [isOpen]);

  // Memoize deterministic connection logic
  const shouldConnect = useCallback((item1, item2) => {
    // 1. Same section
    if (item1.sectionId && item1.sectionId === item2.sectionId) return true;

    // 2. Cross-references (if they exist in data)
    if (
      item1.related_ids?.includes(item2.id) ||
      item2.related_ids?.includes(item1.id)
    )
      return true;

    // 3. Domain relationships
    if (
      item1.type === 'entity' &&
      item2.type === 'domain' &&
      item1.domain === item2.name
    )
      return true;

    return false;
  }, []);

  // Prepare graph data with deterministic layout
  const { nodes, links } = useMemo(() => {
    if (!isOpen || items.length === 0) return { nodes: [], links: [] };

    // Create nodes from items (sorted for determinism)
    const nodeData = items
      .sort((a, b) => `${a.type}-${a.id}`.localeCompare(`${b.type}-${b.id}`))
      .map((item, index) => ({
        id: `${item.type}-${item.id}`,
        type: item.type,
        label: item.title,
        item: item,
        connections: 0,
        // Deterministic initial position based on index
        fx: 100 + (index % 5) * 150,
        fy: 100 + Math.floor(index / 5) * 150,
      }));

    // Create links based on deterministic relationships
    const linkData = [];
    const nodeMap = new Map(nodeData.map((n) => [n.id, n]));

    items.forEach((item, i) => {
      items.forEach((otherItem, j) => {
        if (i < j && shouldConnect(item, otherItem)) {
          const sourceId = `${item.type}-${item.id}`;
          const targetId = `${otherItem.type}-${otherItem.id}`;

          linkData.push({
            source: sourceId,
            target: targetId,
            strength: 1,
          });

          if (nodeMap.has(sourceId)) nodeMap.get(sourceId).connections++;
          if (nodeMap.has(targetId)) nodeMap.get(targetId).connections++;
        }
      });
    });

    return { nodes: nodeData, links: linkData };
  }, [items, isOpen, shouldConnect]);

  // Force simulation setup
  useEffect(() => {
    if (!isOpen || nodes.length === 0) return;

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force('collision', d3.forceCollide().radius(d => 40 + (d.connections * 2)));

    simulationRef.current = simulation;

    // Use alphaTarget for smooth interaction if needed
    simulation.alpha(1).restart();

    return () => simulation.stop();
  }, [nodes, links, dimensions, isOpen]);

  // Canvas drawing with high DPI support
  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = dimensions;

    // Handle device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    let animationFrameId;
    let isAnimating = true;

    const render = () => {
      if (!isAnimating) return;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.k, transform.k);

      // Draw links
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      links.forEach((link) => {
        const source =
          typeof link.source === 'object'
            ? link.source
            : nodes.find((n) => n.id === link.source);
        const target =
          typeof link.target === 'object'
            ? link.target
            : nodes.find((n) => n.id === link.target);
        if (!source || !target) return;

        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
      });
      ctx.stroke();

      // Draw nodes
      nodes.forEach((node) => {
        const radius = 10 + node.connections * 1.5;
        const color = TYPE_COLORS[node.type] || '#ffffff';

        // Node Glow
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          radius + 15
        );
        gradient.addColorStop(0, `${color}40`);
        gradient.addColorStop(1, `${color}00`);
        ctx.fillStyle = gradient;
        ctx.arc(node.x, node.y, radius + 15, 0, 2 * Math.PI);
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.fill();

        // Border for clarity
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Label with shadow for readability
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.fillStyle = '#fff';
        ctx.font = `600 ${Math.max(10, 12 / transform.k)}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + radius + 18);
        ctx.shadowBlur = 0;
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      isAnimating = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [nodes, links, transform, dimensions, TYPE_COLORS]);

  const handleZoomIn = () => {
    setTransform(t => ({ ...t, k: Math.min(t.k * 1.2, 4) }));
  };

  const handleZoomOut = () => {
    setTransform(t => ({ ...t, k: Math.max(t.k / 1.2, 0.3) }));
  };

  const handleReset = () => {
    setTransform({ x: 0, y: 0, k: 1 });
    if (simulationRef.current) {
      simulationRef.current.alpha(1).restart();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="workspace-graph-d3-modal" role="dialog" aria-modal="true" aria-labelledby="graph-title">
      <div className="workspace-graph-d3-overlay" onClick={onClose} />
      <div className="workspace-graph-d3-content">
        <div className="workspace-graph-d3-header">
          <div className="workspace-graph-d3-title">
            <Maximize2 size={20} aria-hidden="true" />
            <h3 id="graph-title">Relationship Map</h3>
            <span className="workspace-graph-d3-count">
              {nodes.length} items • {links.length} connections
            </span>
          </div>
          <div className="workspace-graph-d3-controls">
            <button onClick={handleZoomIn} aria-label="Zoom In">
              <ZoomIn size={16} aria-hidden="true" />
            </button>
            <button onClick={handleZoomOut} aria-label="Zoom Out">
              <ZoomOut size={16} aria-hidden="true" />
            </button>
            <button onClick={handleReset} aria-label="Reset View">
              <Locate size={16} aria-hidden="true" />
            </button>
          </div>
          <button className="workspace-graph-d3-close" onClick={onClose} aria-label="Close relationship map">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="workspace-graph-d3-canvas-wrapper" ref={containerRef}>
          {nodes.length > 0 ? (
            <canvas
              ref={canvasRef}
              width={dimensions.width}
              height={dimensions.height}
              className="workspace-graph-d3-canvas"
              aria-label="Interactive relationship graph of workspace items"
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
                  aria-hidden="true"
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