"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";

// Membuat konteks
const UsersAccStateContext = createContext();
// Custom hook untuk menggunakan konteks
export const useUsersAccState = () => useContext(UsersAccStateContext);

// Provider untuk menyediakan state ke dalam aplikasi
export const UsersAccStateProvider = ({ children }) => {
  const [state, setState] = useState({
    refreshDataAcc: 1,
    eventOrg: [],
    isLoading: false,
  });

  const updateUsersAccState = {
    refreshDataAcc: useCallback(() => {
      setState((prevState) => ({
        ...prevState,
        refreshDataAcc: prevState.refreshDataAcc + 1,
      }));
    }, []),
    eventOrg: useCallback((value) => {
      setState((prevState) => ({
        ...prevState,
        eventOrg: value,
      }));
    }, []),
    isLoading: useCallback((value) => {
      setState((prevState) => ({
        ...prevState,
        isLoading: value,
      }));
    }, []),
  };

  return (
    <UsersAccStateContext.Provider
      value={{
        ...state,
        updateUsersAccState,
      }}
    >
      {children}
    </UsersAccStateContext.Provider>
  );
};

UsersAccStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
