"use client";
import React from "react";
import Carousel from "react-material-ui-carousel";
import PropTypes from "prop-types";

export default function CarauselComp({ children, className = "" }) {
  return (
    <Carousel
      animation="slide"
      indicators={true}
      navButtonsAlwaysVisible={true}
      className={className}
    >
      {children}
    </Carousel>
  );
}

CarauselComp.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
