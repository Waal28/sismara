import CollapsibleTable from "@/components/atoms/CollapsibleTable";
import PropTypes from "prop-types";
import { Upload } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import React from "react";
import { useAdminState } from "@/context/AdminContext";
import { useEventsState } from "@/context/EventsContext";

const columns = [
  { field: "name", headerName: "Nama Peserta" },
  { field: "email", headerName: "Email", align: "left" },
  { field: "isPresent", headerName: "Status Kehadiran", align: "left" },
];

const detailColumns = [{ field: "detail", headerName: "Detail Peserta" }];

export default function ParticipantList({
  peserta,
  isCertificate,
  handleClickUpload,
}) {
  const { currentAdmin } = useAdminState();
  const { currEvent } = useEventsState();
  const [cols, setCols] = React.useState(columns);

  React.useEffect(() => {
    if (currentAdmin && currentAdmin.isAdmin) {
      const newCols = [
        ...columns,
        { field: "action", headerName: "Aksi", align: "center" },
      ];
      setCols(newCols);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-5 gap-3">
        <h1 className="text-lg sm:text-xl font-bold">
          Daftar Peserta{" "}
          <span className="bg-teal-600 text-white py-1 px-2 rounded-lg text-sm sm:text-base">
            {peserta.length}/{currEvent.max_participants}
          </span>
        </h1>
        {isCertificate && (
          <Tooltip title="Upload Sertifikat Peserta" placement="top">
            <IconButton
              className="dark:bg-gray-500"
              onClick={handleClickUpload}
            >
              <Upload className="w-6 h-6 font-bold dark:text-gray-50 text-gray-900" />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <div className="max-h-[41rem] overflow-auto shadow-lg">
        <CollapsibleTable
          rows={peserta}
          columns={cols}
          detailColumns={detailColumns}
        />
      </div>
    </div>
  );
}
ParticipantList.propTypes = {
  peserta: PropTypes.array,
  isCertificate: PropTypes.bool,
  handleClickUpload: PropTypes.func,
};
