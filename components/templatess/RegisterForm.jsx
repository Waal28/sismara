import React from "react";

import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { useAppState } from "@/context/AppStateContext";
import { toast } from "react-toastify";
import { general } from "@/constants";
import { Loader1 } from "../atoms/CustomLoader";
import { editMahasiswa } from "@/api/src/mahasiswa";

export default function RegisterForm() {
  const { updateAppState, currentUser } = useAppState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formState, setFormState] = React.useState({
    name: currentUser.name || "",
    npm: currentUser.npm || "",
    prodi: currentUser.prodi || general.prodi[0].name,
  });
  function handleChange(e) {
    const { name, value, type } = e.target;

    setFormState((prevState) => {
      if (type === "number") {
        const newValue = value < 0 ? 0 : value;
        return { ...prevState, [name]: newValue };
      }

      return { ...prevState, [name]: value };
    });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    if (!formState.name || !formState.npm || !formState.prodi) {
      setIsLoading(false);
      return toast("Data tidak boleh ada yang kosong", {
        type: "error",
        theme: "colored",
      });
    }
    try {
      const res = await editMahasiswa(currentUser.id, formState);
      updateAppState.currentUser(res.data);
      setIsLoading(false);
      toast("Data berhasil disimpan", {
        type: "success",
        theme: "colored",
      });
      updateAppState.modal({ open: false, children: null, reOpen: false });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast(error.response.message, { type: "error", theme: "colored" });
    }
  }
  return (
    <main className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl lg:w-[50%] md:w-[60%] sm:w-[80%] w-[90%] max-h-screen overflow-auto">
      <div className="w-full mx-auto flex items-center justify-center">
        <div className="w-full bg-gray-200 dark:bg-gray-900 rounded-2xl flex flex-col items-center justify-center p-5 lg:py-10 sm:py-10">
          <div className="flex flex-col items-center mb-6 lg:text-2xl md:text-2xl font-semibold text-teal-800 dark:text-white">
            <AppRegistrationIcon className="lg:text-5xl md:text-5xl text-4xl" />
            Lengkapi Data Anda
          </div>
          <div className="w-full lg:w-[80%] md:w-[80%] sm:w-[80%] p-6 space-y-4 md:space-y-6 sm:p-8 shadow-xl bg-white rounded-lg dark:border dark:bg-gray-800 dark:border-gray-700">
            <form
              className="w-full space-y-4 md:space-y-6"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <div className="w-full grid grid-cols-1 gap-4 mb-4">
                <section className="w-full">
                  <label
                    htmlFor="nama"
                    className="block mb-2 lg:text-sm md:text-sm sm:text-sm text-xs font-medium text-teal-800 dark:text-white"
                  >
                    Nama
                  </label>
                  <input
                    autoComplete="off"
                    type="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-300 text-teal-800 lg:text-sm md:text-sm sm:text-sm text-xs rounded-lg focus:ring-teal-600 focus:border-teal-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-teal-600"
                    placeholder="Slamet Kopling"
                    required
                  />
                </section>
                <section>
                  <label
                    htmlFor="npm"
                    className="block mb-2 lg:text-sm md:text-sm sm:text-sm text-xs font-medium text-teal-800 dark:text-white"
                  >
                    NPM
                  </label>
                  <input
                    autoComplete="off"
                    type="number"
                    name="npm"
                    value={formState.npm}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-300 text-teal-800 lg:text-sm md:text-sm sm:text-sm text-xs rounded-lg focus:ring-teal-600 focus:border-teal-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-teal-600"
                    placeholder="6969696969"
                    required
                  />
                </section>
                <section>
                  <label
                    htmlFor="prodi"
                    className="block mb-2 lg:text-sm md:text-sm sm:text-sm text-xs font-medium text-teal-800 dark:text-white"
                  >
                    Prodi
                  </label>
                  <select
                    name="prodi"
                    value={formState.prodi}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-300 text-teal-800 lg:text-sm md:text-sm sm:text-sm text-xs rounded-lg focus:ring-teal-600 focus:border-teal-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-teal-600"
                    required
                  >
                    {general.prodi.map((prodi) => (
                      <option key={prodi.name} value={prodi.name}>
                        {prodi.name}
                      </option>
                    ))}
                  </select>
                </section>
              </div>

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
