"use client";
import React from "react";
import PropTypes from "prop-types";
import { general } from "@/constants";

export default function SelectFakultas({ prodi, setProdi }) {
  return (
    <form className="max-w-full sm:max-w-sm">
      <label
        htmlFor="countries"
        className="block mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white"
      >
        Pilih Prodi
      </label>
      <select
        id="countries"
        className="shadow-md bg-gray-50 border-2 border-gray-500 dark:border-gray-500 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
        value={prodi}
        onChange={(e) => setProdi(e.target.value)}
      >
        <option value="all">Semua Prodi</option>
        {general.prodi.map((item, index) => (
          <option key={index} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
    </form>
  );
}

SelectFakultas.propTypes = {
  prodi: PropTypes.string,
  setProdi: PropTypes.func,
};
