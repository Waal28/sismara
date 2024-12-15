import React from "react";
import PropTypes from "prop-types";
import { AppStateProvider } from "./AppStateContext";
import { AdminStateProvider } from "./AdminContext";
import { DarkModeProvider } from "./DarkModeContext";
import { UsersAccStateProvider } from "./UsersAccContext";
import { EventsStateProvider } from "./EventsContext";

export default function CombineProvider({ children }) {
  return (
    <DarkModeProvider>
      <AppStateProvider>
        <AdminStateProvider>
          <UsersAccStateProvider>
            <EventsStateProvider>{children}</EventsStateProvider>
          </UsersAccStateProvider>
        </AdminStateProvider>
      </AppStateProvider>
    </DarkModeProvider>
  );
}

CombineProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
