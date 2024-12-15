"use client";
import React from "react";
import PropTypes from "prop-types";
import { useEventsState } from "@/context/EventsContext";
import { CircularProgress } from "@mui/material";
import { useAppState } from "@/context/AppStateContext";

export default function ModalPaidInfo({ handleAddParticipant, fetchMyEvents }) {
  const { currEvent } = useEventsState();
  const { updateAppState } = useAppState();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await handleAddParticipant();
      await fetchMyEvents();
      updateAppState.modal({ open: false });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl lg:w-[50%] md:w-[60%] sm:w-[80%] w-[90%] max-h-screen overflow-auto">
      <div className="w-full mx-auto flex items-center justify-center">
        <div className="w-full bg-gray-200 dark:bg-gray-900 rounded-2xl flex flex-col items-center justify-center p-5 py-20 sm:py-18">
          <div className="flex flex-col items-center mb-6 lg:text-2xl md:text-2xl font-semibold text-teal-800 dark:text-white">
            Informasi Pembayaran
          </div>
          <div>
            <p className="sm:text-base text-xs leading-tight text-gray-500 dark:text-white bg-gray-50 dark:bg-gray-800 py-4 px-7 mb-8 rounded-md">
              {currEvent.payment_desc || "-"}
            </p>
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="w-full text-center py-3 px-6 bg-teal-800 text-white rounded-lg sm:text-sm text-xs font-semibold hover:bg-teal-900"
            >
              {loading ? (
                <CircularProgress color="inherit" size={12} />
              ) : (
                "Ikuti Acara"
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

ModalPaidInfo.propTypes = {
  handleAddParticipant: PropTypes.func.isRequired,
  fetchMyEvents: PropTypes.func.isRequired,
};
