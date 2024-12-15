import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useAppState } from "@/context/AppStateContext";
import { toast } from "react-toastify";
import { general } from "@/constants";
import { addEventOrganizer, editEventOrganizer } from "@/api/src/pengguna";
import { Loader1 } from "@/components/atoms/CustomLoader";
import { PersonAddIcon } from "@/components/atoms/CustomIcon";
import { useUsersAccState } from "@/context/UsersAccContext";

export default function ModalAddOrEditAcount({ dataEdit = null }) {
  const { updateAppState } = useAppState();
  const { updateUsersAccState } = useUsersAccState();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    name: dataEdit ? dataEdit.name : "",
    npm: dataEdit ? dataEdit.npm : "",
    prodi: dataEdit ? dataEdit.prodi : general.prodi[0].name,
    email: dataEdit ? dataEdit.email : "",
    username: dataEdit ? dataEdit.username : "",
    isAdmin: dataEdit ? dataEdit.isAdmin : false,
  });
  const { name, npm, prodi, email, username, isAdmin } = formState;

  const handleChange = useCallback((e) => {
    const { name, value, type } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: type === "number" && value < 0 ? 0 : value,
    }));
  }, []);
  const handleChangeRole = useCallback((value) => {
    setFormState((prevState) => ({
      ...prevState,
      isAdmin: value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isAdmin && (!name || !npm || !prodi || !email || !username)) {
      setIsLoading(false);
      return toast.error("Data tidak boleh ada yang kosong", {
        theme: "colored",
      });
    }
    if (isAdmin && (!email || !username)) {
      setIsLoading(false);
      return toast.error("Data tidak boleh ada yang kosong", {
        theme: "colored",
      });
    }

    const apiCall = dataEdit
      ? editEventOrganizer(dataEdit.id, formState)
      : addEventOrganizer(formState);
    try {
      await apiCall;
      toast.success("Data berhasil disimpan", { theme: "colored" });
      updateUsersAccState.refreshDataAcc();
      updateAppState.modal({ open: false, children: null, reOpen: false });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan", {
        theme: "colored",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const stylesAdminBtn = `${
    isAdmin ? "bg-teal-700" : "bg-teal-600 hover:bg-teal-800"
  }`;
  const stylesNonAdminBtn = `${
    !isAdmin ? "bg-teal-700" : "bg-teal-600 hover:bg-teal-800"
  }`;
  return (
    <main className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl lg:w-[50%] md:w-[60%] sm:w-[80%] w-[90%] max-h-screen overflow-auto">
      <div className="w-full mx-auto flex items-center justify-center">
        <div className="w-full bg-gray-200 dark:bg-gray-900 rounded-2xl flex flex-col items-center justify-center p-5 lg:py-10 sm:py-10">
          <div className="flex flex-col items-center mb-6 lg:text-2xl md:text-2xl font-semibold text-teal-800 dark:text-white">
            <PersonAddIcon className="lg:text-5xl md:text-5xl text-4xl" />
            {dataEdit ? "Edit" : "Tambah"} Akun Pengguna
          </div>
          <div className="w-full lg:w-[80%] md:w-[80%] sm:w-[80%] p-6 space-y-4 md:space-y-6 sm:p-8 shadow-xl bg-white rounded-lg dark:border dark:bg-gray-800 dark:border-gray-700">
            <div className="grid grid-cols-2 px-10">
              <button
                onClick={() => handleChangeRole(true)}
                className={`${stylesAdminBtn} text-white font-medium sm:text-sm text-xs py-2 px-4 rounded-l-md`}
              >
                Admin
              </button>
              <button
                onClick={() => handleChangeRole(false)}
                className={`${stylesNonAdminBtn} text-white font-medium sm:text-sm text-xs py-2 px-4 rounded-r-md`}
              >
                Penyelenggara Acara
              </button>
            </div>
            <form className="space-y-4 md:space-y-6">
              {!isAdmin && renderInput("Nama", "name", name, handleChange)}
              {!isAdmin &&
                renderInput("NPM", "npm", npm, handleChange, "number")}
              {!isAdmin &&
                renderSelect(
                  "Prodi",
                  "prodi",
                  prodi,
                  handleChange,
                  general.prodi
                )}
              {renderInput("Email", "email", email, handleChange, "email")}
              {renderInput("Username", "username", username, handleChange)}
              <button
                onClick={handleSubmit}
                className="w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-2 focus:outline-none focus:ring-teal-700 font-medium rounded-lg lg:text-sm md:text-sm text-xs px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-300"
              >
                {isLoading ? (
                  <Loader1 className="w-5 h-5 text-white fill-teal-600" />
                ) : (
                  "Simpan"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

ModalAddOrEditAcount.propTypes = {
  dataEdit: PropTypes.object,
};

function renderInput(label, name, value, onChange, type = "text") {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block mb-2 lg:text-sm md:text-sm sm:text-sm text-xs font-medium text-teal-800 dark:text-white"
      >
        {label}
      </label>
      <input
        autoComplete="off"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-50 border border-gray-300 text-teal-800 lg:text-sm md:text-sm sm:text-sm text-xs rounded-lg focus:ring-teal-600 focus:border-teal-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-teal-600"
        placeholder={label}
        required
      />
    </div>
  );
}

function renderSelect(label, name, value, onChange, options) {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block mb-2 lg:text-sm md:text-sm sm:text-sm text-xs font-medium text-teal-800 dark:text-white"
      >
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-50 border border-gray-300 text-teal-800 lg:text-sm md:text-sm sm:text-sm text-xs rounded-lg focus:ring-teal-600 focus:border-teal-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-teal-600"
        required
      >
        {options.map((option) => (
          <option key={option.name} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
