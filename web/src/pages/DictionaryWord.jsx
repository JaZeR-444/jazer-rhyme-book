import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Pin, Sparkles, GitCompare, Copy, Check } from 'lucide-react';
import { usePageTitle } from '../lib/usePageTitle';
import { Breadcrumbs, BackButton, LoadingState, EmptyState, Card, MarkdownRenderer, FavoriteButton, Badge } from '../components/ui';
import { ContinueExploring } from '../components/dictionary/ContinueExploring';
import { SimilarWords } from '../components/dictionary/SimilarWords';
import { useDictionaryWord, useDictionaryIndex } from '../lib/hooks';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useBrowsingHistory } from '../contexts/BrowsingHistoryContext';
import { useState, useMemo, useEffect, useRef } from 'react';
import { findRhymes, getRhymeScheme } from '../lib/rhymeFinder';
import './DictionaryWord.css';

export function DictionaryWord() {
  const { letter, word } = useParams();
  const safeWord = String(word || '').toLowerCase();
  usePageTitle(safeWord);
  const navigate = useNavigate();

  const safeLetter = String(letter || '').toLowerCase();

  const { content, loading, error } = useDictionaryWord(safeLetter, safeWord);
  const { words: allWords } = useDictionaryIndex();

  const { isPinned, addItem, removeItem } = useWorkspace();
  const { addToHistory } = useBrowsingHistory();

  const [showRhymes, setShowRhymes] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyTimerRef = useRef(null);

  const wordName = useMemo(() => {
    if (!safeWord) return '';
    return safeWord.charAt(0).toUpperCase() + safeWord.slice(1);
  }, [safeWord]);

  const pinned = useMemo(() => {
    if (!safeWord) return false;
    return isPinned(safeWord, 'word');
  }, [safeWord, isPinned]);

  useEffect(() => {
    if (!safeWord || !safeLetter) return;
    if (loading || error) return;

    addToHistory(wordName, safeLetter.toUpperCase());
  }, [safeWord, safeLetter, wordName, loading, error, addToHistory]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const rhymeData = useMemo(() => {
    if (!showRhymes || !Array.isArray(allWords) || allWords.length === 0 || !wordName) return null;
    const wordList = allWords.map((w) => w.name).filter(Boolean);
    return findRhymes(wordName, wordList, { maxResults: 30 });
  }, [showRhymes, wordName, allWords]);

  const wordScheme = useMemo(() => {
    if (!wordName) return { syllables: 0, perfect: '' };
    return getRhymeScheme(wordName);
  }, [wordName]);

  const handlePin = () => {
    if (!safeWord) return;

    if (pinned) {
      removeItem(safeWord, 'word');
      return;
    }

    addItem({
      id: safeWord,
      type: 'word',
      title: wordName,
      subtitle: `Letter ${safeLetter.toUpperCase()}`,
      link: `/dictionary/${safeLetter}/${safeWord}`
    });
  };

  const handleCopyRhymes = async () => {
    if (!rhymeData || !wordName) return;

    const rhymeText = [
      `Rhymes for "${wordName}":`,
      '',
      rhymeData.perfect?.length ? `Perfect Rhymes (${rhymeData.perfect.length}):` : null,
      rhymeData.perfect?.length ? rhymeData.perfect.map((r) => `- ${r.word} (${r.syllables} syllables)`).join('\n') : null,
      '',
      rhymeData.near?.length ? `Near Rhymes (${rhymeData.near.length}):` : null,
      rhymeData.near?.length ? rhymeData.near.map((r) => `- ${r.word} (${r.syllables} syllables)`).join('\n') : null,
      '',
      rhymeData.assonance?.length ? `Assonance (${rhymeData.assonance.length}):` : null,
      rhymeData.assonance?.length ? rhymeData.assonance.map((r) => `- ${r.word} (${r.syllables} syllables)`).join('\n') : null
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(rhymeText);
      setCopySuccess(true);

      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // silent fail (clipboard permissions vary by browser)
      setCopySuccess(false);
    }
  };

  if (loading) return <LoadingState message={`Loading ${wordName || 'word'}...`} />;

  if (error || !content || !safeWord || !safeLetter) {
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
    <div className="dictionary-word" role="main" aria-label={`Dictionary - ${wordName} definition and details`}>
      <div className="dictionary-word__header">
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Dictionary', path: '/dictionary' },
            { label: `Letter ${safeLetter.toUpperCase()}`, path: `/dictionary/${safeLetter.toUpperCase()}` },
            { label: wordName, path: `/dictionary/${safeLetter}/${safeWord}` }
          ]}
        />

        <div className="dictionary-word__title-row">
          <BackButton to={`/dictionary/${safeLetter.toUpperCase()}`} label="Back to Letter" />

          <div className="dictionary-word__title-group">
            <h1 className="dictionary-word__title">{wordName}</h1>

            <div className="dictionary-word__actions">
              <FavoriteButton word={safeWord} letter={safeLetter} size={28} showLabel />

              <button
                type="button"
                className={`word-pin-btn ${pinned ? 'is-pinned' : ''}`}
                onClick={handlePin}
                title={pinned ? 'Remove from Verse Board' : 'Pin to Verse Board'}
                aria-label={pinned ? 'Unpin word' : 'Pin word'}
              >
                <Pin size={20} fill={pinned ? 'currentColor' : 'none'} aria-hidden="true" />
              </button>

              <button
                type="button"
                className="word-compare-btn"
                onClick={() => navigate('/dictionary/compare')}
                title="Compare with another word"
                aria-label="Compare word"
              >
                <GitCompare size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Card className="dictionary-word__content">
        <MarkdownRenderer content={content} />
      </Card>

      <Card className="dictionary-word__rhyme-card">
        <div className="rhyme-card__header">
          <h2 className="rhyme-card__title">
            <Sparkles size={20} aria-hidden="true" />
            Rhyme Analysis
          </h2>

          <div className="rhyme-card__actions">
            <button
              type="button"
              className="rhyme-toggle-btn"
              onClick={() => setShowRhymes((v) => !v)}
              aria-expanded={showRhymes ? 'true' : 'false'}
            >
              {showRhymes ? 'Hide' : 'Find'} Rhymes
            </button>

            {showRhymes && rhymeData && (
              <button
                type="button"
                className="rhyme-copy-btn"
                onClick={handleCopyRhymes}
                title="Copy all rhymes to clipboard"
                aria-label="Copy rhymes"
              >
                {copySuccess ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
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
            {rhymeData.perfect?.length > 0 && (
              <div className="rhyme-section">
                <h3 className="rhyme-section-title">Perfect Rhymes ({rhymeData.perfect.length})</h3>
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

            {rhymeData.near?.length > 0 && (
              <div className="rhyme-section">
                <h3 className="rhyme-section-title">Near Rhymes ({rhymeData.near.length})</h3>
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

            {rhymeData.assonance?.length > 0 && (
              <div className="rhyme-section">
                <h3 className="rhyme-section-title">Assonance ({rhymeData.assonance.length})</h3>
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

            {(!rhymeData.perfect?.length && !rhymeData.near?.length) && (
              <p className="no-rhymes">No rhymes found for "{wordName}"</p>
            )}
          </div>
        )}
      </Card>

      <SimilarWords currentWord={{ name: wordName, syllables: wordScheme.syllables, letter: safeLetter.toUpperCase() }} />
      <ContinueExploring currentWord={wordName} currentLetter={safeLetter.toUpperCase()} />
    </div>
  );
}

export default DictionaryWord;
