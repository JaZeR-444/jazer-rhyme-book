import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import './CopyButton.css';

export function CopyButton({ text, label, size = 'sm', variant = 'default' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      className={`copy-button copy-button--${size} copy-button--${variant} ${copied ? 'is-copied' : ''}`}
      onClick={handleCopy}
      title={copied ? 'Copied!' : `Copy ${label || 'to clipboard'}`}
    >
      {copied ? (
        <>
          <Check size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} />
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
}
