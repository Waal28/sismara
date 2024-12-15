import React from "react";

const loaderStyle = {
  width: "64px",
  height: "64px",
  position: "relative",
  background: "#fff",
  borderRadius: "4px",
  overflow: "hidden",
  boxShadow: "0px 1px 4px 1px rgba(0,0,0,0.2)",
};

const loaderBeforeStyle = {
  content: "''",
  position: "absolute",
  left: "0",
  bottom: "0",
  width: "40px",
  height: "40px",
  transform: "rotate(45deg) translate(30%, 40%)",
  background: "#14b8a6",
  boxShadow: "32px -34px 0 5px #115e59",
  animation: "slide 2s infinite ease-in-out alternate",
};

const loaderAfterStyle = {
  content: "''",
  position: "absolute",
  left: "10px",
  top: "10px",
  width: "16px",
  height: "16px",
  borderRadius: "50%",
  background: "#115e59",
  transform: "rotate(0deg)",
  transformOrigin: "35px 145px",
  animation: "rotate 2s infinite ease-in-out",
};

const keyframesSlide = `
@keyframes slide {
  0% , 100%{ bottom: -35px}
  25% , 75%{ bottom: -2px}
  20% , 80%{ bottom: 2px}
}
`;

const keyframesRotate = `
@keyframes rotate {
  0% { transform: rotate(-15deg)}
  25% , 75%{ transform: rotate(0deg)}
  100% {  transform: rotate(25deg)}
}
`;
export default function LoaderAlbum() {
  return (
    <div className="flex items-center justify-center h-96">
      <style>
        {keyframesSlide}
        {keyframesRotate}
      </style>
      <div className="loader" style={loaderStyle}>
        <div style={loaderBeforeStyle}></div>
        <div style={loaderAfterStyle}></div>
      </div>
    </div>
  );
}
