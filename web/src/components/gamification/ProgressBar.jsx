import { TrendingUp, Award, Star } from 'lucide-react';
import { useMemo } from 'react';
import './ProgressBar.css';

export function ProgressBar({ currentXP, level, showDetails = true }) {
  const { nextLevelXP, progress, pointsToNext } = useMemo(() => {
    const nextLevelXP = level * 100;
    const progress = (currentXP % 100);
    const pointsToNext = nextLevelXP - currentXP;
    
    return { nextLevelXP, progress, pointsToNext };
  }, [currentXP, level]);

  const levelTitle = useMemo(() => {
    if (level < 5) return 'Beginner';
    if (level < 10) return 'Wordsmith';
    if (level < 20) return 'Lyricist';
    if (level < 35) return 'Master';
    return 'Legend';
  }, [level]);

  return (
    <div className="progress-bar-container">
      <div className="progress-header">
        <div className="level-badge">
          <Award size={16} aria-hidden="true" />
          <span className="level-number">Level {level}</span>
        </div>
        <div className="level-title">{levelTitle}</div>
        {showDetails && (
          <div className="xp-counter">
            <Star size={14} aria-hidden="true" />
            {currentXP} XP
          </div>
        )}
      </div>

      <div className="progress-bar-wrapper">
        <div 
          className="progress-bar-track"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${Math.round(progress)}%`}
          aria-label={`Level ${level} progress`}
        >
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }}
          >
            <div className="progress-bar-glow"></div>
          </div>
        </div>
        <div className="progress-labels">
          <span>{progress}%</span>
          {showDetails && (
            <span className="points-to-next">
              <TrendingUp size={12} aria-hidden="true" />
              {pointsToNext} to next level
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
