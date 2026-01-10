import { Outlet, Link, useLocation } from 'react-router-dom';
import { Database, BookOpen, Search, Code, FileText, Info, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './common/Logo';
import { WorkspaceDrawer } from './WorkspaceDrawer';
import { CommandPalette } from './CommandPalette';
import { StudioPlayer } from './StudioPlayer';
import { SystemStatus } from './SystemStatus';
import { HapticFeedback } from './HapticFeedback';
import './AppLayout.css';

export function AppLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: <Database size={18} /> },
    { path: '/domains', label: 'Domains', icon: <Database size={18} /> },
    { path: '/dictionary', label: 'Dictionary', icon: <BookOpen size={18} /> },
    { path: '/search', label: 'Search', icon: <Search size={18} /> },
    { path: '/architecture', label: 'Architecture', icon: <Code size={18} /> },
    { path: '/docs', label: 'Docs', icon: <FileText size={18} /> },
    { path: '/about', label: 'About', icon: <Info size={18} /> }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="app-header">
        <div className="app-header__content">
          <Link to="/" className="app-header__logo">
            <Logo variant="full" size="small" className="nav-logo" />
          </Link>

          {/* Desktop Nav */}
          <nav className="app-nav app-nav--desktop">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`app-nav__link ${isActive(item.path) ? 'app-nav__link--active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="app-header__menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="app-nav app-nav--mobile">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`app-nav__link ${isActive(item.path) ? 'app-nav__link--active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="app-main fade-in">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="app-footer__gradient-line" />
        <div className="app-footer__content">
          <Logo variant="icon" size="small" className="footer-logo" />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <SystemStatus />
          </div>
        </div>
      </footer>
      <WorkspaceDrawer />
      <StudioPlayer />
      <CommandPalette />
      <HapticFeedback />
    </div>
  );
}
