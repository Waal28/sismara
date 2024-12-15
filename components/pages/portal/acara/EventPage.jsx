/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import PropTypes from "prop-types";
import {
  CertificateIcon,
  EndDateIcon,
  LocationIcon,
  PaidIcon,
  StartDateIcon,
  VideoIcon,
} from "@/components/atoms/CustomIcon";
import RunDownnEvent from "./RunDownnEvent";
import { Tooltip } from "@mui/material";
import { Loader3 } from "@/components/atoms/CustomLoader";
import { useDarkMode } from "@/context/DarkModeContext";
import SocialIcons from "./SocialIcons";
import { formatDateTime, formatRupiah } from "@/server/config/format";
import { getOneEvent } from "@/api/src/acara";
import NoDataImage from "@/components/atoms/NoDataImage";
import Breadcrumbs from "@/components/atoms/Breadcrumbs";
import { bgColorForStatus, general, getImage } from "@/constants";
import ReviewEvent from "../../sistem/acara/components/ReviewEvent";
import Image from "next/image";
import { useEventsState } from "@/context/EventsContext";
import EventActionBtn from "./EventActionBtn";
import { Check } from "@mui/icons-material";
import Link from "next/link";
import CarauselComp from "@/components/molecules/CarauselComp";

const breadcrumbItems = [
  {
    label: "Acara",
    href: "/events",
    icon: (
      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
    ),
  },
];
const EventPage = ({ params }) => {
  const { darkMode } = useDarkMode();
  const { updateEventsState, currEvent } = useEventsState();
  const [loading, setLoading] = React.useState(false);

  const fetchEvent = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOneEvent(params.id);
      updateEventsState.currEvent(res.data);
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  React.useEffect(() => {
    fetchEvent();
  }, []);

  const { defaultImg } = general;
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader3 className="scale-[160%]" isDark={darkMode} />
      </div>
    );
  }

  if (!currEvent) {
    return (
      <NoDataImage className="-ml-[50%] sm:mx-auto scale-[30%] sm:scale-100" />
    );
  }
  const status = currEvent.status;
  const styleForBadge = { backgroundColor: bgColorForStatus[status] };
  return (
    <section className="body-font overflow-hidden">
      <section className="container px-5 sm:px-36 mb-0 sm:mb-8">
        <Breadcrumbs items={[...breadcrumbItems, { label: currEvent.title }]} />
      </section>
      <div className="container sm:px-24 px-5 pt-8 pb-24 mx-auto">
        <div className="grid sm:grid-cols-12 grid-cols-1 gap-5">
          <div className="sm:col-span-5 relative w-full sm:h-auto h-[400px]">
            {currEvent.posters.length > 0 ? (
              <CarauselComp className="w-full h-full relative">
                {currEvent.posters.map((image, idx) => (
                  <Image
                    key={idx}
                    fill
                    priority
                    sizes="100%"
                    alt={currEvent.title}
                    src={getImage(image)}
                    style={{ objectFit: "contain" }}
                  />
                ))}
              </CarauselComp>
            ) : (
              <Image
                fill
                priority
                sizes="100%"
                alt={currEvent.title}
                src={defaultImg}
                style={{ objectFit: "contain" }}
              />
            )}
          </div>
          <div className="sm:col-span-7 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="flex items-center justify-between text-sm font-medium text-gray-500 dark:text-teal-300 tracking-widest mb-2">
              {currEvent.prodi}
              <div className="flex items-center">
                {!currEvent.is_paid && (
                  <span className="w-fit h-fit bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                    Gratis
                  </span>
                )}
                {currEvent.is_online && (
                  <span className="w-fit h-fit bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">
                    Online
                  </span>
                )}
                <div
                  style={styleForBadge}
                  className="text-white tracking-normal flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full border"
                >
                  <div className="sm:text-base text-xs leading-none max-w-full flex-initial capitalize">
                    {currEvent.status}
                  </div>
                </div>
              </div>
            </h2>
            <h1 className="text-gray-900 dark:text-white text-xl sm:text-3xl font-medium mb-1">
              {currEvent.title}
            </h1>
            <div className="my-4 grid grid-cols-4 sm:grid-cols-5 gap-1 text-xs sm:text-base text-gray-600 dark:text-teal-300">
              <span className="flex items-center text-yellow-600 dark:text-yellow-500 font-medium">
                <StartDateIcon className="mr-1" /> Mulai
              </span>
              <span className="col-span-3 sm:col-span-4 font-medium tracking-wide">
                : {formatDateTime(currEvent.schedule.start_time)}
              </span>
              <span className="flex items-center text-yellow-600 dark:text-yellow-500 font-medium">
                <EndDateIcon className="mr-1" /> Selesai
              </span>
              <span className="col-span-3 sm:col-span-4 font-medium tracking-wide">
                : {formatDateTime(currEvent.schedule.end_time)}
              </span>
              <span className="flex items-center text-yellow-600 dark:text-yellow-500 font-medium">
                <LocationIcon className="mr-1" /> Lokasi
              </span>
              <span className="col-span-3 sm:col-span-4 font-medium">
                : {currEvent.location.address}
              </span>
              {currEvent.is_certificate && (
                <>
                  <span className="flex items-center text-yellow-600 dark:text-yellow-500 font-medium">
                    <CertificateIcon className="mr-1" /> Sertifikat
                  </span>
                  <span className="col-span-3 sm:col-span-4 font-medium">
                    : <Check className="text-green-500" />
                  </span>
                </>
              )}
              {currEvent.is_paid && (
                <>
                  <span className="flex items-center text-yellow-600 dark:text-yellow-500 font-medium">
                    <PaidIcon className="mr-1" /> Harga
                  </span>
                  <span className="col-span-3 sm:col-span-4 font-medium">
                    : {formatRupiah(currEvent.payment_price)}
                  </span>
                </>
              )}
            </div>
            <div className="flex gap-2">
              {currEvent.is_volunteers && (
                <div className="mb-3">
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                    Membutuhkan Volunteer
                  </span>
                </div>
              )}
              {currEvent.is_online && (
                <div className="mb-3">
                  <Link
                    href={currEvent.event_link}
                    target="_blank"
                    className="flex items-center w-fit bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-700"
                  >
                    <VideoIcon className="mr-2" />
                    Klik disini untuk bergabung
                  </Link>
                </div>
              )}
            </div>
            <p className="leading-relaxed text-xs sm:text-base text-gray-900 dark:text-white mb-4">
              {currEvent.desc}
            </p>
            <section className="mb-6">
              <RunDownnEvent />
            </section>
            <div className="flex items-center justify-between">
              <Tooltip title="Bagikan" placement="top-start" arrow>
                <span className="flex">
                  <SocialIcons
                    URL={`${process.env.NEXT_PUBLIC_BASE_URL}/events/${params.id}`}
                  />
                </span>
              </Tooltip>
              <EventActionBtn />
            </div>
          </div>
        </div>
        <ReviewEvent />
      </div>
    </section>
  );
};

EventPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default EventPage;
