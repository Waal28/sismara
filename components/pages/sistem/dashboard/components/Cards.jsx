"use client";
import React from "react";
import PropTypes from "prop-types";
import {
  EndDateIcon,
  EventOngoingIcon,
  EventUpcommingIcon,
  StartDateIcon,
} from "@/components/atoms/CustomIcon";
import { Loader1 } from "@/components/atoms/CustomLoader";

export default function Cards({ cardValue, loading, month, setMonth }) {
  return (
    <>
      <div className="w-full mb-5">
        <SelectMonth month={month} setMonth={setMonth} />
      </div>
      <section className="text-gray-700 body-font mt-2">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
            {cardData.map((card, index) => (
              <div key={index} className="text-center w-full">
                <div className="bg-gray-300 dark:bg-gray-700 border-2 border-gray-500 px-4 py-6 rounded-lg transform transition duration-500 hover:scale-110">
                  {card.icon}
                  <h2 className="font-medium text-xl text-gray-900 dark:text-white">
                    {loading ? (
                      <Loader1 className="w-7 h-7 text-white fill-teal-500" />
                    ) : (
                      cardValue[card.name]
                    )}
                  </h2>
                  <p className="leading-relaxed text-gray-900 text-base dark:text-white">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

Cards.propTypes = {
  prodi: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  cardValue: PropTypes.object.isRequired,
  month: PropTypes.number.isRequired,
  setMonth: PropTypes.func.isRequired,
};

function SelectMonth({ month, setMonth }) {
  return (
    <form className="w-full ml-auto">
      <label
        htmlFor="countries"
        className="block mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white"
      >
        Pilih Bulan
      </label>
      <select
        id="countries"
        className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
        value={month}
        onChange={(e) => setMonth(Number(e.target.value))}
      >
        {bulan.map((item, index) => (
          <option key={index} value={index}>
            {item}
          </option>
        ))}
      </select>
    </form>
  );
}

SelectMonth.propTypes = {
  month: PropTypes.number,
  setMonth: PropTypes.func,
};
const bulan = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const cardData = [
  {
    title: "Upcoming Events",
    name: "upcoming",
    description: "Upcoming Events",
    icon: (
      <EventUpcommingIcon className="text-teal-500 w-8 h-8 mb-3 inline-block" />
    ),
  },
  {
    title: "Open Events",
    name: "open",
    description: "Open Events",
    icon: <StartDateIcon className="text-teal-500 w-8 h-8 mb-3 inline-block" />,
  },
  {
    title: "Closed Events",
    name: "closed",
    description: "Closed Events",
    icon: <EndDateIcon className="text-teal-500 w-8 h-8 mb-3 inline-block" />,
  },
  {
    title: "Ongoing Events",
    name: "ongoing",
    description: "Ongoing Events",
    icon: (
      <EventOngoingIcon className="text-teal-500 w-8 h-8 mb-3 inline-block" />
    ),
  },
];
