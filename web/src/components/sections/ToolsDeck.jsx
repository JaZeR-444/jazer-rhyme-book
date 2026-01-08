/**
 * ToolsDeck Component
 * ===================
 * 
 * PURPOSE: Showcase the creative infrastructure (DAWs, plugins, hardware).
 * 
 * GSAP PATTERN:
 * - Horizontal scroll-triggered reveal
 * - Card hover animations
 * - Category filtering (optional future enhancement)
 */

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAPContext } from '../motion/useGSAPContext';
import { toolCategories } from '../../lib/data/tools';
import { easing, timing, stagger } from '../../lib/gsap/easing';
import './ToolsDeck.css';

export function ToolsDeck({ id }) {
  const sectionRef = useRef(null);
  
  useGSAPContext(() => {
    // Stagger tool cards entrance
    gsap.fromTo(
      '.tool-card',
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: timing.medium,
        ease: easing.out,
        stagger: stagger.normal,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    );
    
    // Section header animation
    gsap.fromTo(
      '.tools-header',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: timing.medium,
        ease: easing.out,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    );
  }, { scope: sectionRef });
  
  return (
    <section id={id} ref={sectionRef} className="tools-deck section">
      <header className="tools-header">
        <h2 className="text-h1">Tools & Workflow</h2>
        <p className="text-secondary">The creative infrastructure behind the sound.</p>
      </header>
      
      <div className="tools-grid">
        {toolCategories.map((category) => (
          <div key={category.id} className="tool-category">
            <h3 className="category-name text-h3">{category.name}</h3>
            <p className="category-desc text-small text-secondary">{category.description}</p>
            
            <div className="category-tools">
              {category.tools.map((tool) => (
                <article key={tool.id} className="tool-card glass">
                  <header className="tool-header">
                    <h4 className="tool-name">{tool.name}</h4>
                    {tool.role && (
                      <span className="tool-role text-small text-accent">{tool.role}</span>
                    )}
                  </header>
                  
                  {tool.description && (
                    <p className="tool-description text-small text-secondary">
                      {tool.description}
                    </p>
                  )}
                  
                  {tool.proficiency && (
                    <div className="tool-proficiency">
                      <span className="proficiency-label text-micro text-muted">Proficiency</span>
                      <span className="proficiency-level text-small">{tool.proficiency}</span>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
