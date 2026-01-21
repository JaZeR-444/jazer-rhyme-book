/**
 * RhymeGalaxy.jsx
 * 
 * Dedicated page for exploring rhyme relationships in galaxy view
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';
import { usePageTitle } from '../lib/usePageTitle';
import { useDictionaryIndex } from '../lib/hooks';
import { GalaxyView } from '../components/discovery';
import { LoadingState } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import './RhymeGalaxy.css';

export function RhymeGalaxy() {
  usePageTitle('Rhyme Galaxy');
  const navigate = useNavigate();
  const { words, loading, error } = useDictionaryIndex();

  const handleWordClick = (word) => {
    navigate(`/dictionary/${word.letter}/${word.name.toLowerCase()}`);
  };

  if (loading) {
    return <LoadingState message="Loading galaxy..." />;
  }

  if (error) {
    return (
      <div className="rhyme-galaxy">
        <div className="rhyme-galaxy__error">
          <p>Error loading words: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rhyme-galaxy" role="main" aria-label="Rhyme Galaxy - Explore rhyme relationships in galaxy view">
      <div className="rhyme-galaxy__header">
        <Link to="/dictionary" className="rhyme-galaxy__back">
          <ArrowLeft size={20} />
          <span>Back to Dictionary</span>
        </Link>
        <div className="rhyme-galaxy__title-group">
          <h1 className="rhyme-galaxy__title">Rhyme Galaxy</h1>
          <p className="rhyme-galaxy__description">
            Explore the universe of rhyme relationships. Each star represents a rhyme cluster,
            with words orbiting around their shared sounds.
          </p>
        </div>
      </div>

      <div className="rhyme-galaxy__info-panel">
        <Info size={16} />
        <div className="info-content">
          <strong>How to explore:</strong>
          <ul>
            <li>Hover over words to see their details</li>
            <li>Click on a word to view its full definition</li>
            <li>Use zoom controls to explore different regions</li>
            <li>Search to filter specific words or clusters</li>
          </ul>
        </div>
      </div>

      <div className="rhyme-galaxy__canvas-wrapper">
        <GalaxyView words={words} onWordClick={handleWordClick} />
      </div>

      <div className="rhyme-galaxy__stats">
        <div className="stat-card">
          <div className="stat-value">{words.length}</div>
          <div className="stat-label">Total Words</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {new Set(words.map(w => w.rhyme || w.name.slice(-2))).size}
          </div>
          <div className="stat-label">Rhyme Patterns</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {words.filter(w => w.syllables > 2).length}
          </div>
          <div className="stat-label">Complex Words</div>
        </div>
      </div>
    </div>
  );
}

export default RhymeGalaxy;
