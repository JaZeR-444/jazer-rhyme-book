/**
 * JaZeR Master Flow Knowledge Hub
 */

import { Logo } from './components/common/Logo';
import { KnowledgeHubExplorer } from './components/sections/KnowledgeHubExplorer';
import { RapDictionaryExplorer } from './components/sections/RapDictionaryExplorer';
import './index.css';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="hero-section section">
        <div className="hero-logo-container">
          <Logo variant="full" size="large" />
        </div>
        <p style={{ marginTop: '1rem', fontSize: '1.2rem', letterSpacing: '0.1em', color: '#888' }}>
          MASTER FLOW KNOWLEDGE HUB
        </p>
      </header>
      
      <KnowledgeHubExplorer id="knowledge-hub" />
      <RapDictionaryExplorer id="dictionary" />
      
      <footer className="app-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
          <Logo variant="icon" size="small" />
          <p style={{ color: '#666', fontSize: '0.875rem' }}>
            JaZeR Master Flow Knowledge Hub © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
