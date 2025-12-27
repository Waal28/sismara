import React from "react";
import PropTypes from "prop-types";
import { Loader1 } from "@/components/atoms/CustomLoader";
import { styled } from "@mui/material/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Grid,
  IconButton,
  List,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { Cancel, Check } from "@mui/icons-material";
import { toast } from "react-toastify";
import { acceptOrRejectCandidate } from "@/api/src/peserta";
import { useEventsState } from "@/context/EventsContext";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function PotentialList({
  candidateFor,
  listCandidate,
  fetchEvent,
}) {
  const { currEvent } = useEventsState();
  const [loading, setLoading] = React.useState(false);

  async function handleAcceptOrReject(candidate, isApproved) {
    setLoading(true);
    try {
      await acceptOrRejectCandidate(candidate.$fullData.id, {
        isApproved,
        type: candidateFor.toLowerCase(),
        eventId: currEvent.id,
      });
      await fetchEvent({ id: currEvent.id, event: currEvent });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Terjadi kesalahan", {
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <h1 className="text-lg sm:text-xl font-bold mb-5">
        Daftar Calon {candidateFor}
      </h1>
      <Grid>
        <Demo className="rounded-xl shadow-sm">
          <List
            dense={true}
            className="bg-gray-200 dark:bg-gray-700 rounded-lg p-0 max-h-[18rem] overflow-auto shadow-lg"
          >
            {loading && (
              <div className="w-full flex justify-center items-center h-40">
                <Loader1 className="w-10 h-10 text-white fill-teal-500" />
              </div>
            )}
            {!loading &&
              listCandidate.length > 0 &&
              listCandidate.map((item, index) => (
                <Accordion key={index} className="dark:bg-gray-700">
                  <AccordionSummary id={index}>
                    <ListItemAvatar className="flex items-center">
                      <Avatar
                        alt="..."
                        src="https://api.iconify.design/material-symbols:person-2-rounded.svg"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <span className="dark:text-white sm:text-base text-xs">
                          {item.name}
                        </span>
                      }
                      secondary={
                        <span className="dark:text-white sm:text-sm text-xs">
                          {item.npm}
                        </span>
                      }
                    />
                    <ListItemAvatar className="flex items-center pe-5">
                      <Tooltip title="Terima" placement="top">
                        <IconButton
                          edge="end"
                          onClick={() => handleAcceptOrReject(item, true)}
                        >
                          <Check className="text-green-500" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Tolak" placement="top">
                        <IconButton
                          edge="end"
                          onClick={() => handleAcceptOrReject(item, false)}
                        >
                          <Cancel className="text-red-500" />
                        </IconButton>
                      </Tooltip>
                    </ListItemAvatar>
                  </AccordionSummary>
                  <AccordionDetails>
                    <p className="dark:text-white sm:text-base text-xs">
                      {item.test_answers}
                    </p>
                  </AccordionDetails>
                </Accordion>
              ))}
            {!loading && listCandidate.length === 0 && (
              <div className="w-full flex justify-center items-center h-40">
                <p className="dark:text-white sm:text-base text-xs">
                  Tidak ada calon {candidateFor}
                </p>
              </div>
            )}
          </List>
        </Demo>
      </Grid>
    </div>
  );
}

PotentialList.propTypes = {
  candidateFor: PropTypes.string.isRequired,
  listCandidate: PropTypes.array.isRequired,
  fetchEvent: PropTypes.func.isRequired,
};
