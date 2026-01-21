import { useMemo } from 'react';
import { Activity, TrendingUp, BarChart3, AlertTriangle } from 'lucide-react';
import './FlowAnalyzer.css';

// Performance threshold for heavy analysis warning
const HEAVY_TEXT_THRESHOLD = 1000;

// Shared syllable counter with persistent memoization cache
const syllableCache = new Map();
const CACHE_SIZE_LIMIT = 5000;

/**
 * Count syllables in a word using vowel group detection
 * Results are cached for performance across multiple analyses
 */
function countSyllables(word) {
  if (!word || word.length === 0) return 0;

  // Quick cache check
  if (syllableCache.has(word)) return syllableCache.get(word);

  const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');
  if (cleaned.length <= 3) return 1;

  let result;
  const processed = cleaned
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    .replace(/^y/, '');
  const matches = processed.match(/[aeiouy]{1,2}/g);
  result = matches ? matches.length : 1;

  // Store in cache with size limit
  if (syllableCache.size >= CACHE_SIZE_LIMIT) {
    const firstKey = syllableCache.keys().next().value;
    syllableCache.delete(firstKey);
  }
  syllableCache.set(word, result);

  return result;
}

/**
 * Create stress pattern visualization for a word based on syllable count
 */
function getStressPattern(syllables) {
  if (syllables === 0) return '';
  if (syllables === 1) return '●';
  if (syllables === 2) return '●○';
  return '●' + '○'.repeat(syllables - 1);
}

/**
 * Calculate cadence classification based on syllable-to-word ratio
 */
function calculateCadence(syllables, wordCount) {
  if (wordCount === 0) return 'empty';
  const ratio = syllables / wordCount;
  if (ratio < 1.3) return 'fast';
  if (ratio < 1.6) return 'moderate';
  return 'slow';
}

/**
 * Analyze flow and rhythm patterns for a set of lines
 * Performs syllable counting and stress pattern analysis
 */
function analyzeFlow(lines) {
  const patterns = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const words = line.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) {
      patterns.push({
        lineNum: i + 1,
        syllables: 0,
        words: 0,
        stresses: '',
        cadence: 'empty',
        rhythm: 0,
      });
      continue;
    }

    const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
    const stresses = words
      .map((word) => getStressPattern(countSyllables(word)))
      .join(' ');
    const cadence = calculateCadence(syllables, words.length);

    patterns.push({
      lineNum: i + 1,
      syllables,
      words: words.length,
      stresses,
      cadence,
      rhythm: syllables > 0 ? (words.length / syllables).toFixed(2) : 0,
    });
  }

  return patterns;
}

export function FlowAnalyzer({ text, enabled = true }) {
  const lines = useMemo(() => text.split('\n'), [text]);
  const isHeavy = lines.length > HEAVY_TEXT_THRESHOLD;

  const analysis = useMemo(() => {
    return analyzeFlow(lines);
  }, [lines]);

  const stats = useMemo(() => {
    const nonEmpty = analysis.filter(a => a.syllables > 0);
    if (nonEmpty.length === 0) return { avgSyllables: 0, consistency: 0, cadenceDistribution: {} };
    
    const sumSyllables = nonEmpty.reduce((sum, a) => sum + a.syllables, 0);
    const avgSyllables = (sumSyllables / nonEmpty.length).toFixed(1);
    
    const variance = nonEmpty.reduce((sum, a) => {
      const diff = a.syllables - parseFloat(avgSyllables);
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
    <div className="flow-analyzer" role="complementary" aria-label="Flow Analysis">
      {isHeavy && (
        <div className="performance-warning" role="alert">
          <AlertTriangle size={14} aria-hidden="true" />
          <span>Large text detected. Analysis performance may be impacted.</span>
        </div>
      )}

      <div className="flow-stats">
        <div className="stat-card">
          <Activity size={16} aria-hidden="true" />
          <div>
            <div className="stat-label">Avg Syllables</div>
            <div className="stat-value" aria-label={`${stats.avgSyllables} syllables per line average`}>
              {stats.avgSyllables}
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <TrendingUp size={16} aria-hidden="true" />
          <div>
            <div className="stat-label">Consistency</div>
            <div className="stat-value" aria-label={`${stats.consistency}% flow consistency`}>
              {stats.consistency}%
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <BarChart3 size={16} aria-hidden="true" />
          <div>
            <div className="stat-label">Cadence</div>
            <div className="cadence-breakdown">
              {Object.entries(stats.cadenceDistribution).map(([cadence, count]) => (
                <span 
                  key={cadence} 
                  className={`cadence-badge ${cadence}`}
                  aria-label={`${count} lines with ${cadence} cadence`}
                >
                  {cadence} ({count})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flow-patterns" role="list" aria-label="Line by line rhythm patterns">
        {analysis.map((line, idx) => (
          line.syllables > 0 && (
            <div key={idx} className="flow-line" role="listitem">
              <span className="line-num" aria-label={`Line ${line.lineNum}`}>{line.lineNum}</span>
              <div className="stress-pattern" aria-label={`Rhythm pattern: ${line.stresses}`}>
                {line.stresses}
              </div>
              <span className={`cadence-indicator ${line.cadence}`} aria-label={`Cadence: ${line.cadence}`}>
                {line.cadence}
              </span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}