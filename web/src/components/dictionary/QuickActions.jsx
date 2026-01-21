/**
 * QuickActions Component
 * Action buttons overlay for word cards
 */
import { useState } from 'react';
import { Copy, Heart, Pin, Share2, Zap, Check } from 'lucide-react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import './QuickActions.css';

export function QuickActions({
  word,
  letter,
  onRhymePreview
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToWorkspace } = useWorkspace();
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const favorite = isFavorite(word, letter);

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();

    navigator.clipboard.writeText(word).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(word, letter);
  };

  const handlePin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToWorkspace({
      type: 'word',
      name: word,
      letter: letter,
      url: `/dictionary/${letter}/${word.toLowerCase()}`
    });
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/#/dictionary/${letter}/${word.toLowerCase()}`;
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  const handleRhymePreview = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRhymePreview?.();
  };

  return (
    <div className="quick-actions">
      <button
        className="quick-actions__btn"
        onClick={handleCopy}
        title="Copy word"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>

      <button
        className={`quick-actions__btn ${favorite ? 'active' : ''}`}
        onClick={handleFavorite}
        title={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart size={14} fill={favorite ? 'currentColor' : 'none'} />
      </button>

      <button
        className="quick-actions__btn"
        onClick={handlePin}
        title="Pin to workspace"
      >
        <Pin size={14} />
      </button>

      <button
        className="quick-actions__btn"
        onClick={handleShare}
        title="Copy link"
      >
        {linkCopied ? <Check size={14} /> : <Share2 size={14} />}
      </button>

      {onRhymePreview && (
        <button
          className="quick-actions__btn"
          onClick={handleRhymePreview}
          title="Preview rhymes"
        >
          <Zap size={14} />
        </button>
      )}
    </div>
  );
}
