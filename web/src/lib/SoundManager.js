const STORAGE_KEY = 'jazer_sound_enabled';

class SoundManager {
    constructor() {
        this.ctx = null;
        this.enabled = this._loadPreference();
        this._hasUserGesture = false;
        this._resumeInFlight = false;
        this._attachGestureListeners();
    }

    _loadPreference() {
        if (typeof window === 'undefined') return true;
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored === null) return true;
            return stored === 'true';
        } catch {
            return true;
        }
    }

    _savePreference(value) {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(STORAGE_KEY, String(value));
        } catch {
            // Ignore storage errors (private mode/quota)
        }
    }

    _attachGestureListeners() {
        if (typeof window === 'undefined') return;

        const unlock = () => {
            this._hasUserGesture = true;
            this._resume(true);
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('keydown', unlock);
            window.removeEventListener('touchstart', unlock);
        };

        window.addEventListener('pointerdown', unlock, { once: true });
        window.addEventListener('keydown', unlock, { once: true });
        window.addEventListener('touchstart', unlock, { once: true });
    }

    _init() {
        if (!this.ctx && typeof window !== 'undefined') {
            try {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn('AudioContext not supported or failed to initialize', e);
                this.enabled = false;
            }
        }
    }

    _resume(force = false) {
        if (!this.ctx || this.ctx.state !== 'suspended') return;
        if (!force && !this._hasUserGesture) return;
        if (this._resumeInFlight) return;

        this._resumeInFlight = true;
        this.ctx.resume().catch(() => {}).finally(() => {
            this._resumeInFlight = false;
        });
    }

    setEnabled(value) {
        this.enabled = Boolean(value);
        this._savePreference(this.enabled);

        if (this.enabled) {
            this._init();
            this._resume(true);
        }

        return this.enabled;
    }

    toggle() {
        return this.setEnabled(!this.enabled);
    }

    playClick() {
        if (!this.enabled) return;
        this._init();
        this._resume();
        if (this.ctx) this._playTone(800, 'sine', 0.05, 0.1);
    }

    playHover() {
        if (!this.enabled) return;
        this._init();
        this._resume();
        if (this.ctx) this._playTone(400, 'triangle', 0.01, 0.03); // Very subtle
    }

    playConfirm() {
        if (!this.enabled) return;
        this._init();
        this._resume();
        if (this.ctx) this._playTone(1200, 'sine', 0.1, 0.1);
    }
    
    playError() {
        if (!this.enabled) return;
        this._init();
        this._resume();
        if (this.ctx) this._playTone(150, 'sawtooth', 0.2, 0.3);
    }

    _playTone(freq, type, duration, vol = 0.1) {
        if (!this.ctx || this.ctx.state === 'suspended') return;
        
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            
            gain.gain.setValueAtTime(vol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            console.warn('Error playing sound', e);
        }
    }
}

export const soundManager = new SoundManager();
