/**
 * GalaxyView.jsx
 * 
 * 3D-style "Galaxy View" for exploring rhyme clusters
 * Words orbit around rhyme sounds in a cosmic visualization
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, ZoomIn, ZoomOut, Maximize2, Filter } from 'lucide-react';
import './GalaxyView.css';

export default function GalaxyView({ words = [], onWordClick }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState('all');
  const [hoveredWord, setHoveredWord] = useState(null);
  const animationRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Group words by rhyme sound to create clusters
  const rhymeClusters = useMemo(() => {
    const clusters = new Map();
    
    words.forEach(word => {
      const rhymeSound = word.rhyme || word.name.slice(-2); // Use last 2 chars as fallback
      
      if (!clusters.has(rhymeSound)) {
        clusters.set(rhymeSound, {
          sound: rhymeSound,
          words: [],
          centerX: Math.random() * 600 + 100,
          centerY: Math.random() * 400 + 100,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`
        });
      }
      
      clusters.get(rhymeSound).words.push({
        ...word,
        angle: Math.random() * Math.PI * 2,
        distance: 30 + Math.random() * 70,
        speed: 0.0005 + Math.random() * 0.001,
        size: 3 + (word.syllables || 1)
      });
    });
    
    return Array.from(clusters.values()).filter(cluster => cluster.words.length > 1);
  }, [words]);

  // Filter clusters based on search
  const filteredClusters = useMemo(() => {
    if (!searchQuery) return rhymeClusters;
    
    return rhymeClusters.filter(cluster =>
      cluster.words.some(word =>
        word.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [rhymeClusters, searchQuery]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let time = 0;

    function animate() {
      ctx.fillStyle = 'rgba(10, 10, 20, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (let i = 0; i < 100; i++) {
        const x = (i * 100) % canvas.width;
        const y = (i * 73) % canvas.height;
        const size = Math.sin(time * 0.001 + i) * 0.5 + 1;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw clusters
      filteredClusters.forEach((cluster, clusterIndex) => {
        const { centerX, centerY, color, words } = cluster;
        
        // Draw cluster center (star)
        const starPulse = Math.sin(time * 0.002 + clusterIndex) * 3 + 8;
        const gradient = ctx.createRadialGradient(
          centerX * zoom, centerY * zoom, 0,
          centerX * zoom, centerY * zoom, starPulse * zoom
        );
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, `${color}80`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX * zoom, centerY * zoom, starPulse * zoom, 0, Math.PI * 2);
        ctx.fill();

        // Draw orbits and words
        words.forEach((word, wordIndex) => {
          const currentAngle = word.angle + time * word.speed;
          const x = centerX + Math.cos(currentAngle) * word.distance * zoom;
          const y = centerY + Math.sin(currentAngle) * word.distance * zoom;

          // Draw orbit path
          ctx.strokeStyle = `${color}30`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(centerX * zoom, centerY * zoom, word.distance * zoom, 0, Math.PI * 2);
          ctx.stroke();

          // Draw connection line
          ctx.strokeStyle = `${color}50`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(centerX * zoom, centerY * zoom);
          ctx.lineTo(x, y);
          ctx.stroke();

          // Draw word node
          const isHovered = hoveredWord?.name === word.name;
          const nodeSize = word.size * zoom * (isHovered ? 1.5 : 1);
          
          ctx.fillStyle = isHovered ? '#ffffff' : color;
          ctx.beginPath();
          ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
          ctx.fill();

          // Draw word label on hover or for important words
          if (isHovered || word.size > 5) {
            ctx.fillStyle = '#ffffff';
            ctx.font = `${10 * zoom}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(word.name, x, y - nodeSize - 10);
          }
        });
      });

      time++;
      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [filteredClusters, zoom, hoveredWord, dimensions]);

  // Handle mouse move for hover detection
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / zoom;
    const mouseY = (e.clientY - rect.top) / zoom;

    let foundWord = null;

    for (const cluster of filteredClusters) {
      for (const word of cluster.words) {
        const angle = word.angle + Date.now() * word.speed;
        const x = cluster.centerX + Math.cos(angle) * word.distance;
        const y = cluster.centerY + Math.sin(angle) * word.distance;

        const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
        
        if (distance < word.size + 5) {
          foundWord = word;
          break;
        }
      }
      if (foundWord) break;
    }

    setHoveredWord(foundWord);
  };

  const handleClick = (e) => {
    if (hoveredWord && onWordClick) {
      onWordClick(hoveredWord);
    }
  };

  return (
    <div className="galaxy-view" ref={containerRef}>
      <div className="galaxy-header">
        <h2>Rhyme Galaxy</h2>
        <p className="galaxy-subtitle">
          {filteredClusters.length} rhyme clusters • {filteredClusters.reduce((acc, c) => acc + c.words.length, 0)} words
        </p>
      </div>

      <div className="galaxy-controls">
        <div className="galaxy-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search words..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="galaxy-actions">
          <button
            className="galaxy-btn"
            onClick={() => setZoom(Math.min(zoom * 1.2, 3))}
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            className="galaxy-btn"
            onClick={() => setZoom(Math.max(zoom / 1.2, 0.5))}
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            className="galaxy-btn"
            onClick={() => setZoom(1)}
            title="Reset"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="galaxy-canvas"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />

      {hoveredWord && (
        <div className="galaxy-tooltip">
          <div className="tooltip-word">{hoveredWord.name}</div>
          {hoveredWord.rd && (
            <div className="tooltip-def">{hoveredWord.rd}</div>
          )}
          <div className="tooltip-meta">
            <span>Syllables: {hoveredWord.syllables || '?'}</span>
            <span>Rhyme: {hoveredWord.rhyme || '—'}</span>
          </div>
        </div>
      )}

      <div className="galaxy-legend">
        <div className="legend-title">Legend</div>
        <div className="legend-item">
          <div className="legend-icon legend-icon--star"></div>
          <span>Rhyme Center</span>
        </div>
        <div className="legend-item">
          <div className="legend-icon legend-icon--word"></div>
          <span>Word Node</span>
        </div>
        <div className="legend-item">
          <div className="legend-icon legend-icon--orbit"></div>
          <span>Orbital Path</span>
        </div>
      </div>
    </div>
  );
}
