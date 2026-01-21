/**
 * RangeSlider Component
 * Dual-handle slider for selecting numeric ranges
 *
 * @param {Object} props
 * @param {number} [props.min=0] - Minimum allowed value
 * @param {number} [props.max=100] - Maximum allowed value
 * @param {[number,number]} [props.value] - Current range selection
 * @param {function} [props.onChange] - Change handler
 * @param {string} [props.label] - Label text
 * @param {number} [props.step=1] - Step increment
 * @returns {JSX.Element}
 */
import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import './RangeSlider.css';

export function RangeSlider({
  min = 0,
  max = 100,
  value = [min, max],
  onChange,
  label,
  step = 1
}) {
  const [localValue, setLocalValue] = useState(value);
  const rangeRef = useRef(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMinChange = (e) => {
    const newMin = Math.min(Number(e.target.value), localValue[1] - step);
    const newValue = [newMin, localValue[1]];
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  const handleMaxChange = (e) => {
    const newMax = Math.max(Number(e.target.value), localValue[0] + step);
    const newValue = [localValue[0], newMax];
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  const minPercent = ((localValue[0] - min) / (max - min)) * 100;
  const maxPercent = ((localValue[1] - min) / (max - min)) * 100;

  return (
    <div className="range-slider">
      {label && (
        <div className="range-slider__header">
          <label className="range-slider__label">{label}</label>
          <span className="range-slider__value">
            {localValue[0]} - {localValue[1]}
          </span>
        </div>
      )}

      <div className="range-slider__container" ref={rangeRef}>
        <div className="range-slider__track">
          <div
            className="range-slider__range"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`
            }}
          />
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={handleMinChange}
          className="range-slider__input range-slider__input--min"
          aria-label={`${label} minimum`}
          aria-valuemin={min}
          aria-valuemax={localValue[1]}
          aria-valuenow={localValue[0]}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="range-slider__input range-slider__input--max"
          aria-label={`${label} maximum`}
          aria-valuemin={localValue[0]}
          aria-valuemax={max}
          aria-valuenow={localValue[1]}
        />
      </div>
    </div>
  );
}

RangeSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func,
  label: PropTypes.string,
  step: PropTypes.number
};
