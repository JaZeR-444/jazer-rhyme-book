import { useMemo, useCallback } from 'react';
import { Flame } from 'lucide-react';
import './RhymeDensityHeatmap.css';

// Cache for phonetic endings to avoid recalculation
const phoneticCache = new Map();
const PHONETIC_CACHE_LIMIT = 2000;

/**
 * Extract phonetic ending from a word for rhyme matching
 * Results are cached for performance
 */
function getPhoneticEnding(word) {
  if (!word || word.length < 2) return word || '';

  if (phoneticCache.has(word)) {
    return phoneticCache.get(word);
  }

  const vowels = 'aeiouy';
  let lastVowelIdx = -1;

  for (let i = word.length - 1; i >= 0; i--) {
    if (vowels.includes(word[i])) {
      lastVowelIdx = i;
      break;
    }
  }

  const result = lastVowelIdx === -1 ? word.slice(-2) : word.slice(lastVowelIdx);

  // Store in cache with size limit
  if (phoneticCache.size >= PHONETIC_CACHE_LIMIT) {
    const firstKey = phoneticCache.keys().next().value;
    phoneticCache.delete(firstKey);
  }
  phoneticCache.set(word, result);

  return result;
}

/**
 * Find all rhyming groups in the text
 * Returns a map of phonetic endings to matching lines
 */
function findRhymes(lines) {
  const rhymeMap = new Map();

  lines.forEach((line, idx) => {
    const words = line.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return;

    const lastWord = words[words.length - 1]
      .toLowerCase()
      .replace(/[^a-z]/g, '');
    const rhymeKey = getPhoneticEnding(lastWord);

    if (!rhymeMap.has(rhymeKey)) {
      rhymeMap.set(rhymeKey, []);
    }
    rhymeMap.get(rhymeKey).push({ lineIdx: idx, word: lastWord });
  });

  return rhymeMap;
}

/**
 * Calculate rhyme density for each line
 * Higher values indicate more rhymes on that line
 */
function calculateDensity(lines) {
  const rhymeMap = findRhymes(lines);
  const density = new Array(lines.length).fill(0);

  rhymeMap.forEach((matches) => {
    if (matches.length < 2) return;

    const weight = matches.length;
    matches.forEach(({ lineIdx }) => {
      density[lineIdx] = weight;
    });
  });

  return density;
}

/**
 * Convert density value to a heatmap color
 * Uses HSL color space for smooth gradients
 */
function getHeatColor(value, maxDensity) {
  if (value === 0) return 'rgba(156, 163, 175, 0.1)';

  const intensity = value / maxDensity;
  const hue = 260 - intensity * 60; // Purple to red gradient
  return `hsla(${hue}, 80%, 60%, ${0.2 + intensity * 0.6})`;
}

export function RhymeDensityHeatmap({ text, enabled = true }) {
  const { density, maxDensity, rhymeGroups } = useMemo(() => {
    const lines = text.split('\n');
    const density = calculateDensity(lines);
    const maxDensity = Math.max(...density, 1);

    const rhymeMap = findRhymes(lines);
    const rhymeGroups = Array.from(rhymeMap.entries())
      .filter(([, matches]) => matches.length >= 2)
      .map(([key, matches]) => ({
        key,
        count: matches.length,
        lines: matches.map((m) => m.lineIdx),
      }));

    return { density, maxDensity, rhymeGroups };
  }, [text]);

  if (!enabled) return null;

  return (
    <div className="rhyme-density-heatmap">
      <div className="heatmap-header">
        <Flame size={16} />
        <h3>Rhyme Density</h3>
        <span className="rhyme-count">{rhymeGroups.length} rhyme groups</span>
      </div>

      <div className="heatmap-grid">
        {density.map((value, idx) => (
          <div
            key={idx}
            className="heatmap-cell"
            style={{
              backgroundColor: getHeatColor(value, maxDensity),
              height: '1.5em',
            }}
            title={
              value > 0
                ? `Line ${idx + 1}: ${value} rhymes`
                : `Line ${idx + 1}: No rhymes`
            }
          >
            <span className="line-marker">{idx + 1}</span>
            {value > 0 && <span className="density-value">{value}</span>}
          </div>
        ))}
      </div>

      <div className="heatmap-legend">
        <span>Low</span>
        <div className="gradient-bar"></div>
        <span>High</span>
      </div>

      <div className="rhyme-groups">
        {rhymeGroups.slice(0, 5).map((group, idx) => (
          <div key={idx} className="rhyme-group">
            <span className="group-badge">{group.count}×</span>
            <span className="group-lines">
              Lines: {group.lines.map(l => l + 1).join(', ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
