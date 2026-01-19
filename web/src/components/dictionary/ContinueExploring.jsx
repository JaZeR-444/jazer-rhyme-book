import { Link } from 'react-router-dom';
import { Tag, Shuffle, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { useMemo } from 'react';
import { useDictionaryIndex } from '../../lib/hooks';
import { findRhymes } from '../../lib/rhymeFinder';
import './ContinueExploring.css';

function ContinueExploringSection({ title, icon: Icon, items, emptyMessage }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="continue-section">
      <div className="continue-section__header">
        <Icon size={18} className="continue-section__icon" />
        <h3 className="continue-section__title">{title}</h3>
      </div>
      <div className="continue-section__grid">
        {items.map((item, idx) => (
          <Link
            key={`${item.name}-${idx}`}
            to={`/dictionary/${item.letter}/${item.name.toLowerCase()}`}
            className="continue-card glass"
          >
            <span className="continue-card__letter">{item.letter}</span>
            <span className="continue-card__name">{item.name}</span>
            <ArrowRight size={14} className="continue-card__arrow" />
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ContinueExploring({ currentWord, currentLetter }) {
  const { words: allWords, loading } = useDictionaryIndex();

  const suggestions = useMemo(() => {
    if (loading || !allWords.length || !currentWord) {
      return { sameTags: [], rhymes: [], nextInLetter: [] };
    }

    const currentName = currentWord.toLowerCase();
    const otherWords = allWords.filter(w => w.name.toLowerCase() !== currentName);
    const suggestions = {
      sameTags: [],
      rhymes: [],
      nextInLetter: []
    };

    // Find words with same tags
    const currentWordData = allWords.find(w => w.name.toLowerCase() === currentName);
    const currentTags = currentWordData?.t || [];

    if (currentTags.length > 0) {
      const tagScores = {};
      otherWords.forEach(word => {
        const wordTags = word.t || [];
        const commonTags = wordTags.filter(t => currentTags.includes(t));
        if (commonTags.length > 0) {
          tagScores[word.name] = {
            word,
            score: commonTags.length,
            commonTags
          };
        }
      });

      suggestions.sameTags = Object.values(tagScores)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(s => s.word);
    }

    // Find perfect rhymes (limited to 5)
    const rhymeData = findRhymes(currentName, allWords.map(w => w.name), { maxResults: 20 });
    if (rhymeData && rhymeData.perfect) {
      suggestions.rhymes = rhymeData.perfect.slice(0, 5).map(r => {
        const wordData = allWords.find(w => w.name.toLowerCase() === r.word.toLowerCase());
        return wordData || { name: r.word, letter: r.word.charAt(0).toUpperCase() };
      });
    }

    // Find next 5 words in same letter (alphabetically after current)
    const sameLetterWords = otherWords
      .filter(w => w.letter === currentLetter)
      .sort((a, b) => a.name.localeCompare(b.name));

    const currentIndex = sameLetterWords.findIndex(
      w => w.name.toLowerCase() === currentName
    );

    if (currentIndex >= 0) {
      suggestions.nextInLetter = sameLetterWords
        .slice(currentIndex + 1, currentIndex + 6)
        .slice(0, 5);
    } else {
      suggestions.nextInLetter = sameLetterWords.slice(0, 5);
    }

    return suggestions;
  }, [currentWord, currentLetter, allWords, loading]);

  if (loading) {
    return (
      <section className="continue-exploring">
        <div className="continue-exploring__loading">
          <Zap size={20} className="spinning" />
          <span>Finding suggestions...</span>
        </div>
      </section>
    );
  }

  const hasSuggestions = suggestions.sameTags.length > 0 ||
                         suggestions.rhymes.length > 0 ||
                         suggestions.nextInLetter.length > 0;

  if (!hasSuggestions) {
    return null;
  }

  return (
    <section className="continue-exploring">
      <div className="continue-exploring__header">
        <Sparkles size={20} className="continue-exploring__icon" />
        <h2 className="continue-exploring__title">Continue Exploring</h2>
      </div>

      <div className="continue-exploring__content">
        <ContinueExploringSection
          title="More with Same Tags"
          icon={Tag}
          items={suggestions.sameTags}
          emptyMessage="No other words with matching tags"
        />

        <ContinueExploringSection
          title="Perfect Rhymes"
          icon={Shuffle}
          items={suggestions.rhymes}
          emptyMessage="No rhymes found"
        />

        <ContinueExploringSection
          title="Next in Letter"
          icon={ArrowRight}
          items={suggestions.nextInLetter}
          emptyMessage="No more words in this letter"
        />
      </div>
    </section>
  );
}
