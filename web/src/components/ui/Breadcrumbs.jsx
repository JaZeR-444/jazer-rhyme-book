import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, Clock, Home, BookOpen, Database, Search, Edit3, X, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useBrowsingHistory } from '../../contexts/BrowsingHistoryContext';
import './Breadcrumbs.css';

const PAGE_ICONS = {
  '/': <Home size={14} />,
  '/domains': <Database size={14} />,
  '/dictionary': <BookOpen size={14} />,
  '/search': <Search size={14} />,
  '/studio': <Edit3 size={14} />,
};

function formatTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Breadcrumbs - Renders a breadcrumb trail with history dropdown
 *
 * @param {Object} props
 * @param {{label:string,path:string}[]} props.items - Ordered breadcrumb segments
 * @returns {JSX.Element}
 */
export function Breadcrumbs({ items }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const location = useLocation();
  const { getRecentPages, clearPageHistory, pageHistory, addToPageHistory } = useBrowsingHistory();

  // Track current page in history
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === '/' || currentPath === '*') return;

    // Determine label and icon
    let label = currentPath.split('/').pop() || 'Home';
    label = label.charAt(0).toUpperCase() + label.slice(1);

    // Get icon based on path
    let icon = null;
    for (const [path, pathIcon] of Object.entries(PAGE_ICONS)) {
      if (currentPath.startsWith(path)) {
        icon = pathIcon;
        break;
      }
    }

    addToPageHistory(currentPath, label, icon);
  }, [location.pathname, addToPageHistory]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClearHistory = () => {
    clearPageHistory();
  };

  // Get filtered history based on active category
  const getFilteredHistory = () => {
    let filtered = pageHistory;

    if (activeCategory === 'dictionary') {
      filtered = pageHistory.filter(h => h.path.startsWith('/dictionary'));
    } else if (activeCategory === 'domains') {
      filtered = pageHistory.filter(h => h.path.startsWith('/domains'));
    } else if (activeCategory === 'other') {
      filtered = pageHistory.filter(h =>
        !h.path.startsWith('/dictionary') &&
        !h.path.startsWith('/domains')
      );
    }

    return filtered.slice(0, 10);
  };

  return (
    <div className="breadcrumbs-wrapper">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol className="breadcrumbs__list">
          {items.map((item, index) => (
            <li key={index} className="breadcrumbs__item">
              {index < items.length - 1 ? (
                <>
                  <Link to={item.path} className="breadcrumbs__link">
                    {index === 0 ? '~' : item.label}
                  </Link>
                  <span className="breadcrumbs__separator">/</span>
                </>
              ) : (
                <span className="breadcrumbs__current">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* History Dropdown Toggle */}
      <button
        ref={buttonRef}
        className="breadcrumbs__history-toggle"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-label="View browsing history"
      >
        <Clock size={16} />
        <ChevronDown size={14} className={isOpen ? 'rotated' : ''} />
      </button>

      {/* History Dropdown */}
      {isOpen && (
        <div ref={dropdownRef} className="breadcrumbs__dropdown">
          <div className="dropdown__header">
            <h3 className="dropdown__title">Browsing History</h3>
            <div className="dropdown__actions">
              <div className="dropdown__categories">
                <button
                  className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('all')}
                >
                  All
                </button>
                <button
                  className={`category-btn ${activeCategory === 'dictionary' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('dictionary')}
                >
                  Dictionary
                </button>
                <button
                  className={`category-btn ${activeCategory === 'domains' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('domains')}
                >
                  Domains
                </button>
              </div>
              <button
                className="clear-btn"
                onClick={handleClearHistory}
                title="Clear history"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="dropdown__content">
            {getFilteredHistory().length === 0 ? (
              <div className="dropdown__empty">
                <p>No history yet</p>
                <p className="dropdown__empty-hint">Start browsing to see your history here</p>
              </div>
            ) : (
              <ul className="dropdown__list">
                {getFilteredHistory().map((item, index) => (
                  <li key={`${item.path}-${index}`} className="dropdown__item">
                    <Link
                      to={item.path}
                      className="dropdown__link"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="dropdown__icon">
                        {item.icon || <ArrowRight size={14} />}
                      </span>
                      <span className="dropdown__label">{item.label}</span>
                      <span className="dropdown__path">{item.path}</span>
                      <span className="dropdown__time">
                        {formatTimeAgo(item.viewedAt)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="dropdown__footer">
            <span className="dropdown__count">
              {pageHistory.length} page{pageHistory.length !== 1 ? 's' : ''} visited
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired
    })
  ).isRequired
};
