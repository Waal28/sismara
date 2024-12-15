import React from "react";
import PropTypes from "prop-types";
import { debounce } from "lodash";

export default function SearchBar({
  placeholder,
  updateState,
  showSuggestions = false,
  loadingSuggestions = false,
  filteredSuggestions = [],
  handleSelectSuggestion = () => {},
}) {
  const [keyword, setKeyword] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);
  const debouncedUpdate = React.useMemo(
    () => debounce((value) => updateState(value), 500), // Adjust the delay as needed
    [updateState]
  );
  const handleChange = (event) => {
    setKeyword(event.target.value);
    debouncedUpdate(event.target.value);
  };
  const handleClick = (suggest) => {
    setKeyword("");
    handleSelectSuggestion(suggest);
  };

  return (
    <div className="relative w-full">
      <input
        type="search"
        name="search"
        className="block p-2.5 w-full z-20 text-xs sm:text-sm bg-gray-50 rounded-lg border-2 border-gray-500 dark:bg-gray-700 dark:placeholder-white dark:text-white"
        placeholder={placeholder}
        value={keyword}
        autoComplete="off"
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setTimeout(() => setIsFocused(false), 300);
        }}
      />
      {/* Suggestions dropdown */}
      {showSuggestions &&
        isFocused &&
        !loadingSuggestions &&
        filteredSuggestions.length > 0 && (
          <ul className="absolute left-0 right-0 bg-white dark:bg-gray-700 border border-gray-500 rounded-lg z-30 mt-1 max-h-40 overflow-y-auto text-sm">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                onClick={() => handleClick(suggestion)}
              >
                {suggestion.label}
              </li>
            ))}
          </ul>
        )}

      {/* Loading suggestions */}
      {showSuggestions && isFocused && loadingSuggestions && (
        <p className="absolute left-0 right-0 bg-white dark:bg-gray-700 border border-gray-500 rounded-lg z-30 mt-1 p-3 text-gray-400 text-sm">
          Memuat hasil pencarian...
        </p>
      )}

      {/* No suggestions found */}
      {showSuggestions &&
        isFocused &&
        !loadingSuggestions &&
        filteredSuggestions.length === 0 && (
          <p className="absolute left-0 right-0 bg-white dark:bg-gray-700 border border-gray-500 rounded-lg z-30 mt-1 p-3 text-gray-400 text-sm">
            Tidak ada hasil yang cocok.
          </p>
        )}
    </div>
  );
}

SearchBar.propTypes = {
  placeholder: PropTypes.string.isRequired,
  updateState: PropTypes.func.isRequired,
  showSuggestions: PropTypes.bool,
  loadingSuggestions: PropTypes.bool,
  filteredSuggestions: PropTypes.array,
  handleSelectSuggestion: PropTypes.func,
};
