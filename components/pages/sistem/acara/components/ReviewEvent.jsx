"use client";
import React from "react";
import PropTypes from "prop-types";
import {
  CommentIcon,
  DeleteIcon,
  FullStarIcon,
  ImageSearchIcon,
} from "@/components/atoms/CustomIcon";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { addReview, getReviewsEvent } from "@/api/src/ulasan";
import { useEventsState } from "@/context/EventsContext";
import { getImage } from "@/constants";
import { Loader3 } from "@/components/atoms/CustomLoader";
import { useAppState } from "@/context/AppStateContext";
import { toast } from "react-toastify";
import { uploadImages } from "@/api/src/dashboard";
import { CircularProgress, Divider, IconButton, Tooltip } from "@mui/material";

const stars = [5, 4, 3, 2, 1];
export default function ReviewEvent({ isFromAdmin = false }) {
  const { currentUser } = useAppState();
  const { currEvent } = useEventsState();
  const [state, setState] = React.useState({
    data: null,
    content: "",
    images: [],
    rating: 0,
    currStar: 0,
    loading: false,
    loadingSubmit: false,
  });
  const { data, content, images, rating, currStar, loading, loadingSubmit } =
    state;
  const updateState = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };
  async function fetchEventReview(star) {
    updateState("loading", true);
    try {
      const res = await getReviewsEvent(currEvent.id);
      const dataReviews = {
        event_id: currEvent.id,
        event_title: currEvent.title,
        reviews: res.data.reviews.map((item) => ({
          review_id: item.id,
          participant_id: item.mahasiswa.id,
          participant_name: item.mahasiswa.name,
          participant_img: item?.mahasiswa?.image
            ? getImage(item?.mahasiswa?.image)
            : item?.mahasiswa?.defaultImg,
          rating: item.rating,
          images: item.images,
          review_content: item.content,
          review_date: item.createdAt,
          user_as: item.user_as,
        })),
        total_rating: res.data.total_rating,
        rating_breakdown: res.data.rating_breakdown,
        total_reviews: res.data.total_reviews,
      };
      if (star) {
        const newReviews = dataReviews.reviews.filter(
          (item) => item.rating === star
        );
        dataReviews.reviews = newReviews;
      }
      updateState("data", dataReviews);
    } catch (error) {
      console.log(error);
    } finally {
      updateState("loading", false);
    }
  }

  const handleUploadImage = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => file.size <= 5 * 1000 * 1000);
    const invalidFiles = files.filter((file) => file.size > 5 * 1000 * 1000);
    if (invalidFiles.length) {
      toast.error("File tidak boleh lebih dari 5 MB", {
        theme: "colored",
      });
    }
    const uniqueFiles = validFiles.filter((file) => {
      return !state.images.some(
        (existingFile) =>
          existingFile.name === file.name && existingFile.size === file.size
      );
    });
    if (uniqueFiles.length < validFiles.length) {
      toast.error("File tidak boleh sama", {
        theme: "colored",
      });
    }
    if (uniqueFiles.length) {
      updateState("images", [...state.images, ...uniqueFiles]);
    }
  };
  const removeImage = (indexToRemove) => {
    if (state.loadingSubmit) return;
    const newImages = state.images.filter(
      (_, index) => index !== indexToRemove
    );
    updateState("images", newImages);
  };
  const handleSubmitReview = async () => {
    updateState("loadingSubmit", true);
    const { content, images, rating } = state;
    const payload = {
      idEvent: currEvent.id,
      idMhs: currentUser.id,
      content,
      images,
      rating,
    };
    try {
      if (images.length > 0) {
        const imgUploadPromises = images.map((image) => {
          const formData = new FormData();
          formData.append("image", image);
          return uploadImages(formData);
        });
        // eslint-disable-next-line no-undef
        const imgResponses = await Promise.all(imgUploadPromises);
        const imgUrls = imgResponses.map((response) => response.data.fileName);

        payload.images = imgUrls;
      }
      await addReview(payload);
      fetchEventReview();
      updateState("content", "");
      updateState("images", []);
      updateState("rating", 0);
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error(error?.response?.data?.message || "Terjadi kesalahan", {
        theme: "colored",
      });
    } finally {
      updateState("loadingSubmit", false);
    }
  };
  const handleFilterRating = async (star) => {
    if (data.total_reviews === 0) return;

    if (star === currStar) {
      updateState("currStar", 0);
      await fetchEventReview();
    } else {
      updateState("currStar", star);
      await fetchEventReview(star);
    }
  };
  React.useEffect(() => {
    if (currEvent) fetchEventReview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currEvent]);

  return loading ? (
    <div className="w-full mt-14 flex justify-center">
      <Loader3 className="w-12 h-12" />
    </div>
  ) : (
    data && (
      <main>
        <div className="w-full mt-14 flex flex-col gap-2 py-5 rounded-lg dark:bg-custom-tertiary bg-gray-white dark:text-white text-black">
          <div className="flex items-center gap-1 sm:mb-5 mb-2">
            <h1 className="text-3xl font-bold">{data.total_rating}</h1>
            <FullStarIcon className="text-yellow-500 w-8 h-8" />
            <h1 className="ml-2 sm:text-2xl text-xl font-semibold">
              Ulasan Acara
            </h1>
          </div>
          {/* Tags */}
          <div className="flex flex-wrap sm:gap-5 gap-2 w-full py-2">
            {stars.map((star) => (
              <span
                key={star}
                className={`${
                  currStar === star
                    ? "bg-gray-300 dark:bg-opacity-30 bg-opacity-100"
                    : "bg-gray-950 dark:bg-opacity-30 bg-opacity-10"
                } flex gap-1 items-center px-2 p-1 rounded-md hover:bg-gray-300 cursor-pointer`}
                onClick={() => handleFilterRating(star)}
              >
                {[...Array(star)].map((_, index) => (
                  <FullStarIcon
                    key={index}
                    className="text-yellow-500 w-4 h-4"
                  />
                ))}
                {data.rating_breakdown[`stars_${star}`]}
              </span>
            ))}
          </div>
          {/* Item Container */}
          <div className="flex flex-col gap-3">
            {data.total_reviews === 0 || data.reviews.length === 0 ? (
              <div className="flex justify-center mt-10">
                <span className="sm:text-2xl text-lg font-bold">
                  Belum ada ulasan
                </span>
              </div>
            ) : (
              data.reviews.map((review) => (
                <div
                  key={review.review_id}
                  className="flex flex-col gap-4 dark:bg-gray-700 bg-gray-50 p-4 rounded-lg shadow-md"
                >
                  {/* Profile and Rating */}
                  <div className="flex justify justify-between">
                    <div className="flex gap-2">
                      <div className="overflow-hidden w-7 h-7 rounded-full">
                        <Image
                          src={review.participant_img}
                          alt="..."
                          width={28}
                          height={28}
                        />
                      </div>
                      <span className="sm:pt-0.5 pt-1 sm:text-base text-sm">
                        {review.participant_name}
                      </span>
                      {review.user_as && (
                        <span className="h-fit sm:mt-0.5 mt-1 bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-800 dark:text-gray-300">
                          {review.user_as}
                        </span>
                      )}
                    </div>
                    <div className="flex p-1 gap-1 text-orange-300">
                      {[...Array(review.rating)].map((_, index) => (
                        <FullStarIcon
                          key={index}
                          className="text-yellow-500 w-4 h-4"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="sm:text-sm text-xs">
                    {review.review_content}
                  </div>
                  <div className="flex gap-2">
                    {review.images.map((image, i) => (
                      <Link key={i} href={getImage(image)} target="_blank">
                        <Image
                          className="object-fill w-16 h-16"
                          src={getImage(image)}
                          alt="..."
                          width={100}
                          height={100}
                        />
                      </Link>
                    ))}
                  </div>
                  <div className="flex justify-between sm:text-sm text-xs">
                    <span>
                      {format(
                        new Date(review.review_date),
                        "d MMM yyyy, HH:mm"
                      )}
                    </span>
                    {/* <button className="p-1 px-2 bg-gray-900 hover:bg-gray-950 border border-gray-950 bg-opacity-60">
                    <ion-icon name="share-outline" /> Share
                  </button> */}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {!isFromAdmin && ["ongoing", "closed"].includes(currEvent.status) && (
          <>
            <div className="mb-10 mt-8">
              <Divider className="dark:bg-gray-500 bg-gray-300" />
            </div>
            <div className="w-full mb-5">
              <span className="flex items-center mb-5 sm:text-2xl text-xl font-medium text-teal-800 dark:text-white">
                <CommentIcon className="mr-2 w-8 h-8 text-teal-500" />
                Tuliskan Review
              </span>
              <input
                type="file"
                name="image"
                id="image"
                accept="image/jpeg, image/png, image/jpg"
                hidden
                onChange={handleUploadImage}
              />
              <textarea
                name="content"
                value={content}
                onChange={(e) => updateState("content", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-teal-800 lg:text-sm md:text-sm sm:text-sm text-xs rounded-lg focus:ring-teal-600 focus:border-teal-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-teal-600"
                placeholder="Tuliskan Review"
                required
                rows="4"
              />
              <div className="flex gap-2 mt-5">
                {images.map((image, i) => (
                  <div key={i} className="relative">
                    <DeleteIcon
                      onClick={() => removeImage(i)}
                      className="h-6 w-6 cursor-pointer absolute -top-2 -right-2 text-white rounded-full bg-red-500 hover:bg-red-600 p-1"
                    />
                    <Link href={URL.createObjectURL(image)} target="_blank">
                      <Image
                        className="object-fill w-16 h-16"
                        src={URL.createObjectURL(image)}
                        alt="..."
                        width={100}
                        height={100}
                      />
                    </Link>
                  </div>
                ))}
              </div>
              <div className="flex gap-1 mt-3 items-center">
                {Array.from({ length: 5 }, (_, index) => (
                  <FullStarIcon
                    key={index}
                    onClick={() => updateState("rating", index + 1)}
                    className={`h-6 w-6 cursor-pointer ${
                      index < rating ? "text-yellow-500" : "text-gray-400"
                    }`}
                  />
                ))}
                <div className="ml-5">
                  <Tooltip title="Upload Gambar" placement="top">
                    <label htmlFor="image">
                      <IconButton component="span" className="dark:bg-gray-600">
                        <ImageSearchIcon className="h-5 w-5 dark:text-teal-500 text-teal-700" />
                      </IconButton>
                    </label>
                  </Tooltip>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  disabled={loadingSubmit}
                  className="w-fit text-white bg-teal-600 hover:bg-teal-700 focus:ring-2 focus:outline-none focus:ring-teal-700 font-medium rounded-lg lg:text-sm md:text-sm text-xs px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-300"
                  onClick={handleSubmitReview}
                >
                  {loadingSubmit ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    "Kirim"
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    )
  );
}
ReviewEvent.propTypes = {
  isFromAdmin: PropTypes.bool,
};
