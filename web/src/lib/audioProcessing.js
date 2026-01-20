/**
 * Audio Processing Library for Beat Integration
 * Handles beat upload, BPM detection, and audio playback features
 */

// Initialize IndexedDB for beat storage
export async function initBeatDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('JaZeRBeats', 1);
    
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('beats')) {
        const store = db.createObjectStore('beats', { keyPath: 'id', autoIncrement: true });
        store.createIndex('bpm', 'bpm', { unique: false });
        store.createIndex('mood', 'mood', { unique: false });
        store.createIndex('dateAdded', 'dateAdded', { unique: false });
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Store beat in IndexedDB
export async function storeBeat(beatData) {
  const db = await initBeatDatabase();
  const transaction = db.transaction(['beats'], 'readwrite');
  const store = transaction.objectStore('beats');
  
  return new Promise((resolve, reject) => {
    const request = store.add(beatData);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Get all beats
export async function getAllBeats() {
  const db = await initBeatDatabase();
  const transaction = db.transaction(['beats'], 'readonly');
  const store = transaction.objectStore('beats');
  
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Delete beat
export async function deleteBeat(id) {
  const db = await initBeatDatabase();
  const transaction = db.transaction(['beats'], 'readwrite');
  const store = transaction.objectStore('beats');
  
  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// BPM Detection using Web Audio API
export async function detectBPM(audioBuffer) {
  try {
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
    const peaks = findPeaks(filteredBuffer.getChannelData(0), audioBuffer.sampleRate);
    
    return calculateBPMFromPeaks(peaks, audioBuffer.sampleRate);
  } catch (err) {
    console.error('BPM detection failed:', err);
    return 120; // default
  }
}

function findPeaks(data, sampleRate) {
  const peaks = [];
  const threshold = 0.7;
  const minDistance = Math.floor(0.3 * sampleRate); // 0.3 seconds minimum between peaks
  
  let lastPeak = -minDistance;
  
  for (let i = 0; i < data.length; i++) {
    if (Math.abs(data[i]) > threshold && i - lastPeak > minDistance) {
      peaks.push(i);
      lastPeak = i;
    }
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
  const audioContext = new AudioContext();
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  return audioBuffer;
}

// A-B Loop functionality
export class BeatLooper {
  constructor(audioElement) {
    this.audio = audioElement;
    this.loopStart = 0;
    this.loopEnd = audioElement.duration;
    this.enabled = false;
    this.updateInterval = null;
  }
  
  setLoop(start, end) {
    this.loopStart = start;
    this.loopEnd = end;
    this.enabled = true;
    this.startMonitoring();
  }
  
  startMonitoring() {
    if (this.updateInterval) return;
    
    this.updateInterval = setInterval(() => {
      if (this.enabled && this.audio.currentTime >= this.loopEnd) {
        this.audio.currentTime = this.loopStart;
      }
    }, 100);
  }
  
  disable() {
    this.enabled = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
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
