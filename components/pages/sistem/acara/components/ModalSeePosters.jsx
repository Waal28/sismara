"use client";
import React from "react";
import { useEventsState } from "@/context/EventsContext";
import { getImage } from "@/constants";
import CarauselComp from "@/components/molecules/CarauselComp";
import Image from "next/image";

export default function ModalSeePosters() {
  const { currEvent } = useEventsState();
  return (
    <main className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl lg:w-[50%] md:w-[60%] sm:w-[80%] w-[90%] max-h-screen overflow-auto">
      <div className="w-full mx-auto flex items-center justify-center">
        <div className="w-full bg-gray-200 dark:bg-gray-900 rounded-2xl flex flex-col items-center justify-center p-5 py-20 sm:py-18">
          <div className="flex flex-col items-center mb-6 lg:text-2xl md:text-2xl font-semibold text-teal-800 dark:text-white">
            Poster Acara {currEvent.title}
          </div>
          <div className="relative w-full h-auto">
            {currEvent.posters.length > 0 ? (
              <CarauselComp className="w-full h-[400px] relative">
                {currEvent.posters.map((image, idx) => (
                  <Image
                    key={idx}
                    fill
                    priority
                    sizes="100%"
                    alt={currEvent.title}
                    src={getImage(image)}
                    style={{ objectFit: "contain" }}
                  />
                ))}
              </CarauselComp>
            ) : (
              <p className="sm:text-base text-xs text-center leading-tight text-gray-500 dark:text-white bg-gray-50 dark:bg-gray-800 py-4 px-7 mb-8 rounded-md">
                Poster belum ditambahkan
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}