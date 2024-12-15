"use client";
import React from "react";
import {
  CertificateIcon,
  DeleteIcon,
  EditIcon,
  EndDateIcon,
  ImageIcon,
  LocationIcon,
  PaidIcon,
  PublishIcon,
  QrCodeIcon,
  SadIcon,
  StartDateIcon,
  VideoIcon,
  XlsxIcon,
} from "@/components/atoms/CustomIcon";
import RunDownnEvent from "@/components/pages/portal/acara/RunDownnEvent";
import { formatDateTime, formatRupiah } from "@/server/config/format";
import { Divider, IconButton, Tooltip } from "@mui/material";
import { useAppState } from "@/context/AppStateContext";
import ModalQrCodePresent from "./ModalQrCodePresent";
import { useEventsState } from "@/context/EventsContext";
import ModalAddOrEditEvent from "./ModalAddOrEditEvent";
import ModalConfirmDelete from "@/components/molecules/ModalConfirmDelete";
import { deleteEvent, updateEvent } from "@/api/src/acara";
import {
  bgColorForStatus,
  listStatusForDisabledBtn,
  listDisableBtn,
} from "@/constants";
import { Check } from "@mui/icons-material";
import Link from "next/link";
import { useAdminState } from "@/context/AdminContext";
import { toast } from "react-toastify";
import ModalSeePosters from "./ModalSeePosters";

