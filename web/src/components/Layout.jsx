import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="mainframe-container">
      {/* Top Status Bar */}
      <header className="mainframe-header">
        <div className="brand">
          <div className="logo-glitch">JZR</div>
          <span className="system-name">RHYME_EXEC // V.1.0</span>
        </div>
        <div className="status-indicators">
          <span>SYS: ONLINE</span>
          <span>NET: SECURE</span>
          <span className="time">{new Date().toLocaleTimeString()}</span>
        </div>
      </header>

      <div className="content-wrapper">
        {/* Side Navigation */}
        <nav className="mainframe-sidebar">
          <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            [01] DASHBOARD
          </Link>
          <Link to="/hub" className={`nav-item ${location.pathname.startsWith('/hub') ? 'active' : ''}`}>
            [02] KNOWLEDGE_HUB
          </Link>
          <Link to="/dictionary" className={`nav-item ${location.pathname.startsWith('/dictionary') ? 'active' : ''}`}>
            [03] DICTIONARY
          </Link>
          <Link to="/graph" className={`nav-item ${location.pathname === '/graph' ? 'active' : ''}`}>
            [04] NEURAL_MAP
          </Link>
          
          <div className="nav-footer">
            <div className="audio-visualizer-mock">
              {/* CSS animated bars */}
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          </div>
        </nav>

        {/* Main Viewport */}
        <main className="mainframe-viewport">
          <div className="viewport-overlay"></div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
