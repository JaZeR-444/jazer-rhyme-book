import { useState, useEffect } from 'react';
import { Clock, RotateCcw, Trash2, Download, Eye } from 'lucide-react';
import './VersionHistory.css';

export function VersionHistory({ currentText, onRestore, enabled = true }) {
  const [versions, setVersions] = useState([]);
  const [showPreview, setShowPreview] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('jazer_version_history');
    if (saved) {
      try {
        setVersions(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load version history:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (!currentText || currentText.trim().length === 0) return;

    const autoSave = () => {
      const newVersion = {
        id: Date.now(),
        text: currentText,
        timestamp: new Date().toISOString(),
        wordCount: currentText.split(/\s+/).filter(Boolean).length,
        preview: currentText.slice(0, 100)
      };

      setVersions(prev => {
        const updated = [newVersion, ...prev].slice(0, 50);
        localStorage.setItem('jazer_version_history', JSON.stringify(updated));
        return updated;
      });
    };

    const timer = setTimeout(autoSave, 5000);
    return () => clearTimeout(timer);
  }, [currentText]);

  const handleRestore = (version) => {
    if (confirm('Restore this version? Current changes will be lost.')) {
      onRestore?.(version.text);
      setShowPreview(null);
    }
  };

  const handleDelete = (id) => {
    setVersions(prev => {
      const updated = prev.filter(v => v.id !== id);
      localStorage.setItem('jazer_version_history', JSON.stringify(updated));
      return updated;
    });
    if (showPreview?.id === id) setShowPreview(null);
  };

  const handleClearAll = () => {
    if (confirm('Clear all version history? This cannot be undone.')) {
      setVersions([]);
      localStorage.removeItem('jazer_version_history');
      setShowPreview(null);
    }
  };

  const handleExport = (version) => {
    const blob = new Blob([version.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `version-${new Date(version.timestamp).toISOString().slice(0, 19)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (!enabled) return null;

  return (
    <div className="version-history">
      <div className="history-header">
        <div className="header-title">
          <Clock size={16} />
          <h3>Version History</h3>
          <span className="version-count">{versions.length} versions</span>
        </div>
        {versions.length > 0 && (
          <button className="clear-all-btn" onClick={handleClearAll}>
            <Trash2 size={14} />
            Clear All
          </button>
        )}
      </div>

      <div className="versions-list">
        {versions.length === 0 ? (
          <div className="empty-state">
            <Clock size={48} />
            <p>No versions saved yet</p>
            <small>Auto-saves every 5 seconds</small>
          </div>
        ) : (
          versions.map((version) => (
            <div key={version.id} className="version-item">
              <div className="version-info">
                <span className="version-time">{formatTimestamp(version.timestamp)}</span>
                <span className="version-words">{version.wordCount} words</span>
              </div>
              <div className="version-preview">{version.preview}...</div>
              <div className="version-actions">
                <button
                  className="action-btn"
                  onClick={() => setShowPreview(version)}
                  title="Preview"
                >
                  <Eye size={14} />
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleRestore(version)}
                  title="Restore"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleExport(version)}
                  title="Export"
                >
                  <Download size={14} />
                </button>
                <button
                  className="action-btn danger"
                  onClick={() => handleDelete(version.id)}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showPreview && (
        <div className="preview-modal" onClick={() => setShowPreview(null)}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <h4>Version Preview</h4>
              <button onClick={() => setShowPreview(null)}>
                <Trash2 size={16} />
              </button>
            </div>
            <div className="preview-text">{showPreview.text}</div>
            <div className="preview-actions">
              <button
                className="btn-primary"
                onClick={() => handleRestore(showPreview)}
              >
                <RotateCcw size={16} />
                Restore This Version
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
