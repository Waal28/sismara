"use client";
import { loginAdmin } from "@/api/src/admin";
import jwt from "jsonwebtoken";
import SystemLogo from "@/components/atoms/SystemLogo";
import { useAdminState } from "@/context/AdminContext";
import { useDarkMode } from "@/context/DarkModeContext";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function LoginPageAdmin() {
  const router = useRouter();
  const { darkMode } = useDarkMode();
  const { updateAdminState, isAdminLogin } = useAdminState();
  const isDarkMode = darkMode ? "dark" : "";
  const [loading, setLoading] = React.useState(false);
  const [state, setState] = React.useState({
    email: "",
    password: "",
    visible: false,
  });
  const { email, password, visible } = state;
  const updateState = (name, value) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateState(name, value);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password minimal 8 karakter", { theme: "colored" });
      setLoading(false);
      return;
    }
    try {
      const res = await loginAdmin({ email, password });
      const { token, user } = res.data;
      updateAdminState.isAdminLogin(true);
      updateAdminState.currentAdmin({
        name: user.username,
        prodi: user.prodi,
      });
      localStorage.setItem("adminToken", token);
      router.push("/admin");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan", {
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAdminToken = () => {
      const adminToken = localStorage.getItem("adminToken");

      if (!adminToken) return; // Exit if no token

      // Decode token payload
      const decoded = jwt.decode(adminToken);

      // Validate token expiration
      if (decoded && decoded.exp * 1000 > Date.now()) {
        router.push("/admin");
      }
    };

    checkAdminToken();
  }, [router]);

  return (
    !isAdminLogin && (
      <div className={isDarkMode}>
        {/* component */}
        <div className="h-screen bg-white sm:grid grid-cols-2 flex flex-col sm:gap-5 gap-5 sm:p-20 p-10 justify-center items-center dark:bg-custom-tertiary">
          <div className="flex justify-center items-center dark:bg-gray-700 bg-white rounded-full w-fit h-fit sm:mb-0 -mb-14 z-10 border dark:border-gray-500 border-gray-300 sm:shadow-xl shadow-none">
            <SystemLogo className="sm:w-[500px] w-[200px] sm:h-[500px] h-[200px]" />
          </div>
          <div className="bg-white w-full shadow-xl rounded-xl sm:px-20 px-10 sm:py-32 py-10 dark:bg-gray-700 h-fit border dark:border-gray-500 border-gray-300">
            <h1 className="sm:text-5xl text-xl font-medium dark:text-white text-gray-800 mb-2 text-center">
              Selamat Datang
            </h1>
            <p className="sm:text-base text-sm dark:text-white text-gray-800 text-center">
              Silahkan Login ke Sistem Manajemen Acara
            </p>
            <form className="space-y-5 mt-8" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                value={state.email}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-teal-800 lg:text-sm md:text-sm sm:text-sm text-xs rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                placeholder="email"
                required
              />
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  value={state.password}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-teal-800 lg:text-sm md:text-sm sm:text-sm text-xs rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                  placeholder="Password"
                  required
                />
                <div
                  className="absolute right-3 top-2 cursor-pointer dark:text-gray-500 text-gray-700"
                  onClick={() => updateState("visible", !visible)}
                >
                  {visible ? <Visibility /> : <VisibilityOff />}
                </div>
              </div>
              <div className="sm:pt-10 pt-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="text-center w-full bg-teal-700 rounded-md text-white py-3 font-medium sm:text-base text-xs"
                >
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
}
