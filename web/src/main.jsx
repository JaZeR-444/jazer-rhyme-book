/**
 * JaZeR Master Flow Knowledge Hub — Entry Point
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

console.log('main.jsx loading...');

// Add error handling for App import
let App;
try {
  const appModule = await import('./App.jsx');
  App = appModule.default;
  console.log('App.jsx loaded successfully');
} catch (error) {
  console.error('Failed to load App.jsx:', error);
  document.getElementById('root').innerHTML = '<div style="padding: 20px; color: red;"><h1>Failed to load App</h1><pre>' + error.message + '</pre></div>';
  throw error;
}

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Failed to render App:', error);
  document.getElementById('root').innerHTML = '<div style="padding: 20px; color: red;"><h1>Failed to render App</h1><pre>' + error.message + '</pre></div>';
}
