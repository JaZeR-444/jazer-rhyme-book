/**
 * RadioGroup Component
 * Custom styled radio buttons with vertical layout
 */
import './RadioGroup.css';

export function RadioGroup({
  options = [],
  value,
  onChange,
  label,
  name
}) {
  return (
    <div className="radio-group">
      {label && <label className="radio-group__label">{label}</label>}

      <div className="radio-group__options">
        {options.map(option => {
          const optionValue = typeof option === 'string' ? option : option.value;
          const optionLabel = typeof option === 'string' ? option : option.label;
          const isSelected = value === optionValue;

          return (
            <label
              key={optionValue}
              className={`radio-group__option ${isSelected ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name={name}
                value={optionValue}
                checked={isSelected}
                onChange={(e) => onChange?.(e.target.value)}
                className="radio-group__input"
              />
              <span className="radio-group__radio">
                {isSelected && <span className="radio-group__radio-dot" />}
              </span>
              <span className="radio-group__option-label">{optionLabel}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
