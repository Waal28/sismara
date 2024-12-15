import React, { useState, useCallback } from "react";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { useAppState } from "@/context/AppStateContext";
import { toast } from "react-toastify";
import { general } from "@/constants";
import { Loader1 } from "../atoms/CustomLoader";
import { editMahasiswa } from "@/api/src/mahasiswa";

export default function RegisterForm() {
  const { updateAppState, currentUser } = useAppState();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    name: currentUser.name || "",
    npm: currentUser.npm || "",
    prodi: currentUser.prodi || general.prodi[0].name,
  });

  const handleChange = useCallback((e) => {
    const { name, value, type } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: type === "number" && value < 0 ? 0 : value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, npm, prodi } = formState;
    if (!name || !npm || !prodi) {
      setIsLoading(false);
      return toast.error("Data tidak boleh ada yang kosong", {
        theme: "colored",
      });
    }

    try {
      const res = await editMahasiswa(currentUser.id, formState);
      updateAppState.currentUser(res.data);
      toast.success("Data berhasil disimpan", { theme: "colored" });
      updateAppState.modal({ open: false, children: null, reOpen: false });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.message || "Terjadi kesalahan", {
        theme: "colored",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl lg:w-[50%] md:w-[60%] sm:w-[80%] w-[90%] max-h-screen overflow-auto">
      <div className="w-full mx-auto flex items-center justify-center">
        <div className="w-full bg-gray-200 dark:bg-gray-900 rounded-2xl flex flex-col items-center justify-center p-5 lg:py-10 sm:py-10">
          <div className="flex flex-col items-center mb-6 lg:text-2xl md:text-2xl font-semibold text-teal-800 dark:text-white">
            <AppRegistrationIcon className="lg:text-5xl md:text-5xl text-4xl" />
            Lengkapi Data Anda
          </div>
          <div className="w-full lg:w-[80%] md:w-[80%] sm:w-[80%] p-6 space-y-4 md:space-y-6 sm:p-8 shadow-xl bg-white rounded-lg dark:border dark:bg-gray-800 dark:border-gray-700">
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {renderInput("Nama", "name", formState.name, handleChange)}
              {renderInput("NPM", "npm", formState.npm, handleChange, "number")}
              {renderSelect(
                "Prodi",
                "prodi",
                formState.prodi,
                handleChange,
                general.prodi
              )}

              <button
                type="submit"
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
