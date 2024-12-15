"use client";
import "./globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import PropTypes from "prop-types";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { ParallaxProvider } from "react-scroll-parallax";
import TransitionsModal from "@/components/molecules/TransitionsModal";
import CombineProvider from "@/context/CombineProvider";

export default function RootLayout({ children, params: { session } }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/engineering.png" sizes="any" />
      </head>
      <body>
        <SessionProvider session={session}>
          <ParallaxProvider>
            <CombineProvider>
              {children}
              <TransitionsModal />
              <ToastContainer />
            </CombineProvider>
          </ParallaxProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node,
  params: PropTypes.object,
};
