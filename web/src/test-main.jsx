import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <h1>React is Working!</h1>
      <p>If you see this, React is rendering correctly.</p>
    </div>
  );
}

function renderFatal(message, error) {
  console.error(message, error);

  // Render a safe fallback without HTML injection
  document.body.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.style.padding = '20px';
  wrap.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';

  const h1 = document.createElement('h1');
  h1.style.color = 'red';
  h1.textContent = message;

  const pre = document.createElement('pre');
  pre.textContent = error?.stack || error?.message || (error ? String(error) : '');

  wrap.appendChild(h1);
  if (pre.textContent) wrap.appendChild(pre);
  document.body.appendChild(wrap);
}

const rootElement = document.getElementById('root');
console.log('Root element found:', rootElement);

if (!rootElement) {
  renderFatal('Root element #root not found!', null);
} else {
  try {
    const root = createRoot(rootElement);
    console.log('Root created successfully');

    root.render(
      <StrictMode>
        <TestApp />
      </StrictMode>
    );

    console.log('Render called successfully');
  } catch (error) {
    renderFatal('Error creating/rendering root', error);
  }
}
