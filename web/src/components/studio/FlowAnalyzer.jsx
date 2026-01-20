import { useMemo } from 'react';
import { Activity, TrendingUp, BarChart3 } from 'lucide-react';
import './FlowAnalyzer.css';

function analyzeFlow(lines) {
  const patterns = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const words = line.trim().split(/\s+/).filter(Boolean);
    
    const syllables = words.reduce((sum, word) => {
      return sum + countSyllables(word);
    }, 0);
    
    const stresses = estimateStressPattern(words);
    const cadence = calculateCadence(syllables, words.length);
    
    patterns.push({
      lineNum: i + 1,
      syllables,
      words: words.length,
      stresses,
      cadence,
      rhythm: syllables > 0 ? (words.length / syllables).toFixed(2) : 0
    });
  }
  
  return patterns;
}

function countSyllables(word) {
  if (!word || word.length === 0) return 0;
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

function estimateStressPattern(words) {
  return words.map(word => {
    const syllables = countSyllables(word);
    if (syllables === 1) return '●';
    if (syllables === 2) return '●○';
    return '●' + '○'.repeat(syllables - 1);
  }).join(' ');
}

function calculateCadence(syllables, wordCount) {
  if (wordCount === 0) return 'empty';
  const ratio = syllables / wordCount;
  if (ratio < 1.3) return 'fast';
  if (ratio < 1.6) return 'moderate';
  return 'slow';
}

export function FlowAnalyzer({ text, enabled = true }) {
  const analysis = useMemo(() => {
    const lines = text.split('\n');
    return analyzeFlow(lines);
  }, [text]);

  const stats = useMemo(() => {
    const nonEmpty = analysis.filter(a => a.syllables > 0);
    if (nonEmpty.length === 0) return { avgSyllables: 0, consistency: 0, cadenceDistribution: {} };
    
    const avgSyllables = (nonEmpty.reduce((sum, a) => sum + a.syllables, 0) / nonEmpty.length).toFixed(1);
    
    const syllableCounts = nonEmpty.map(a => a.syllables);
    const variance = syllableCounts.reduce((sum, s) => {
      const diff = s - avgSyllables;
      return sum + diff * diff;
    }, 0) / nonEmpty.length;
    const consistency = Math.max(0, 100 - Math.sqrt(variance) * 10).toFixed(0);
    
    const cadenceDistribution = nonEmpty.reduce((dist, a) => {
      dist[a.cadence] = (dist[a.cadence] || 0) + 1;
      return dist;
    }, {});
    
    return { avgSyllables, consistency, cadenceDistribution };
  }, [analysis]);

  if (!enabled) return null;

  return (
    <div className="flow-analyzer">
      <div className="flow-stats">
        <div className="stat-card">
          <Activity size={16} />
          <div>
            <div className="stat-label">Avg Syllables</div>
            <div className="stat-value">{stats.avgSyllables}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <TrendingUp size={16} />
          <div>
            <div className="stat-label">Consistency</div>
            <div className="stat-value">{stats.consistency}%</div>
          </div>
        </div>
        
        <div className="stat-card">
          <BarChart3 size={16} />
          <div>
            <div className="stat-label">Cadence</div>
            <div className="cadence-breakdown">
              {Object.entries(stats.cadenceDistribution).map(([cadence, count]) => (
                <span key={cadence} className={`cadence-badge ${cadence}`}>
                  {cadence} ({count})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flow-patterns">
        {analysis.map((line, idx) => (
          line.syllables > 0 && (
            <div key={idx} className="flow-line">
              <span className="line-num">{line.lineNum}</span>
              <div className="stress-pattern">{line.stresses}</div>
              <span className={`cadence-indicator ${line.cadence}`}>
                {line.cadence}
              </span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
