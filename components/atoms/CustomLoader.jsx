import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import clsx from "clsx"; // Helper untuk menggabungkan className

export function Loader1({ className }) {
  const defaultClassName = "w-14 h-14 text-white fill-black";
  return (
    <div role="status" className="flex justify-center items-center">
      <svg
        aria-hidden="true"
        className={`${className ? className : defaultClassName} animate-spin`}
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

Loader1.propTypes = {
  className: PropTypes.string,
};

export function Loader2({ className }) {
  const defaultClassName = "w-14 h-14";
  return (
    <div className="relative -ml-8">
      <div
        className={`${
          className ? className : defaultClassName
        } rounded-full border-t-8 border-b-8 dark:border-custom-tertiary border-white`}
      ></div>
      <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-teal-500 animate-spin"></div>
    </div>
  );
}

Loader2.propTypes = {
  className: PropTypes.string,
};

const Loader3Container = styled("div")(({ isDark }) => ({
  position: "relative",
  width: "120px",
  height: "140px",
  backgroundImage: `radial-gradient(circle 30px, ${
    isDark ? "#fff" : "#134e4a"
  } 100%, transparent 0),
                    radial-gradient(circle 5px, ${
                      isDark ? "#fff" : "#134e4a"
                    } 100%, transparent 0),
                    radial-gradient(circle 5px, ${
                      isDark ? "#fff" : "#134e4a"
                    } 100%, transparent 0),
                    linear-gradient(${
                      isDark ? "#FFF" : "#134e4a"
                    } 20px, transparent 0)`,
  backgroundPosition: "center 127px , 94px 102px , 16px 18px, center 114px",
  backgroundSize: "60px 60px, 10px 10px , 10px 10px , 4px 14px",
  backgroundRepeat: "no-repeat",
  zIndex: 10,
  perspective: "500px",
  "&::before": {
    content: "''",
    position: "absolute",
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    border: `3px solid ${isDark ? "#FFF" : "#134e4a"}`,
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -55%) rotate(-45deg)",
    borderRightColor: "transparent",
    boxSizing: "border-box",
  },
  "&::after": {
    content: "''",
    position: "absolute",
    height: "80px",
    width: "80px",
    transform: "translate(-50%, -55%) rotate(-45deg) rotateY(0deg)",
    left: "50%",
    top: "50%",
    boxSizing: "border-box",
    border: "7px solid #14b8a6",
    borderRadius: "50%",
    animation: "rotate 0.5s linear infinite",
  },
  "@keyframes rotate": {
    to: {
      transform: "translate(-50%, -55%) rotate(-45deg) rotateY(360deg)",
    },
  },
}));

export const Loader3 = ({ className, isDark }) => {
  return <Loader3Container className={clsx(className)} isDark={isDark} />;
};
Loader3.propTypes = {
  className: PropTypes.string,
  isDark: PropTypes.bool,
};
