/**
 * Philosophy Component
 * ====================
 * 
 * PURPOSE: Communicate artistic values and creative principles.
 * 
 * GSAP PATTERN:
 * - Text reveals on scroll
 * - Pull-quote emphasis animations
 * - Progressive disclosure of chapters
 */

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAPContext } from '../motion/useGSAPContext';
import { philosophy } from '../../lib/data/philosophy';
import { easing, timing, stagger } from '../../lib/gsap/easing';
import './Philosophy.css';

export function Philosophy({ id }) {
  const sectionRef = useRef(null);
  
  useGSAPContext(() => {
    // Header entrance
    gsap.fromTo(
      '.philosophy-header',
      { opacity: 0, y: 30 },
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
    
    // Stagger chapter reveals
    gsap.fromTo(
      '.philosophy-chapter',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: timing.medium,
        ease: easing.out,
        stagger: stagger.relaxed,
        scrollTrigger: {
          trigger: '.philosophy-chapters',
          start: 'top 70%',
        },
      }
    );
    
    // Pull-quote emphasis
    gsap.utils.toArray('.pull-quote').forEach((quote) => {
      gsap.fromTo(
        quote,
        { opacity: 0.5, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: timing.long,
          ease: easing.out,
          scrollTrigger: {
            trigger: quote,
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: 1,
          },
        }
      );
    });
  }, { scope: sectionRef });
  
  return (
    <section id={id} ref={sectionRef} className="philosophy section">
      <header className="philosophy-header">
        <h2 className="text-h1">{philosophy.title}</h2>
        <p className="philosophy-tagline text-secondary">{philosophy.tagline}</p>
      </header>
      
      <div className="philosophy-chapters">
        {philosophy.chapters.map((chapter) => (
          <article key={chapter.id} className="philosophy-chapter">
            <h3 className="chapter-title text-h2">{chapter.title}</h3>
            <p className="chapter-content text-body">{chapter.content}</p>
            <blockquote className="pull-quote">
              <p>"{chapter.pullQuote}"</p>
            </blockquote>
          </article>
        ))}
      </div>
    </section>
  );
}
