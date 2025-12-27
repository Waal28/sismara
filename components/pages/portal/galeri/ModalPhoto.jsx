/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { IconButton } from "@mui/material";
import { useAppState } from "@/context/AppStateContext";
import { getImage } from "@/constants";

// const imageList = [
//   "/images/acara/11.jpg",
//   "/images/acara/2.jpg",
//   "/images/acara/3.jpg",
//   "/images/acara/4.jpg",
//   "/images/acara/5.jpg",
//   "/images/acara/6.jpg",
//   "/images/acara/7.jpg",
//   "/images/acara/8.jpg",
//   "/images/acara/9.jpg",
//   "/images/acara/10.jpg",
// ];
export default function ModalPhoto({ images }) {
  const { updateAppState } = useAppState();
  const [selectedImg, setSelectedImg] = React.useState(images[0]);

  return (
    <main className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl lg:w-[90%] md:w-[60%] w-[93%] max-h-screen overflow-auto">
      <React.Fragment>
        <div className="relative w-full mx-auto mb-10">
          <IconButton
            style={{ position: "absolute", top: -6, right: 4, zIndex: 1 }}
            onClick={() => updateAppState.modal({ open: false })}
          >
            <CloseIcon className="w-5 sm:w-7 h-w-5 sm:h-7 text-white bg-gray-900 rounded-full" />
          </IconButton>
          <div className="h-[50vw] sm:h-[35vw] max-w-[30vw] sm:max-w-full rounded-lg">
            <Image
              className="rounded-lg"
              src={
                (selectedImg && getImage(selectedImg)) ||
                "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg"
              }
              alt="..."
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
        <section className="overflow-x-auto flex flex-nowrap">
          <div className="flex gap-3">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative h-[60px] sm:h-[100px] w-[60px] sm:w-[100px] rounded-lg"
              >
                <Image
                  className={`${
                    selectedImg === image && "border-4 border-teal-600"
                  } rounded-lg cursor-pointer hover:border-4 hover:border-teal-500`}
                  src={getImage(image)}
                  alt={image}
                  fill
                  style={{ objectFit: "contain" }}
                  onClick={() => setSelectedImg(image)}
                />
              </div>
            ))}
          </div>
        </section>
      </React.Fragment>
    </main>
  );
}
ModalPhoto.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
};
export function CloseIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="m8.382 17.025l-1.407-1.4L10.593 12L6.975 8.4L8.382 7L12 10.615L15.593 7L17 8.4L13.382 12L17 15.625l-1.407 1.4L12 13.41z"
      ></path>
    </svg>
  );
}
