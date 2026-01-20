/**
 * Flow Analysis Library
 * Provides utilities for analyzing lyrical flow, cadence, and rhythm patterns
 */

export function countSyllables(word) {
  if (!word || word.length === 0) return 0;
  
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

export function analyzeStressPattern(words) {
  return words.map(word => {
    const syllables = countSyllables(word);
    if (syllables === 1) return '●';
    if (syllables === 2) return '●○';
    return '●' + '○'.repeat(syllables - 1);
  });
}

export function calculateCadence(syllables, wordCount) {
  if (wordCount === 0) return 'empty';
  const ratio = syllables / wordCount;
  if (ratio < 1.3) return 'fast';
  if (ratio < 1.6) return 'moderate';
  return 'slow';
}

export function analyzeRhythm(text) {
  const lines = text.split('\n');
  const patterns = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const words = line.trim().split(/\s+/).filter(Boolean);
    
    const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
    const stresses = analyzeStressPattern(words);
    const cadence = calculateCadence(syllables, words.length);
    
    patterns.push({
      lineNum: i + 1,
      syllables,
      words: words.length,
      stresses: stresses.join(' '),
      cadence,
      rhythm: syllables > 0 ? (words.length / syllables).toFixed(2) : 0
    });
  }
  
  return patterns;
}

export function calculateFlowConsistency(patterns) {
  const syllableCounts = patterns
    .filter(p => p.syllables > 0)
    .map(p => p.syllables);
  
  if (syllableCounts.length === 0) return 0;
  
  const avg = syllableCounts.reduce((sum, s) => sum + s, 0) / syllableCounts.length;
  const variance = syllableCounts.reduce((sum, s) => {
    const diff = s - avg;
    return sum + diff * diff;
  }, 0) / syllableCounts.length;
  
  return Math.max(0, 100 - Math.sqrt(variance) * 10);
}

export function detectFlowChanges(patterns) {
  const changes = [];
  
  for (let i = 1; i < patterns.length; i++) {
    const prev = patterns[i - 1];
    const curr = patterns[i];
    
    if (prev.cadence !== curr.cadence && curr.syllables > 0) {
      changes.push({
        line: curr.lineNum,
        from: prev.cadence,
        to: curr.cadence
      });
    }
  }
  
  return changes;
}

export function getBPMSuggestion(avgSyllablesPerLine, avgWordsPerLine) {
  const density = avgSyllablesPerLine / Math.max(avgWordsPerLine, 1);
  
  if (density > 1.8) return { min: 70, max: 90, style: 'Slow/Melodic' };
  if (density > 1.5) return { min: 85, max: 105, style: 'Medium/Balanced' };
  return { min: 100, max: 140, style: 'Fast/Aggressive' };
}
