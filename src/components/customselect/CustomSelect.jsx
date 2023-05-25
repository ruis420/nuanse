import React, { useState, useRef, useEffect } from 'react';
import './customselect.css';

const CustomSelect = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('English');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="custom-select" ref={wrapperRef}>
      <div className="selected-option" onClick={() => setIsOpen(!isOpen)}>
        {selectedOption}
      </div>
      {isOpen && (
        <div className="options-container-wrapper">
          <div className="options-container">
            {options.map((option, index) => (
              <div 
                key={index} 
                className="option" 
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
