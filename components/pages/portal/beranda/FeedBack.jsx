"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import PropTypes from "prop-types";
import { Loader2 } from "@/components/atoms/CustomLoader";
import { getAllReviews } from "@/api/src/ulasan";
import { toast } from "react-toastify";
import { DEFAULT_USER_IMG, getImage } from "@/constants";
import { FullStarIcon } from "@/components/atoms/CustomIcon";

function Card({ title, eventId, name, text, img, prodi, rating }) {
  return (
    <div className="w-full mx-auto rounded-lg bg-white dark:bg-teal-700 p-5 text-gray-800 font-light shadow-xl">
      <h5 className="text-center mb-2 font-medium text-teal-700 dark:text-gray-300 hover:underline dark:hover:text-white line-clamp-2 ">
        <Link href={`events/${eventId}`}>{title}</Link>
      </h5>
      <div className="w-full flex mb-4 items-center">
        <div className="overflow-hidden rounded-full w-10 h-10 bg-gray-50 border border-gray-200">
          <Image
            src={img ? getImage(img) : DEFAULT_USER_IMG}
            alt="..."
            width={40}
            height={40}
          />
        </div>
        <div className="flex-grow pl-3">
          <h6 className="font-bold text-sm text-gray-600 dark:text-gray-200">
            {name}
          </h6>
          <span className="text-xs text-gray-400 font-medium">{prodi}</span>
        </div>
      </div>
      <div className="w-full mb-2">
        <p className="text-sm leading-tight text-gray-400 dark:text-white">
          <span></span>
          <span className="text-lg leading-none italic font-bold mr-1">
            {'"'}
          </span>
          {text}
          <span className="text-lg leading-none italic font-bold ml-1">
            {'"'}
          </span>
        </p>
      </div>
      <div className="flex p-1 gap-1 text-orange-300">
        {[...Array(rating)].map((_, index) => (
          <FullStarIcon
            key={index}
            className="text-yellow-500 w-4 h-4"
          />
        ))}
      </div>
    </div>
  );
}
Card.propTypes = {
  title: PropTypes.string,
  name: PropTypes.string,
  text: PropTypes.string,
  img: PropTypes.string,
  prodi: PropTypes.string,
  eventId: PropTypes.string,
  rating: PropTypes.number,
};
export default function FeedBack() {
  const [feedBack, setFeedBacks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  function fetchComingSoonEvent() {
    setLoading(true);
    getAllReviews()
      .then((response) => {
        const data = response.data.map((item) => ({
          id: item.id,
          title: item?.event?.title || "-",
          eventId: item?.event?.id || "-",
          prodi: item?.mahasiswa?.prodi || "-",
          name: item?.mahasiswa?.name || "-",
          text: item?.content || "-",
          img: item?.mahasiswa?.image,
          rating: item?.rating,
        }));
        setFeedBacks(data);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        toast.error(error?.response?.data?.message, {
          theme: "colored",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  React.useEffect(() => {
    fetchComingSoonEvent();
  }, []);
  return (
    <div className="bg-white dark:bg-custom-tertiary w-full px-5 py-16 md:py-24 mb-10">
      <div className="w-full max-w-screen-xl px-4 mx-auto">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="mb-6 text-6xl tracking-tight font-extrabold text-center text-teal-900 dark:text-white">
            Review
          </h2>
          <p className="mb-12 text-teal-900 dark:text-white">
            Kumpulan ulasan acara terbaru yang memberikan wawasan dan pengalaman
            langsung dari para penonton
          </p>
          <div className="text-center mb-10">
            <span className="inline-block w-1 h-1 rounded-full bg-teal-500 ml-1" />
            <span className="inline-block w-3 h-1 rounded-full bg-teal-500 mx-1" />
            <span className="inline-block w-40 h-1 rounded-full bg-teal-500" />
            <span className="inline-block w-3 h-1 rounded-full bg-teal-500 ml-1" />
            <span className="inline-block w-1 h-1 rounded-full bg-teal-500 ml-1" />
          </div>
        </div>
        {loading ? (
          <div className="w-full h-80 flex flex-col justify-center items-center">
            <Loader2 />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
            {feedBack.map((item) => (
              <Card key={item.id} {...item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
