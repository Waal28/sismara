"use client";
import React from "react";
import ListMessages from "./ListMessages";

export default function AdminMessages() {
  return (
    <React.Fragment>
      <h1 className="text-2xl sm:text-3xl font-bold mb-10">Pesan</h1>
      <ListMessages />
    </React.Fragment>
  );
}
