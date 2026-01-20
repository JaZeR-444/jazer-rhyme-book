import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Pin, Sparkles, GitCompare, Copy, Check } from 'lucide-react';
import { Breadcrumbs, LoadingState, EmptyState, Card, MarkdownRenderer, FavoriteButton, Badge } from '../components/ui';
import { ContinueExploring } from '../components/dictionary/ContinueExploring';
import { SimilarWords } from '../components/dictionary/SimilarWords';
import { useDictionaryWord, useDictionaryIndex } from '../lib/hooks';
import { useWorkspace } from '../lib/WorkspaceContext';
import { useBrowsingHistory } from '../lib/BrowsingHistoryContext';
import { useState, useMemo, useEffect } from 'react';
import { findRhymes, getRhymeScheme } from '../lib/rhymeFinder';
import './DictionaryWord.css';

export function DictionaryWord() {
  const { letter, word } = useParams();
  const navigate = useNavigate();
  const { content, loading, error } = useDictionaryWord(letter, word);
  const { words: allWords } = useDictionaryIndex();
  const { isPinned, addItem, removeItem } = useWorkspace();
  const { addToHistory } = useBrowsingHistory();
  const [showRhymes, setShowRhymes] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const wordName = word.charAt(0).toUpperCase() + word.slice(1);
  const pinned = isPinned(word, 'word');

  // Track browsing history
  useEffect(() => {
    if (word && letter && !loading && !error) {
      addToHistory(wordName, letter.toUpperCase());
    }
  }, [word, letter, wordName, loading, error, addToHistory]);

  // Calculate rhymes
  const rhymeData = useMemo(() => {
    if (!showRhymes || !allWords.length) return null;
    const wordList = allWords.map(w => w.name);
    return findRhymes(wordName, wordList, { maxResults: 30 });
  }, [showRhymes, wordName, allWords]);

  const wordScheme = useMemo(() => getRhymeScheme(wordName), [wordName]);

  const handlePin = () => {
    if (pinned) {
      removeItem(word, 'word');
    } else {
      addItem({
        id: word,
        type: 'word',
        title: wordName,
        subtitle: `Letter ${letter}`,
        link: `/dictionary/${letter}/${word}`
      });
    }
  };

  const handleCopyRhymes = async () => {
    if (!rhymeData) return;

    const rhymeText = [
      `Rhymes for "${wordName}":`,
      '',
      rhymeData.perfect.length > 0 && `Perfect Rhymes (${rhymeData.perfect.length}):`,
      rhymeData.perfect.length > 0 && rhymeData.perfect.map(r => `- ${r.word} (${r.syllables} syllables)`).join('\n'),
      '',
      rhymeData.near.length > 0 && `Near Rhymes (${rhymeData.near.length}):`,
      rhymeData.near.length > 0 && rhymeData.near.map(r => `- ${r.word} (${r.syllables} syllables)`).join('\n'),
      '',
      rhymeData.assonance.length > 0 && `Assonance (${rhymeData.assonance.length}):`,
      rhymeData.assonance.length > 0 && rhymeData.assonance.map(r => `- ${r.word} (${r.syllables} syllables)`).join('\n'),
    ].filter(Boolean).join('\n');

    try {
      await navigator.clipboard.writeText(rhymeText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy rhymes:', err);
    }
  };

  if (loading) {
    return <LoadingState message={`Loading ${wordName}...`} />;
  }

  if (error || !content) {
    return (
      <div className="dictionary-word">
        <EmptyState
          icon={<BookOpen size={48} />}
          title="Word Not Found"
          description="The word you're looking for doesn't exist or couldn't be loaded."
          action={() => window.history.back()}
          actionLabel="Go Back"
        />
      </div>
    );
  }

  return (
    <div className="dictionary-word">
      <div className="dictionary-word__header">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Dictionary', path: '/dictionary' },
          { label: `Letter ${letter}`, path: `/dictionary/${letter}` },
          { label: wordName, path: `/dictionary/${letter}/${word}` }
        ]} />

        <div className="dictionary-word__title-row">
          <Link to={`/dictionary/${letter}`} className="dictionary-word__back">
            <ArrowLeft size={24} />
          </Link>
          <div className="dictionary-word__title-group">
            <h1 className="dictionary-word__title">{wordName}</h1>
            <div className="dictionary-word__actions">
              <FavoriteButton word={word} letter={letter} size={28} showLabel />
              <button
                className={`word-pin-btn ${pinned ? 'is-pinned' : ''}`}
                onClick={handlePin}
                title={pinned ? "Remove from Verse Board" : "Pin to Verse Board"}
              >
                <Pin size={20} fill={pinned ? "currentColor" : "none"} />
              </button>
              <button
                className="word-compare-btn"
                onClick={() => navigate('/dictionary/compare')}
                title="Compare with another word"
              >
                <GitCompare size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Card className="dictionary-word__content">
        <MarkdownRenderer content={content} />
      </Card>

      {/* Rhyme Analysis Card */}
      <Card className="dictionary-word__rhyme-card">
        <div className="rhyme-card__header">
          <h2 className="rhyme-card__title">
            <Sparkles size={20} />
            Rhyme Analysis
          </h2>
          <div className="rhyme-card__actions">
            <button
              className="rhyme-toggle-btn"
              onClick={() => setShowRhymes(!showRhymes)}
            >
              {showRhymes ? 'Hide' : 'Find'} Rhymes
            </button>
            {showRhymes && rhymeData && (
              <button
                className="rhyme-copy-btn"
                onClick={handleCopyRhymes}
                title="Copy all rhymes to clipboard"
              >
                {copySuccess ? <Check size={16} /> : <Copy size={16} />}
                {copySuccess ? 'Copied!' : 'Copy All'}
              </button>
            )}
          </div>
        </div>

        <div className="rhyme-card__info">
          <div className="rhyme-info-item">
            <span className="rhyme-label">Syllables:</span>
            <Badge variant="primary">{wordScheme.syllables}</Badge>
          </div>
          <div className="rhyme-info-item">
            <span className="rhyme-label">Phonetic:</span>
            <Badge variant="secondary">{wordScheme.perfect}</Badge>
          </div>
        </div>

        {showRhymes && rhymeData && (
          <div className="rhyme-results">
            {rhymeData.perfect.length > 0 && (
              <div className="rhyme-section">
                <h3 className="rhyme-section-title">
                  Perfect Rhymes ({rhymeData.perfect.length})
                </h3>
                <div className="rhyme-chips">
                  {rhymeData.perfect.map((r, idx) => (
                    <Link
                      key={idx}
                      to={`/dictionary/${r.word.charAt(0).toLowerCase()}/${r.word.toLowerCase()}`}
                      className="rhyme-chip perfect"
                    >
                      {r.word}
                      <span className="rhyme-syllables">{r.syllables}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {rhymeData.near.length > 0 && (
              <div className="rhyme-section">
                <h3 className="rhyme-section-title">
                  Near Rhymes ({rhymeData.near.length})
                </h3>
                <div className="rhyme-chips">
                  {rhymeData.near.map((r, idx) => (
                    <Link
                      key={idx}
                      to={`/dictionary/${r.word.charAt(0).toLowerCase()}/${r.word.toLowerCase()}`}
                      className="rhyme-chip near"
                    >
                      {r.word}
                      <span className="rhyme-syllables">{r.syllables}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {rhymeData.assonance.length > 0 && (
              <div className="rhyme-section">
                <h3 className="rhyme-section-title">
                  Assonance ({rhymeData.assonance.length})
                </h3>
                <div className="rhyme-chips">
                  {rhymeData.assonance.map((r, idx) => (
                    <Link
                      key={idx}
                      to={`/dictionary/${r.word.charAt(0).toLowerCase()}/${r.word.toLowerCase()}`}
                      className="rhyme-chip assonance"
                    >
                      {r.word}
                      <span className="rhyme-syllables">{r.syllables}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {rhymeData.perfect.length === 0 && rhymeData.near.length === 0 && (
              <p className="no-rhymes">No rhymes found for "{wordName}"</p>
            )}
          </div>
        )}
      </Card>

      <SimilarWords currentWord={{ name: wordName, syllables: wordScheme.syllables, letter: letter.toUpperCase() }} />

      <ContinueExploring currentWord={wordName} currentLetter={letter.toUpperCase()} />
    </div>
  );
}


export default DictionaryWord;
