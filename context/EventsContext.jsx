"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";

// Membuat konteks
const EventsStateContext = createContext();
// Custom hook untuk menggunakan konteks
export const useEventsState = () => useContext(EventsStateContext);

// Provider untuk menyediakan state ke dalam aplikasi
export const EventsStateProvider = ({ children }) => {
  const [state, setState] = useState({
    refreshEvents: 1,
    events: [],
    isLoading: false,
    currEvent: null,
    filters: null,
    dateRange: null,
  });

  const updateEventsState = {
    refreshEvents: useCallback(() => {
      setState((prevState) => ({
        ...prevState,
        refreshEvents: prevState.refreshEvents + 1,
      }));
    }, []),
    events: useCallback((value) => {
      setState((prevState) => ({
        ...prevState,
        events: value,
      }));
    }, []),
    isLoading: useCallback((value) => {
      setState((prevState) => ({
        ...prevState,
        isLoading: value,
      }));
    }, []),
    currEvent: useCallback((value) => {
      setState((prevState) => ({
        ...prevState,
        currEvent: value,
      }));
    }, []),
    filters: useCallback((value) => {
      setState((prevState) => ({
        ...prevState,
        filters: value,
      }));
    }, []),
    dateRange: useCallback((value) => {
      setState((prevState) => ({
        ...prevState,
        dateRange: value,
      }));
    }, []),
  };

  return (
    <EventsStateContext.Provider
      value={{
        ...state,
        updateEventsState,
      }}
    >
      {children}
    </EventsStateContext.Provider>
  );
};

EventsStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
