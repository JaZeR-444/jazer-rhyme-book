import { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap';
import './BootSequence.css';

/**
 * BootSequence - High-tech terminal-style loading animation
 * Shows a system initialization sequence
 */
export function BootSequence({ onComplete, skipable = true }) {
  const containerRef = useRef(null);
  const [canSkip, setCanSkip] = useState(false);
  const [logs, setLogs] = useState([]);

  const bootLogs = [
    { text: 'INITIALIZING MASTER FLOW SYSTEM...', delay: 0 },
    { text: 'LOADING NEURAL NETWORKS...', delay: 300 },
    { text: '├── Dictionary Engine: OK', delay: 400 },
    { text: '├── Domain Processor: OK', delay: 500 },
    { text: '├── Rhyme Analyzer: OK', delay: 600 },
    { text: '└── Semantic Engine: OK', delay: 700 },
    { text: 'CONNECTING TO KNOWLEDGE BASE...', delay: 900 },
    { text: '█████████████████████ 100%', delay: 1200 },
    { text: 'CALIBRATING CREATIVE MODULES...', delay: 1400 },
    { text: 'SYSTEM READY', delay: 1700 },
  ];

  useEffect(() => {
    if (skipable) {
      const timer = setTimeout(() => setCanSkip(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [skipable]);

  useEffect(() => {
    let mounted = true;
    const timeouts = [];

    bootLogs.forEach((log, index) => {
      const timeout = setTimeout(() => {
        if (mounted) {
          setLogs(prev => [...prev, log.text]);
          
          // Complete on last log
          if (index === bootLogs.length - 1) {
            setTimeout(() => {
              if (mounted && onComplete) {
                // Fade out animation
                gsap.to(containerRef.current, {
                  opacity: 0,
                  duration: 0.5,
                  onComplete: onComplete
                });
              }
            }, 500);
          }
        }
      }, log.delay);
      
      timeouts.push(timeout);
    });

    return () => {
      mounted = false;
      timeouts.forEach(clearTimeout);
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (canSkip && onComplete) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: onComplete
      });
    }
  };

  return (
    <div ref={containerRef} className="boot-sequence">
      <div className="boot-sequence__container">
        <div className="boot-sequence__header">
          <div className="boot-sequence__logo">
            <span className="boot-sequence__logo-bracket">{'['}</span>
            <span className="boot-sequence__logo-text">JaZeR</span>
            <span className="boot-sequence__logo-bracket">{']'}</span>
          </div>
          <div className="boot-sequence__subtitle">Master Flow Knowledge Hub v2.1.0</div>
        </div>

        <div className="boot-sequence__terminal">
          {logs.map((log, index) => (
            <div 
              key={index} 
              className="boot-sequence__log"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="boot-sequence__log-prompt">{'>'}</span>
              <span className="boot-sequence__log-text">{log}</span>
            </div>
          ))}
          <div className="boot-sequence__cursor"></div>
        </div>

        {canSkip && (
          <button 
            className="boot-sequence__skip"
            onClick={handleSkip}
            aria-label="Skip boot sequence"
          >
            Press any key to skip...
          </button>
        )}
      </div>

      {/* Background grid effect */}
      <div className="boot-sequence__grid" aria-hidden="true"></div>
    </div>
  );
}
