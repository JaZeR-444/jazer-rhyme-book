import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>React is Working!</h1>
      <p>If you see this, React is rendering correctly.</p>
    </div>
  );
}

const rootElement = document.getElementById('root');
console.log('Root element found:', rootElement);

if (rootElement) {
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
    console.error('Error creating/rendering root:', error);
    document.body.innerHTML = '<h1 style="color: red;">Error: ' + error.message + '</h1>';
  }
} else {
  console.error('Root element not found!');
  document.body.innerHTML = '<h1 style="color: red;">Root element #root not found!</h1>';
}
