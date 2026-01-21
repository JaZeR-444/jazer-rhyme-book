import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, RefreshCw, X, Eye, Tag, Shuffle } from 'lucide-react';
import { useBrowsingHistory } from '../../contexts/BrowsingHistoryContext';
import { useDictionaryIndex } from '../../lib/hooks';
import { findRhymes } from '../../lib/rhymeFinder';
import './ContextualSuggestions.css';

function SuggestionCard({ word, reason }) {
  return (
    <Link
      to={`/dictionary/${word.letter}/${word.name.toLowerCase()}`}
      className="suggestion-card glass"
    >
      <span className="suggestion-card__letter">{word.letter}</span>
      <div className="suggestion-card__content">
        <span className="suggestion-card__name">{word.name}</span>
        {word.d && (
          <span className="suggestion-card__preview">
            {word.d.length > 40 ? word.d.substring(0, 40) + '...' : word.d}
          </span>
        )}
      </div>
      <span className="suggestion-card__reason">{reason}</span>
    </Link>
  );
}

export function ContextualSuggestions({ limit = 6 }) {
  const { history, isLoaded: historyLoaded } = useBrowsingHistory();
  const { words: allWords, loading: wordsLoading } = useDictionaryIndex();

  const suggestions = useMemo(() => {
    if (!historyLoaded || wordsLoading || !allWords.length) {
      return [];
    }

    if (history.length === 0) {
      return [];
    }

    const historyWords = history.map(h => h.word.toLowerCase());
    const viewedWordData = allWords.filter(w => historyWords.includes(w.name.toLowerCase()));
    const viewedTags = new Set();
    const viewedRhymes = new Set();

    // Collect tags and rhymes from viewed words
    viewedWordData.forEach(word => {
      (word.t || []).forEach(tag => viewedTags.add(tag.toLowerCase()));
    });

    // Get rhymes for viewed words
    viewedWordData.forEach(word => {
      const rhymeData = findRhymes(word.name, allWords.map(w => w.name), { maxResults: 10 });
      if (rhymeData && rhymeData.perfect) {
        rhymeData.perfect.forEach(r => viewedRhymes.add(r.word.toLowerCase()));
      }
    });

    // Score each word
    const scoredWords = allWords
      .filter(w => !historyWords.includes(w.name.toLowerCase())) // Exclude viewed
      .map(word => {
        let score = 0;
        let reasons = [];

        // Tag matching
        const wordTags = (word.t || []).map(t => t.toLowerCase());
        const matchingTags = wordTags.filter(t => viewedTags.has(t));
        if (matchingTags.length > 0) {
          score += matchingTags.length * 10;
          reasons.push({ type: 'tag', score: matchingTags.length });
        }

        // Rhyme matching
        if (viewedRhymes.has(word.name.toLowerCase())) {
          score += 15;
          reasons.push({ type: 'rhyme', score: 1 });
        }

        // Letter proximity (suggest nearby letters)
        const viewedLetters = [...new Set(viewedWordData.map(w => w.letter))];
        if (viewedLetters.includes(word.letter)) {
          score += 5;
          reasons.push({ type: 'letter', score: 1 });
        }

        return { word, score, reasons: reasons.slice(0, 2) };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scoredWords;
  }, [history, allWords, historyLoaded, wordsLoading, limit]);

  const getReasonLabel = (reasons) => {
    if (reasons.length === 0) return 'Suggested';
    if (reasons[0].type === 'tag') {
      return `${reasons[0].score} matching tag${reasons[0].score > 1 ? 's' : ''}`;
    }
    if (reasons[0].type === 'rhyme') return 'Rhymes with viewed';
    if (reasons[0].type === 'letter') return `From ${reasons[0].score} viewed letter${reasons[0].score > 1 ? 's' : ''}`;
    return 'Suggested';
  };

  if (!historyLoaded || wordsLoading) {
    return null;
  }

  if (history.length === 0) {
    return null;
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <section className="contextual-suggestions">
      <div className="contextual-suggestions__header">
        <div className="contextual-suggestions__title-wrapper">
          <Lightbulb size={20} className="contextual-suggestions__icon" />
          <h3 className="contextual-suggestions__title">Suggested for You</h3>
        </div>
        <span className="contextual-suggestions__based-on">
          Based on your browsing history
        </span>
      </div>

      <div className="contextual-suggestions__grid">
        {suggestions.map(({ word, reasons }, idx) => (
          <SuggestionCard
            key={`${word.name}-${idx}`}
            word={word}
            reason={getReasonLabel(reasons)}
          />
        ))}
      </div>
    </section>
  );
}

export function SuggestionsWidget({ compact = false }) {
  const { history, isLoaded: historyLoaded } = useBrowsingHistory();
  const { words: allWords, loading: wordsLoading } = useDictionaryIndex();

  const topSuggestion = useMemo(() => {
    if (!historyLoaded || wordsLoading || !allWords.length || history.length === 0) {
      return null;
    }

    const historyWords = history.map(h => h.word.toLowerCase());
    const viewedWordData = allWords.filter(w => historyWords.includes(w.name.toLowerCase()));
    const viewedTags = new Set();

    viewedWordData.forEach(word => {
      (word.t || []).forEach(tag => viewedTags.add(tag.toLowerCase()));
    });

    const scoredWords = allWords
      .filter(w => !historyWords.includes(w.name.toLowerCase()))
      .map(word => {
        const wordTags = (word.t || []).map(t => t.toLowerCase());
        const matchingTags = wordTags.filter(t => viewedTags.has(t));
        return { word, score: matchingTags.length };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 1);

    return scoredWords[0] || null;
  }, [history, allWords, historyLoaded, wordsLoading]);

  if (!historyLoaded || wordsLoading) {
    return null;
  }

  if (history.length === 0 || !topSuggestion) {
    return null;
  }

  if (compact) {
    return (
      <Link
        to={`/dictionary/${topSuggestion.word.letter}/${topSuggestion.word.name.toLowerCase()}`}
        className="suggestions-widget suggestions-widget--compact glass"
      >
        <Lightbulb size={16} />
        <span>Try: <strong>{topSuggestion.word.name}</strong></span>
      </Link>
    );
  }

  return (
    <div className="suggestions-widget glass">
      <div className="suggestions-widget__header">
        <Lightbulb size={18} />
        <span>Recommended</span>
      </div>
      <Link
        to={`/dictionary/${topSuggestion.word.letter}/${topSuggestion.word.name.toLowerCase()}`}
        className="suggestions-widget__link"
      >
        <span className="suggestions-widget__letter">{topSuggestion.word.letter}</span>
        <span className="suggestions-widget__name">{topSuggestion.word.name}</span>
      </Link>
      <p className="suggestions-widget__preview">
        {topSuggestion.word.d?.substring(0, 60)}...
      </p>
    </div>
  );
}
