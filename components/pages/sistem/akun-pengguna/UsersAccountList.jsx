import { deleteEventOrganizer } from "@/api/src/pengguna";
import CollapsibleTable from "@/components/atoms/CollapsibleTable";
import { DeleteIcon, EditIcon } from "@/components/atoms/CustomIcon";
import { useAppState } from "@/context/AppStateContext";
import { IconButton, Tooltip } from "@mui/material";
import React from "react";
import { toast } from "react-toastify";
import ModalAddOrEditAcount from "./ModalAddOrEditAcount";
import { useUsersAccState } from "@/context/UsersAccContext";
import ModalConfirmDelete from "@/components/molecules/ModalConfirmDelete";
import { Loader3 } from "@/components/atoms/CustomLoader";
import ModalChangePasswordUserForAdmin from "@/components/atoms/ModalChangePasswordUserForAdmin";
import { KeyRounded } from "@mui/icons-material";

const columns = [
  { field: "name", headerName: "Username" },
  { field: "email", headerName: "Email", align: "left" },
  { field: "isAdmin", headerName: "Role", align: "left" },
  { field: "action", headerName: "Aksi", align: "left" },
];

const detailColumns = [{ field: "detail", headerName: "Detail Akun" }];

export default function UsersAccountList() {
  const { updateAppState } = useAppState();
  const { updateUsersAccState, eventOrg, isLoading } = useUsersAccState();

  async function handleDelete(id) {
    try {
      await deleteEventOrganizer(id);
      updateUsersAccState.refreshDataAcc();
      toast.success("Data berhasil dihapus", { theme: "colored" });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.message || "Terjadi kesalahan", {
        theme: "colored",
      });
    }
  }
  function renderRows() {
    return eventOrg.map((item) => ({
      name: item.username,
      email: item.email,
      isAdmin: item.isAdmin ? "Admin" : "Penyelenggara Acara",
      action: (
        <div className="flex items-center gap-2">
          <Tooltip title="Edit Akun" placement="top">
            <IconButton
              className="dark:bg-gray-500"
              onClick={() =>
                updateAppState.modal({
                  open: true,
                  children: <ModalAddOrEditAcount dataEdit={item} />,
                })
              }
            >
              <EditIcon className="w-6 h-6 font-bold text-blue-500" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hapus Akun" placement="top">
            <IconButton
              className="dark:bg-gray-500"
              onClick={() =>
                updateAppState.modal({
                  open: true,
                  children: (
                    <ModalConfirmDelete
                      onClickConfirm={() => handleDelete(item.id)}
                    />
                  ),
                })
              }
            >
              <DeleteIcon className="w-6 h-6 font-bold text-red-500" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Password" placement="top">
            <IconButton
              className="dark:bg-gray-500"
              onClick={() =>
                updateAppState.modal({
                  open: true,
                  children: (
                    <ModalChangePasswordUserForAdmin
                      userId={item.id}
                      userEmail={item.email}
                    />
                  ),
                })
              }
            >
              <KeyRounded className="w-6 h-6 font-bold text-slate-900" />
            </IconButton>
          </Tooltip>
        </div>
      ),
      detail: [
        { detail: `Nama: ${item.name || "-"}` },
        { detail: `NPM: ${item.npm || "-"}` },
        { detail: `Prodi: ${item.prodi}` },
      ],
    }));
  }

  return isLoading ? (
    <div className="flex justify-center items-center min-h-[31rem]">
      <Loader3 />
    </div>
  ) : (
    <div className="max-h-[31rem] overflow-auto shadow-lg">
      <CollapsibleTable
        rows={renderRows()}
        columns={columns}
        detailColumns={detailColumns}
      />
    </div>
  );
}
