import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Database, BookOpen, Search, Code, FileText, Info, Menu, X, Edit3, Settings } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './common/Logo';
import { WorkspaceDrawer } from './WorkspaceDrawer';
import { CommandPalette } from './CommandPalette';
import { StudioPlayer } from './StudioPlayer';
import { SystemStatus } from './SystemStatus';
import { HapticFeedback } from './HapticFeedback';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';
import { BottomNav } from './BottomNav';
import { useKeyboardShortcuts } from '../lib/useKeyboardShortcuts';
import { useWorkspace } from '../lib/WorkspaceContext';
import './AppLayout.css';

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleWorkspace, exportWorkspace } = useWorkspace();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: <Database size={18} /> },
    { path: '/domains', label: 'Domains', icon: <Database size={18} /> },
    { path: '/dictionary', label: 'Dictionary', icon: <BookOpen size={18} /> },
    { path: '/search', label: 'Search', icon: <Search size={18} /> },
    { path: '/studio', label: 'Studio', icon: <Edit3 size={18} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={18} /> },
    { path: '/about', label: 'About', icon: <Info size={18} /> }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Global keyboard shortcuts
  useKeyboardShortcuts({
    // Navigation
    '/': () => navigate('/search'),
    'ctrl+k': () => navigate('/search'),
    'w': () => toggleWorkspace(),
    'g+h': () => navigate('/'),
    'g+d': () => navigate('/domains'),
    'g+w': () => navigate('/dictionary'),
    'g+s': () => navigate('/studio'),

    // Actions
    'ctrl+e': () => {
      const text = exportWorkspace();
      if (text) {
        const blob = new Blob([text], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `verse-board-${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
      }
    },

    // Help
    '?': () => setShowShortcutsHelp(true),
    'shift+/': () => setShowShortcutsHelp(true),
    'escape': () => {
      setShowShortcutsHelp(false);
      setMobileMenuOpen(false);
    },
  });

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


      </header>

      {/* Mobile Nav Overlay - Moved outside header to avoid backdrop-filter stacking issues */}
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
          <button
            className="app-footer__shortcuts-btn"
            onClick={() => setShowShortcutsHelp(true)}
            title="Keyboard shortcuts (Press ?)"
          >
            <span className="shortcuts-icon">⌨</span>
            <span className="shortcuts-text">Shortcuts</span>
          </button>
        </div>
      </footer>
      <WorkspaceDrawer />
      <StudioPlayer />
      <CommandPalette />
      <HapticFeedback />
      <BottomNav />
      <KeyboardShortcutsHelp
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />
    </div>
  );
}
