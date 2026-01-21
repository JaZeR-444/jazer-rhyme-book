import PropTypes from 'prop-types';
import { useRef, useEffect } from 'react';

/**
 * GenerativeArt - Animated canvas background seeded for repeatable visuals
 *
 * @param {Object} props
 * @param {string|number} props.seed - Seed value for deterministic patterns
 * @param {string|number} [props.width] - Canvas width
 * @param {string|number} [props.height] - Canvas height
 * @param {string} [props.className] - Additional class names
 * @param {boolean} [props.animated] - Whether to animate frames
 * @returns {JSX.Element}
 */
export function GenerativeArt({ seed, width = '100%', height = '100%', className = '', animated = true }) {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w, h;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Simple hash function for seeding
    const hash = (str) => {
      let h = 0;
      const s = String(str || 'default');
      for (let i = 0; i < s.length; i++) {
        h = Math.imul(31, h) + s.charCodeAt(i) | 0;
      }
      return h;
    };

    const rng = (seedVal) => {
      let t = seedVal += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };

    const draw = () => {
      const time = (Date.now() - startTimeRef.current) / 1000;
      let seedVal = hash(seed);
      const rand = () => {
        seedVal += 1;
        return rng(seedVal);
      };

      // Clear with slight trail if animated
      ctx.fillStyle = animated ? 'rgba(10, 10, 15, 0.2)' : '#0a0a0f';
      ctx.fillRect(0, 0, w, h);

      // Grid lines with movement
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      const offset = (time * 10) % gridSize;
      
      ctx.beginPath();
      for(let x = offset; x < w; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for(let y = offset; y < h; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // Animated Tech Circles
      const numCircles = 3;
      for (let i = 0; i < numCircles; i++) {
        const r1 = rand();
        const r2 = rand();
        const cx = w * r1 + Math.sin(time * 0.5 + i) * 20;
        const cy = h * r2 + Math.cos(time * 0.3 + i) * 20;
        const radius = 50 + rand() * 100;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = i === 0 ? 'hsla(262, 70%, 55%, 0.1)' : 'hsla(180, 100%, 41%, 0.1)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Moving arc
        ctx.beginPath();
        ctx.arc(cx, cy, radius, time + i, time + i + 1);
        ctx.strokeStyle = i === 0 ? 'hsla(262, 70%, 55%, 0.3)' : 'hsla(180, 100%, 50%, 0.3)';
        ctx.stroke();
      }

      // Glitch Rects
      const numRects = 2;
      const colors = ['#5D3FD3', '#00CED1', '#FF0055'];

      for (let i = 0; i < numRects; i++) {
        if (rand() > 0.95) { // Occasional glitch
          ctx.fillStyle = colors[Math.floor(rand() * colors.length)];
          ctx.globalAlpha = rand() * 0.1;
          const rx = rand() * w;
          const ry = rand() * h;
          const rw = rand() * 200 + 50;
          const rh = rand() * 20 + 2;
          ctx.fillRect(rx, ry, rw, rh);
        }
      }
      
      // Tech Details
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(`SYS_ID: ${seed.toUpperCase()}`, 20, h - 20);
      ctx.fillText(`FLOW_SYNC: ${(Math.sin(time) * 100).toFixed(2)}%`, 20, h - 35);
      
      if (animated) {
        requestRef.current = requestAnimationFrame(draw);
      }
    };

    if (animated) {
      requestRef.current = requestAnimationFrame(draw);
    } else {
      draw();
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [seed, animated]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`generative-art ${className}`} 
      style={{ width, height, display: 'block' }}
    />
  );
}

GenerativeArt.propTypes = {
  seed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  animated: PropTypes.bool
};
