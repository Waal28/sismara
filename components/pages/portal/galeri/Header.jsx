"use client";
import React from "react";
import { general } from "@/constants";
export default function Header() {
  const { fakultas } = general;
  const windowWidth = window.innerWidth;
  const styles = {
    headerGaleri: {
      textShadow:
        windowWidth < 768
          ? `4px 4px 0px rgba(0, 0, 0, 0.3)`
          : `6px 6px 0px rgba(0, 0, 0, 0.3)`,
      letterSpacing: windowWidth < 768 ? "2px" : "5px",
    },
    headerAcara: {
      textShadow: `0px 0px 2px rgba(255, 255, 255), ${
        windowWidth < 768
          ? "4px 4px 0px rgba(0, 0, 0, 0.3)"
          : "6px 6px 0px rgba(0, 0, 0, 0.3)"
      }`,
      letterSpacing: windowWidth < 768 ? "2px" : "5px",
    },
  };
  return (
    <div className="relative bg-teal-500 -mt-4 mb-10">
      <div className="absolute inset-x-0 bottom-0">
        <svg
          viewBox="0 0 224 12"
          fill="currentColor"
          className="w-full text-white dark:text-custom-tertiary"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C48.8902582,6.27314026 86.2235915,9.40971039 112,9.40971039 C137.776408,9.40971039 175.109742,6.27314026 224,0 L224,12.0441132 L0,12.0441132 L0,0 Z" />
        </svg>
      </div>
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="relative max-w-2xl sm:mx-auto sm:max-w-xl md:max-w-2xl sm:text-center">
          <h2 className="mb-6 font-sans text-3xl font-bold tracking-tight text-white sm:text-8xl sm:leading-none">
            <span style={styles.headerGaleri}>Galeri</span>
            <span className="relative inline-block px-2">
              <div className="absolute inset-0 transform -skew-x-12" />
              <span
                className="relative text-teal-900"
                style={styles.headerAcara}
              >
                Acara
              </span>
            </span>
          </h2>
          <p className="mb-6 text-sm text-white md:text-lg">
            Dokumentasi lengkap dari setiap acara yang telah di selenggarakan
            semua prodi di {fakultas.name} UIR.
          </p>
        </div>
      </div>
    </div>
  );
}
