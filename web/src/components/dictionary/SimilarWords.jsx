import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '../ui';
import { useSearchIndex } from '../../lib/hooks';
import { getRhymeScheme } from '../../lib/rhymeFinder';
import { getSimilarWords } from '../../lib/recommendationEngine';
import './SimilarWords.css';

export function SimilarWords({ currentWord }) {
  const { searchIndex } = useSearchIndex();
  const [similarWords, setSimilarWords] = useState([]);

  useEffect(() => {
    if (!currentWord || !searchIndex || !searchIndex.words) {
      return;
    }

    // Find the current word in the index
    const wordData = searchIndex.words.find(w => w.name === currentWord.name);
    if (!wordData) {
      return;
    }

    // Get rhyme data function
    const getRhymeData = (wordName) => {
      return getRhymeScheme(wordName);
    };

    // Get similar words
    const similar = getSimilarWords(wordData, searchIndex.words, getRhymeData, 8);

    setSimilarWords(similar);
  }, [currentWord, searchIndex]);

  if (similarWords.length === 0) {
    return null;
  }

  return (
    <div className="similar-words">
      <div className="similar-words__header">
        <div className="similar-words__title">
          <Sparkles size={20} />
          <h3>Similar Words</h3>
        </div>
        <p className="similar-words__subtitle">
          Words with similar sounds, syllables, or meanings
        </p>
      </div>

      <div className="similar-words__grid">
        {similarWords.map(word => (
          <Link
            key={word.name}
            to={`/dictionary/${word.letter}/${word.name}`}
            className="similar-word-card"
          >
            <Card className="similar-word-card__content" hover>
              <div className="similar-word-card__header">
                <h4 className="similar-word-name">{word.name}</h4>
                <ArrowRight size={16} className="similar-word-icon" />
              </div>

              {word.syllables && (
                <div className="similar-word-meta">
                  <span className="similar-word-syllables">
                    {word.syllables} {word.syllables === 1 ? 'syllable' : 'syllables'}
                  </span>
                  {currentWord.syllables === word.syllables && (
                    <span className="similar-word-badge">Same count</span>
                  )}
                </div>
              )}

              {word.rd && (
                <p className="similar-word-definition">
                  {word.rd.length > 80 ? word.rd.substring(0, 80) + '...' : word.rd}
                </p>
              )}

              {!word.rd && word.d && (
                <p className="similar-word-definition">
                  {word.d.length > 80 ? word.d.substring(0, 80) + '...' : word.d}
                </p>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
