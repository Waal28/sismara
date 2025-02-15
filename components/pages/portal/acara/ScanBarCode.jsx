"use client";
import React from "react";
import PropTypes from "prop-types";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { participantPresent } from "@/api/src/peserta";
import { toast } from "react-toastify";
import { useEventsState } from "@/context/EventsContext";
import { useAppState } from "@/context/AppStateContext";
import { Loader3 } from "@/components/atoms/CustomLoader";

export default function ScanBarCode({ fetchMyEvents }) {
  const { currEvent } = useEventsState();
  const { currentUser, updateAppState } = useAppState();
  const [isLoading, setIsLoading] = React.useState(false);

  const onUpdate = async (err, result) => {
    if (result) {
      setIsLoading(true);
      try {
        const res = await participantPresent({
          mhsId: currentUser.id,
          eventId: currEvent.id,
          timestamp: result.text,
        });
        console.log(res);
        updateAppState.modal({
          open: false,
        });
        fetchMyEvents();
        toast.success("Absensi berhasil", { theme: "colored" });
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Terjadi kesalahan", {
          theme: "colored",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <main className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl lg:w-[50%] md:w-[60%] sm:w-[80%] w-[90%] max-h-screen overflow-auto">
      <div className="w-full mx-auto flex items-center justify-center">
        <div className="w-full bg-gray-200 dark:bg-gray-900 rounded-2xl flex flex-col items-center justify-center p-5 lg:py-10 sm:py-10">
          <div className="flex flex-col items-center mb-6 lg:text-2xl md:text-2xl font-semibold text-teal-800 dark:text-white">
            Scan Barcode untuk Presensi
          </div>
          {isLoading ? (
            <div className="w-full flex justify-center items-center h-96">
              <Loader3 className="w-10 h-10 text-white fill-teal-600" />
            </div>
          ) : (
            <BarcodeScannerComponent
              width={500}
              height={500}
              onUpdate={onUpdate}
            />
          )}
        </div>
      </div>
    </main>
  );
}

ScanBarCode.propTypes = {
  fetchMyEvents: PropTypes.func.isRequired,
};
