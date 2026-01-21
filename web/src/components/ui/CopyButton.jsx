import { useState } from 'react';
import PropTypes from 'prop-types';
import { Copy, Check, AlertCircle } from 'lucide-react';
import './CopyButton.css';

export function CopyButton({ text, label, size = 'sm', variant = 'default', className = '' }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'copied' | 'error'

  const handleCopy = async () => {
    try {
      // Primary: Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback: execCommand('copy')
        const textArea = document.createElement("textarea");
        textArea.value = text;
        
        // Ensure it's not visible
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (!successful) throw new Error('execCommand failed');
      }

      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const ariaLabel = status === 'copied' 
    ? 'Copied to clipboard' 
    : status === 'error' 
      ? 'Failed to copy' 
      : `Copy ${label || 'content'} to clipboard`;

  const iconSize = size === 'xs' ? 12 : size === 'sm' ? 14 : 16;

  return (
    <button
      className={`copy-button copy-button--${size} copy-button--${variant} ${status === 'copied' ? 'is-copied' : ''} ${status === 'error' ? 'is-error' : ''} ${className}`}
      onClick={handleCopy}
      aria-label={ariaLabel}
      title={ariaLabel}
      type="button"
    >
      <span className="copy-button__icon" aria-hidden="true">
        {status === 'copied' ? (
          <Check size={iconSize} />
        ) : status === 'error' ? (
          <AlertCircle size={iconSize} />
        ) : (
          <Copy size={iconSize} />
        )}
      </span>
      
      {(label || status === 'copied') && (
        <span className="copy-button__label">
          {status === 'copied' ? 'Copied!' : status === 'error' ? 'Failed' : label}
        </span>
      )}
    </button>
  );
}

CopyButton.propTypes = {
  text: PropTypes.string.isRequired,
  label: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['default', 'ghost', 'outline', 'neon', 'glass']),
  className: PropTypes.string
};