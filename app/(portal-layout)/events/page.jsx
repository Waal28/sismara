import EventCards from "@/components/pages/portal/acara/EventCards";
import EventsHero from "@/components/pages/portal/acara/EventsHero";
import React from "react";

export const metadata = {
  title:
    "Semua Acara - Portal Informasi Acara & Seminar Fakultas Teknik Universitas Islam Riau",
};
export default function page() {
  return (
    <React.Fragment>
      <EventsHero />
      <EventCards />
    </React.Fragment>
  );
}
