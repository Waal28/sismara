import React from "react";

import {
  AudienceIcon,
  DashboardIcon,
  EventIcon,
} from "./components/atoms/CustomIcon";
import { Group, Message } from "@mui/icons-material";

export const general = {
  copyright: "Copyright © 2024. Wal Husna Faizul.",
  prodi: [
    { name: "Teknik Sipil", link: "https://eng.uir.ac.id/teknik-sipil" },
    {
      name: "Teknik Perminyakan",
      link: "https://eng.uir.ac.id/teknik-perminyakan",
    },
    { name: "Teknik Mesin", link: "https://eng.uir.ac.id/teknik-mesin" },
    { name: "Teknik PWK", link: "https://eng.uir.ac.id/teknik-pwk" },
    {
      name: "Teknik Informatika",
      link: "https://eng.uir.ac.id/teknik-informatika",
    },
    { name: "Teknik Geologi", link: "https://eng.uir.ac.id/teknik-geologi" },
  ],
  layanan: [
    {
      name: "Universitas Islam Riau",
      link: "https://uir.ac.id",
    },
    {
      name: "Fakultas Teknik",
      link: "https://eng.uir.ac.id",
    },
    {
      name: "Biro Administrasi dan Akademik Kemahasiswaan",
      link: "https://dlma.uir.ac.id",
    },
    {
      name: "Biro Sistem Informasi dan Komputasi",
      link: "https://simfokom.uir.ac.id",
    },
  ],
  logo: "/images/Logo_UIR.svg",
  gedungTI: "/images/gedung-teknik-uir1.jpg",
  fotoMaba23: "/images/maba23.jpg",
  fakultas: {
    name: "Fakultas Teknik",
    email: "fakultas_teknik@uir.ac.id",
    telepon: "+62 761 674674",
    socialMedias: [
      {
        name: "Facebook",
        link: "https://www.facebook.com/UIN-UIR-109591834474165",
      },
      {
        name: "Instagram",
        link: "https://www.instagram.com/uin_uir/",
      },
      {
        name: "Youtube",
        link: "https://www.youtube.com/channel/UCnS1D9JQmFm7jLJp0nXV2XQ",
      },
    ],
  },
  universitas: {
    name: "Universitas Islam Riau",
    alamat: "Jl. Kaharuddin Nasution 113, Pekanbaru 28284, Riau - Indonesia",
  },
  defaultImg: "/images/default_img1.png",
};

export const navbarMenu = [
  {
    name: "Beranda",
    link: "/",
  },
  {
    name: "Acara",
    link: "/events",
  },
  {
    name: "Galeri",
    link: "/gallery",
  },
  {
    name: "Kontak",
    link: "/contact-us",
  },
];

export const navSettings = [
  {
    name: "Profil",
    link: "/profile",
  },
  {
    name: "Logout",
    link: "/logout",
  },
];
export const menuAdmin = {
  top: [
    {
      text: "Dashboard",
      icon: <DashboardIcon className="w-7 h-7 text-white" />,
      link: "/admin",
    },
    {
      text: "Acara",
      icon: <EventIcon className="w-7 h-7 text-white" />,
      link: "/admin/events",
    },
    {
      text: "Peserta",
      icon: <AudienceIcon className="w-7 h-7 text-white" />,
      link: "/admin/participants",
    },
  ],
  bottom: [
    {
      text: "Akun Pengguna",
      icon: <Group className="w-7 h-7 text-white" />,
      link: "/admin/users-account",
    },
    {
      text: "Pesan",
      icon: <Message className="w-7 h-7 text-white" />,
      link: "/admin/messages",
    },
  ],
};
export const colorForStatus = {
  open: "#22c55e",
  ongoing: "#eab308",
  upcoming: "#3b82f6",
  closed: "#6b7280",
};
export const listStatusEvent = ["open", "ongoing", "upcoming", "closed"];
export const bgColorForStatus = {
  open: "#15803d", // Green
  ongoing: "#ca8a04", // Yellow
  upcoming: "#1d4ed8", // Blue
  closed: "#4b5563", // Gray
};
export const BASE_URL_STORAGE =
  "https://firebasestorage.googleapis.com/v0/b/sistem-manajemen-acara-e8711.appspot.com/o";
export const getImage = (imageName) =>
  `${BASE_URL_STORAGE}/images%2F${imageName}?alt=media`;
export const getImgCert = (imageName) => `/certificate/${imageName}`;
export const STATUS_VOLUNTEER = {
  CANDIDATE: "candidate",
  APPROVED: "approved",
};
export const ROLES = ["Admin", "Penyelenggara Acara"];

export const listDisableBtn = ["edit_event", "delete_event"];
export const listStatusForDisabledBtn = ["open", "ongoing", "closed"];
export const showBtnInEventPageByStatus = ["open", "ongoing"];
export const DEFAULT_USER_IMG =
  "https://cdn.icon-icons.com/icons2/2643/PNG/512/male_boy_person_people_avatar_icon_159358.png";

export const monthInIndonesia = {
  0: "Januari",
  1: "Februari",
  2: "Maret",
  3: "April",
  4: "Mei",
  5: "Juni",
  6: "Juli",
  7: "Agustus",
  8: "September",
  9: "Oktober",
  10: "November",
  11: "Desember",
};
