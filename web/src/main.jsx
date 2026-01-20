/**
 * JaZeR Master Flow Knowledge Hub — Entry Point
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

console.log('main.jsx loading...');

function renderFatalError(title, error) {
  console.error(title, error);

  const rootEl = document.getElementById('root');
  if (!rootEl) return;

  // Build DOM nodes safely (no HTML injection)
  rootEl.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.style.padding = '20px';
  wrap.style.color = 'red';
  wrap.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';

  const h1 = document.createElement('h1');
  h1.textContent = title;

  const pre = document.createElement('pre');
  pre.textContent = error?.stack || error?.message || String(error);

  wrap.appendChild(h1);
  wrap.appendChild(pre);
  rootEl.appendChild(wrap);
}

try {
  const rootEl = document.getElementById('root');
  if (!rootEl) {
    throw new Error('Missing #root element in index.html');
  }

  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>
  );

  console.log('App rendered successfully');
} catch (error) {
  renderFatalError('Failed to render App', error);
  throw error;
}
