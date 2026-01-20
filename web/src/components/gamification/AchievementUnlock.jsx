import { Trophy, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import './AchievementUnlock.css';

export function AchievementUnlock({ achievement, onClose }) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  if (!achievement) return null;
  
  return (
    <div className={`achievement-unlock ${visible ? 'visible' : ''}`}>
      <div className="achievement-glow"></div>
      
      <button className="achievement-close" onClick={() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }}>
        <X size={16} />
      </button>
      
      <div className="achievement-icon-wrapper">
        <Sparkles className="sparkle-1" size={16} />
        <Sparkles className="sparkle-2" size={16} />
        <div className="achievement-icon-large">{achievement.icon}</div>
      </div>
      
      <div className="achievement-details">
        <div className="achievement-label">
          <Trophy size={14} />
          Achievement Unlocked!
        </div>
        <div className="achievement-name">{achievement.name}</div>
        <div className="achievement-desc">{achievement.description}</div>
        <div className="achievement-points">+{achievement.points} XP</div>
      </div>
    </div>
  );
}
