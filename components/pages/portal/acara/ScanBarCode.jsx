"use client";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function ScanBarCode({ fetchMyEvents }) {
  useEffect(() => {
    const qrcodeRegionId = "qr-reader";
    const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, {
      fps: 10,
      qrbox: 250,
    });

    html5QrcodeScanner.render(
      (result) => {
        console.log(result);
        alert("Presensi Berhasil: " + result);
        fetchMyEvents();
      },
      (error) => {
        console.error("Error scanning QR code: ", error);
      }
    );

    return () => {
      html5QrcodeScanner.clear();
    };
  }, []);

  return (
    <main className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl lg:w-[50%] md:w-[60%] sm:w-[80%] w-[90%] max-h-screen overflow-auto">
      <div className="w-full mx-auto flex items-center justify-center">
        <div className="w-full bg-gray-200 dark:bg-gray-900 rounded-2xl flex flex-col items-center justify-center p-5 lg:py-10 sm:py-10">
          <div className="flex flex-col items-center mb-6 lg:text-2xl md:text-2xl font-semibold text-teal-800 dark:text-white">
            Scan Barcode untuk Presensi
          </div>
          <div id="qr-reader" style={{ width: "100%" }}></div>
        </div>
      </div>
    </main>
  );
}

ScanBarCode.propTypes = {
  fetchMyEvents: PropTypes.func.isRequired,
};
