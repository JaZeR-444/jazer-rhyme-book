import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, RefreshCw } from 'lucide-react';
import { getRandomEntities } from '../lib/data/knowledgeHub';
import './RandomDiscovery.css';

export function RandomDiscovery() {
  const [isSpinning, setIsSpinning] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSurpriseMe = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    timerRef.current = setTimeout(() => {
      const [randomEntity] = getRandomEntities(1);
      if (randomEntity) {
        navigate(`/entities/${randomEntity.domain}/${randomEntity.id}`);
      }
      setIsSpinning(false);
    }, 500);
  };

  return (
    <button 
      className={`random-discovery ${isSpinning ? 'spinning' : ''}`}
      onClick={handleSurpriseMe}
      disabled={isSpinning}
      aria-label="Find a random entity"
    >
      <Sparkles size={20} aria-hidden="true" />
      <span>Surprise Me</span>
      <RefreshCw size={16} className="refresh-icon" aria-hidden="true" />
    </button>
  );
}