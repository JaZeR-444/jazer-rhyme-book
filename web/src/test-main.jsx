import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './components/FatalErrorScreen.css';

function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <h1>React is Working!</h1>
      <p>If you see this, React is rendering correctly.</p>
    </div>
  );
}

function renderFatal(message, error) {
  if (import.meta.env.DEV) {
    console.error(message, error);
  }

  // Render a safe fallback without HTML injection using FatalErrorScreen structure
  document.body.innerHTML = '';

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
  h1.textContent = message;

  const testMessage = document.createElement('p');
  testMessage.className = 'fatal-error-screen__message';
  testMessage.textContent = 'An error occurred during React initialization. Please check the diagnostic information below.';

  content.appendChild(icon);
  content.appendChild(h1);
  content.appendChild(testMessage);

  if (error && import.meta.env.DEV) {
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
    content.appendChild(details);
  }

  const actions = document.createElement('div');
  actions.className = 'fatal-error-screen__actions';

  const reloadBtn = document.createElement('button');
  reloadBtn.className = 'fatal-error-screen__button fatal-error-screen__button--primary';
  reloadBtn.setAttribute('aria-label', 'Reload the page');
  reloadBtn.textContent = 'Reload Page';
  reloadBtn.onclick = () => window.location.reload();

  actions.appendChild(reloadBtn);
  content.appendChild(actions);

  const footer = document.createElement('p');
  footer.className = 'fatal-error-screen__footer';
  footer.textContent = 'If this problem persists, please verify the page configuration.';

  content.appendChild(footer);
  screen.appendChild(content);
  document.body.appendChild(screen);
}

const rootElement = document.getElementById('root');
if (import.meta.env.DEV) {
  console.log('Root element found:', rootElement);
}

if (!rootElement) {
  renderFatal('Root element #root not found!', null);
} else {
  try {
    const root = createRoot(rootElement);
    if (import.meta.env.DEV) {
      console.log('Root created successfully');
    }

    root.render(
      <StrictMode>
        <TestApp />
      </StrictMode>
    );

    if (import.meta.env.DEV) {
      console.log('Render called successfully');
    }
  } catch (error) {
    renderFatal('Error creating/rendering root', error);
  }
}
