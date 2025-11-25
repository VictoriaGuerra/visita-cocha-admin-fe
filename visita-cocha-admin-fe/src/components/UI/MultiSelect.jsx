import React from 'react';
import './MultiSelect.css';

const MultiSelect = ({ options = [], value = [], onChange }) => {
  const handleChange = (option) => {
    const newValue = value.includes(option)
      ? value.filter(item => item !== option)
      : [...value, option];
    onChange(newValue);
  };

  return (
    <div className="multi-select">
      <div className="selected-options">
        {value.map(option => (
          <span key={option} className="selected-tag">
            {option}
            <button
              type="button"
              onClick={() => handleChange(option)}
              className="remove-tag"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="options-list">
        {options.map(option => (
          <label key={option} className="option-item">
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={() => handleChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default MultiSelect;