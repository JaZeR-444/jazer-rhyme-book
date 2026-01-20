/**
 * voiceInput.js
 * Speech recognition utilities using Web Speech API
 */

export class VoiceInput {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.continuousMode = false;
    
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 3;
    }
  }

  isSupported() {
    return this.recognition !== null;
  }

  startListening(onResult, onError, continuous = false) {
    if (!this.recognition) {
      onError && onError('Speech recognition not supported in this browser');
      return false;
    }

    this.continuousMode = continuous;
    this.recognition.continuous = continuous;

    this.recognition.onresult = (event) => {
      const results = [];
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        results.push({
          transcript: result[0].transcript,
          confidence: result[0].confidence,
          isFinal: result.isFinal,
        });
      }
      
      const lastResult = results[results.length - 1];
      onResult(lastResult.transcript, lastResult.confidence, lastResult.isFinal);
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      onError && onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      // Auto-restart if in continuous mode
      if (this.continuousMode) {
        this.startListening(onResult, onError, true);
      }
    };

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error('Failed to start recognition:', error);
      onError && onError(error.message);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.continuousMode = false;
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Parse voice commands
  parseCommand(transcript) {
    const lower = transcript.toLowerCase().trim();

    // Search commands
    if (lower.startsWith('search for') || lower.startsWith('find')) {
      const query = lower.replace(/^(search for|find)\s+/, '');
      return { type: 'search', query };
    }

    // Navigation commands
    if (lower.startsWith('go to') || lower.startsWith('open')) {
      const page = lower.replace(/^(go to|open)\s+/, '');
      return { type: 'navigate', page: this.mapPageName(page) };
    }

    // Studio commands
    if (lower === 'start writing' || lower === 'open studio') {
      return { type: 'navigate', page: '/studio' };
    }

    // Dictionary commands
    if (lower.startsWith('define') || lower.startsWith('what is')) {
      const word = lower.replace(/^(define|what is)\s+/, '');
      return { type: 'define', word };
    }

    // Playback commands
    if (lower === 'play' || lower === 'pause' || lower === 'stop') {
      return { type: 'playback', action: lower };
    }

    return { type: 'unknown', transcript };
  }

  // Map spoken page names to routes
  mapPageName(pageName) {
    const routes = {
      'home': '/',
      'dictionary': '/dictionary',
      'domains': '/domains',
      'studio': '/studio',
      'writing studio': '/studio',
      'about': '/about',
      'settings': '/settings',
      'statistics': '/stats',
      'stats': '/stats',
    };

    return routes[pageName] || '/';
  }

  // Get list of supported languages
  getSupportedLanguages() {
    return [
      { code: 'en-US', name: 'English (US)' },
      { code: 'en-GB', name: 'English (UK)' },
      { code: 'es-ES', name: 'Spanish' },
      { code: 'fr-FR', name: 'French' },
      { code: 'de-DE', name: 'German' },
      { code: 'it-IT', name: 'Italian' },
      { code: 'pt-BR', name: 'Portuguese (Brazil)' },
      { code: 'ja-JP', name: 'Japanese' },
      { code: 'ko-KR', name: 'Korean' },
      { code: 'zh-CN', name: 'Chinese (Simplified)' },
    ];
  }

  // Change language
  setLanguage(languageCode) {
    if (this.recognition) {
      this.recognition.lang = languageCode;
    }
  }
}

// Singleton instance
export const voiceInput = new VoiceInput();

// React hook for voice input
export function useVoiceInput(onResult, onError) {
  const [isListening, setIsListening] = React.useState(false);

  const startListening = (continuous = false) => {
    const success = voiceInput.startListening(
      (transcript, confidence, isFinal) => {
        onResult(transcript, confidence, isFinal);
      },
      (error) => {
        setIsListening(false);
        onError(error);
      },
      continuous
    );
    setIsListening(success);
  };

  const stopListening = () => {
    voiceInput.stopListening();
    setIsListening(false);
  };

  return { isListening, startListening, stopListening, isSupported: voiceInput.isSupported() };
}
