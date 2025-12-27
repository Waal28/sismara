/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import ParticipantList from "./components/ParticipantList";
import VolunteerList from "./components/VolunteerList";
import PotentialList from "./components/PotentialList";
import SearchBar from "../acara/components/SearchBar";
import {
  deleteParticipantOrVolunteer,
  getEventParticipantsAndVolunteers,
} from "@/api/src/peserta";
import { getAllEventsByFilters } from "@/api/src/acara";
import { Loader1 } from "@/components/atoms/CustomLoader";
import { SadIcon } from "@/components/atoms/CustomIcon";
import { Clear, Check, Delete } from "@mui/icons-material";
import { useAppState } from "@/context/AppStateContext";
import CertificateGenerator from "./components/CertificateGenerator";
import { useEventsState } from "@/context/EventsContext";
import { IconButton, Tooltip } from "@mui/material";
import ModalConfirmDelete from "@/components/molecules/ModalConfirmDelete";
import { toast } from "react-toastify";
import { useAdminState } from "@/context/AdminContext";

export default function AdminParticipants() {
  const { updateAppState } = useAppState();
  const { currentAdmin } = useAdminState();
  const { updateEventsState, currEvent } = useEventsState();
  const [state, setState] = React.useState({
    keyword: "",
    filteredSuggestions: [],
    loading: false,
    peserta: [],
    volunteers: [],
    loadingSuggestions: false,
    candidateVolunteers: [],
    candidatePeserta: [],
    totalPeserta: null,
    totalData: [],
  });
  const {
    keyword,
    filteredSuggestions,
    loading,
    peserta,
    volunteers,
    loadingSuggestions,
    candidateVolunteers,
    candidatePeserta,
    totalData,
  } = state;
  const updateState = (newState) =>
    setState((prev) => ({ ...prev, ...newState }));
  const handleSelectSuggestion = async (suggest) => {
    updateState({ loading: true });
    updateEventsState.currEvent(suggest.event);
    try {
      const res = await getEventParticipantsAndVolunteers(suggest.id);
      const resPeserta = res.data.peserta.map((item) => ({
        $fullData: item,
        name: item.mahasiswa.name,
        email: item.mahasiswa.email,
        status: item.status,
        isPresent: item.is_present ? "Hadir" : "Tidak Hadir",
        detail: [
          { detail: `NPM: ${item.mahasiswa.npm}` },
          { detail: `Prodi: ${item.mahasiswa.prodi}` },
        ],
        action: (
          <Tooltip title="Hapus Peserta" placement="left">
            <IconButton
              onClick={() => handleDelete(item.id, "peserta")}
              fontSize="small"
            >
              <Delete className="text-red-500" />
            </IconButton>
          </Tooltip>
        ),
      }));
      const resVolunterrs = res.data.volunteers.map((item) => ({
        $fullData: item,
        name: item.mahasiswa.name,
        email: item.mahasiswa.email,
        status: item.status,
        detail: [
          { detail: `NPM: ${item.mahasiswa.npm}` },
          { detail: `Prodi: ${item.mahasiswa.prodi}` },
        ],
        test_answers: item.test_answers,
        action: (
          <Tooltip title="Hapus Volunteer" placement="left">
            <IconButton
              onClick={() => handleDelete(item.id, "volunteer")}
              fontSize="small"
            >
              <Delete className="text-red-500" />
            </IconButton>
          </Tooltip>
        ),
      }));
      const formatTotalPeserta = {
        name: "Peserta",
        count: res.data.peserta.filter((item) => item.status !== "candidate")
          .length,
      };
      const formatTotalPesertaHadir = {
        name: "Peserta Hadir",
        count: res.data.peserta.filter(
          (item) => item.status !== "candidate" && item.is_present
        ).length,
      };
      const formatTotalPesertaTidakHadir = {
        name: "Peserta Tidak Hadir",
        count: res.data.peserta.filter(
          (item) => item.status !== "candidate" && !item.is_present
        ).length,
      };
      const formatTotalCalonPeserta = {
        name: "Calon Peserta",
        count: res.data.peserta.filter((item) => item.status === "candidate")
          .length,
      };
      const formatTotalVolunteer = {
        name: "Volunteer",
        count: res.data.volunteers.filter((item) => item.status !== "candidate")
          .length,
      };
      const formatTotalCalonVolunteer = {
        name: "Calon Volunteer",
        count: res.data.volunteers.filter((item) => item.status === "candidate")
          .length,
      };
      updateState({
        peserta: resPeserta.filter((item) => item.status !== "candidate"),
        volunteers: resVolunterrs.filter((item) => item.status !== "candidate"),
        candidatePeserta: resPeserta.filter(
          (item) => item.status === "candidate"
        ),
        candidateVolunteers: resVolunterrs.filter(
          (item) => item.status === "candidate"
        ),
        totalData: [
          formatTotalPeserta,
          formatTotalPesertaHadir,
          formatTotalPesertaTidakHadir,
          formatTotalCalonPeserta,
          formatTotalVolunteer,
          formatTotalCalonVolunteer,
        ],
      });
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Terjadi kesalahan", {
        theme: "colored",
      });
    } finally {
      updateState({ loading: false });
    }
  };
  const fetchEventsBySearch = async () => {
    updateState({ loadingSuggestions: true });
    try {
      const res = await getAllEventsByFilters({ search: keyword });
      const resData = currentAdmin.isAdmin
        ? res.data
        : res.data.filter((item) => item.prodi === currentAdmin.prodi);
      const resSuggestions = resData.map((item) => ({
        id: item.id,
        label: item.title,
        event: item,
      }));
      updateState({
        filteredSuggestions: resSuggestions,
      });
    } catch (error) {
      console.error(error);
    } finally {
      updateState({ loadingSuggestions: false });
    }
  };
  const handleClickUpload = (selected) => {
    updateAppState.modal({
      open: true,
      children: (
        <CertificateGenerator
          event={currEvent}
          certificateFor={selected}
          fetchEvent={handleSelectSuggestion}
        />
      ),
    });
  };
  const getBollIcon = (value) => {
    return value ? (
      <Check className="text-green-500" />
    ) : (
      <Clear className="text-red-500" />
    );
  };
  const handleDelete = async (id, type) => {
    updateAppState.modal({
      open: true,
      children: (
        <ModalConfirmDelete
          onClickConfirm={async () => {
            try {
              await deleteParticipantOrVolunteer({
                id,
                type,
                eventId: currEvent.id,
              });
              await handleSelectSuggestion({
                id: currEvent.id,
                event: currEvent,
              });
            } catch (error) {
              console.error(error);
              toast.error(
                error?.response?.data?.message || "Terjadi kesalahan",
                {
                  theme: "colored",
                }
              );
            }
          }}
        />
      ),
    });
  };
  React.useEffect(() => {
    fetchEventsBySearch();
  }, [keyword]);

  React.useEffect(() => {
    if (currEvent) {
      handleSelectSuggestion({ id: currEvent.id, event: currEvent });
    }
  }, []);

  return (
    <React.Fragment>
      <h1 className="text-2xl sm:text-3xl font-bold mb-10">Peserta</h1>
      <SearchBar
        placeholder="Cari acara"
        updateState={(value) => updateState({ keyword: value })}
        showSuggestions
        loadingSuggestions={loadingSuggestions}
        filteredSuggestions={filteredSuggestions}
        handleSelectSuggestion={handleSelectSuggestion}
      />
      {loading ? (
        <div className="w-full flex justify-center items-center h-96">
          <Loader1 className="w-10 h-10 text-white fill-teal-600" />
        </div>
      ) : currEvent ? (
        <>
          <h1 className="text-2xl sm:text-3xl font-bold my-5">
            {currEvent.title}
          </h1>
          <section className="grid grid-cols-1 gap-5 mb-10">
            <table className="sm:w-[45%] w-full">
              <tbody>
                <tr>
                  <th className="text-left py-2 px-6 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    Sertifikat: {getBollIcon(currEvent.is_certificate)}
                  </th>
                  <th className="text-left py-2 px-6 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    Berbayar: {getBollIcon(currEvent.is_paid)}
                  </th>
                  <th className="text-left py-2 px-6 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    Volunteer: {getBollIcon(currEvent.is_volunteers)}
                  </th>
                </tr>
              </tbody>
            </table>
            <div className="flex gap-5">
              {totalData.map((item, index) => (
                <div
                  key={index}
                  className="w-full flex flex-col items-center justify-center p-5 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                >
                  <dt className="mb-2 text-3xl font-extrabold">{item.count}</dt>
                  <dd className="text-gray-500 dark:text-gray-400">
                    {item.name}
                  </dd>
                </div>
              ))}
            </div>
          </section>
          <section className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="w-full">
              <ParticipantList
                peserta={peserta}
                isCertificate={currEvent.is_certificate}
                handleClickUpload={() => handleClickUpload("Peserta")}
              />
              {currEvent.is_paid && (
                <>
                  <div className="my-9" />
                  <PotentialList
                    candidateFor="Peserta"
                    listCandidate={candidatePeserta}
                    fetchEvent={handleSelectSuggestion}
                  />
                </>
              )}
            </div>
            {currEvent.is_volunteers && (
              <div className="w-full">
                <VolunteerList
                  volunteers={volunteers}
                  isCertificate={currEvent.is_certificate}
                  handleClickUpload={() => handleClickUpload("Volunteer")}
                />
                <div className="my-9" />
                <PotentialList
                  candidateFor="Volunteer"
                  listCandidate={candidateVolunteers}
                  fetchEvent={handleSelectSuggestion}
                />
              </div>
            )}
          </section>
        </>
      ) : (
        <div className="w-full flex flex-col justify-center items-center h-96">
          <SadIcon className="w-24 h-24 text-gray-400 mb-5" />
          <span className="text-sm sm:text-2xl font-medium text-gray-400">
            Acara Belum Dipilih
          </span>
        </div>
      )}
    </React.Fragment>
  );
}
