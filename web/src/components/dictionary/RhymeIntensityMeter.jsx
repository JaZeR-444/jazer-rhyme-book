/**
 * RhymeIntensityMeter.jsx
 * 
 * Displays rhyme quality ratings (weak/good/perfect) with visual meter
 */

import React from 'react';
import './RhymeIntensityMeter.css';

const INTENSITY_LEVELS = {
  weak: {
    label: 'Weak',
    color: '#FFA500',
    description: 'Approximate or slant rhymes'
  },
  good: {
    label: 'Good',
    color: '#32CD32',
    description: 'Strong phonetic similarity'
  },
  perfect: {
    label: 'Perfect',
    color: '#FFD700',
    description: 'Exact sound match'
  }
};

export default function RhymeIntensityMeter({ 
  intensity = 'good', 
  score = 0.7,
  showLabel = true,
  showDescription = false,
  size = 'medium'
}) {
  const config = INTENSITY_LEVELS[intensity];
  const percentage = Math.round(score * 100);
  
  const sizeClasses = {
    small: 'meter--small',
    medium: 'meter--medium',
    large: 'meter--large'
  };

  return (
    <div className={`rhyme-intensity-meter ${sizeClasses[size]}`}>
      {showLabel && (
        <div className="meter__header">
          <span 
            className="meter__label"
            style={{ color: config.color }}
          >
            {config.label}
          </span>
          <span className="meter__score">{percentage}%</span>
        </div>
      )}
      
      <div className="meter__bar">
        <div className="meter__track"></div>
        <div 
          className="meter__fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: config.color,
            boxShadow: `0 0 8px ${config.color}40`
          }}
        ></div>
      </div>
      
      {showDescription && (
        <p className="meter__description">
          {config.description}
        </p>
      )}
    </div>
  );
}

export function RhymeQualityIndicator({ rhymes }) {
  if (!rhymes || (!rhymes.perfect && !rhymes.good && !rhymes.weak)) {
    return null;
  }

  const perfectCount = rhymes.perfect?.length || 0;
  const goodCount = rhymes.good?.length || 0;
  const weakCount = rhymes.weak?.length || 0;
  const total = perfectCount + goodCount + weakCount;

  if (total === 0) return null;

  return (
    <div className="rhyme-quality-indicator">
      <h4 className="quality__title">Rhyme Quality Distribution</h4>
      
      <div className="quality__bars">
        {perfectCount > 0 && (
          <div className="quality__segment">
            <div 
              className="quality__bar quality__bar--perfect"
              style={{ 
                width: `${(perfectCount / total) * 100}%`,
                backgroundColor: INTENSITY_LEVELS.perfect.color
              }}
            ></div>
            <span className="quality__count">{perfectCount}</span>
          </div>
        )}
        
        {goodCount > 0 && (
          <div className="quality__segment">
            <div 
              className="quality__bar quality__bar--good"
              style={{ 
                width: `${(goodCount / total) * 100}%`,
                backgroundColor: INTENSITY_LEVELS.good.color
              }}
            ></div>
            <span className="quality__count">{goodCount}</span>
          </div>
        )}
        
        {weakCount > 0 && (
          <div className="quality__segment">
            <div 
              className="quality__bar quality__bar--weak"
              style={{ 
                width: `${(weakCount / total) * 100}%`,
                backgroundColor: INTENSITY_LEVELS.weak.color
              }}
            ></div>
            <span className="quality__count">{weakCount}</span>
          </div>
        )}
      </div>
      
      <div className="quality__legend">
        <div className="legend__item">
          <div 
            className="legend__dot" 
            style={{ backgroundColor: INTENSITY_LEVELS.perfect.color }}
          ></div>
          <span>Perfect ({perfectCount})</span>
        </div>
        <div className="legend__item">
          <div 
            className="legend__dot" 
            style={{ backgroundColor: INTENSITY_LEVELS.good.color }}
          ></div>
          <span>Good ({goodCount})</span>
        </div>
        <div className="legend__item">
          <div 
            className="legend__dot" 
            style={{ backgroundColor: INTENSITY_LEVELS.weak.color }}
          ></div>
          <span>Weak ({weakCount})</span>
        </div>
      </div>
    </div>
  );
}