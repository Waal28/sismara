import React from "react";
import PropTypes from "prop-types";

export const Button1 = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="relative border-2 text-white bg-teal-800 border-teal-400 rounded-md px-4 py-2 inline cursor-pointer lg:text-base text-xs font-semibold before:bg-teal-400 before:absolute before:-bottom-0 before:-left-0 before:block before:h-[4px] before:w-full before:origin-bottom-right before:scale-x-0 before:transition before:duration-300 before:ease-in-out hover:before:origin-bottom-left hover:before:scale-x-100"
  >
    {children}
  </button>
);

Button1.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export const Button2 = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="group relative inline-flex border border-teal-600 focus:outline-none w-full sm:w-auto"
  >
    <span className="w-full inline-flex items-center justify-center self-stretch px-4 py-2 text-sm text-teal-600 text-center font-bold uppercase bg-white ring-1 ring-teal-600 ring-offset-1 transform transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1 group-focus:-translate-y-1 group-focus:-translate-x-1">
      {children}
    </span>
  </button>
);

Button2.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
export const Button3 = ({ onClick, children, type = "button" }) => (
  <button
    onClick={onClick}
    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-2 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
    type={type}
  >
    {children}
  </button>
);

Button3.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
};
