"use client";
import React from "react";

import CardMyEvents from "./CardMyEvents";
import CardProfile from "./CardProfile";

export default function Profile() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl lg:w-[90%] md:w-[60%] w-[70%] max-h-screen overflow-auto">
      <main className="grid lg:grid-cols-5 grid-cols-1 gap-4">
        <CardProfile />
        <CardMyEvents />
      </main>
    </div>
  );
}
