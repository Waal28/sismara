import React from "react";
import Eventslist from "./components/EventsList";
import EventPoster from "./components/EventPoster";
import ReviewEvent from "./components/ReviewEvent";

export default function AdminEvent() {
  return (
    <React.Fragment>
      <h1 className="text-2xl sm:text-3xl font-bold mb-10">Acara</h1>
      <main className="grid grid-cols-3 gap-5">
        <section className="col-span-1">
          <Eventslist />
        </section>
        <section className="col-span-2">
          <EventPoster />
        </section>
      </main>
      <ReviewEvent isFromAdmin />
    </React.Fragment>
  );
}
