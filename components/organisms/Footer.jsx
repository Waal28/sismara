"use client";
import { Stack } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";
import PlaceIcon from "@mui/icons-material/Place";
import { general } from "@/constants";

export default function Footer() {
  const { logo, fakultas, universitas, prodi, layanan, copyright } = general;
  const mediasLogo = {
    Facebook: (
      <svg
        className="w-4 h-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 8 19"
      >
        <path
          fillRule="evenodd"
          d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    Instagram: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
        />
      </svg>
    ),
    Youtube: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M18 3a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H6a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zM9 9v6a1 1 0 0 0 1.514.857l5-3a1 1 0 0 0 0-1.714l-5-3A1 1 0 0 0 9 9"
        />
      </svg>
    ),
  };
  return (
    <footer className="bg-gradient-to-r from-teal-900 from-2% via-teal-700 via-50% to-teal-900 to-98%">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-12 md:mb-0">
            <Link href="/" className="flex items-center">
              <Image
                src={logo}
                width={0}
                height={0}
                className="me-3 w-16 h-auto"
                alt="Logo UIR"
              />
              <Stack direction="column">
                <span
                  className="lg:text-2xl text-lg font-semibold text-white"
                  style={{ fontFamily: "georgia, sans-serif" }}
                >
                  {universitas.name}
                </span>
              </Stack>
            </Link>
            <p
              className="lg:text-xl text-base text-white font-semibold mt-6"
              style={{ fontFamily: "georgia, sans-serif" }}
            >
              {fakultas.name}
            </p>
            <p
              className="lg:text-xl text-base text-white"
              style={{ fontFamily: "georgia,sans-serif" }}
            >
              {universitas.name}
            </p>
            <p className="text-white lg:text-sm text-xs mt-6">
              <PlaceIcon /> : {universitas.alamat}
            </p>
            <p className="text-white lg:text-sm text-xs mt-1">
              <EmailIcon /> : {fakultas.email}
            </p>
            <p className="text-white lg:text-sm text-xs mt-1">
              <CallIcon /> : {fakultas.telepon}
            </p>
          </div>
          <div className="grid gap-0 md:gap-9 grid-cols-2">
            <div>
              <h2 className="mb-6 lg:text-sm text-xs font-semibold uppercase text-white">
                Prodi F. Teknik
              </h2>
              <ul className="text-gray-400 font-medium">
                {prodi.map((prodi) => (
                  <li className="mb-4" key={prodi.name}>
                    <Link
                      href={prodi.link}
                      className="hover:underline lg:text-sm text-xs"
                    >
                      {prodi.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-6 lg:text-sm text-xs font-semibold uppercase text-white">
                Informasi Lainnya
              </h2>
              <ul className="text-gray-400 font-medium">
                {layanan.map((layanan) => (
                  <li className="mb-4" key={layanan.name}>
                    <Link
                      href={layanan.link}
                      className="hover:underline lg:text-sm text-xs"
                    >
                      {layanan.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 sm:mx-auto border-gray-400 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm sm:text-center text-gray-400">
            {copyright}
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            {fakultas.socialMedias.map((media, index) => (
              <Link
                href={media.link}
                className={`text-gray-400 hover:text-white ${
                  index > 0 && "ms-5"
                }`}
                key={media.name}
              >
                {mediasLogo[media.name]}
                <span className="sr-only">{media.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
