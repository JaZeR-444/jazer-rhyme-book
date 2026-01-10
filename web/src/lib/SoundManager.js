class SoundManager {
    constructor() {
        this.ctx = null;
        this.enabled = true;
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

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    playClick() {
        if (!this.enabled) return;
        this._init();
        if (this.ctx) this._playTone(800, 'sine', 0.05, 0.1);
    }

    playHover() {
        if (!this.enabled) return;
        this._init();
        if (this.ctx) this._playTone(400, 'triangle', 0.01, 0.03); // Very subtle
    }

    playConfirm() {
        if (!this.enabled) return;
        this._init();
        if (this.ctx) this._playTone(1200, 'sine', 0.1, 0.1);
    }
    
    playError() {
        if (!this.enabled) return;
        this._init();
        if (this.ctx) this._playTone(150, 'sawtooth', 0.2, 0.3);
    }

    _playTone(freq, type, duration, vol = 0.1) {
        if (!this.ctx) return;
        
        try {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch(() => {});
            }

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
