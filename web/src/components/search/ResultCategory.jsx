import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './ResultCategory.css';

/**
 * ResultCategory - Collapsible category header with result count
 */
export function ResultCategory({ 
  name, 
  count, 
  icon: Icon,
  color = 'cyan',
  defaultExpanded = true,
  children 
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggle = () => setIsExpanded(!isExpanded);

  return (
    <div className={`result-category result-category--${color}`}>
      <button
        className="result-category__header"
        onClick={toggle}
        aria-expanded={isExpanded}
        aria-controls={`category-${name}`}
      >
        <div className="result-category__title">
          {Icon && (
            <div className="result-category__icon">
              <Icon size={18} />
            </div>
          )}
          <span className="result-category__name">{name}</span>
          <span className="result-category__count">{count}</span>
        </div>
        
        <div className="result-category__toggle">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {isExpanded && (
        <div 
          className="result-category__content"
          id={`category-${name}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
