import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import { getRhymeScheme } from '../lib/rhymeFinder';
import { Card } from './ui';
import './RhymeSchemeAnalyzer.css';

export function RhymeSchemeAnalyzer({ text }) {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (!text || !text.trim()) {
      setAnalysis(null);
      return;
    }

    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      setAnalysis(null);
      return;
    }

    // Analyze rhyme scheme
    const analyzedLines = lines.map(line => {
      const words = line.trim().split(/\s+/);
      const lastWord = words[words.length - 1]?.replace(/[^\w]/g, '');

      if (!lastWord) {
        return { line, lastWord: '', phonetic: null, syllables: 0 };
      }

      const rhymeData = getRhymeScheme(lastWord);
      return {
        line,
        lastWord,
        phonetic: rhymeData.perfect,
        syllables: rhymeData.syllables
      };
    });

    // Determine rhyme scheme (AABB, ABAB, etc.)
    const schemeMap = {};
    let nextCharCode = 65; // 'A'
    const scheme = analyzedLines.map((lineData) => {
      if (!lineData.phonetic) return '-';

      // Check if this phonetic pattern already exists
      const existingScheme = Object.keys(schemeMap).find(
        key => schemeMap[key] === lineData.phonetic
      );

      if (existingScheme) {
        return existingScheme;
      } else {
        // Handle alphabet overflow (A-Z, then AA, AB...)
        let assigned;
        if (nextCharCode <= 90) {
          assigned = String.fromCharCode(nextCharCode);
        } else {
          // Fallback for extremely long complex schemes
          const prefix = String.fromCharCode(64 + Math.floor((nextCharCode - 65) / 26));
          const suffix = String.fromCharCode(65 + ((nextCharCode - 65) % 26));
          assigned = prefix + suffix;
        }
        
        schemeMap[assigned] = lineData.phonetic;
        nextCharCode++;
        return assigned;
      }
    });

    // Detect pattern
    const schemeString = scheme.join('');
    let pattern = 'Custom';

    if (scheme.length >= 4) {
      const first4 = schemeString.substring(0, 4);
      if (first4 === 'AABB') pattern = 'Couplets (AABB)';
      else if (first4 === 'ABAB') pattern = 'Alternate (ABAB)';
      else if (first4 === 'ABBA') pattern = 'Enclosed (ABBA)';
      else if (first4 === 'AAAA') pattern = 'Monorhyme (AAAA)';
    }

    setAnalysis({
      lines: analyzedLines,
      scheme,
      pattern,
      schemeString
    });
  }, [text]);

  if (!analysis) {
    return (
      <Card className="rhyme-scheme-analyzer empty">
        <Sparkles size={24} className="text-accent-secondary" aria-hidden="true" />
        <p className="analyzer-hint">Write at least 2 lines to see rhyme scheme analysis</p>
      </Card>
    );
  }

  return (
    <Card className="rhyme-scheme-analyzer" role="region" aria-label="Rhyme Scheme Analysis">
      <div className="analyzer-header">
        <div className="analyzer-title">
          <TrendingUp size={20} aria-hidden="true" />
          <h3>Rhyme Scheme Analysis</h3>
        </div>
        <div className="analyzer-pattern">
          <span className="pattern-label">Pattern:</span>
          <span className="pattern-value">{analysis.pattern}</span>
        </div>
      </div>

      <div className="analyzer-scheme">
        <div className="scheme-visual" aria-label={`Rhyme scheme sequence: ${analysis.schemeString}`}>
          {analysis.scheme.map((letter, idx) => (
            <span
              key={idx}
              className={`scheme-letter ${letter === '-' ? 'none' : ''}`}
              data-letter={letter}
              aria-hidden="true"
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="scheme-string" aria-hidden="true">{analysis.schemeString}</div>
      </div>

      <div className="analyzer-lines">
        {analysis.lines.map((lineData, idx) => (
          <div key={idx} className="analyzed-line">
            <span 
              className={`line-scheme ${analysis.scheme[idx] === '-' ? 'none' : ''}`}
              aria-label={`Rhyme group ${analysis.scheme[idx]}`}
            >
              {analysis.scheme[idx]}
            </span>
            <div className="line-content">
              <span className="line-text">{lineData.line}</span>
              {lineData.lastWord && (
                <div className="line-meta">
                  <span className="line-word" aria-label="End word">{lineData.lastWord}</span>
                  <span className="line-syllables">{lineData.syllables} syllables</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}