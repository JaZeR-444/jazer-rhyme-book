import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Breadcrumbs, LoadingState, EmptyState, Card, MarkdownRenderer } from '../components/ui';
import { useDictionaryWord } from '../lib/hooks';
import './DictionaryWord.css';

export function DictionaryWord() {
  const { letter, word } = useParams();
  const { content, loading, error } = useDictionaryWord(letter, word);

  const wordName = word.charAt(0).toUpperCase() + word.slice(1);

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
          <h1 className="dictionary-word__title">{wordName}</h1>
        </div>
      </div>

      <Card className="dictionary-word__content">
        <MarkdownRenderer content={content} />
      </Card>
    </div>
  );
}
