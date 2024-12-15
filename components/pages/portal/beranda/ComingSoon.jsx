"use client";
import Link from "next/link";
import React from "react";
import CarauselComp from "../../../molecules/CarauselComp";
import { Box } from "@mui/material";
import { getAllEventsByFilters } from "@/api/src/acara";
import EventCard from "@/components/molecules/EventCard";
import { Loader2 } from "@/components/atoms/CustomLoader";

export default function ComingSoon() {
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  async function fetchComingSoonEvent() {
    setLoading(true);
    const payload = {
      status: "upcoming",
      limit: 5,
    };
    try {
      const response = await getAllEventsByFilters(payload);
      const newEvents = response.data;
      setEvents(newEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchComingSoonEvent();
  }, []);
  return (
    <section className="bg-emerald-200 dark:bg-custom-tertiary">
      {/* Jumbotron */}
      <div className="px-6 py-12 text-center md:px-12 lg:text-left">
        <div className="w-100 mx-auto sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl xl:px-32">
          <div className="grid items-center lg:grid-cols-2 lg:gap-16">
            <div className="mb-12 md:mt-12 lg:mt-0 lg:mb-0 dark:shadow-none relative">
              <Box
                sx={{
                  clipPath: {
                    xl: "polygon(80% 0%, 100% 50%, 80% 100%, 0% 100%, 0 0%)",
                    lg: "polygon(80% 0%, 100% 50%, 80% 100%, 0% 100%, 0 0%)",
                    md: "polygon(80% 0%, 100% 50%, 80% 100%, 0% 100%, 0 0%)",
                    sm: "polygon(100% 0%, 100% 70%, 50% 100%, 0% 70%, 0 0%)",
                    xs: "polygon(100% 0%, 100% 75%, 50% 100%, 0% 75%, 0 0%)",
                  },
                }}
                className="rounded-lg px-6 py-14 bg-white dark:bg-gradient-to-r from-teal-900 from-1% via-teal-700 via-50% to-teal-900 to-99% dark:shadow-black/20 md:px-12 lg:-mr-14"
              >
                <h1 className="lg:mb-16 md:mb-16 mb-8 xl:text-6xl text-5xl font-bold tracking-tight text-teal-900 dark:text-white">
                  Jelajahi acara
                  <br />
                  <span className="text-teal-600 dark:text-emerald-400">
                    yang akan datang
                  </span>
                </h1>
                <Link
                  className="lg:mb-0 md:mb-0 mb-10 inline-block rounded-full bg-teal-900 px-12 pt-4 pb-3.5 text-sm font-medium uppercase leading-normal text-white dark:text-white dark:hover:text-emerald-300 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-600 dark:hover:bg-teal-900 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-600 focus:shadow-[0_8px_9px_-4px_rgba(74, 222, 128, 0.3),0_4px_18px_0_rgba(74, 222, 128, 0.2)] focus:outline-none focus:ring-0 active:bg-teal-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(255,255,255,1)] dark:hover:shadow-[0_4px_9px_-4px_rgba(52,211,153,1),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  href="/events"
                >
                  Lihat Semua Acara
                </Link>
              </Box>
            </div>
            <div className="md:mb-12 lg:mb-0">
              {loading ? (
                <div className="w-full flex flex-col justify-center items-center">
                  <Loader2 />
                </div>
              ) : (
                <CarauselComp>
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </CarauselComp>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Jumbotron */}
    </section>
  );
}
