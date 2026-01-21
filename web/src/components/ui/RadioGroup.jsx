/**
 * RadioGroup Component
 * Custom styled radio buttons with vertical layout
 *
 * @param {Object} props
 * @param {Array<string|{value:string,label:string}>} props.options - Available options
 * @param {string} props.value - Current selection value
 * @param {function} [props.onChange] - Change handler
 * @param {string} [props.label] - Group label
 * @param {string} [props.name] - Native radio name
 * @returns {JSX.Element}
 */
import PropTypes from 'prop-types';
import { useId } from 'react';
import './RadioGroup.css';

export function RadioGroup({
  options = [],
  value,
  onChange,
  label,
  name
}) {
  const labelId = useId();

  return (
    <div 
      className="radio-group"
      role="radiogroup"
      aria-labelledby={label ? labelId : undefined}
    >
      {label && <label id={labelId} className="radio-group__label">{label}</label>}

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

RadioGroup.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
      })
    ])
  ).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  name: PropTypes.string
};
