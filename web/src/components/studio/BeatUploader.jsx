import { useState, useRef } from 'react';
import { Upload, File, Check, X, Music, Loader } from 'lucide-react';
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

    // Validate file
    if (!file.type.includes('audio')) {
      setError('Please upload an audio file (MP3, WAV, etc.)');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return;
    }

    setUploading(true);
    setUploadProgress({ status: 'loading', message: 'Loading audio file...' });

    try {
      // Load audio
      const audioBuffer = await loadAudioFile(file);
      
      setUploadProgress({ status: 'analyzing', message: 'Detecting BPM...' });
      
      // Detect BPM
      const bpm = await detectBPM(audioBuffer);
      
      setUploadProgress({ status: 'processing', message: 'Processing metadata...' });
      
      // Create metadata
      const metadata = extractMetadata(file, bpm);
      metadata.duration = audioBuffer.duration;
      
      // Store audio as base64 (simplified - in production use IndexedDB blob)
      const reader = new FileReader();
      reader.onload = async (e) => {
        metadata.audioData = e.target.result;
        
        setUploadProgress({ status: 'saving', message: 'Saving to library...' });
        
        // Save to IndexedDB
        await storeBeat(metadata);
        
        setUploadProgress({ status: 'complete', message: 'Upload complete!' });
        
        setTimeout(() => {
          onUploadComplete?.(metadata);
          onClose?.();
        }, 1000);
      };
      
      reader.readAsDataURL(file);
      
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload beat. Please try again.');
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="beat-uploader-overlay" onClick={onClose}>
      <div className="beat-uploader" onClick={(e) => e.stopPropagation()}>
        <div className="uploader-header">
          <Music size={20} />
          <h3>Upload Beat</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
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
              >
                <Upload size={48} />
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
                />
              </div>

              {error && (
                <div className="error-message">
                  <X size={16} />
                  {error}
                </div>
              )}
            </>
          ) : (
            <div className="upload-progress">
              {uploadProgress?.status === 'complete' ? (
                <Check size={48} className="success-icon" />
              ) : (
                <Loader size={48} className="spinner" />
              )}
              
              <div className="progress-info">
                <h4>{uploadProgress?.message}</h4>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${uploadProgress?.status}`}
                    style={{
                      width: uploadProgress?.status === 'complete' ? '100%' : '50%'
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
