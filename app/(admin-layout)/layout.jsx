import React from "react";
import PropTypes from "prop-types";
import LayoutAdmin from "@/components/template/LayoutAdmin";

export const metadata = {
  link: {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/tw-elements/dist/css/tw-elements.min.css",
  },
  scripts: ["https://cdn.tailwindcss.com/3.3.0"],
};
export default function RootLayout({ children }) {
  return <LayoutAdmin>{children}</LayoutAdmin>;
}

RootLayout.propTypes = {
  children: PropTypes.node,
};
