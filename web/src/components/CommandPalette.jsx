import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, X, ArrowRight, BookOpen, Database, Code, FileText, Info, Activity, BarChart3, Zap } from 'lucide-react';
import Fuse from 'fuse.js';
import { useSearchIndex } from '../lib/hooks';
import './CommandPalette.css';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState([]);
  
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const modalRef = useRef(null);
  const { searchIndex } = useSearchIndex();

  // Static navigation items
  const navItems = useMemo(() => [
    { type: 'nav', name: 'Home', path: '/', icon: <Database /> },
    { type: 'nav', name: 'Domains', path: '/domains', icon: <Database /> },
    { type: 'nav', name: 'Dictionary', path: '/dictionary', icon: <BookOpen /> },
    { type: 'nav', name: 'Search', path: '/search', icon: <Search /> },
    { type: 'nav', name: 'Studio', path: '/studio', icon: <Activity /> },
    { type: 'nav', name: 'Architecture', path: '/architecture', icon: <Zap /> },
    { type: 'nav', name: 'Docs', path: '/docs', icon: <FileText /> },
    { type: 'nav', name: 'Statistics', path: '/stats', icon: <BarChart3 /> },
    { type: 'nav', name: 'Settings', path: '/settings', icon: <Code /> },
    { type: 'nav', name: 'About', path: '/about', icon: <Info /> }
  ], []);

  // System Commands
  const systemCommands = useMemo(() => [
    { type: 'cmd', name: 'Toggle Studio Mode', action: 'toggle_audio', icon: <Activity /> },
    { type: 'cmd', name: 'Clear Workspace', action: 'clear_workspace', icon: <X /> },
    { type: 'cmd', name: 'System Reboot (Reload)', action: 'reload', icon: <Command /> }
  ], []);

  // Initialize Fuse
  const fuses = useMemo(() => {
    if (!searchIndex) return null;
    return {
      entities: new Fuse(searchIndex.entities, {
        keys: ['name', 'id', 'tags', 'one_liner', 'aliases'],
        threshold: 0.3
      }),
      words: new Fuse(searchIndex.words, {
        keys: ['name'],
        threshold: 0.3
      }),
      nav: new Fuse([...navItems, ...systemCommands], {
        keys: ['name'],
        threshold: 0.3
      })
    };
  }, [searchIndex, navItems, systemCommands]);

  // Handle open/close with keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      // Close with Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setDebouncedQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Debounce query input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 150);
    
    return () => clearTimeout(timer);
  }, [query]);

  // Search logic (using debounced query)
  useEffect(() => {
    if (!fuses && debouncedQuery) return;

    if (!debouncedQuery) {
      setResults(navItems.slice(0, 5));
      return;
    }

    const navResults = fuses.nav.search(debouncedQuery).map(r => ({ ...r.item, type: 'nav' }));
    const entityResults = fuses.entities ? fuses.entities.search(debouncedQuery).map(r => ({ ...r.item, type: 'entity' })).slice(0, 5) : [];
    const wordResults = fuses.words ? fuses.words.search(debouncedQuery).map(r => ({ ...r.item, type: 'word' })).slice(0, 5) : [];

    setResults([...navResults, ...entityResults, ...wordResults].slice(0, 10));
    setSelectedIndex(0);
  }, [debouncedQuery, fuses, navItems]);

  // Keyboard navigation logic
  const handleKeyDown = (e) => {
    if (results.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  const handleSelect = (item) => {
    setIsOpen(false);
    if (item.type === 'nav') {
      navigate(item.path);
    } else if (item.type === 'cmd') {
      // Execute command
      if (item.action === 'reload') window.location.reload();
      if (item.action === 'toggle_audio') {
        // Dispatch custom event for StudioPlayer to catch
        window.dispatchEvent(new CustomEvent('studio-toggle'));
      }
      if (item.action === 'clear_workspace') {
        // Dispatch event for Workspace
         window.dispatchEvent(new CustomEvent('workspace-clear'));
      }
    } else if (item.type === 'entity') {
      navigate(`/domains/${item.domain}/entities/${item.id}`);
    } else if (item.type === 'word') {
      navigate(`/dictionary/${item.letter}/${item.name.toLowerCase()}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cmd-overlay" onClick={() => setIsOpen(false)} role="dialog" aria-modal="true" aria-labelledby="cmd-title">
      <div 
        ref={modalRef}
        className="cmd-modal" 
        onClick={e => e.stopPropagation()}
        role="search"
      >
        <div className="cmd-header">
          <Search className="cmd-icon" size={20} aria-hidden="true" />
          <label htmlFor="cmd-search" className="sr-only" id="cmd-title">
            Command Palette Search
          </label>
          <input
            id="cmd-search"
            ref={inputRef}
            type="text"
            className="cmd-input"
            placeholder="Type a command or search..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-autocomplete="list"
            aria-controls="cmd-results-list"
            aria-activedescendant={results.length > 0 ? `cmd-item-${selectedIndex}` : undefined}
          />
          <button 
            className="cmd-close" 
            onClick={() => setIsOpen(false)}
            aria-label="Close command palette"
          >
            <div className="cmd-shortcut">ESC</div>
          </button>
        </div>
        
        <div className="cmd-results" id="cmd-results-list" role="listbox">
          {results.length > 0 ? results.map((item, index) => (
            <div
              key={index}
              id={`cmd-item-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              className={`cmd-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="cmd-item-icon">
                {item.type === 'nav' ? item.icon : 
                 item.type === 'cmd' ? <Command size={16} /> :
                 item.type === 'entity' ? <Database size={16} /> : 
                 <BookOpen size={16} />}
              </div>
              <div className="cmd-item-content">
                <span className="cmd-item-title">{item.name}</span>
                {item.type === 'entity' && <span className="cmd-item-subtitle">{item.domain}</span>}
                {item.type === 'word' && <span className="cmd-item-subtitle">Dictionary</span>}
              </div>
              {index === selectedIndex && <ArrowRight size={16} className="cmd-item-arrow" />}
            </div>
          )) : (
            <div className="cmd-empty">No results found</div>
          )}
        </div>
        
        <div className="cmd-footer">
          <div className="cmd-footer-group">
            <span className="cmd-key">↑</span>
            <span className="cmd-key">↓</span>
            <span>to navigate</span>
          </div>
          <div className="cmd-footer-group">
            <span className="cmd-key">↵</span>
            <span>to select</span>
          </div>
        </div>
      </div>
    </div>
  );
}
