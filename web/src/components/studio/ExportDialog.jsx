import { useId, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Download, FileText, Twitter, Instagram, FileJson, X, Loader } from 'lucide-react';
import { exportToPDF, exportToGoogleDocs, exportToTwitter, exportToInstagram } from '../../lib/exportFormats';
import './ExportDialog.css';

export function ExportDialog({ content, metadata, onClose, open = false }) {
  const [format, setFormat] = useState('txt');
  const [exporting, setExporting] = useState(false);
  const titleId = useId();

  // Handle Escape key
  useEffect(() => {
    if (!open) return;
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  const formats = [
    { id: 'txt', name: 'Plain Text', icon: FileText, description: 'Simple .txt file' },
    { id: 'pdf', name: 'PDF', icon: FileText, description: 'Formatted PDF document' },
    { id: 'json', name: 'JSON', icon: FileJson, description: 'Data with metadata' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, description: 'Thread-ready format' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, description: 'Caption-optimized' },
  ];

  const handleExport = async () => {
    setExporting(true);
    
    try {
      switch (format) {
        case 'txt':
          exportPlainText();
          break;
        case 'pdf':
          await exportToPDF(content, metadata);
          break;
        case 'json':
          exportJSON();
          break;
        case 'twitter':
          exportToTwitter(content);
          break;
        case 'instagram':
          exportToInstagram(content);
          break;
      }
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const exportPlainText = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lyrics-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const data = {
      content,
      metadata: {
        ...metadata,
        exportedAt: new Date().toISOString()
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lyrics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!open) return null;

  return (
    <div className="export-dialog-overlay" onClick={onClose} role="presentation">
      <div
        className="export-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="export-header">
          <Download size={20} aria-hidden="true" />
          <h3 id={titleId}>Export Your Work</h3>
          <button 
            className="export-close" 
            onClick={onClose}
            aria-label="Close export dialog"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="export-body">
          <div className="format-selector" role="listbox" aria-label="Select export format">
            {formats.map((fmt) => (
              <button
                key={fmt.id}
                role="option"
                className={`format-option ${format === fmt.id ? 'active' : ''}`}
                onClick={() => setFormat(fmt.id)}
                aria-label={`${fmt.name}: ${fmt.description}`}
                aria-selected={format === fmt.id}
              >
                <fmt.icon size={20} aria-hidden="true" />
                <div className="format-info">
                  <span className="format-name">{fmt.name}</span>
                  <span className="format-desc">{fmt.description}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="export-preview">
            <h4>Preview</h4>
            <div className="preview-content">
              {content.split('\n').slice(0, 8).join('\n')}
              {content.split('\n').length > 8 && '\n...'}
            </div>
          </div>
        </div>

        <div className="export-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={handleExport}
            disabled={exporting}
            aria-busy={exporting}
          >
            {exporting
              ? <Loader size={16} className="spinner" aria-hidden="true" />
              : <Download size={16} aria-hidden="true" />}
            {exporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
}

ExportDialog.propTypes = {
  content: PropTypes.string.isRequired,
  metadata: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool
};
