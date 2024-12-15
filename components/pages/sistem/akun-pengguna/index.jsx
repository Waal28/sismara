/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import SearchBar from "../acara/components/SearchBar";
import { IconButton, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";
import UsersAccountList from "./UsersAccountList";
import { useAppState } from "@/context/AppStateContext";
import ModalAddOrEditAcount from "./ModalAddOrEditAcount";
import { getEventOrganizerBySearch } from "@/api/src/pengguna";
import { useUsersAccState } from "@/context/UsersAccContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAdminState } from "@/context/AdminContext";

export default function UsersAccount() {
  const { updateAppState } = useAppState();
  const { currentAdmin } = useAdminState();
  const { updateUsersAccState, refreshDataAcc } = useUsersAccState();
  const router = useRouter();
  const [keyword, setKeyword] = React.useState("");
  async function fetchEventOrganizer() {
    updateUsersAccState.isLoading(true);
    try {
      const res = await getEventOrganizerBySearch(keyword);
      updateUsersAccState.eventOrg(res.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.message || "Terjadi kesalahan", {
        theme: "colored",
      });
    } finally {
      updateUsersAccState.isLoading(false);
    }
  }
  React.useEffect(() => {
    if (currentAdmin && !currentAdmin.isAdmin) {
      router.push("/admin");
    }
  }, []);
  React.useEffect(() => {
    fetchEventOrganizer();
  }, [keyword, refreshDataAcc]);
  return (
    <React.Fragment>
      <h1 className="text-2xl sm:text-3xl font-bold mb-10">Akun Pengguna</h1>
      <div className="flex items-center justify-end gap-3 mb-10">
        <Tooltip title="Tambah Akun" placement="top">
          <IconButton
            className="dark:bg-gray-500"
            onClick={() =>
              updateAppState.modal({
                open: true,
                children: <ModalAddOrEditAcount />,
              })
            }
          >
            <Add className="w-6 h-6 font-bold dark:text-gray-50 text-gray-900" />
          </IconButton>
        </Tooltip>
        <div className="sm:w-[50%] w-full">
          <SearchBar placeholder="Cari Pengguna" updateState={setKeyword} />
        </div>
      </div>
      <UsersAccountList />
    </React.Fragment>
  );
}
