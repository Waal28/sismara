import Image from "next/image";
import Link from "next/link";
import React from "react";
import PropTypes from "prop-types";
import {
  CertificateIcon,
  StartDateIcon,
  PaidIcon,
  VolunteerIcon,
} from "../atoms/CustomIcon";
import { getImage, general, bgColorForStatus } from "@/constants";
import { format } from "date-fns";
import { formatRupiah } from "@/server/config/format";

export default function EventCard({ event }) {
  const { defaultImg } = general;
  const status = event.status;
  const styleForBadge = { backgroundColor: bgColorForStatus[status] };
  return (
    <div
      key={event.id}
      className="mx-auto lg:w-96 lg:h-[600px] w-full h-[350px] border border-gray-300 dark:border-none bg-gray-50 dark:bg-teal-800 lg:p-6 p-4 rounded-xl shadow-xl transform hover:scale-105 transition duration-500"
    >
      <main className="h-full flex flex-col justify-between">
        <section>
          <div className="mb-3 flex justify-between items-center">
            <h3 className="w-max lg:text-xl text-xs font-semibold text-teal-900 dark:text-white">
              {event.prodi}
            </h3>
            <div
              style={styleForBadge}
              className="text-white flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full border"
            >
              <div className="sm:text-base text-xs leading-none max-w-full flex-initial capitalize">
                {event.status}
              </div>
            </div>
          </div>
          <div className="w-full lg:h-60 h-28" style={{ position: "relative" }}>
            <Image
              fill
              sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              className="w-full lg:w-1/2 xl:w-1/3 h-28 lg:h-60 rounded-xl"
              src={
                event.posters.length ? getImage(event.posters[0]) : defaultImg
              }
              alt={event.title}
            />
          </div>
          <Link
            className="mt-4 text-gray-800 dark:text-white lg:text-2xl text-sm font-bold line-clamp-2 hover:underline hover:underline-offset-4"
            href={`/events/${event.id}`}
          >
            {event.title}
          </Link>
        </section>
        <section>
          <div className="flex space-x-1 items-center lg:mb-1.5 mb-1">
            <span>
              <StartDateIcon className="lg:h-6 lg:w-6 h-4 w-4 text-teal-600 dark:text-teal-300" />
            </span>
            <p className="dark:text-white lg:text-base text-xs">
              {format(new Date(event.schedule.start_time), "dd MMMM yyyy")}
            </p>
          </div>
          {event.is_certificate && (
            <div className="flex space-x-1 items-center lg:mb-1.5 mb-1">
              <span>
                <CertificateIcon className="lg:h-6 lg:w-6 h-4 w-4 text-teal-600 dark:text-teal-300" />
              </span>
              <p className="dark:text-white lg:text-base text-xs">
                Tersedia Sertifikat
              </p>
            </div>
          )}
          {event.is_volunteers && (
            <div className="flex space-x-1 items-center lg:mb-1.5 mb-1">
              <span>
                <VolunteerIcon className="lg:h-6 lg:w-6 h-4 w-4 text-teal-600 dark:text-teal-300" />
              </span>
              <p className="dark:text-white lg:text-base text-xs">
                Butuh Volunteer
              </p>
            </div>
          )}
          <div className="flex space-x-1 items-center lg:mb-1.5 mb-1">
            <span>
              <PaidIcon className="lg:h-6 lg:w-6 h-4 w-4 text-teal-600 dark:text-teal-300" />
            </span>
            <p className="dark:text-white lg:text-base text-xs">
              {event.is_paid ? formatRupiah(event.payment_price) : "Gratis"}
            </p>
          </div>
          <Link
            className="block text-center mt-4 lg:text-xl text-xs w-full text-white bg-teal-900 dark:bg-teal-600 py-2 rounded-xl shadow-lg hover:bg-teal-600 dark:hover:bg-teal-800"
            href={`/events/${event.id}`}
          >
            Selengkapnya
          </Link>
        </section>
      </main>
    </div>
  );
}
EventCard.propTypes = {
  event: PropTypes.object,
};
