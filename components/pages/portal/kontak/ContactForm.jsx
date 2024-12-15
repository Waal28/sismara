"use client";
import { addMessage } from "@/api/src/pesan";
import { CircularProgress, Container } from "@mui/material";
import React from "react";
import { toast } from "react-toastify";

export default function ContactForm() {
  const [state, setState] = React.useState({
    email: "",
    subject: "",
    message: "",
    loading: false,
  });

  const { email, subject, message, loading } = state;

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
    e.preventDefault();
    updateState("loading", true);
    try {
      await addMessage({ email, subject, message });
      updateState("email", "");
      updateState("subject", "");
      updateState("message", "");
      toast.success("Pesan berhasil dikirim", { theme: "colored" });
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
    <Container>
      <section className="relative">
        {/*  */}
        <div className="absolute inset-0 z-0 bg-contact-texture bg-repeat rounded-xl"></div>
        {/*  */}
        <main className="relative z-10 bg-opacity-70 dark:bg-opacity-85 bg-emerald-300 dark:bg-custom-secondary rounded-xl">
          <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
            <h2 className="mb-4 text-5xl tracking-tight font-extrabold text-center text-teal-900 dark:text-white">
              Hubungi Kami
            </h2>
            <p className="mb-8 lg:mb-16 font-light text-center text-teal-900 dark:text-white sm:text-xl">
              Untuk informasi lebih lanjut tentang layanan kami atau jika Anda
              memerlukan bantuan, silakan hubungi kami menggunakan formulir di
              bawah ini. Kami siap membantu Anda dan akan merespons sesegera
              mungkin
            </p>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-teal-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="shadow-sm bg-teal-50 border border-teal-300 text-teal-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-teal-700 dark:border-teal-600 dark:placeholder-teal-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                  placeholder="name@gmail.com"
                  required
                  value={email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block mb-2 text-sm font-medium text-teal-900 dark:text-white"
                >
                  Subjek
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="block p-3 w-full text-sm text-teal-900 bg-teal-50 rounded-lg border border-teal-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-teal-700 dark:border-teal-600 dark:placeholder-teal-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                  placeholder="Perihal apa yang bisa kami bantu?"
                  required
                  value={subject}
                  onChange={handleChange}
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-teal-900 dark:text-white"
                >
                  Pesan
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="block p-2.5 w-full text-sm text-teal-900 bg-teal-50 rounded-lg shadow-sm border border-teal-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-teal-700 dark:border-teal-600 dark:placeholder-teal-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Tinggalkan pesan anda..."
                  required
                  value={message}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="py-3 px-5 rounded-full border border-teal-300 dark:border-teal-300 text-sm font-medium text-center text-white hover:bg-opacity-80 dark:hover:bg-opacity-50 bg-teal-800 dark:bg-teal-600 bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {loading ? (
                  <CircularProgress color="inherit" size={14} />
                ) : (
                  "Kirim"
                )}
              </button>
            </form>
          </div>
        </main>
      </section>
    </Container>
  );
}
