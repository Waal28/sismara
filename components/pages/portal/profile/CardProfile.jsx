"use client";
import { useAppState } from "@/context/AppStateContext";
import Image from "next/image";
import React from "react";
import { Modal } from "@mui/material";
import { useDarkMode } from "@/context/DarkModeContext";
import CardEditProfile from "./CardEditProfile";
import { toast } from "react-toastify";
import { Loader3 } from "@/components/atoms/CustomLoader";
import { uploadImages } from "@/api/src/dashboard";
import { editMahasiswa } from "@/api/src/mahasiswa";
import { DEFAULT_USER_IMG, getImage } from "@/constants";

export default function CardProfile() {
  const { updateAppState, currentUser } = useAppState();
  const { darkMode } = useDarkMode();
  const isDarkMode = darkMode ? "dark" : "";
  const { name, npm, email, prodi, image, defaultImg, id } = currentUser;
  const [open, setOpen] = React.useState({
    editProfile: false,
  });
  const [loading, setLoading] = React.useState(false);

  const handleOpen = (key) => {
    setOpen({ ...open, [key]: true });
  };
  const handleClose = (key) => {
    setOpen({ ...open, [key]: false });
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSizeInMB = 3;
      if (file.size > maxSizeInMB * 1000 * 1000) {
        return toast.error("Ukuran file tidak boleh lebih dari 3MB", {
          theme: "colored",
        });
      }
      const formData = new FormData();
      formData.append("image", file);
      setLoading(true);
      try {
        const resImg = await uploadImages(formData);
        const imageUrl = resImg.data.fileName;
        const resMhs = await editMahasiswa(id, { image: imageUrl });
        updateAppState.currentUser(resMhs.data);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Terjadi kesalahan", {
          theme: "colored",
        });
      } finally {
        setLoading(false);
      }
    }
    e.target.value = null;
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-xl rounded-lg lg:col-span-2 col-span-1">
      <div className="flex justify-between items-center border-b-2 lg:text-lg md:text-lg text-base font-medium bg-gray-200 rounded-t-xl text-gray-900 border-gray-300 dark:bg-gray-800 dark:border-white/10 dark:text-white px-8 py-[22px]">
        Profil
      </div>
      <div className="m-8 px-8 pt-10 pb-3 rounded-lg dark:bg-gray-800">
        <input
          id="profilePic"
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handleImageChange}
          className="hidden"
        />
        {loading ? (
          <div className="w-full flex justify-center items-center">
            <Loader3 className="w-10 h-10 text-white fill-teal-600" />
          </div>
        ) : (
          <label
            htmlFor="profilePic"
            className="block photo-wrapper mx-auto p-2 w-full transform hover:scale-105 duration-300 cursor-pointer"
            style={{ width: "128px", height: "128px" }}
          >
            <Image
              className="rounded-full border-2 border-teal-500 object-fill w-full h-full"
              src={(image && getImage(image)) || defaultImg || DEFAULT_USER_IMG}
              alt={name || "..."}
              width={128}
              height={128}
            />
          </label>
        )}
        <div className="p-2">
          <div className="flex flex-col items-center">
            <h3 className="block lg:text-xl text-sm text-gray-900 dark:text-white font-medium leading-8">
              {name || "-"}
            </h3>
            <p className="block text-gray-400 lg:text-sm text-xs font-medium">
              {prodi || "-"}
            </p>
          </div>
          <table className="lg:text-sm text-xs my-3">
            <tbody>
              <tr>
                <td className="px-2 py-2 text-gray-400 font-medium">NPM</td>
                <td className="px-2 py-2 dark:text-white">: {npm || "-"}</td>
              </tr>
              <tr>
                <td className="px-2 py-2 text-gray-400 font-medium">Email</td>
                <td className="px-2 py-2 dark:text-white">: {email}</td>
              </tr>
            </tbody>
          </table>
          <div className="text-center my-3">
            <button
              className="py-2 px-4 rounded-md lg:text-sm text-xs text-teal-500 hover:bg-gray-300 hover:text-teal-600 dark:hover:bg-gray-800 font-semibold"
              onClick={() => handleOpen("editProfile")}
            >
              Edit Profil
            </button>
            {/* Modal */}
            <Modal
              open={open.editProfile}
              onClose={() => handleClose("editProfile")}
              aria-labelledby="child-modal-title"
              aria-describedby="child-modal-description"
            >
              <div className={isDarkMode + " my-10"}>
                <CardEditProfile handleClose={handleClose} />
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
