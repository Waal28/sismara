"use client";
import React from "react";
import PropTypes from "prop-types";
import { Loader1 } from "./CustomLoader";
import { changePasswordUser } from "@/api/src/pengguna";
import { useAdminState } from "@/context/AdminContext";
import { toast } from "react-toastify";
import { useAppState } from "@/context/AppStateContext";

export default function ModalChangePassword({ handleLogout }) {
  const { currentAdmin } = useAdminState();
  const { updateAppState } = useAppState();
  const [state, setState] = React.useState({
    oldPassword: "",
    newPassword: "",
    verifyNewPassword: "",
    loading: false,
  });
  const { oldPassword, newPassword, verifyNewPassword, loading } = state;
  function updateState(key, value) {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateState(name, value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    updateState("loading", true);
    try {
      await changePasswordUser(currentAdmin.id, {
        oldPassword,
        newPassword,
        verifyNewPassword,
      });
      await handleLogout();
      updateAppState.modal({ open: false });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Terjadi kesalahan", {
        theme: "colored",
      });
    } finally {
      updateState("loading", false);
    }
  };

  return (
    <main className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl lg:w-[30%] md:w-[60%] sm:w-[80%] w-[90%] max-h-screen overflow-auto">
      <div className="w-full mx-auto flex items-center justify-center">
        <div className="w-full bg-gray-200 dark:bg-gray-900 rounded-2xl flex flex-col items-center justify-center p-5 py-20 sm:py-18">
          <div className="flex flex-col items-center mb-6 lg:text-2xl md:text-2xl font-semibold text-teal-800 dark:text-white">
            Reset Password
          </div>
          <form onSubmit={handleSubmit} autoComplete="off" className="w-full">
            <div className="w-full flex flex-col gap-5 mb-8">
              <section className="w-full">
                <label
                  htmlFor="nama"
                  className="block mb-2 lg:text-sm md:text-sm sm:text-sm text-xs font-medium text-teal-800 dark:text-white"
                >
                  Password Lama
                </label>
                <input
                  autoComplete="off"
                  type="password"
                  name="oldPassword"
                  value={oldPassword}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 text-teal-800 lg:text-sm md:text-sm sm:text-sm text-xs rounded-lg focus:ring-teal-600 focus:border-teal-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-teal-600"
                  placeholder="*****"
                  required
                />
              </section>
              <section className="w-full">
                <label
                  htmlFor="nama"
                  className="block mb-2 lg:text-sm md:text-sm sm:text-sm text-xs font-medium text-teal-800 dark:text-white"
                >
                  Password Baru
                </label>
                <input
                  autoComplete="off"
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 text-teal-800 lg:text-sm md:text-sm sm:text-sm text-xs rounded-lg focus:ring-teal-600 focus:border-teal-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-teal-600"
                  placeholder="*****"
                  required
                />
              </section>
              <section className="w-full">
                <label
                  htmlFor="nama"
                  className="block mb-2 lg:text-sm md:text-sm sm:text-sm text-xs font-medium text-teal-800 dark:text-white"
                >
                  Konfirmasi Password
                </label>
                <input
                  autoComplete="off"
                  type="password"
                  name="verifyNewPassword"
                  value={verifyNewPassword}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 text-teal-800 lg:text-sm md:text-sm sm:text-sm text-xs rounded-lg focus:ring-teal-600 focus:border-teal-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-teal-600"
                  placeholder="*****"
                  required
                />
              </section>
            </div>

            <button
              type="submit"
              className="w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-2 focus:outline-none focus:ring-teal-700 font-medium rounded-lg lg:text-sm md:text-sm text-xs px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-300"
            >
              {loading ? (
                <Loader1 className="w-5 h-5 text-white fill-teal-600" />
              ) : (
                "Simpan"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

ModalChangePassword.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};
