"use client";
import React from "react";
import PropTypes from "prop-types";
import { GoogleIcon } from "@/components/atoms/CustomIcon";
import { signIn } from "next-auth/react";

export default function ModalLoginGoogle({ fetchMyEvents }) {
  const handleClickLogin = async () => {
    try {
      await signIn("google");
      await fetchMyEvents();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl lg:w-[50%] md:w-[60%] sm:w-[80%] w-[90%] max-h-screen overflow-auto">
      <div className="w-full mx-auto flex items-center justify-center">
        <div className="w-full bg-gray-200 dark:bg-gray-900 rounded-2xl flex flex-col items-center justify-center p-5 py-20 sm:py-18">
          <div className="flex flex-col items-center mb-6 lg:text-2xl md:text-2xl font-semibold text-teal-800 dark:text-white">
            Login Untuk Ikuti Acara
          </div>
          <button
            onClick={handleClickLogin}
            className="flex items-center justify-between rounded-full bg-teal-900 px-6 pt-4 pb-3.5 border-double border-4 border-teal-700 text-sm font-medium leading-normal text-white transition duration-150 ease-in-out hover:font-semibold hover:bg-neutral-500 hover:bg-opacity-10 hover:text-teal-900 active:text-teal-700 dark:hover:bg-white dark:hover:bg-opacity-60"
            role="button"
          >
            <GoogleIcon className="w-6 h-6 mr-2" />
            Login with Google
          </button>
        </div>
      </div>
    </main>
  );
}

ModalLoginGoogle.propTypes = {
  fetchMyEvents: PropTypes.func.isRequired,
};
