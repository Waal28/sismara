import React from "react";
import PropTypes from "prop-types";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { getMyEvents } from "@/api/src/peserta";
import { Loader2 } from "@/components/atoms/CustomLoader";
import Link from "next/link";
import { useAppState } from "@/context/AppStateContext";
import { toast } from "react-toastify";
import CertificateGenerator from "../../sistem/peserta/components/CertificateGenerator";
export default function CardMyEvents() {
  const { updateAppState, currentUser } = useAppState();
  const [loading, setLoading] = React.useState(true);
  const [userParticipants, setUserParticipants] = React.useState([]);
  async function fetchMyEvents() {
    setLoading(true);
    try {
      const res = await getMyEvents(currentUser.id);
      const data = res.data.filter((item) => item.status === "approved");
      setUserParticipants(data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Terjadi kesalahan", {
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  }
  React.useEffect(() => {
    fetchMyEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="bg-white dark:bg-gray-900 shadow-xl rounded-lg lg:col-span-3 col-span-1">
      <div className="flex items-center gap-2 border-b-2 lg:text-lg md:text-lg text-base font-medium bg-gray-200 rounded-t-xl text-gray-900 border-gray-300 dark:bg-gray-800 dark:border-white/10 dark:text-white px-8 py-4">
        Acara yang diikuti
        <Tooltip title="Tambah Acara">
          <IconButton className="text-lg text-gray-600 dark:text-white">
            <AddIcon />
          </IconButton>
        </Tooltip>
        <div className="flex items-center gap-3 ml-auto text-xs">
          <div className="flex items-center">
            <span className="mr-2 inline-block bg-blue-500 w-3 h-3 rounded-full" />
            Sebagai Peserta
          </div>
          <div className="flex items-center">
            <span className="mr-2 inline-block bg-orange-500 w-3 h-3 rounded-full" />
            Sebagai Volunteer
          </div>
        </div>
      </div>
      <div className="p-8">
        {loading ? (
          <div className="w-full h-80 flex flex-col justify-center items-center">
            <Loader2 />
          </div>
        ) : (
          userParticipants.length > 0 ?
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4 overflow-auto max-h-96">
              {userParticipants.map((card) => (
                <CardItem
                  key={card.id}
                  card={card}
                  updateAppState={updateAppState}
                />
              ))}
            </div>
          :
          <div className="w-full h-80 flex flex-col justify-center items-center">
            <h1 className="text-2xl font-semibold text-gray-600 dark:text-white">
              Belum ada acara
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}

function CardItem({ card, updateAppState }) {
  return (
    <div className="group relative cursor-pointer overflow-hidden bg-gray-50 dark:bg-gray-800 px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:mx-auto sm:w-full rounded-lg sm:px-10">
      <span
        className={`${
          card.type === "peserta" ? "bg-blue-500" : "bg-orange-500"
        } absolute top-4 left-4 z-20 h-4 w-4 block rounded-full`}
      />
      <CertificateGenerator
        event={card.event}
        certificateFor="Peserta"
        isFromProfileMhs
      />
      <span className="absolute top-10 z-0 h-20 w-20 rounded-full bg-teal-500 transition-all duration-300 group-hover:scale-[10]" />
      <div className="relative z-10 mx-auto max-w-md">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-teal-500 transition-all duration-300 group-hover:bg-teal-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-white transition-all"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M19 19H5V8h14m0-5h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-2.47 8.06L15.47 10l-4.88 4.88l-2.12-2.12l-1.06 1.06L10.59 17z"
            />
          </svg>
        </span>
        <div className="space-y-6 pt-5 text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-white/90">
          <p>{card.event.title}</p>
        </div>
        <div className="pt-5 text-base font-semibold leading-7">
          <p>
            <Link
              href={`/events/${card.event.id}`}
              onClick={() => updateAppState.modal({ open: false })}
              className="text-teal-500 transition-all duration-300 group-hover:text-white"
            >
              Selengkapnya →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
CardItem.propTypes = {
  card: PropTypes.object,
  updateAppState: PropTypes.object,
};
