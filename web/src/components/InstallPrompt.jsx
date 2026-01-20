import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { isAppInstalled, getInstallInstructions, isIOS } from '../lib/pwaHelpers';
import './InstallPrompt.css';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (isAppInstalled()) {
      return;
    }

    // Check if user already dismissed
    const dismissed = localStorage.getItem('pwa_install_dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Handle beforeinstallprompt event (Chrome, Edge)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after 30 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show manual instructions after 30 seconds
    if (isIOS()) {
      setTimeout(() => {
        setShowIOSInstructions(true);
        setShowPrompt(true);
      }, 30000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log('Install prompt outcome:', outcome);
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa_install_dismissed', Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }

  const instructions = getInstallInstructions();

  return (
    <div className="install-prompt">
      <button className="prompt-close" onClick={handleDismiss}>
        <X size={16} />
      </button>

      <div className="prompt-icon">
        {showIOSInstructions ? <Smartphone size={32} /> : <Download size={32} />}
      </div>

      <div className="prompt-content">
        <h3>Install JaZeR Rhyme Book</h3>
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
              <Download size={16} />
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
