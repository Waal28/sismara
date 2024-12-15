"use client";
import React, { useEffect } from "react";
import PropTypes from "prop-types";

import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";
import { useDarkMode } from "@/context/DarkModeContext";
import { navbarMenu, navSettings } from "@/constants";
import { useSession } from "next-auth/react";
import { useAppState } from "@/context/AppStateContext";
import LoadingPage from "./LoadingPage";
import RegisterForm from "./RegisterForm";

export default function LayoutPortal(props) {
  const { children } = props;
  const { darkMode } = useDarkMode();
  const { updateAppState, isPageLoading } = useAppState();
  const isDarkMode = darkMode ? "dark" : "";
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      updateAppState.isPageLoading(true);
    } else if (status === "unauthenticated") {
      console.log("User is not authenticated");
      updateAppState.isPageLoading(false);
    } else if (status === "authenticated") {
      console.log("User is authenticated");
      // console.log(session);

      localStorage.setItem("token", session.token);
      updateAppState.isUserLogin(true);
      updateAppState.currentUser(session.user);
      updateAppState.isPageLoading(false);

      if (session.user.isFirstLogin) {
        updateAppState.modal({
          open: true,
          children: <RegisterForm />,
          reOpen: true,
        });
      }
    } else {
      console.log("User is not signed in");
      updateAppState.isPageLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <div className={isDarkMode}>
      <div className="bg-white dark:bg-custom-tertiary">
        {isPageLoading ? (
          <LoadingPage />
        ) : (
          <React.Fragment>
            <Navbar pages={navbarMenu} settings={navSettings}>
              {children}
            </Navbar>
            <Footer />
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
LayoutPortal.propTypes = {
  children: PropTypes.node,
};
