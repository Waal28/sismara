"use client";
import React from "react";
import { Bakbak_One } from "next/font/google";
import { ParallaxBanner } from "react-scroll-parallax";
import { useDarkMode } from "@/context/DarkModeContext";
import { general } from "@/constants";

const bebasNeue = Bakbak_One({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export default function EventsHero() {
  const { fakultas } = general;
  const { darkMode } = useDarkMode();
  const windowWidth = window.innerWidth;
  const shadowColor = {
    layer1: darkMode ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255)",
    layer2: darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
  };
  const stylesHeader = {
    textShadow: `0px 0px 3px ${shadowColor.layer1}, ${
      windowWidth < 768 ? "3px 3px 0px" : "5px 5px 0px"
    } ${shadowColor.layer2}`,
    letterSpacing: windowWidth < 768 ? "2px" : "4px",
  };

  const background = {
    image: "/event.svg",
    translateY: [0, 0],
    translateX: [-20, 0],
    opacity: darkMode ? [0.8, 0.3] : [1, 0.3],
    scale: [1, 0.9, "easeOutCubic"],
    shouldAlwaysCompleteAnimation: true,
    style: {
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
    },
  };

  const headline = {
    translateY: [0, 0],
    translateX: [18, 0],
    scale: [1, 1.1, "easeOutCubic"],
    shouldAlwaysCompleteAnimation: true,
    expanded: false,
    children: (
      <div className="flex flex-col items-center justify-center h-full">
        <div className={`${bebasNeue.className} text-end`}>
          <h1
            className="lg:text-8xl text-3xl text-teal-700 dark:text-white px-1.5"
            style={stylesHeader}
          >
            Acara
          </h1>
          <h2
            className="lg:text-6xl text-lg text-teal-700 dark:text-white px-1.5"
            style={stylesHeader}
          >
            {fakultas.name} UIR
          </h2>
        </div>
      </div>
    ),
  };

  // const foreground = {
  //   image:
  //     "https://s3-us-west-2.amazonaws.com/s.cdpn.io/105988/banner-foreground.png",
  //   translateY: [0, 40],
  //   scale: [1, 1.1, "easeOutCubic"],
  //   shouldAlwaysCompleteAnimation: true,
  // };

  const gradientOverlay = {
    opacity: [0, 1, "easeOutCubic"],
    shouldAlwaysCompleteAnimation: true,
    expanded: false,
    children: <div className="gradient inset" />,
  };

  return (
    <ParallaxBanner
      layers={[background, headline, gradientOverlay]}
      style={{ aspectRatio: windowWidth < 768 ? "2 / 1" : "4 / 1" }}
      className="-mt-4 lg:mb-10 mb-5"
    />
  );
}
