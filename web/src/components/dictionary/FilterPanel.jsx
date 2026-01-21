/**
 * FilterPanel Component
 * Advanced filtering panel for dictionary words
 */
import { X, RotateCcw } from 'lucide-react';
import { RangeSlider } from '../ui/RangeSlider';
import { MultiSelect } from '../ui/MultiSelect';
import { RadioGroup } from '../ui/RadioGroup';
import { useFilters } from '../../contexts/FilterContext';
import './FilterPanel.css';

export function FilterPanel({
  isOpen,
  onClose,
  availablePartsOfSpeech = [],
  availableTags = []
}) {
  const { filters, updateFilter, resetFilters, isDefaultFilters } = useFilters();

  const complexityOptions = [
    { value: 'All', label: 'All Levels' },
    { value: 'basic', label: 'Basic' },
    { value: 'medium', label: 'Medium' },
    { value: 'advanced', label: 'Advanced' }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="filter-panel-overlay" onClick={onClose} />
      )}

      {/* Panel */}
      <div className={`filter-panel ${isOpen ? 'open' : ''}`}>
        <div className="filter-panel__header">
          <h2 className="filter-panel__title">Filters</h2>
          <button
            className="filter-panel__close"
            onClick={onClose}
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>

        <div className="filter-panel__content">
          {/* Syllables */}
          <div className="filter-panel__section">
            <RangeSlider
              label="Syllables"
              min={1}
              max={8}
              value={filters.syllableRange}
              onChange={(value) => updateFilter('syllableRange', value)}
            />
          </div>

          {/* Word Length */}
          <div className="filter-panel__section">
            <RangeSlider
              label="Word Length"
              min={1}
              max={20}
              value={filters.lengthRange}
              onChange={(value) => updateFilter('lengthRange', value)}
            />
          </div>

          {/* Part of Speech */}
          {availablePartsOfSpeech.length > 0 && (
            <div className="filter-panel__section">
              <MultiSelect
                label="Part of Speech"
                options={availablePartsOfSpeech}
                value={filters.partsOfSpeech}
                onChange={(value) => updateFilter('partsOfSpeech', value)}
                placeholder="Select parts of speech..."
              />
            </div>
          )}

          {/* Tags */}
          {availableTags.length > 0 && (
            <div className="filter-panel__section">
              <MultiSelect
                label="Tags"
                options={availableTags}
                value={filters.tags}
                onChange={(value) => updateFilter('tags', value)}
                placeholder="Select tags..."
              />
            </div>
          )}

          {/* Content Flags */}
          <div className="filter-panel__section">
            <label className="filter-panel__section-label">Content</label>
            <div className="filter-panel__checkboxes">
              <label className="filter-panel__checkbox">
                <input
                  type="checkbox"
                  checked={filters.hasRhymes}
                  onChange={(e) => updateFilter('hasRhymes', e.target.checked)}
                />
                <span>Has Rhymes</span>
              </label>
              <label className="filter-panel__checkbox">
                <input
                  type="checkbox"
                  checked={filters.hasExamples}
                  onChange={(e) => updateFilter('hasExamples', e.target.checked)}
                />
                <span>Has Examples</span>
              </label>
            </div>
          </div>

          {/* Complexity */}
          <div className="filter-panel__section">
            <RadioGroup
              label="Complexity"
              options={complexityOptions}
              value={filters.complexity}
              onChange={(value) => updateFilter('complexity', value)}
              name="complexity"
            />
          </div>
        </div>

        <div className="filter-panel__footer">
          <button
            className="filter-panel__reset"
            onClick={resetFilters}
            disabled={isDefaultFilters()}
          >
            <RotateCcw size={16} />
            Reset Filters
          </button>
        </div>
      </div>
    </>
  );
}