export default function EventPoster() {
  const { updateAppState } = useAppState();
  const { updateEventsState } = useEventsState();
  const { currentAdmin } = useAdminState();
  const { currEvent } = useEventsState();
  const status = currEvent && currEvent.status;
  const styleForBadge = { backgroundColor: bgColorForStatus[status] };
  const actions = [
    {
      id: "edit_event",
      title: "Edit acara",
      icon: EditIcon,
      color: "text-blue-500",
      onClick: () => {
        updateAppState.modal({
          open: true,
          children: <ModalAddOrEditEvent isEdit={true} />,
        });
      },
    },
    {
      id: "delete_event",
      title: "Hapus acara",
      icon: DeleteIcon,
      color: "text-red-500",
      onClick: () =>
        updateAppState.modal({
          open: true,
          children: (
            <ModalConfirmDelete
              onClickConfirm={() => handleDeleteEvent(currEvent.id)}
            />
          ),
        }),
    },
    {
      id: "export_to_excel",
      title: "Export ke Excel",
      icon: XlsxIcon,
      color: "text-green-500",
      onClick: () => {
        console.log("waal");
      },
    },
    {
      id: "barcode_absen",
      title: "Barcode Absen",
      icon: QrCodeIcon,
      color: "text-black",
      onClick: () => {
        updateAppState.modal({
          open: true,
          children: <ModalQrCodePresent />,
        });
      },
    },
  ];
  async function handleDeleteEvent(id) {
    await deleteEvent(id);
    updateEventsState.refreshEvents();
  }
  async function handlePublish() {
    try {
      await updateEvent(currEvent.id, {
        status: "open",
      });
      updateEventsState.refreshEvents();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Terjadi kesalahan", {
        theme: "colored",
      });
    }
  }
  function handleClickPublish() {
    updateAppState.modal({
      open: true,
      children: (
        <ModalConfirmDelete
          content={
            <div className="mb-5 dark:text-white">
              <PublishIcon className="w-11 h-11 mb-3.5 mx-auto" />
              <h4 className="mb-2 sm:text-lg text-base font-semibold">
                Anda yakin ingin mempublish acara ini?
              </h4>
              <p className="sm:text-sm text-xs">
                Setelah dipublish, acara tidak dapat diubah lagi
              </p>
            </div>
          }
          btnLabel="Publish"
          onClickConfirm={handlePublish}
        />
      ),
    });
  }
  function handleClickPoster() {
    updateAppState.modal({
      open: true,
      children: (
        <ModalSeePosters />
      ),
    });
  }

  function isHideBtn(btnId) {
    if (currentAdmin.isAdmin) return false;
    if (
      listDisableBtn.includes(btnId) &&
      listStatusForDisabledBtn.includes(status)
    ) {
      return true;
    }
    return false;
  }
  return currEvent ? (
    <div className="w-full dark:bg-gray-700 bg-gray-200 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1">
          {!currentAdmin.isAdmin &&
            listStatusForDisabledBtn.includes(status) && (
              <span className="inline-block bg-teal-200 text-teal-800 sm:text-sm text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-teal-800 dark:text-teal-200">
                Acara sudah dipublish, hubungi admin jika terdapat kesalahan
              </span>
            )}
        </div>
        <div className="flex gap-3 justify-end items-center">
          {actions
            .filter((item) => !isHideBtn(item.id))
            .map((item, i) => (
              <Tooltip key={i} title={item.title} placement="top">
                <IconButton
                  className="dark:bg-gray-500"
                  onClick={() => item.onClick()}
                >
                  <item.icon className={`w-6 h-6 font-bold ${item.color}`} />
                </IconButton>
              </Tooltip>
            ))}
        </div>
      </div>
      <Divider className="dark:bg-gray-500 bg-gray-300" />
      <h2 className="flex items-center justify-between text-sm font-medium text-gray-500 dark:text-teal-300 tracking-widest mb-2 mt-4">
        {currEvent.prodi}
        <div className="flex items-center">
          {!currEvent.is_paid && (
            <span className="w-fit h-fit bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
              Gratis
            </span>
          )}
          {currEvent.is_online && (
            <span className="w-fit h-fit bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-800 dark:text-indigo-200">
              Online
            </span>
          )}
          <div
            style={styleForBadge}
            className="text-white tracking-normal flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full border"
          >
            <div className="sm:text-base text-xs leading-none max-w-full flex-initial capitalize">
              {currEvent.status}
            </div>
          </div>
        </div>
      </h2>
      <h1 className="text-gray-900 dark:text-white text-xl sm:text-3xl font-medium mb-1">
        {currEvent.title}
      </h1>
      <div className="my-4 grid grid-cols-4 sm:grid-cols-5 gap-1 text-xs sm:text-base text-gray-600 dark:text-teal-300">
        <span className="flex items-center text-yellow-600 dark:text-yellow-500 font-medium">
          <StartDateIcon className="mr-1" /> Mulai
        </span>
        <span className="col-span-3 sm:col-span-4 font-medium tracking-wide">
          : {formatDateTime(currEvent.schedule.start_time)}
        </span>
        <span className="flex items-center text-yellow-600 dark:text-yellow-500 font-medium">
          <EndDateIcon className="mr-1" /> Selesai
        </span>
        <span className="col-span-3 sm:col-span-4 font-medium tracking-wide">
          : {formatDateTime(currEvent.schedule.end_time)}
        </span>
        <span className="flex items-center text-yellow-600 dark:text-yellow-500 font-medium">
          <LocationIcon className="mr-1" /> Lokasi
        </span>
        <span className="col-span-3 sm:col-span-4 font-medium">
          :{" "}
          <Link
            href={currEvent.location.link_gmaps}
            target="_blank"
            className="underline underline-offset-4 hover:text-teal-700 dark:hover:text-teal-500 duration-200"
          >
            {currEvent.location.address}
          </Link>
        </span>
        {currEvent.is_certificate && (
          <>
            <span className="flex items-center text-yellow-600 dark:text-yellow-500 font-medium">
              <CertificateIcon className="mr-1" /> Sertifikat
            </span>
            <span className="col-span-3 sm:col-span-4 font-medium">
              : <Check className="text-green-500" />
            </span>
          </>
        )}
        {currEvent.is_paid && (
          <>
            <span className="flex items-center text-yellow-600 dark:text-yellow-500 font-medium">
              <PaidIcon className="mr-1" /> Harga
            </span>
            <span className="col-span-3 sm:col-span-4 font-medium">
              : {formatRupiah(currEvent.payment_price)}
            </span>
          </>
        )}
      </div>
      <div className="flex gap-2">
        {currEvent.is_volunteers && (
          <div className="mb-3">
            <span className="bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
              Membutuhkan Volunteer
            </span>
          </div>
        )}
        {currEvent.is_online && (
          <div className="mb-3">
            <Link
              href={currEvent.event_link}
              target="_blank"
              className="flex items-center w-fit bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-800 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-700"
            >
              <VideoIcon className="mr-2" />
              Klik disini untuk bergabung
            </Link>
          </div>
        )}
      </div>
      <p className="leading-relaxed text-xs sm:text-base text-gray-900 dark:text-white mb-4">
        {currEvent.desc}
      </p>
      <section className="mb-6">
        <RunDownnEvent />
      </section>
      <Divider className="dark:bg-gray-500 bg-gray-300" />
      <div className="flex gap-3 justify-between mt-4">
        <button
          onClick={handleClickPoster}
          className="text-sm sm:text-base flex items-center text-white bg-sky-700 border-0 py-2 px-6 focus:outline-none hover:bg-sky-600 rounded"
        >
          <ImageIcon className="mr-2" />
          Lihat Poster
        </button>
        {(currentAdmin.isAdmin || !listStatusForDisabledBtn.includes(status)) && (
          <button
            onClick={handleClickPublish}
            className="text-sm sm:text-base flex text-white bg-teal-700 border-0 py-2 px-6 focus:outline-none hover:bg-teal-600 rounded"
          >
            Publish Acara
          </button>
        )}
      </div>
    </div>
  ) : (
    <div className="w-full flex flex-col justify-center items-center h-full">
      <SadIcon className="w-24 h-24 text-gray-400 mb-5" />
      <span className="text-sm sm:text-2xl font-medium text-gray-400">
        Tidak ada acara
      </span>
    </div>
  );
}
