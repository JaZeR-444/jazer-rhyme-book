import { useState, useEffect } from 'react';
import { Clock, Search, Navigation, Command as CommandIcon } from 'lucide-react';
import './ActionHistory.css';

/**
 * ActionHistory - Tracks and displays recent command palette actions
 */

const MAX_HISTORY = 20;
const STORAGE_KEY = 'jazer_command_history';

export function ActionHistory({ onSelect, visible = true }) {
  const [history, setHistory] = useState([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load command history:', error);
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (newHistory) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save command history:', error);
    }
  };

  // Add item to history
  const addToHistory = (item) => {
    const timestamp = Date.now();
    const historyItem = {
      ...item,
      timestamp,
      id: `${timestamp}-${Math.random()}`
    };

    setHistory(prev => {
      // Remove duplicates (same query/path)
      const filtered = prev.filter(h => 
        h.query !== item.query && h.path !== item.path
      );

      // Add new item at the beginning
      const newHistory = [historyItem, ...filtered].slice(0, MAX_HISTORY);
      saveHistory(newHistory);
      return newHistory;
    });
  };

  // Clear all history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Get icon based on type
  const getIcon = (type) => {
    switch (type) {
      case 'search':
        return <Search size={14} />;
      case 'navigate':
        return <Navigation size={14} />;
      case 'action':
        return <CommandIcon size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!visible || history.length === 0) return null;

  return (
    <div className="action-history">
      <div className="action-history__header">
        <div className="action-history__title">
          <Clock size={16} />
          <span>Recent Actions</span>
        </div>
        <button 
          className="action-history__clear"
          onClick={clearHistory}
          title="Clear history"
        >
          Clear
        </button>
      </div>

      <div className="action-history__list">
        {history.map((item) => (
          <button
            key={item.id}
            className="action-history__item"
            onClick={() => onSelect?.(item)}
          >
            <div className="action-history__icon">
              {getIcon(item.type)}
            </div>
            <div className="action-history__content">
              <div className="action-history__name">
                {item.query || item.path || item.name}
              </div>
              <div className="action-history__meta">
                <span className="action-history__type">{item.type}</span>
                <span className="action-history__time">{formatTime(item.timestamp)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Custom hook for managing history
export function useActionHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }, []);

  const addToHistory = (item) => {
    const timestamp = Date.now();
    const historyItem = {
      ...item,
      timestamp,
      id: `${timestamp}-${Math.random()}`
    };

    setHistory(prev => {
      const filtered = prev.filter(h => 
        h.query !== item.query && h.path !== item.path
      );
      const newHistory = [historyItem, ...filtered].slice(0, MAX_HISTORY);
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error('Failed to save history:', error);
      }

      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    history,
    addToHistory,
    clearHistory
  };
}
