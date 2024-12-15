"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";

// Membuat konteks
const AppStateContext = createContext();
// Custom hook untuk menggunakan konteks
export const useAppState = () => useContext(AppStateContext);

// Provider untuk menyediakan state ke dalam aplikasi
export const AppStateProvider = ({ children }) => {
  const [state, setState] = useState({
    modal: {
      open: false,
      children: <div></div>,
      reOpen: false,
    },
    isUserLogin: false,
    currentUser: null,
    isPageLoading: false,
  });

  const updateAppState = {
    modal: useCallback((value) => {
      setState((prevState) => ({
        ...prevState,
        modal: { ...prevState.modal, ...value },
      }));
    }, []),
    isUserLogin: useCallback((value) => {
      setState((prevState) => ({
        ...prevState,
        isUserLogin: value,
      }));
    }, []),
    currentUser: useCallback((value) => {
      setState((prevState) => ({
        ...prevState,
        currentUser: value,
      }));
    }, []),
    isPageLoading: useCallback((value) => {
      setState((prevState) => ({
        ...prevState,
        isPageLoading: value,
      }));
    }, []),
  };

  return (
    <AppStateContext.Provider
      value={{
        ...state,
        updateAppState,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

AppStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
