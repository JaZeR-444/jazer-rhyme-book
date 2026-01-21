/**
 * JaZeR Master Flow Knowledge Hub — Entry Point
 */

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import FatalErrorScreen from './components/FatalErrorScreen.jsx';
import './components/FatalErrorScreen.css';

if (import.meta.env.DEV) {
  console.log('main.jsx loading...');
}

function renderFatalError(title, error) {
  if (import.meta.env.DEV) {
    console.error(title, error);
  }

  const rootEl = document.getElementById('root');
  if (!rootEl) return;

  // Build DOM nodes safely (no HTML injection) using FatalErrorScreen structure
  rootEl.innerHTML = '';

  const screen = document.createElement('div');
  screen.className = 'fatal-error-screen';
  screen.setAttribute('role', 'alert');
  screen.setAttribute('aria-live', 'assertive');

  const content = document.createElement('div');
  content.className = 'fatal-error-screen__content';

  const icon = document.createElement('div');
  icon.className = 'fatal-error-screen__icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = '⚠️';

  const h1 = document.createElement('h1');
  h1.className = 'fatal-error-screen__title';
  h1.textContent = title;

  const message = document.createElement('p');
  message.className = 'fatal-error-screen__message';
  message.textContent = 'An unexpected error occurred while loading the application. Please try refreshing the page or contact support if the problem persists.';

  const details = document.createElement('details');
  details.className = 'fatal-error-screen__details';

  const summary = document.createElement('summary');
  summary.className = 'fatal-error-screen__summary';
  summary.textContent = 'Diagnostic Information (Development Only)';

  const errorPre = document.createElement('pre');
  errorPre.className = 'fatal-error-screen__error-details';
  errorPre.textContent = error?.stack || error?.message || String(error);

  details.appendChild(summary);
  details.appendChild(errorPre);

  content.appendChild(icon);
  content.appendChild(h1);
  content.appendChild(message);

  if (error && import.meta.env.DEV) {
    content.appendChild(details);
  }

  const actions = document.createElement('div');
  actions.className = 'fatal-error-screen__actions';

  const reloadBtn = document.createElement('button');
  reloadBtn.className = 'fatal-error-screen__button fatal-error-screen__button--primary';
  reloadBtn.setAttribute('aria-label', 'Reload the application');
  reloadBtn.textContent = 'Reload Application';
  reloadBtn.onclick = () => window.location.reload();

  const homeBtn = document.createElement('button');
  homeBtn.className = 'fatal-error-screen__button fatal-error-screen__button--secondary';
  homeBtn.setAttribute('aria-label', 'Return to home page');
  homeBtn.textContent = 'Go to Home';
  homeBtn.onclick = () => window.location.href = '/';

  actions.appendChild(reloadBtn);
  actions.appendChild(homeBtn);

  const footer = document.createElement('p');
  footer.className = 'fatal-error-screen__footer';
  footer.textContent = 'If this problem continues, please clear your browser cache and try again.';

  content.appendChild(actions);
  content.appendChild(footer);

  screen.appendChild(content);
  rootEl.appendChild(screen);
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

  if (import.meta.env.DEV) {
    console.log('App rendered successfully');
  }

  // Register service worker for PWA support in production
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    const swUrl = `${import.meta.env.BASE_URL || '/'}service-worker.js`;
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
} catch (error) {
  renderFatalError('Failed to render App', error);
  // Do not rethrow to prevent additional error logging
}
