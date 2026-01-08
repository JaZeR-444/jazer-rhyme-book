import { Search, X } from 'lucide-react';
import './SearchBar.css';

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
