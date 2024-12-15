import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const DropDown = ({ onChange, options }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref untuk elemen dropdown

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left z-10" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-max flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm text-teal-800 bg-gray-50 rounded-lg border-2 border-teal-500 dark:bg-gray-700 dark:text-white focus:border-black dark:focus:border-white"
      >
        <span className="sm:hidden">
          <FilterIcon />
        </span>
        <span className="hidden sm:block">{selectedOption}</span>
        <svg
          className="hidden sm:block w-5 h-5 ml-2 -mr-1"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:font-medium"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

DropDown.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DropDown;

export function FilterIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M10 18v-2h4v2zm-4-5v-2h12v2zM3 8V6h18v2z"
      ></path>
    </svg>
  );
}
