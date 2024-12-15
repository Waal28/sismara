import EventPage from "@/components/pages/portal/acara/EventPage";
import React from "react";

export const metadata = {
  title:
    "Acara - Portal Informasi Acara & Seminar Fakultas Teknik Universitas Islam Riau",
};
export default function page({ params }) {
  return <EventPage params={params} />;
}
