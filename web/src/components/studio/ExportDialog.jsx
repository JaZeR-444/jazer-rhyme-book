import { useState } from 'react';
import { Download, FileText, Twitter, Instagram, FileJson } from 'lucide-react';
import { exportToPDF, exportToGoogleDocs, exportToTwitter, exportToInstagram } from '../lib/exportFormats';
import './ExportDialog.css';

export function ExportDialog({ content, metadata, onClose, open = false }) {
  const [format, setFormat] = useState('txt');
  const [exporting, setExporting] = useState(false);

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
    <div className="export-dialog-overlay" onClick={onClose}>
      <div className="export-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="export-header">
          <Download size={20} />
          <h3>Export Your Work</h3>
        </div>

        <div className="export-body">
          <div className="format-selector">
            {formats.map((fmt) => (
              <button
                key={fmt.id}
                className={`format-option ${format === fmt.id ? 'active' : ''}`}
                onClick={() => setFormat(fmt.id)}
              >
                <fmt.icon size={20} />
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
              {content.split('\n').slice(0, 10).join('\n')}
              {content.split('\n').length > 10 && '\n...'}
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
          >
            <Download size={16} />
            {exporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
}
