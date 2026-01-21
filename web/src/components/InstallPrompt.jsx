import { useState, useEffect, useRef } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { isAppInstalled, getInstallInstructions, isIOS } from '../lib/pwaHelpers';
import './InstallPrompt.css';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Check if already installed
    if (isAppInstalled()) {
      return;
    }

    // Check if user already dismissed
    try {
      const dismissed = localStorage.getItem('jazer_pwa_install_dismissed');
      if (dismissed) {
        const dismissedTime = parseInt(dismissed);
        const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
        
        // Show again after 7 days
        if (daysSinceDismissed < 7) {
          return;
        }
      }
    } catch (e) {
      // Ignore storage errors
    }

    // Handle beforeinstallprompt event (Chrome, Edge)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after 30 seconds
      timerRef.current = setTimeout(() => {
        setShowPrompt(true);
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show manual instructions after 30 seconds
    if (isIOS()) {
      timerRef.current = setTimeout(() => {
        setShowIOSInstructions(true);
        setShowPrompt(true);
      }, 30000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (import.meta.env.DEV) {
      console.log('Install prompt outcome:', outcome);
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem('jazer_pwa_install_dismissed', Date.now().toString());
    } catch (e) {
      // Ignore storage errors
    }
    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }

  const instructions = getInstallInstructions();

  return (
    <div className="install-prompt" role="alertdialog" aria-labelledby="prompt-title">
      <button 
        className="prompt-close" 
        onClick={handleDismiss}
        aria-label="Dismiss install prompt"
      >
        <X size={16} aria-hidden="true" />
      </button>

      <div className="prompt-icon" aria-hidden="true">
        {showIOSInstructions ? <Smartphone size={32} /> : <Download size={32} />}
      </div>

      <div className="prompt-content">
        <h3 id="prompt-title">Install JaZeR Rhyme Book</h3>
        <p>
          Get quick access and work offline by installing the app on your device.
        </p>

        {showIOSInstructions ? (
          <div className="ios-instructions">
            <h4>How to install on {instructions.platform}:</h4>
            <ol>
              {instructions.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="install-benefits">
            <ul>
              <li>✓ Works offline</li>
              <li>✓ Faster loading</li>
              <li>✓ App-like experience</li>
            </ul>
          </div>
        )}
      </div>

      <div className="prompt-actions">
        {deferredPrompt && !showIOSInstructions ? (
          <>
            <button className="btn-secondary" onClick={handleDismiss}>
              Not Now
            </button>
            <button className="btn-primary" onClick={handleInstall}>
              <Download size={16} aria-hidden="true" />
              Install
            </button>
          </>
        ) : (
          <button className="btn-primary" onClick={handleDismiss}>
            Got It
          </button>
        )}
      </div>
    </div>
  );
}