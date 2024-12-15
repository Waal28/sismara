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
    { name: "Teknik Sipil", link: "/prodi/teknik-sipil" },
    { name: "Teknik Perminyakan", link: "/prodi/teknik-perminyakan" },
    { name: "Teknik Mesin", link: "/prodi/teknik-mesin" },
    { name: "Teknik PWK", link: "/prodi/teknik-pwk" },
    { name: "Teknik Informatika", link: "/prodi/teknik-informatika" },
    { name: "Teknik Geologi", link: "/prodi/teknik-geologi" },
  ],
  layanan: [
    {
      name: "Universitas Islam Riau",
      link: "/pendaftaran",
    },
    {
      name: "Fakultas Teknik",
      link: "/pendaftaran",
    },
    {
      name: "Biro Administrasi dan Akademik Kemahasiswaan",
      link: "/pendaftaran",
    },
    {
      name: "Biro Sistem Informasi dan Komputasi",
      link: "/pendaftaran",
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
export const dummyEvent = {
  title: "Pelatihan IOT di Universitas Islam Riau",
  prodi: "Teknik Informatika",
  status: "Buka",
  description:
    "Pelatihan ini bertujuan untuk memperkenalkan teknologi IOT dalam industri. Diharapkan pelatihan ini dapat memberikan gambaran tentang bagaimana teknologi AI dapat membantu meningkatkan kinerja industri.",
  images: [
    "https://marketplace.canva.com/EAF6AoSpopg/1/0/1131w/canva-biru-modern-poster-pengisi-acara-sekolah-FUEXC4GP0a4.jpg",
    "https://embossphotography.com/wp-content/uploads/2021/10/DSC_1532-scaled.jpg.webp",
  ],
  rundown: [
    {
      time: {
        start: "09:00",
        end: "10:00",
      },
      session: "Pembukaan dan Sambutan",
      speaker: "Dr. Andi Wijaya",
    },
    {
      time: {
        start: "10:00",
        end: "11:30",
      },
      session: "Teknologi AI dalam Industri",
      speaker: "Prof. Siti Rahmawati",
    },
    {
      time: {
        start: "11:30",
        end: "13:00",
      },
      session: "Lunch Break",
    },
    {
      time: {
        start: "13:00",
        end: "14:30",
      },
      session: "Blockchain dan Keamanan Data",
      speaker: "Ir. Budi Santoso",
    },
    {
      time: {
        start: "14:30",
        end: "16:00",
      },
      session: "Diskusi Panel: Masa Depan Teknologi",
      speaker: "Panel Ahli",
    },
    {
      time: {
        start: "16:00",
        end: "16:30",
      },
      session: "Penutupan",
    },
  ],
  schedule: {
    start_time: "2024-08-25T09:00:00",
    end_time: "2024-08-25T16:30:00",
  },
  location: "Aula Universitas ABC, Jakarta",
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