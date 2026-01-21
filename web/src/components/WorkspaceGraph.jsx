import { useState, useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { X, Maximize2 } from 'lucide-react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { findEntitiesByIds } from '../lib/data/knowledgeHub';
import './WorkspaceGraph.css';

export function WorkspaceGraph({ isOpen, onClose }) {
  const { items } = useWorkspace();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const graphRef = useRef();
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });

  useEffect(() => {
    if (!isOpen || items.length === 0) return;

    // Get entity items only
    const entityItems = items.filter(item => item.type === 'entity');

    // Create nodes from workspace items
    const nodes = entityItems.map(item => ({
      id: item.id,
      name: item.title,
      group: item.sectionId || 'general',
      val: 10
    }));

    // Create links based on related_ids
    const links = [];
    const nodeIds = new Set(nodes.map(n => n.id));

    entityItems.forEach(item => {
      // Try to load the entity to get related_ids
      const entityData = findEntitiesByIds([item.id]);
      if (entityData && entityData.length > 0) {
        const entity = entityData[0].entity;
        if (entity.related_ids) {
          entity.related_ids.forEach(relatedId => {
            // Only create link if the related entity is also in workspace
            if (nodeIds.has(relatedId)) {
              links.push({
                source: item.id,
                target: relatedId,
                value: 2
              });
            }
          });
        }
      }
    });

    setGraphData({ nodes, links });
  }, [items, isOpen]);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return undefined;

    const updateSize = () => {
      const rect = canvasRef.current.getBoundingClientRect();
      const width = Math.max(320, Math.floor(rect.width));
      const height = Math.max(240, Math.floor(rect.height));
      setCanvasSize({ width, height });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, [isOpen]);

  if (!isOpen) return null;

  const sectionColors = {
    general: '#6366f1',
    'verse-1': '#8b5cf6',
    hook: '#ec4899',
    'verse-2': '#f97316',
    bridge: '#14b8a6'
  };

  return (
    <div className="workspace-graph-modal">
      <div className="workspace-graph-overlay" onClick={onClose} />
      <div className="workspace-graph-content">
        <div className="workspace-graph-header">
          <div className="workspace-graph-title">
            <Maximize2 size={20} />
            <h3>Relationship Map</h3>
            <span className="workspace-graph-count">
              {graphData.nodes.length} items • {graphData.links.length} connections
            </span>
          </div>
          <button className="workspace-graph-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="workspace-graph-canvas" ref={canvasRef}>
          {graphData.nodes.length > 0 ? (
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              nodeLabel="name"
              nodeColor={node => sectionColors[node.group] || '#6366f1'}
              nodeRelSize={6}
              linkWidth={2}
              linkColor={() => 'rgba(255, 255, 255, 0.2)'}
              backgroundColor="#0a0a0a"
              width={canvasSize.width}
              height={canvasSize.height}
            />
          ) : (
            <div className="workspace-graph-empty">
              <p>No entity relationships to display.</p>
              <p className="workspace-graph-hint">
                Pin more entities that are related to each other to see connections.
              </p>
            </div>
          )}
        </div>

        <div className="workspace-graph-legend">
          <div className="workspace-graph-legend-title">Sections:</div>
          <div className="workspace-graph-legend-items">
            {Object.entries(sectionColors).map(([key, color]) => (
              <div key={key} className="workspace-graph-legend-item">
                <div
                  className="workspace-graph-legend-color"
                  style={{ backgroundColor: color }}
                />
                <span>{key.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
