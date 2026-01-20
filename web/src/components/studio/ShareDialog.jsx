import { useState } from 'react';
import { Share2, Copy, Check, Eye, Edit3, Link as LinkIcon } from 'lucide-react';
import './ShareDialog.css';

export function ShareDialog({ content, onClose, open = false }) {
  const [shareMode, setShareMode] = useState('view');
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const generateShareLink = () => {
    const data = {
      content,
      mode: shareMode,
      timestamp: Date.now()
    };
    
    const encoded = btoa(JSON.stringify(data));
    const url = `${window.location.origin}/studio/shared/${encoded}`;
    setShareLink(url);
  };

  const copyToClipboard = async () => {
    if (!shareLink) generateShareLink();
    
    try {
      await navigator.clipboard.writeText(shareLink || generateShareLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!open) return null;

  return (
    <div className="share-dialog-overlay" onClick={onClose}>
      <div className="share-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="share-header">
          <Share2 size={20} />
          <h3>Share Your Work</h3>
        </div>

        <div className="share-body">
          <div className="share-mode">
            <label>Access Level</label>
            <div className="mode-options">
              <button
                className={`mode-btn ${shareMode === 'view' ? 'active' : ''}`}
                onClick={() => setShareMode('view')}
              >
                <Eye size={16} />
                View Only
              </button>
              <button
                className={`mode-btn ${shareMode === 'edit' ? 'active' : ''}`}
                onClick={() => setShareMode('edit')}
              >
                <Edit3 size={16} />
                Can Edit
              </button>
            </div>
          </div>

          <div className="share-link-section">
            <label>Share Link</label>
            <div className="link-input-group">
              <input
                type="text"
                value={shareLink || 'Click Generate to create a link'}
                readOnly
                className="link-input"
              />
              <button className="copy-btn" onClick={copyToClipboard}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <button className="generate-btn" onClick={generateShareLink}>
            <LinkIcon size={16} />
            Generate Share Link
          </button>

          <div className="share-info">
            <p>
              {shareMode === 'view' 
                ? '🔒 Recipients can view but not edit your work'
                : '✏️ Recipients can view and make edits'}
            </p>
            <small>Links expire after 7 days</small>
          </div>
        </div>

        <div className="share-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
