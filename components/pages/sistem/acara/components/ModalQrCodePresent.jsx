"use client";
import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useAppState } from "@/context/AppStateContext";

export default function ModalQrCodePresent() {
  const [qrData, setQrData] = React.useState("");
  const { updateAppState } = useAppState();
  // Function to generate new QR data, could be anything (random string, timestamp, etc.)
  const generateQrData = () => {
    const timestamp = new Date().toISOString(); // Contoh, gunakan timestamp untuk memastikan QR berubah
    setQrData(timestamp);
  };

  React.useEffect(() => {
    // Call the function immediately to set initial QR code
    generateQrData();

    // Set interval to update QR code every 3 seconds
    const interval = setInterval(() => {
      generateQrData();
    }, 3000); // 3 seconds

    // Cleanup the interval when component unmounts
    return () => clearInterval(interval);
  }, []);
  return (
    <main className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl w-fit max-h-screen overflow-auto">
      <div className="w-[90vw] md:w-[70vw] h-[90vh] mx-auto flex items-center justify-center relative">
        <div className="absolute top-2 right-2">
          <IconButton
            onClick={() => updateAppState.modal({ open: false })}
            className="dark:bg-gray-500 bg-gray-500 text-gray-50 dark:text-black dark:hover:text-gray-50"
          >
            <Close fontSize="small" />
          </IconButton>
        </div>
        <div className="w-full h-full bg-gray-200 dark:bg-gray-900 rounded-2xl flex flex-col items-center justify-center p-5 lg:py-10 sm:py-10">
          <h1 className="text-center mb-16 lg:text-3xl md:text-2xl font-semibold text-teal-800 dark:text-white">
            Barcode untuk Presensi
          </h1>
          <QRCodeSVG value={qrData} size={256} />
        </div>
      </div>
    </main>
  );
}
