"use client";
import React from "react";
import PropTypes from "prop-types";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { useAppState } from "@/context/AppStateContext";
import { addCandidateVolunteer } from "@/api/src/peserta";

export default function ModalVolunteerForm({ event, fetchMyEvents }) {
  const { updateAppState, currentUser } = useAppState();
  const [state, setState] = React.useState({
    answer: "",
    loading: false,
  });
  const { answer, loading } = state;
  function updateState(key, value) {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    updateState("loading", true);
    try {
      await addCandidateVolunteer({
        eventId: event.id,
        answer,
        idMhs: currentUser.id,
      });
      toast.success(
        "Jawaban berhasil disimpan, mohon ditunggu informasi selanjutnya",
        {
          theme: "colored",
          position: "top-center",
          autoClose: 10000,
        }
      );
      await fetchMyEvents();
      updateAppState.modal({ open: false });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Terjadi kesalahan", {
        theme: "colored",
      });
    } finally {
      updateState("loading", false);
    }
  }
  return (
    <main className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl lg:w-[50%] md:w-[60%] sm:w-[80%] w-[90%] max-h-screen overflow-auto">
      <div className="w-full mx-auto flex items-center justify-center">
        <div className="w-full bg-gray-200 dark:bg-gray-900 rounded-2xl flex flex-col items-center justify-center p-5 lg:py-10 sm:py-10">
          <div className="flex flex-col items-center mb-6 lg:text-2xl md:text-2xl font-semibold text-teal-800 dark:text-white">
            Informasi Terkait Volunteer
          </div>
          <main className="w-full">
            <p className="sm:text-base text-xs leading-tight text-gray-500 dark:text-white bg-gray-50 dark:bg-gray-800 py-4 px-7 mb-8 rounded-md">
              {event.criteria_volunteers || "-"}
            </p>
            <form onSubmit={handleSubmit}>
              <textarea
                value={answer}
                onChange={(e) => updateState("answer", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-teal-800 sm:text-base text-xs rounded-lg focus:ring-teal-600 focus:border-teal-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-teal-600"
                placeholder="Tuliskan Alasan Anda Menjadi Volunteer"
                required
                rows="2"
              />

              <div className="flex justify-between items-center mt-6">
                <span className="w-fit h-fit bg-gray-100 text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-gray-300">
                  volunteer tersisa : {event.totalVolunteers || 0}/
                  {event.max_volunteers}
                </span>
                <button
                  disabled={
                    loading || event.totalVolunteers >= event.max_volunteers
                  }
                  className="w-fit text-center py-3 px-6 bg-teal-800 text-white rounded-lg sm:text-sm text-xs font-semibold hover:bg-teal-900"
                >
                  {loading ? (
                    <CircularProgress color="inherit" size={12} />
                  ) : event.totalVolunteers >= event.max_volunteers ? (
                    "Volunteer Sudah Penuh"
                  ) : (
                    "Kirim"
                  )}
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </main>
  );
}

ModalVolunteerForm.propTypes = {
  event: PropTypes.object.isRequired,
  fetchMyEvents: PropTypes.func.isRequired,
};
