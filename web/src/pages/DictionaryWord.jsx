import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Pin } from 'lucide-react';
import { Breadcrumbs, LoadingState, EmptyState, Card, MarkdownRenderer, FavoriteButton } from '../components/ui';
import { useDictionaryWord } from '../lib/hooks';
import { useWorkspace } from '../lib/WorkspaceContext';
import './DictionaryWord.css';

export function DictionaryWord() {
  const { letter, word } = useParams();
  const { content, loading, error } = useDictionaryWord(letter, word);
  const { isPinned, addItem, removeItem } = useWorkspace();

  const wordName = word.charAt(0).toUpperCase() + word.slice(1);
  const pinned = isPinned(word, 'word');

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
            </div>
          </div>
        </div>
      </div>

      <Card className="dictionary-word__content">
        <MarkdownRenderer content={content} />
      </Card>
    </div>
  );
}
