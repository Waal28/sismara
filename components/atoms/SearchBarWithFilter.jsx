import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import FilterListEvents from "../pages/sistem/acara/components/FilterListEvents";

const SearchBarWithFilter = ({ placeholder, fetchData, isFilter = true }) => {
  const [keyword, setKeyword] = useState("");

  // Use useMemo to create a debounced function that only runs after a delay
  const debouncedFetchData = useMemo(
    () => debounce((payload) => fetchData(payload), 500), // Adjust the delay as needed
    [fetchData]
  );

  const handleChange = (event) => {
    setKeyword(event.target.value);
    const payload = {
      keyword: event.target.value,
    };
    debouncedFetchData(payload); // Call debounced function instead of directly calling fetchData
  };

  return (
    <form className="lg:w-[512px] w-full">
      <div className="flex items-center gap-3">
        <div className="relative w-full">
          <input
            type="search"
            name="search"
            className="block p-2.5 w-full z-20 text-xs sm:text-sm text-teal-800 bg-gray-50 rounded-lg border-2 border-teal-500 dark:bg-gray-700 placeholder-teal-800 dark:placeholder-white dark:text-white"
            placeholder={placeholder}
            value={keyword}
            onChange={handleChange}
          />
        </div>
        {isFilter && <FilterListEvents />}
      </div>
    </form>
  );
};

SearchBarWithFilter.propTypes = {
  placeholder: PropTypes.string.isRequired,
  fetchData: PropTypes.func.isRequired,
  isFilter: PropTypes.bool,
};

export default SearchBarWithFilter;
