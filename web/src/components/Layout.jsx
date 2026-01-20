import { Outlet, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Layout.css';

const Layout = () => {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const navLinkClass = ({ isActive }) => `nav-item${isActive ? ' active' : ''}`;

  return (
    <div className="mainframe-container">
      {/* Top Status Bar */}
      <header className="mainframe-header" role="banner">
        <div className="brand">
          <div className="logo-glitch" aria-label="JaZeR" role="img">
            JZR
          </div>
          <span className="system-name">RHYME_EXEC // V.1.0</span>
        </div>

        <div className="status-indicators" aria-label="System status">
          <span>SYS: ONLINE</span>
          <span>NET: SECURE</span>
          <span className="time" aria-label="Local time">
            {time.toLocaleTimeString()}
          </span>
        </div>
      </header>

      <div className="content-wrapper">
        {/* Side Navigation */}
        <nav className="mainframe-sidebar" aria-label="Primary">
          <NavLink to="/" end className={navLinkClass}>
            [01] DASHBOARD
          </NavLink>

          <NavLink to="/hub" className={navLinkClass}>
            [02] KNOWLEDGE_HUB
          </NavLink>

          <NavLink to="/dictionary" className={navLinkClass}>
            [03] DICTIONARY
          </NavLink>

          <NavLink to="/graph" className={navLinkClass}>
            [04] NEURAL_MAP
          </NavLink>

          <div className="nav-footer">
            <div className="audio-visualizer-mock" aria-hidden="true">
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
            </div>
          </div>
        </nav>

        {/* Main Viewport */}
        <main className="mainframe-viewport" role="main">
          <div className="viewport-overlay" aria-hidden="true" />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
