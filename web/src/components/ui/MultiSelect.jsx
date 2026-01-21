/**
 * MultiSelect Component
 * Dropdown with checkboxes for multiple selection
 *
 * @param {Object} props
 * @param {string[]} props.options - Available option labels
 * @param {string[]} props.value - Selected options
 * @param {function} [props.onChange] - Change handler receiving new values
 * @param {string} [props.label] - Visible label text
 * @param {string} [props.placeholder] - Placeholder copy for empty state
 * @returns {JSX.Element}
 */
import PropTypes from 'prop-types';
import { useState, useRef, useEffect, useId } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const triggerId = useId();
  const listboxId = useId();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset active index when dropdown opens/closes or search changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [isOpen, searchQuery]);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0) {
          handleToggle(filteredOptions[activeIndex]);
        }
        break;
      case 'Tab':
        // Optional: close on tab away if needed, usually browser handles
        break;
    }
  };

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
      {label && <label id={triggerId} className="multiselect__label">{label}</label>}

      <button
        type="button"
        className="multiselect__trigger"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? triggerId : undefined}
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
                    aria-label={`Remove ${item}`}
                  >
                    <X size={12} aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`multiselect__icon ${isOpen ? 'open' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="multiselect__dropdown">
          <div className="multiselect__search">
            <Search size={16} aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="multiselect__search-input"
              aria-label="Filter options"
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

          <div 
            className="multiselect__options" 
            role="listbox" 
            id={listboxId}
            aria-multiselectable="true"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <label 
                  key={option} 
                  className={`multiselect__option ${index === activeIndex ? 'active' : ''}`}
                  role="option"
                  aria-selected={value.includes(option)}
                >
                  <input
                    type="checkbox"
                    checked={value.includes(option)}
                    onChange={() => handleToggle(option)}
                    className="multiselect__checkbox"
                    tabIndex={-1}
                  />
                  <span className="multiselect__option-label">{option}</span>
                </label>
              ))
            ) : (
              <div className="multiselect__empty" role="status">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

MultiSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func,
  label: PropTypes.string,
  placeholder: PropTypes.string
};
