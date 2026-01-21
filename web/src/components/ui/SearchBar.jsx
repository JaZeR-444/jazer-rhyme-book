import PropTypes from 'prop-types';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

/**
 * SearchBar - Minimal search input with clear affordance
 *
 * @param {Object} props
 * @param {string} props.value - Current input value
 * @param {function} props.onChange - Change handler
 * @param {string} [props.placeholder] - Placeholder text
 * @param {function} [props.onClear] - Optional clear handler
 * @param {string} [props.className] - Additional class names
 * @returns {JSX.Element}
 */
export function SearchBar({ value, onChange, placeholder = 'Search...', onClear, className = '' }) {
  return (
    <div className={`search-bar ${className}`}>
      <Search className="search-bar__icon" size={20} />
      <input
        type="text"
        className="search-bar__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button className="search-bar__clear" onClick={onClear} aria-label="Clear search">
          <X size={18} />
        </button>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  onClear: PropTypes.func,
  className: PropTypes.string
};
