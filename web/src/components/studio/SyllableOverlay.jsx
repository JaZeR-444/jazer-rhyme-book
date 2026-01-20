import { useState, useEffect, useMemo } from 'react';
import { Volume2 } from 'lucide-react';
import './SyllableOverlay.css';

function countSyllables(word) {
  if (!word || word.length === 0) return 0;
  
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

export function SyllableOverlay({ text, enabled = true }) {
  const [hoveredLine, setHoveredLine] = useState(null);

  const lines = useMemo(() => {
    return text.split('\n').map((line, idx) => {
      const words = line.trim().split(/\s+/).filter(Boolean);
      const syllableCount = words.reduce((sum, word) => sum + countSyllables(word), 0);
      return {
        index: idx,
        text: line,
        syllables: syllableCount,
        words: words.length
      };
    });
  }, [text]);

  const avgSyllables = useMemo(() => {
    const nonEmpty = lines.filter(l => l.syllables > 0);
    if (nonEmpty.length === 0) return 0;
    return (nonEmpty.reduce((sum, l) => sum + l.syllables, 0) / nonEmpty.length).toFixed(1);
  }, [lines]);

  if (!enabled) return null;

  return (
    <div className="syllable-overlay">
      <div className="syllable-stats">
        <div className="stat-item">
          <Volume2 size={14} />
          <span>Avg: {avgSyllables} syllables/line</span>
        </div>
      </div>
      
      <div className="syllable-lines">
        {lines.map((line) => (
          <div
            key={line.index}
            className={`syllable-line ${hoveredLine === line.index ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredLine(line.index)}
            onMouseLeave={() => setHoveredLine(null)}
          >
            {line.syllables > 0 && (
              <span 
                className="syllable-count"
                style={{
                  opacity: hoveredLine === line.index ? 1 : 0.5,
                  fontWeight: hoveredLine === line.index ? 'bold' : 'normal'
                }}
              >
                {line.syllables}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
