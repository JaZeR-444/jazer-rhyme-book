/**
 * JaZeR Master Flow Knowledge Hub
 */

import { KnowledgeHubExplorer } from './components/sections/KnowledgeHubExplorer';
import { RapDictionaryExplorer } from './components/sections/RapDictionaryExplorer';
import './index.css';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="hero-section section">
        <h1 className="text-hero" style={{ 
          background: 'linear-gradient(135deg, #f5f5f5, #00ffff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          JaZeR
        </h1>
        <p style={{ marginTop: '1rem', fontSize: '1.2rem', letterSpacing: '0.1em', color: '#888' }}>
          MASTER FLOW KNOWLEDGE HUB
        </p>
      </header>
      
      <KnowledgeHubExplorer id="knowledge-hub" />
      <RapDictionaryExplorer id="dictionary" />
      
      <footer className="app-footer">
        <p style={{ color: '#666', fontSize: '0.875rem' }}>
          JaZeR Master Flow Knowledge Hub
        </p>
      </footer>
    </div>
  );
}

export default App;
