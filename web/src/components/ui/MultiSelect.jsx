/**
 * MultiSelect Component
 * Dropdown with checkboxes for multiple selection
 */
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import './MultiSelect.css';

export function MultiSelect({
  options = [],
  value = [],
  onChange,
  label,
  placeholder = 'Select options...'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (option) => {
    const newValue = value.includes(option)
      ? value.filter(v => v !== option)
      : [...value, option];
    onChange?.(newValue);
  };

  const handleSelectAll = () => {
    onChange?.(filteredOptions);
  };

  const handleClearAll = () => {
    onChange?.([]);
    setSearchQuery('');
  };

  const handleRemove = (option, e) => {
    e.stopPropagation();
    onChange?.(value.filter(v => v !== option));
  };

  return (
    <div className="multiselect" ref={dropdownRef}>
      {label && <label className="multiselect__label">{label}</label>}

      <button
        type="button"
        className="multiselect__trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="multiselect__selected">
          {value.length === 0 ? (
            <span className="multiselect__placeholder">{placeholder}</span>
          ) : (
            <div className="multiselect__pills">
              {value.map(item => (
                <span key={item} className="multiselect__pill">
                  {item}
                  <button
                    type="button"
                    className="multiselect__pill-remove"
                    onClick={(e) => handleRemove(item, e)}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`multiselect__icon ${isOpen ? 'open' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="multiselect__dropdown">
          <div className="multiselect__search">
            <Search size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="multiselect__search-input"
            />
          </div>

          <div className="multiselect__actions">
            <button
              type="button"
              className="multiselect__action-btn"
              onClick={handleSelectAll}
            >
              Select All
            </button>
            <button
              type="button"
              className="multiselect__action-btn"
              onClick={handleClearAll}
            >
              Clear All
            </button>
          </div>

          <div className="multiselect__options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <label key={option} className="multiselect__option">
                  <input
                    type="checkbox"
                    checked={value.includes(option)}
                    onChange={() => handleToggle(option)}
                    className="multiselect__checkbox"
                  />
                  <span className="multiselect__option-label">{option}</span>
                </label>
              ))
            ) : (
              <div className="multiselect__empty">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
