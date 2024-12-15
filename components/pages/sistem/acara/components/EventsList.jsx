"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchBar from "./SearchBar";
import { deleteEvent, getAllEventsByFilters } from "@/api/src/acara";
import { Loader1 } from "@/components/atoms/CustomLoader";
import {
  colorForStatus,
  listDisableBtn,
  listStatusForDisabledBtn,
} from "@/constants";
import FilterListEvents from "./FilterListEvents";
import { Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppState } from "@/context/AppStateContext";
import ModalAddOrEditEvent from "./ModalAddOrEditEvent";
import { useEventsState } from "@/context/EventsContext";
import ModalConfirmDelete from "@/components/molecules/ModalConfirmDelete";
import { useAdminState } from "@/context/AdminContext";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function EventsList() {
  const { updateAppState } = useAppState();
  const { currentAdmin } = useAdminState();
  const { refreshEvents, updateEventsState, events, filters, dateRange } =
    useEventsState();
  const [keyword, setKeyword] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  // Membuat payload berdasarkan kondisi
  const createPayload = () => {
    const payload = {
      search: keyword || undefined, // Memastikan nilai default undefined
      prodi: filters?.prodi,
      status: filters?.status,
      start: dateRange?.start,
      end: dateRange?.end,
    };

    // Menghapus properti yang tidak diperlukan berdasarkan kondisi
    if (keyword) {
      delete payload.prodi;
      delete payload.status;
      delete payload.start;
      delete payload.end;
      updateEventsState.filters(null);
      updateEventsState.dateRange(null);
    } else if (filters) {
      delete payload.search;
    }

    return payload;
  };

  async function fetchListEvent() {
    setLoading(true);
    const payload = createPayload();

    try {
      const res = await getAllEventsByFilters(payload);
      const data = currentAdmin.isAdmin
        ? res.data
        : res.data.filter((item) => item.prodi === currentAdmin.prodi);
      updateEventsState.events(data);
      updateEventsState.currEvent(data[0]);
    } catch (error) {
      console.error("Error fetching events:", error);
      // Memberi tahu pengguna tentang kesalahan (bisa menggunakan alert atau notifikasi)
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteEvent(id) {
    await deleteEvent(id);
    updateEventsState.refreshEvents();
  }
  function isHideBtn(btnId, status) {
    if (currentAdmin.isAdmin) return false;
    if (
      listDisableBtn.includes(btnId) &&
      listStatusForDisabledBtn.includes(status)
    ) {
      return true;
    }
    return false;
  }
  React.useEffect(() => {
    fetchListEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshEvents, keyword, filters, dateRange]);

  return (
    <Box>
      <div className="mb-5 flex gap-3 items-center">
        <SearchBar placeholder="Cari acara" updateState={setKeyword} />
        <FilterListEvents />
        <Tooltip title="Tambah Acara" placement="top">
          <IconButton
            className="dark:bg-gray-500"
            onClick={() =>
              updateAppState.modal({
                open: true,
                children: <ModalAddOrEditEvent />,
              })
            }
          >
            <Add className="w-6 h-6 font-bold dark:text-gray-50 text-gray-900" />
          </IconButton>
        </Tooltip>
      </div>
      <div className="flex items-center gap-2 mb-5">
        {Object.keys(colorForStatus).map((key, index) => (
          <React.Fragment key={index}>
            <span
              key={index}
              className="w-4 h-4 block rounded-full"
              style={{ backgroundColor: colorForStatus[key] }}
            ></span>
            <span className="text-sm capitalize">{key}</span>
          </React.Fragment>
        ))}
      </div>
      <Grid>
        <Demo className="rounded-xl">
          <List
            dense={true}
            className="bg-gray-200 dark:bg-gray-700 rounded-lg p-0 max-h-[28rem] overflow-auto shadow-lg"
          >
            {loading ? (
              <div className="w-full flex justify-center items-center h-40">
                <Loader1 className="w-10 h-10 text-white fill-teal-500" />
              </div>
            ) : events.length === 0 ? (
              <div className="w-full flex justify-center items-center h-40">
                Tidak ada acara
              </div>
            ) : (
              events.map((item, index) => (
                <ListItem
                  key={index}
                  onClick={() => updateEventsState.currEvent(item)}
                  className="border-b border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-300 dark:hover:bg-custom-tertiary "
                  secondaryAction={
                    isHideBtn("delete_event", item.status) ? (
                      ""
                    ) : (
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() =>
                          updateAppState.modal({
                            open: true,
                            children: (
                              <ModalConfirmDelete
                                onClickConfirm={() =>
                                  handleDeleteEvent(item.id)
                                }
                              />
                            ),
                          })
                        }
                      >
                        <DeleteIcon className="text-red-500" />
                      </IconButton>
                    )
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: colorForStatus[item.status] }}>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <span className="dark:text-white sm:text-base text-sm">
                        {item.title}
                      </span>
                    }
                    secondary={
                      <span className="dark:text-white sm:text-sm text-xs">
                        {item.prodi}
                      </span>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>
        </Demo>
      </Grid>
    </Box>
  );
}
