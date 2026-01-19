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
        return { line, lastWord: '', scheme: null, syllables: 0 };
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
    let currentScheme = 'A';
    const scheme = analyzedLines.map((lineData, idx) => {
      if (!lineData.phonetic) return '-';

      // Check if this phonetic pattern already exists
      const existingScheme = Object.keys(schemeMap).find(
        key => schemeMap[key] === lineData.phonetic
      );

      if (existingScheme) {
        return existingScheme;
      } else {
        schemeMap[currentScheme] = lineData.phonetic;
        const assigned = currentScheme;
        currentScheme = String.fromCharCode(currentScheme.charCodeAt(0) + 1);
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
        <Sparkles size={24} className="text-accent-secondary" />
        <p className="analyzer-hint">Write at least 2 lines to see rhyme scheme analysis</p>
      </Card>
    );
  }

  return (
    <Card className="rhyme-scheme-analyzer">
      <div className="analyzer-header">
        <div className="analyzer-title">
          <TrendingUp size={20} />
          <h3>Rhyme Scheme Analysis</h3>
        </div>
        <div className="analyzer-pattern">
          <span className="pattern-label">Pattern:</span>
          <span className="pattern-value">{analysis.pattern}</span>
        </div>
      </div>

      <div className="analyzer-scheme">
        <div className="scheme-visual">
          {analysis.scheme.map((letter, idx) => (
            <span
              key={idx}
              className={`scheme-letter ${letter === '-' ? 'none' : ''}`}
              data-letter={letter}
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="scheme-string">{analysis.schemeString}</div>
      </div>

      <div className="analyzer-lines">
        {analysis.lines.map((lineData, idx) => (
          <div key={idx} className="analyzed-line">
            <span className={`line-scheme ${analysis.scheme[idx] === '-' ? 'none' : ''}`}>
              {analysis.scheme[idx]}
            </span>
            <div className="line-content">
              <span className="line-text">{lineData.line}</span>
              {lineData.lastWord && (
                <span className="line-meta">
                  <span className="line-word">{lineData.lastWord}</span>
                  <span className="line-syllables">{lineData.syllables} syl</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
