import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { Mail } from "@mui/icons-material";
import { Badge } from "@mui/material";
import { useAdminState } from "@/context/AdminContext";
import { Loader3 } from "@/components/atoms/CustomLoader";
import ModalConfirmDelete from "@/components/molecules/ModalConfirmDelete";
import { deleteMessage, readMessage } from "@/api/src/pesan";
import { useAppState } from "@/context/AppStateContext";
import { toast } from "react-toastify";

export default function ListMessages() {
  const { updateAppState } = useAppState();
  const { allMsg, loadingMsg, updateAdminState } = useAdminState();

  async function handleDeleteMsg(id) {
    try {
      await deleteMessage(id);
      updateAdminState.refreshDataMsg(1);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error?.response?.data?.message || "Terjadi kesalahan", {
        theme: "colored",
      });
    }
  }
  const handleReplyClick = (email) => {
    // Membuka email di klien default
    window.location.href = `mailto:${email}`;
  };
  const handleClickDelete = (id) => {
    updateAppState.modal({
      open: true,
      children: (
        <ModalConfirmDelete onClickConfirm={() => handleDeleteMsg(id)} />
      ),
    });
  };
  const handleReadMsg = async (item) => {
    if (item.isRead) return;
    try {
      await readMessage(item.id);
      updateAdminState.refreshDataMsg();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Terjadi kesalahan", {
        theme: "colored",
      });
    }
  };
  return (
    <div>
      {loadingMsg && (
        <div className="w-full flex justify-center items-center h-96">
          <Loader3 className="w-10 h-10 text-white fill-teal-600" />
        </div>
      )}
      {!loadingMsg &&
        allMsg.map((item) => (
          <Accordion key={item.id} onClick={() => handleReadMsg(item)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-message"
              id="panel1a-header"
              className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
            >
              <div className="mr-2">
                <Badge color="error" variant="dot" invisible={item.isRead}>
                  <Mail />
                </Badge>
              </div>
              <h3 className="font-medium sm:text-base text-sm">{item.email}</h3>
            </AccordionSummary>
            <AccordionDetails className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white">
              <h3 className="font-bold sm:text-base text-sm mb-2">
                Subject: {item.subject}
              </h3>
              <p className="sm:text-base text-sm">{item.message}</p>
            </AccordionDetails>
            <AccordionActions className="bg-gray-200 dark:bg-gray-700">
              <Button
                sx={{ textTransform: "none" }}
                color="info"
                className="sm:text-base text-sm"
                onClick={() => handleReplyClick(item.email)}
              >
                Balas
              </Button>
              <Button
                sx={{ textTransform: "none" }}
                color="error"
                className="sm:text-base text-sm"
                onClick={() => handleClickDelete(item.id)}
              >
                Hapus
              </Button>
            </AccordionActions>
          </Accordion>
        ))}
    </div>
  );
}
