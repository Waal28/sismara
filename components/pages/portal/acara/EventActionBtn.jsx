/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import ScanBarCode from "./ScanBarCode";
import ModalLoginGoogle from "./ModalLoginGoogle";
import { useAppState } from "@/context/AppStateContext";
import { useEventsState } from "@/context/EventsContext";
import { addParticipant, getMyEvents } from "@/api/src/peserta";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import ModalVolunteerForm from "./ModalVolunteerForm";
import ModalPaidInfo from "./ModalPaidInfo";
import { showBtnInEventPageByStatus as showBtnByStatus } from "@/constants";

// Fungsi penanganan error yang lebih konsisten
const handleError = (error) => {
  console.error(error);
  toast.error(error?.response?.data?.message || "Terjadi kesalahan", {
    theme: "colored",
  });
};

export default function EventActionBtn() {
  const { updateAppState, currentUser } = useAppState();
  const { currEvent } = useEventsState();
  const [state, setState] = useState({
    loading: false,
    btnConfig1: null,
    btnConfig2: null,
  });
  const { loading, btnConfig1, btnConfig2 } = state;

  const updateState = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };
  async function handleAddParticipant() {
    updateState("loading", true);
    const payload = { idEvent: currEvent.id, idMhs: currentUser.id };

    try {
      await addParticipant(payload);
      updateState("btnConfig1", {
        label: "Anda Mengikuti Acara Ini",
        className: "bg-indigo-500",
        onClick: () => {},
      });
    } catch (error) {
      handleError(error);
    } finally {
      updateState("loading", false);
    }
  }
  // Fetch acara yang diikuti oleh user
  const fetchMyEvents = useCallback(async () => {
    if (!currentUser) return;
    updateState("loading", true);
    try {
      const res = await getMyEvents(currentUser.id);
      configureButtonBasedOnEvent(res.data);
    } catch (error) {
      handleError(error);
    } finally {
      updateState("loading", false);
    }
  }, [currentUser, currEvent]);

  // Konfigurasi tombol berdasarkan event yang sedang berlangsung
  const configureButtonBasedOnEvent = (participants) => {
    const dataApproved = participants.filter(
      (participant) =>
        participant.status === "approved" &&
        participant.id_event === currEvent.id
    );
    const dataCandidate = participants.filter(
      (participant) =>
        participant.status === "candidate" &&
        participant.id_event === currEvent.id
    );
    const isParticipantApproved = dataApproved.some(
      (participant) => participant.type === "peserta"
    );
    const isVolunteerApproved = dataApproved.some(
      (participant) => participant.type === "volunteer"
    );
    const isParticipantCandidate = dataCandidate.some(
      (participant) => participant.type === "peserta"
    );
    const isVolunteerCandidate = dataCandidate.some(
      (participant) => participant.type === "volunteer"
    );
    const isUserPresent = dataApproved.some(
      (participant) =>
        participant.type === "peserta" && participant.is_present === true
    );

    if (currEvent.status === "ongoing") {
      if (isParticipantApproved) {
        if (isUserPresent) {
          updateState("btnConfig1", btnUserIsPresence);
        } else {
          updateState("btnConfig1", btnPresence);
        }
        updateState("btnConfig2", null);
      } else if (isVolunteerApproved) {
        updateState("btnConfig1", null);
        updateState("btnConfig2", btnUserIsVolunteer);
      } else {
        updateState("btnConfig1", null);
        updateState("btnConfig2", null);
      }
    } else {
      if (isParticipantApproved) {
        updateState("btnConfig1", btnUserIsParticipant);
        updateState("btnConfig2", null);
      } else if (isVolunteerApproved) {
        updateState("btnConfig1", null);
        updateState("btnConfig2", btnUserIsVolunteer);
      } else if (isParticipantCandidate) {
        updateState("btnConfig1", btnUserIsCandidateParticipant);
        updateState("btnConfig2", null);
      } else if (isVolunteerCandidate) {
        updateState("btnConfig1", null);
        updateState("btnConfig2", btnUserIsCandidateVolunteer);
      } else {
        updateState("btnConfig1", btnUserIsNotParticipant);
        updateState("btnConfig2", btnUserIsNotVolunteer);
      }
    }
  };

  // Event Handler untuk mengikuti acara
  const handleClickFollow = async () => {
    if (currEvent.totalParticipants >= currEvent.max_participants) {
      toast.warning("Mohon maaf, acara sudah penuh", { theme: "colored" });
      return;
    }
    if (currEvent.is_paid) {
      updateAppState.modal({
        open: true,
        children: (
          <ModalPaidInfo
            handleAddParticipant={handleAddParticipant}
            fetchMyEvents={fetchMyEvents}
          />
        ),
      });
      return;
    }
    await handleAddParticipant();
  };
  const handleClickVolunteer = () => {
    updateAppState.modal({
      open: true,
      children: (
        <ModalVolunteerForm event={currEvent} fetchMyEvents={fetchMyEvents} />
      ),
    });
  };

  // Event Handler untuk absen acara
  const handleClickPresence = () => {
    updateAppState.modal({
      open: true,
      children: <ScanBarCode fetchMyEvents={fetchMyEvents} />,
    });
  };

  // Event Handler untuk login
  const handleClickLogin = () => {
    updateAppState.modal({
      open: true,
      children: <ModalLoginGoogle fetchMyEvents={fetchMyEvents} />,
    });
  };

  const btnUserIsVolunteer = {
    label: "Anda Menjadi Volunteer Acara Ini",
    className: "bg-red-700 cursor-default",
    onClick: () => {},
  };
  const btnUserIsNotVolunteer = {
    label: "Jadilah Volunteer",
    className: "bg-yellow-600 hover:bg-yellow-500",
    onClick: handleClickVolunteer,
  };
  const btnUserIsCandidateVolunteer = {
    label: "Pendaftaran volunteer Anda sedang kami proses",
    className: "bg-orange-700 cursor-default",
    onClick: () => {},
  };
  const btnUserIsParticipant = {
    label: "Anda Mengikuti Acara Ini",
    className: "bg-indigo-500 cursor-default",
    onClick: () => {},
  };
  const btnUserIsNotParticipant = {
    label: "Ikuti Acara",
    className: "bg-green-700 hover:bg-green-600",
    onClick: handleClickFollow,
  };
  const btnUserIsCandidateParticipant = {
    label: "Pendaftaranmu lagi kami proses, sabar ya!",
    className: "bg-sky-600 cursor-default",
    onClick: () => {},
  };
  const btnUserIsNotLogin = {
    label: "Login Untuk Ikuti Acara",
    className: "bg-blue-800 hover:bg-blue-900",
    onClick: handleClickLogin,
  };
  const btnPresence = {
    label: "Absensi Acara",
    className: "bg-blue-700 hover:bg-blue-600",
    onClick: handleClickPresence,
  };
  const btnUserIsPresence = {
    label: "Anda Sudah Absen",
    className: "bg-orange-800 cursor-default",
    onClick: () => {},
  };

  // React Effect untuk fetch data ketika ada perubahan user atau event
  useEffect(() => {
    if (currentUser) {
      fetchMyEvents();
    } else {
      updateState("btnConfig1", btnUserIsNotLogin);
    }
  }, [currentUser, currEvent]);

  return (
    currEvent &&
    showBtnByStatus.includes(currEvent.status) && (
      <div className="flex items-center gap-2">
        {btnConfig1 && (
          <button
            onClick={btnConfig1.onClick}
            className={`${btnConfig1.className} text-sm sm:text-base flex text-white border-0 py-2 px-6 focus:outline-none rounded`}
          >
            {loading ? (
              <CircularProgress
                size={20}
                className="text-white dark:text-white"
              />
            ) : (
              btnConfig1.label
            )}
          </button>
        )}
        {currEvent.is_volunteers && btnConfig2 && (
          <button
            onClick={btnConfig2.onClick}
            className={`${btnConfig2.className} text-sm sm:text-base flex text-white border-0 py-2 px-6 focus:outline-none rounded`}
          >
            {btnConfig2.label}
          </button>
        )}
      </div>
    )
  );
}
