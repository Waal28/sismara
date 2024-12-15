"use client";
import Image from "next/image";
import React from "react";
import { signIn } from "next-auth/react";

import { useAppState } from "@/context/AppStateContext";
import { useDarkMode } from "@/context/DarkModeContext";
import { general } from "@/constants";

export default function MainHero() {
  const { gedungTI, universitas, fakultas } = general;
  const { isUserLogin } = useAppState();
  const [show, setShow] = React.useState(false);
  const { darkMode } = useDarkMode();
  const stopColor = darkMode ? "#232D3F" : "#0d9488";

  const handleClickLogin = async () => {
    try {
      await signIn("google");
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    setShow(true);
  }, []);

  return (
    <section className="-mt-4 relative dark:bg-teal-700">
      <div className="absolute inset-0 bg-cover bg-center z-0">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="absolute top-0 left-0 w-full h-full"
        >
          <defs>
            <linearGradient id="sw-gradient-light" x1={0} x2={0} y1={1} y2={0}>
              <stop stopColor={stopColor} offset="0%" />
              <stop stopColor={stopColor} offset="100%" />
            </linearGradient>
          </defs>
          <path
            fill="url(#sw-gradient-light)"
            d="M -0.664 3.46 C -0.664 3.46 405.288 15.475 461.728 21.285 C 601.037 35.625 672.268 76.086 701.056 97.646 C 756.056 138.838 797.267 216.257 857.745 245.156 C 885.704 258.516 980.334 280.547 1048.511 268.826 C 1121.622 256.256 1199.864 226.267 1214.176 220.176 C 1241.273 208.643 1280.201 191.509 1343.494 179.436 C 1434.325 162.111 1439.504 196.099 1439.503 183.204 C 1439.502 161.288 1440 0 1440 0 L 1360 0 C 1280 0 1120 0 960 0 C 800 0 640 0 480 0 C 320 0 160 0 80 0 L 0 0 L -0.664 3.46 Z"
          ></path>
        </svg>
      </div>
      {/* SVG Background */}
      {/* Jumbotron */}
      <div className="px-6 lg:py-32 md:py-0 py-0 text-center md:px-12 lg:text-left relative z-10">
        <div className="w-100 mx-auto sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div
              className={`mt-12 lg:mt-0 transition-opacity duration-1000 ${
                show ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="mb-16 text-teal-950 dark:text-white">
                <p className="text-5xl drop-shadow-2xl font-bold tracking-tight md:text-6xl xl:text-7xl">
                  Selamat Datang
                </p>
                <p className="text-3xl drop-shadow-2xl font-bold mt-3 tracking-tight md:text-4xl xl:text-5xl">
                  Di Portal Informasi Acara
                </p>
                <p className="text-2xl font-georgia tracking-wider font-medium mt-3 drop-shadow-2xl md:text-3xl xl:text-4xl">
                  {fakultas.name}
                </p>
                <p className="text-2xl font-georgia tracking-wider font-medium mt-3 drop-shadow-2xl md:text-3xl xl:text-4xl">
                  {universitas.name}
                </p>
              </div>
              {!isUserLogin && (
                <button
                  onClick={handleClickLogin}
                  className="inline-block rounded-full bg-teal-900 px-12 pt-4 pb-3.5 border-double border-4 border-teal-700 text-sm font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:font-semibold hover:bg-neutral-500 hover:bg-opacity-10 hover:text-teal-900 active:text-teal-700 dark:hover:bg-white dark:hover:bg-opacity-60"
                  role="button"
                >
                  Login
                </button>
              )}
            </div>
            <div
              className={`mb-12 lg:mb-0 transform transition-all duration-1000 ${
                show
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-full opacity-0"
              }`}
            >
              <Image
                src={gedungTI}
                width={400}
                height={0}
                className="w-full h-auto rounded-lg shadow-lg dark:shadow-black/20"
                alt="gedungTI"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      {/* Jumbotron */}
    </section>
  );
}
