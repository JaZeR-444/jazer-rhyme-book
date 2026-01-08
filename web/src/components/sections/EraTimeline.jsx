/**
 * EraTimeline Component
 * =====================
 * 
 * PURPOSE: Communicate musical evolution through time via pinned scroll.
 * 
 * GSAP PATTERN:
 * - Each era is 100vh pinned
 * - Scroll progress drives era crossfade
 * - Era dots indicate current position
 */

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAPContext } from '../motion/useGSAPContext';
import { eras } from '../../lib/data/eras';
import { easing, timing } from '../../lib/gsap/easing';
import './EraTimeline.css';

export function EraTimeline({ id }) {
  const sectionRef = useRef(null);
  const [activeEraIndex, setActiveEraIndex] = useState(0);
  
  useGSAPContext(() => {
    const eraCards = gsap.utils.toArray('.era-card');
    
    eraCards.forEach((card, index) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onEnter: () => setActiveEraIndex(index),
        onEnterBack: () => setActiveEraIndex(index),
      });
      
      // Animate content within each era card
      const content = card.querySelector('.era-content');
      gsap.fromTo(
        content,
        { opacity: 0.3, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: easing.out,
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'top 30%',
            scrub: true,
          },
        }
      );
    });
  }, { scope: sectionRef });
  
  return (
    <section id={id} ref={sectionRef} className="era-timeline">
      {/* Era Navigation Dots */}
      <nav className="era-nav" aria-label="Era navigation">
        {eras.map((era, index) => (
          <button
            key={era.id}
            className={`era-dot ${index === activeEraIndex ? 'active' : ''}`}
            style={{ '--era-color': era.color }}
            aria-label={`${era.name} era`}
            aria-current={index === activeEraIndex ? 'true' : undefined}
          />
        ))}
      </nav>
      
      {/* Era Cards */}
      {eras.map((era) => (
        <article
          key={era.id}
          className="era-card section"
          style={{ '--era-color': era.color }}
        >
          <div className="era-background" aria-hidden="true">
            <div 
              className="era-gradient"
              style={{ background: `radial-gradient(ellipse at center, ${era.color}20 0%, transparent 70%)` }}
            />
          </div>
          
          <div className="era-content">
            <header className="era-header">
              <span className="era-years text-small text-secondary">
                {era.yearStart} — {era.yearEnd || 'Present'}
              </span>
              <h2 className="era-name text-h1">{era.name}</h2>
              <p className="era-signature text-accent">{era.sonicSignature}</p>
            </header>
            
            <p className="era-description text-body">{era.description}</p>
            
            <div className="era-projects">
              <h3 className="text-small text-secondary">Key Projects</h3>
              <ul className="project-list">
                {era.projects.map((project) => (
                  <li key={project.id} className="project-item">
                    <span className="project-title">{project.title}</span>
                    <span className="project-type text-small text-muted">{project.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
