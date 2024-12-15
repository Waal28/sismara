"use client";
import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import LoaderAlbum from "./LoaderAlbum";
import EastIcon from "@mui/icons-material/East";
import { useAppState } from "@/context/AppStateContext";
import ModalPhoto from "./ModalPhoto";
import { Button1 } from "@/components/atoms/CustomButton";
import SearchBarWithFilter from "@/components/atoms/SearchBarWithFilter";
import NoDataImage from "@/components/atoms/NoDataImage";
import { getImage } from "@/constants";
import { getFilterAndSearchAlbum } from "@/api/src/ulasan";
import { toast } from "react-toastify";

export default function Album() {
  const { updateAppState } = useAppState();
  const [loading, setLoading] = React.useState(false);
  const [albums, setAlbums] = React.useState([]);
  const [hasMore, setHasMore] = React.useState(true);
  const [page, setPage] = React.useState(0);

  const fetchAllAlbum = async ({ newPage = 0, keyword = "" }) => {
    setLoading(true);
    try {
      const payload = {
        limit: 5,
        skip: newPage * 5,
        search: keyword,
      };
      const response = await getFilterAndSearchAlbum(payload);
      const newAlbums = response.data.map((item) => ({
        id: item?.eventId,
        src: item?.thumbnail,
        title: item?.eventTitle,
        prodi: item?.eventProdi,
        images: item?.images,
      }));

      setAlbums((prevAlbums) => {
        if (newPage === 0) return newAlbums; // Reset albums on new search
        return [...prevAlbums, ...newAlbums]; // Append new albums for pagination
      });
      setHasMore(newAlbums.length > 0);
      setPage(newPage);
    } catch (error) {
      console.error("Error fetching all albums:", error);
      toast.error(error?.response?.data?.message, { theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  const handleClickAlbum = useCallback(
    (images) => {
      updateAppState.modal({
        open: true,
        children: <ModalPhoto images={images} />,
      });
    },
    [updateAppState]
  );

  useEffect(() => {
    fetchAllAlbum({ newPage: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <div className="flex justify-end w-full lg:px-28 px-4">
        <SearchBarWithFilter
          placeholder="Cari Acara di sini"
          fetchData={fetchAllAlbum} // Pass handleSearch to trigger search
          isFilter={false}
        />
      </div>
      {!loading && albums.length < 1 ? (
        <NoDataImage className="-ml-[50%] sm:mx-auto scale-[30%] sm:scale-100" />
      ) : (
        <div className="container lg:px-20 px-4 py-10 mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
          {albums.map((item) => (
            <AlbumItem
              key={item.id}
              item={item}
              onClick={() => handleClickAlbum(item.images)}
            />
          ))}
        </div>
      )}
      {loading ? (
        <div className="w-full h-80 flex flex-col justify-center items-center">
          <LoaderAlbum />
        </div>
      ) : (
        hasMore && (
          <div className="flex justify-center">
            <Button1 onClick={() => fetchAllAlbum({ newPage: page + 1 })}>
              View More <EastIcon />
            </Button1>
          </div>
        )
      )}
    </React.Fragment>
  );
}

// Komponen terpisah untuk item album
const AlbumItem = ({ item, onClick }) => (
  <div
    className="relative h-[100px] sm:h-[250px] max-w-full cursor-pointer group"
    onClick={onClick}
  >
    <Image
      fill
      style={{ objectFit: "contain" }}
      className="border-2 border-gray-300 dark:border-teal-600 shadow-md bg-gray-200 rounded-lg transition-all duration-300 group-hover:opacity-50 group-hover:blur-sm dark:bg-teal-800"
      src={getImage(item.src)}
      alt={item.title}
    />
    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1">
      <h3 className="text-teal-500 dark:text-white lg:text-lg text-xs font-semibold text-center line-clamp-2 mb-1">
        {item.title}
      </h3>
      <span className="text-teal-500 dark:text-white lg:text-base text-xs">
        {item.prodi}
      </span>
    </div>
  </div>
);

AlbumItem.propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};
