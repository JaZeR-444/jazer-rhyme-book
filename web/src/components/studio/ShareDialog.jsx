import { useState } from 'react';
import PropTypes from 'prop-types';
import { Share2, Copy, Check, Eye, Edit3, Link as LinkIcon, X } from 'lucide-react';
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
    
    // Safer than btoa for complex strings, using URI encoding
    const encoded = encodeURIComponent(JSON.stringify(data));
    const url = `${window.location.origin}/studio/shared?data=${encoded}`;
    setShareLink(url);
    return url;
  };

  const copyToClipboard = async () => {
    const link = shareLink || generateShareLink();
    
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!open) return null;

  return (
    <div className="share-dialog-overlay" onClick={onClose} role="presentation">
      <div 
        className="share-dialog" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-title"
      >
        <div className="share-header">
          <Share2 size={20} aria-hidden="true" />
          <h3 id="share-title">Share Your Work</h3>
          <button className="share-close" onClick={onClose} aria-label="Close share dialog">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="share-body">
          <div className="share-mode">
            <label id="access-label">Access Level</label>
            <div className="mode-options" role="radiogroup" aria-labelledby="access-label">
              <button
                role="radio"
                aria-checked={shareMode === 'view'}
                className={`mode-btn ${shareMode === 'view' ? 'active' : ''}`}
                onClick={() => setShareMode('view')}
              >
                <Eye size={16} aria-hidden="true" />
                View Only
              </button>
              <button
                role="radio"
                aria-checked={shareMode === 'edit'}
                className={`mode-btn ${shareMode === 'edit' ? 'active' : ''}`}
                onClick={() => setShareMode('edit')}
              >
                <Edit3 size={16} aria-hidden="true" />
                Can Edit
              </button>
            </div>
          </div>

          <div className="share-link-section">
            <label htmlFor="share-url">Share Link</label>
            <div className="link-input-group">
              <input
                id="share-url"
                type="text"
                value={shareLink}
                placeholder="Click Generate to create a link"
                readOnly
                className="link-input"
              />
              <button 
                className="copy-btn" 
                onClick={copyToClipboard}
                aria-label={copied ? "Copied to clipboard" : "Copy link to clipboard"}
              >
                {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              </button>
            </div>
          </div>

          <button className="generate-btn" onClick={generateShareLink}>
            <LinkIcon size={16} aria-hidden="true" />
            Generate Share Link
          </button>

          <div className="share-info">
            <p>
              {shareMode === 'view' 
                ? '🔒 Recipients can view but not edit your work'
                : '✏️ Recipients can view and make edits'}
            </p>
            <small>Links contain all current content in the URL</small>
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

ShareDialog.propTypes = {
  content: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool
};
