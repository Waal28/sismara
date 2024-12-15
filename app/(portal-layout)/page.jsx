import React from "react";
import ComingSoon from "@/components/pages/portal/beranda/ComingSoon";
import Benefits from "@/components/pages/portal/beranda/Benefits";
import MainHero from "@/components/pages/portal/beranda/MainHero";
import FeedBack from "@/components/pages/portal/beranda/FeedBack";

export const metadata = {
  title:
    "Beranda - Portal Informasi Acara & Seminar Fakultas Teknik Universitas Islam Riau",
};

export default function Home() {
  return (
    <>
      <div id="main-hero">
        <MainHero />
      </div>
      <div id="benefits">
        <Benefits />
      </div>
      <div id="coming-soon">
        <ComingSoon />
      </div>
      <div id="feedback">
        <FeedBack />
      </div>
    </>
  );
}
