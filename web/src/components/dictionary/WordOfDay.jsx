import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, RefreshCw, Bookmark, ArrowRight } from 'lucide-react';
import { useDictionaryIndex } from '../../lib/hooks';
import { Card } from '../ui';
import './WordOfDay.css';

export function WordOfDay() {
  const { words, loading, error } = useDictionaryIndex();
  const [wordOfDay, setWordOfDay] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Get word of day based on date
  const wordOfDayData = useMemo(() => {
    if (!words || words.length === 0) return null;

    const today = new Date();
    const seed = today.getFullYear() * 1000 + today.getMonth() * 100 + today.getDate();
    const pseudoRandom = (seed * 9301 + 49297) % 233280;
    const randomIndex = Math.floor((pseudoRandom / 233280) * words.length);

    return words[randomIndex];
  }, [words]);

  // Generate random word
  const getRandomWord = () => {
    if (!words || words.length === 0) return;

    setIsAnimating(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * words.length);
      setWordOfDay(words[randomIndex]);
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    if (wordOfDayData) {
      setWordOfDay(wordOfDayData);
    }
  }, [wordOfDayData]);

  if (loading) {
    return (
      <Card className="word-of-day word-of-day--loading">
        <div className="word-of-day__content">
          <Sparkles size={24} className="word-of-day__icon spinning" />
          <span>Loading word of the day...</span>
        </div>
      </Card>
    );
  }

  if (error || !wordOfDay) {
    return null;
  }

  return (
    <Card className={`word-of-day ${isAnimating ? 'word-of-day--animating' : ''}`}>
      <div className="word-of-day__badge">
        <Sparkles size={14} />
        <span>Word of the Day</span>
      </div>

      <div className="word-of-day__content">
        <div className="word-of-day__letter">{wordOfDay.letter}</div>
        <div className="word-of-day__info">
          <h3 className="word-of-day__name">{wordOfDay.name}</h3>
          {wordOfDay.d && (
            <p className="word-of-day__definition">
              {wordOfDay.d.length > 100
                ? wordOfDay.d.substring(0, 100) + '...'
                : wordOfDay.d}
            </p>
          )}
        </div>
      </div>

      <div className="word-of-day__actions">
        <Link
          to={`/dictionary/${wordOfDay.letter}/${wordOfDay.name.toLowerCase()}`}
          className="word-of-day__read-btn"
        >
          Read Entry
          <ArrowRight size={16} />
        </Link>
        <button
          className="word-of-day__random-btn"
          onClick={getRandomWord}
          title="Get a random word"
        >
          <RefreshCw size={16} className={isAnimating ? 'spinning' : ''} />
        </button>
      </div>
    </Card>
  );
}

export function RandomDiscovery() {
  const { words, loading } = useDictionaryIndex();
  const [randomWord, setRandomWord] = useState(null);

  const getRandomWord = () => {
    if (!words || words.length === 0) return;
    const randomIndex = Math.floor(Math.random() * words.length);
    setRandomWord(words[randomIndex]);
  };

  if (loading) {
    return null;
  }

  return (
    <button
      className="random-discovery-btn"
      onClick={getRandomWord}
      disabled={!words || words.length === 0}
    >
      <Sparkles size={18} />
      <span>Random Discovery</span>
    </button>
  );
}
