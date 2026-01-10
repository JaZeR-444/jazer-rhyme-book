import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, RefreshCw } from 'lucide-react';
import { getRandomEntities } from '../lib/data/knowledgeHub';
import './RandomDiscovery.css';

export function RandomDiscovery() {
  const [isSpinning, setIsSpinning] = useState(false);
  const navigate = useNavigate();

  const handleSurpriseMe = () => {
    setIsSpinning(true);
    
    setTimeout(() => {
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
    >
      <Sparkles size={20} />
      <span>Surprise Me</span>
      <RefreshCw size={16} className="refresh-icon" />
    </button>
  );
}
