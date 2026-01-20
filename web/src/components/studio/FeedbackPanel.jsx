import { useState } from 'react';
import { MessageSquare, ThumbsUp, Heart, Smile, Send, X } from 'lucide-react';
import './FeedbackPanel.css';

const EMOJI_REACTIONS = ['👍', '🔥', '❤️', '💯', '🎵', '✨'];

export function FeedbackPanel({ enabled = true, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [reactions, setReactions] = useState({});

  const addComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      text: newComment,
      author: 'You',
      timestamp: new Date().toISOString(),
      line: null
    };
    
    setComments([...comments, comment]);
    setNewComment('');
  };

  const deleteComment = (id) => {
    setComments(comments.filter(c => c.id !== id));
  };

  const addReaction = (emoji) => {
    setReactions(prev => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1
    }));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    
    return date.toLocaleDateString();
  };

  if (!enabled) return null;

  return (
    <div className="feedback-panel">
      <div className="feedback-header">
        <MessageSquare size={18} />
        <h3>Feedback</h3>
        <button className="close-btn" onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div className="reactions-section">
        <div className="reactions-label">Quick Reactions</div>
        <div className="reactions-grid">
          {EMOJI_REACTIONS.map(emoji => (
            <button
              key={emoji}
              className="reaction-btn"
              onClick={() => addReaction(emoji)}
            >
              {emoji}
              {reactions[emoji] > 0 && (
                <span className="reaction-count">{reactions[emoji]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="comments-section">
        <div className="comments-header">Comments ({comments.length})</div>
        <div className="comments-list">
          {comments.length === 0 ? (
            <div className="empty-comments">
              <MessageSquare size={32} opacity={0.3} />
              <p>No comments yet</p>
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-time">{formatTimestamp(comment.timestamp)}</span>
                </div>
                <div className="comment-text">{comment.text}</div>
                <div className="comment-actions">
                  <button
                    className="comment-action"
                    onClick={() => deleteComment(comment.id)}
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="comment-input-section">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment or suggestion..."
          className="comment-input"
          rows={3}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              addComment();
            }
          }}
        />
        <button
          className="send-comment-btn"
          onClick={addComment}
          disabled={!newComment.trim()}
        >
          <Send size={16} />
          Send
        </button>
      </div>
    </div>
  );
}
