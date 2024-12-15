import React from "react";
import Album from "@/components/pages/portal/galeri/Album";
import Header from "@/components/pages/portal/galeri/Header";

export const metadata = {
  title:
    "Gallery - Portal Informasi Acara & Seminar Fakultas Teknik Universitas Islam Riau",
};
export default function page() {
  return (
    <React.Fragment>
      <Header />
      <Album />
    </React.Fragment>
  );
}
