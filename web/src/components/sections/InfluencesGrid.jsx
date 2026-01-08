/**
 * InfluencesGrid Component
 * ========================
 * 
 * PURPOSE: Showcase real entities from the Knowledge Hub
 * displaying artists, influences, and connections.
 * 
 * DATA SOURCE: src/lib/data/knowledgeHub.js (curated from data/music, data/people)
 */

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAPContext } from '../motion/useGSAPContext';
import { featuredInfluences, hubStats } from '../../lib/data/knowledgeHub';
import { easing, timing, stagger } from '../../lib/gsap/easing';
import './InfluencesGrid.css';

export function InfluencesGrid({ id }) {
  const sectionRef = useRef(null);
  
  useGSAPContext(() => {
    // Stats entrance
    gsap.fromTo(
      '.hub-stats',
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
    
    // Stagger influence cards entrance
    gsap.fromTo(
      '.influence-card',
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: timing.medium,
        ease: easing.out,
        stagger: stagger.normal,
        scrollTrigger: {
          trigger: '.influences-grid',
          start: 'top 70%',
        },
      }
    );
  }, { scope: sectionRef });
  
  return (
    <section id={id} ref={sectionRef} className="influences-section section">
      <header className="influences-header">
        <h2 className="text-h1">Knowledge Hub</h2>
        <p className="text-secondary">
          The influences, artists, and ideas that shaped the journey.
        </p>
        
        {/* Hub Statistics */}
        <div className="hub-stats">
          <div className="stat">
            <span className="stat-value">{hubStats.totalDomains}</span>
            <span className="stat-label text-small text-muted">Domains</span>
          </div>
          <div className="stat">
            <span className="stat-value">{hubStats.totalEntities.toLocaleString()}</span>
            <span className="stat-label text-small text-muted">Entities</span>
          </div>
          <div className="stat">
            <span className="stat-value">{(hubStats.rapDictionaryWords / 1000).toFixed(0)}k+</span>
            <span className="stat-label text-small text-muted">Rap Words</span>
          </div>
        </div>
      </header>
      
      {/* Influences Grid */}
      <div className="influences-grid">
        {featuredInfluences.map((influence) => (
          <article key={influence.id} className="influence-card glass">
            <header className="influence-header">
              <h3 className="influence-name">{influence.name}</h3>
              <span className="influence-era text-small text-secondary">{influence.era}</span>
            </header>
            
            {influence.aliases.length > 0 && (
              <div className="influence-aliases">
                {influence.aliases.map((alias) => (
                  <span key={alias} className="alias-tag text-micro">{alias}</span>
                ))}
              </div>
            )}
            
            <p className="influence-liner text-small">{influence.one_liner}</p>
            
            <footer className="influence-footer">
              <div className="influence-tags">
                {influence.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="tag text-micro">{tag}</span>
                ))}
              </div>
              <span className="influence-type text-micro text-accent">
                {influence.influence_type.replace(/-/g, ' ')}
              </span>
            </footer>
          </article>
        ))}
      </div>
      
      <p className="hub-cta text-small text-secondary">
        Data sourced from the JaZeR Master Flow Knowledge Hub
      </p>
    </section>
  );
}
