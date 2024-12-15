"use client";

import React, { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

// Membuat konteks
const DarkModeContext = createContext();

// Custom hook untuk menggunakan konteks
export const useDarkMode = () => useContext(DarkModeContext);

// Provider untuk menyediakan state ke dalam aplikasi
export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === "true");
    }
    setIsLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (isLoaded) {
      // Only update localStorage if the setting is loaded
      localStorage.setItem("darkMode", darkMode);
    }
  }, [darkMode, isLoaded]);

  const toggleDarkMode = (value) => {
    const newMode = value;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {isLoaded && children}
    </DarkModeContext.Provider>
  );
};

DarkModeProvider.propTypes = {
  children: PropTypes.node,
};
