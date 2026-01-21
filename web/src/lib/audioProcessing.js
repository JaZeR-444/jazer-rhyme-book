/**
 * Audio Processing Library for Beat Integration
 * Handles beat upload, BPM detection, and audio playback features
 */

const DB_NAME = 'JaZeRBeats';
const STORE_NAME = 'beats';
const DB_VERSION = 1;

function setupBeatStore(db) {
  if (!db.objectStoreNames.contains(STORE_NAME)) {
    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    store.createIndex('bpm', 'bpm', { unique: false });
    store.createIndex('mood', 'mood', { unique: false });
    store.createIndex('dateAdded', 'dateAdded', { unique: false });
  }
}

function migrateBeatDatabase(db, oldVersion) {
  if (oldVersion < 1) {
    setupBeatStore(db);
  }
}

// Initialize IndexedDB for beat storage
export async function initBeatDatabase() {
  return new Promise((resolve, reject) => {
    let request;
    try {
      request = indexedDB.open(DB_NAME, DB_VERSION);
    } catch (err) {
      reject(err);
      return;
    }
    
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      migrateBeatDatabase(db, e.oldVersion);
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB'));
    request.onblocked = () => reject(new Error('IndexedDB upgrade blocked by another tab'));
  });
}

// Store or update beat in IndexedDB
export async function storeBeat(beatData) {
  const db = await initBeatDatabase();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  transaction.oncomplete = () => db.close();
  transaction.onerror = () => db.close();
  
  return new Promise((resolve, reject) => {
    // Use put to handle both add and update
    const request = store.put(beatData);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Get all beats
export async function getAllBeats() {
  const db = await initBeatDatabase();
  const transaction = db.transaction([STORE_NAME], 'readonly');
  const store = transaction.objectStore(STORE_NAME);

  transaction.oncomplete = () => db.close();
  transaction.onerror = () => db.close();
  
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const beats = request.result;
      // Convert Blobs to object URLs for playback
      const beatsWithUrls = beats.map(beat => {
        if (beat.audioBlob) {
          beat.url = URL.createObjectURL(beat.audioBlob);
        } else if (beat.audioData && typeof beat.audioData === 'string') {
          // Fallback for legacy base64 data
          beat.url = beat.audioData;
        }
        return beat;
      });
      resolve(beatsWithUrls);
    };
    request.onerror = () => reject(request.error);
  });
}

// Delete beat
export async function deleteBeat(id) {
  const db = await initBeatDatabase();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  transaction.oncomplete = () => db.close();
  transaction.onerror = () => db.close();
  
  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// BPM Detection using Web Audio API
export async function detectBPM(audioBuffer, options = {}) {
  try {
    const {
      threshold = 0.7,
      minDistanceSec = 0.3,
      maxPeaks = 50,
    } = options;

    const offlineContext = new OfflineAudioContext(
      1,
      audioBuffer.length,
      audioBuffer.sampleRate
    );
    
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    
    const filter = offlineContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 150;
    
    source.connect(filter);
    filter.connect(offlineContext.destination);
    source.start(0);
    
    const filteredBuffer = await offlineContext.startRendering();
    const peaks = findPeaks(
      filteredBuffer.getChannelData(0),
      audioBuffer.sampleRate,
      { threshold, minDistanceSec, maxPeaks }
    );
    
    return calculateBPMFromPeaks(peaks, audioBuffer.sampleRate);
  } catch (err) {
    console.error('BPM detection failed:', err);
    return 120; // default
  }
}

function findPeaks(data, sampleRate, options) {
  const { threshold = 0.7, minDistanceSec = 0.3, maxPeaks = 50 } = options || {};
  const peaks = [];
  const minDistance = Math.floor(minDistanceSec * sampleRate);
  
  let lastPeak = -minDistance;
  
  for (let i = 0; i < data.length; i++) {
    if (Math.abs(data[i]) > threshold && i - lastPeak > minDistance) {
      peaks.push(i);
      lastPeak = i;
    }

    if (peaks.length >= maxPeaks) break;
  }
  
  return peaks;
}

function calculateBPMFromPeaks(peaks, sampleRate) {
  if (peaks.length < 2) return 120;
  
  const intervals = [];
  for (let i = 1; i < Math.min(peaks.length, 50); i++) {
    intervals.push((peaks[i] - peaks[i - 1]) / sampleRate);
  }
  
  const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
  const bpm = Math.round(60 / avgInterval);
  
  // Validate BPM range (typical range: 60-180)
  if (bpm < 60) return bpm * 2;
  if (bpm > 180) return Math.round(bpm / 2);
  
  return bpm;
}

// Load audio file
export async function loadAudioFile(file) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  return audioBuffer;
}

// A-B Loop functionality
export class BeatLooper {
  constructor(audioElement) {
    this.audio = audioElement;
    this.loopStart = 0;
    this.loopEnd = audioElement.duration || 0;
    this.enabled = false;
    this._bound = false;
    this._onTimeUpdate = this._onTimeUpdate.bind(this);
    this._onLoadedMetadata = this._onLoadedMetadata.bind(this);
  }
  
  setLoop(start, end) {
    this.loopStart = start;
    this.loopEnd = end;
    this.enabled = true;
    this.startMonitoring();
  }
  
  startMonitoring() {
    if (this._bound) return;
    this.audio.addEventListener('timeupdate', this._onTimeUpdate);
    this.audio.addEventListener('loadedmetadata', this._onLoadedMetadata);
    this._bound = true;
  }

  _onTimeUpdate() {
    if (!this.enabled) return;
    if (this.loopEnd > 0 && this.audio.currentTime >= this.loopEnd) {
      this.audio.currentTime = this.loopStart;
    }
  }

  _onLoadedMetadata() {
    if (!this.loopEnd || Number.isNaN(this.loopEnd)) {
      this.loopEnd = this.audio.duration || 0;
    }
  }
  
  disable() {
    this.enabled = false;
    if (this._bound) {
      this.audio.removeEventListener('timeupdate', this._onTimeUpdate);
      this.audio.removeEventListener('loadedmetadata', this._onLoadedMetadata);
      this._bound = false;
    }
  }
  
  destroy() {
    this.disable();
  }
}

// Playback speed control
export function setPlaybackSpeed(audioElement, speed) {
  audioElement.playbackRate = Math.max(0.25, Math.min(2.0, speed));
}

// Pitch shifting (approximation using playback rate)
export function setPitch(audioElement, semitones) {
  const rate = Math.pow(2, semitones / 12);
  audioElement.playbackRate = rate;
}

// Export beat metadata
export function extractMetadata(file, bpm) {
  return {
    name: file.name.replace(/\.[^/.]+$/, ''),
    fileName: file.name,
    size: file.size,
    type: file.type,
    bpm: bpm,
    dateAdded: new Date().toISOString(),
    duration: 0, // Will be set after loading
    tags: [],
    mood: 'neutral',
    favorite: false
  };
}
