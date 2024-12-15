"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";

// Membuat konteks
const AdminStateContext = createContext();
// Custom hook untuk menggunakan konteks
export const useAdminState = () => useContext(AdminStateContext);

// Provider untuk menyediakan state ke dalam aplikasi
export const AdminStateProvider = ({ children }) => {
  const [state, setState] = useState({
    isAdminLogin: false,
    currentAdmin: {
      username: "Admin",
      prodi: "Teknik Informatika",
    },
    allMsg: [],
    msgNoRead: 0,
    refreshDataMsg: 1,
    loadingMsg: false,
  });

  const updateAdminState = {
    isAdminLogin: useCallback((value) => {
      setState((prevState) => ({
        ...prevState,
        isAdminLogin: value,
      }));
    }, []),
    currentAdmin: useCallback((value) => {
      setState((prevState) => ({
        ...prevState,
        currentAdmin: value,
      }));
    }, []),
    allMsg: useCallback((value) => {
      setState((prevState) => ({
        ...prevState,
        allMsg: value,
      }));
    }, []),
    msgNoRead: useCallback((value) => {
      setState((prevState) => ({
        ...prevState,
        msgNoRead: value,
      }));
    }),
    refreshDataMsg: useCallback((value) => {
      setState((prevState) => ({
        ...prevState,
        refreshDataMsg: value || prevState.refreshDataMsg + 1,
      }));
    }, []),
    loadingMsg: useCallback((value) => {
      setState((prevState) => ({
        ...prevState,
        loadingMsg: value,
      }));
    }),
  };

  return (
    <AdminStateContext.Provider
      value={{
        ...state,
        updateAdminState,
      }}
    >
      {children}
    </AdminStateContext.Provider>
  );
};

AdminStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
