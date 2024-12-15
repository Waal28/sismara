"use client";
import React, { useState, useEffect, Fragment } from "react";
import EventCard from "@/components/molecules/EventCard";
import EastIcon from "@mui/icons-material/East";
import { getAllEventsByFilters } from "@/api/src/acara";
import { Loader2 } from "@/components/atoms/CustomLoader";
import SearchBarWithFilter from "@/components/atoms/SearchBarWithFilter";
import { Button1 } from "@/components/atoms/CustomButton";
import NoDataImage from "@/components/atoms/NoDataImage";
import { useEventsState } from "@/context/EventsContext";
export default function EventCards() {
  const { updateEventsState, filters, dateRange, refreshEvents } =
    useEventsState();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const createPayload = (newPage = 0, keyword = "") => {
    const payload = {
      search: keyword || undefined, // Memastikan nilai default undefined
      prodi: filters?.prodi,
      status: filters?.status,
      start: dateRange?.start,
      end: dateRange?.end,
      limit: 5,
      skip: newPage * 5,
    };

    // Menghapus properti yang tidak diperlukan berdasarkan kondisi
    if (keyword) {
      delete payload.prodi;
      delete payload.status;
      delete payload.start;
      delete payload.end;
      updateEventsState.filters(null);
      updateEventsState.dateRange(null);
    } else if (filters) {
      delete payload.search;
    }

    return payload;
  };
  const fetchEvents = async ({ newPage = 0, keyword = "" }) => {
    setLoading(true);
    try {
      const payload = createPayload(newPage, keyword);

      const response = await getAllEventsByFilters(payload);
      const newEvents = response.data;

      setEvents((prevEvents) => {
        if (newPage === 0) return newEvents; // Reset events on new search
        return [...prevEvents, ...newEvents]; // Append new events for pagination
      });
      setHasMore(newEvents.length > 0);
      setPage(newPage);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents({ newPage: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshEvents, filters, dateRange]);

  return (
    <Fragment>
      <div className="flex justify-end w-full lg:px-28 px-4">
        <SearchBarWithFilter
          placeholder="Cari Acara di sini"
          fetchData={fetchEvents} // Pass handleSearch to trigger search
        />
      </div>
      {!loading && events.length < 1 ? (
        <NoDataImage className="-ml-[50%] sm:mx-auto scale-[30%] sm:scale-100" />
      ) : (
        <div className="grid lg:grid-cols-3 grid-cols-2 lg:gap-6 gap-4 justify-center items-center container mx-auto lg:p-8 p-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
      {loading ? (
        <div className="w-full h-80 flex flex-col justify-center items-center">
          <Loader2 />
        </div>
      ) : (
        hasMore && (
          <div className="flex justify-center">
            <Button1 onClick={() => fetchEvents({ newPage: page + 1 })}>
              View More <EastIcon />
            </Button1>
          </div>
        )
      )}
    </Fragment>
  );
}
