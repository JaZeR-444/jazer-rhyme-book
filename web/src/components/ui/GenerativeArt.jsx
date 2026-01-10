import { useRef, useEffect } from 'react';

export function GenerativeArt({ seed, width = '100%', height = '100%', className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width: w, height: h } = canvas.getBoundingClientRect();
    
    // Resize canvas for high DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // Simple hash function for seeding
    const hash = (str) => {
      let h = 0;
      for (let i = 0; i < str.length; i++) {
        h = Math.imul(31, h) + str.charCodeAt(i) | 0;
      }
      return h;
    };

    const rng = (seedVal) => {
      let t = seedVal += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };

    let seedVal = hash(seed);
    const rand = () => {
      seedVal += 1;
      return rng(seedVal);
    };

    // Drawing Logic
    ctx.fillStyle = '#0a0a0f'; // Surface 1
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 20;
    
    for(let x=0; x<w; x+=gridSize) {
      if (rand() > 0.8) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
    }

    // Glitch Rects
    const numRects = Math.floor(rand() * 5) + 3;
    const colors = ['#5D3FD3', '#00CED1', '#FF0055']; // Purple, Cyan, Magenta

    for (let i=0; i<numRects; i++) {
      ctx.fillStyle = colors[Math.floor(rand() * colors.length)];
      ctx.globalAlpha = rand() * 0.2;
      const rx = rand() * w;
      const ry = rand() * h;
      const rw = rand() * 100 + 20;
      const rh = rand() * 100 + 20;
      ctx.fillRect(rx, ry, rw, rh);
    }
    
    // Tech Details
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.font = '10px monospace';
    ctx.fillText(`ID: ${seed}`, 10, h - 10);

  }, [seed]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className} 
      style={{ width, height, display: 'block' }}
    />
  );
}
