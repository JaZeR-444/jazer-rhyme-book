import { useState, useRef } from 'react';
import { Upload, Check, X, Music, Loader, AlertCircle } from 'lucide-react';
import { loadAudioFile, detectBPM, storeBeat, extractMetadata } from '../../lib/audioProcessing';
import './BeatUploader.css';

export function BeatUploader({ onUploadComplete, onClose }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    setError(null);
    const file = files[0];

    // Validate file type
    if (!file.type.includes('audio')) {
      setError('Please upload an audio file (MP3, WAV, etc.)');
      return;
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return;
    }

    setUploading(true);
    setUploadProgress({ status: 'loading', message: 'Reading audio file...' });

    try {
      // Load and decode audio for analysis
      const audioBuffer = await loadAudioFile(file);
      
      setUploadProgress({ status: 'analyzing', message: 'Detecting BPM...' });
      
      // Detect BPM
      const bpm = await detectBPM(audioBuffer);
      
      setUploadProgress({ status: 'saving', message: 'Saving to library...' });
      
      // Create metadata
      const metadata = extractMetadata(file, bpm);
      metadata.duration = audioBuffer.duration;
      
      // Store audio as Blob directly for better performance and memory
      metadata.audioBlob = file;
      
      // Save to IndexedDB
      const id = await storeBeat(metadata);
      metadata.id = id;
      
      setUploadProgress({ status: 'complete', message: 'Upload complete!' });
      
      // Create a temporary URL for immediate use
      metadata.url = URL.createObjectURL(file);
      
      setTimeout(() => {
        onUploadComplete?.(metadata);
        onClose?.();
      }, 1000);
      
    } catch (err) {
      console.error('Upload failed:', err);
      setError(`Upload failed: ${err.message || 'Please try again.'}`);
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className="beat-uploader-overlay" 
      onClick={onClose}
      role="presentation"
    >
      <div 
        className="beat-uploader" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="uploader-title"
      >
        <div className="uploader-header">
          <Music size={20} aria-hidden="true" />
          <h3 id="uploader-title">Upload Beat</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close uploader">
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="uploader-body">
          {!uploading ? (
            <>
              <div
                className={`drop-zone ${dragActive ? 'active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onButtonClick();
                }}
                aria-label="Drag and drop or click to upload audio file"
              >
                <Upload size={48} aria-hidden="true" />
                <p className="drop-message">
                  Drag & drop your beat here or click to browse
                </p>
                <p className="drop-hint">
                  Supports MP3, WAV • Max 50MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="file-input"
                  accept="audio/*"
                  onChange={handleChange}
                  aria-hidden="true"
                />
              </div>

              {error && (
                <div className="error-message" role="alert">
                  <AlertCircle size={16} aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}
            </>
          ) : (
            <div className="upload-progress" role="status" aria-live="polite">
              {uploadProgress?.status === 'complete' ? (
                <Check size={48} className="success-icon" aria-hidden="true" />
              ) : (
                <Loader size={48} className="spinner" aria-hidden="true" />
              )}
              
              <div className="progress-info">
                <h4>{uploadProgress?.message}</h4>
                <div 
                  className="progress-bar"
                  role="progressbar"
                  aria-valuenow={uploadProgress?.status === 'complete' ? 100 : 50}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div 
                    className={`progress-fill ${uploadProgress?.status}`}
                    style={{
                      width: uploadProgress?.status === 'complete' ? '100%' : '60%'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div className="uploader-info">
            <h4>What happens after upload?</h4>
            <ul>
              <li>✓ BPM automatically detected</li>
              <li>✓ Beat added to your library</li>
              <li>✓ Available in Writing Studio</li>
              <li>✓ Stored locally in your browser</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}