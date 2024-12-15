import React, { useState, useCallback } from "react";
import PropTypes from 'prop-types';
import { useAppState } from "@/context/AppStateContext";
import { toast } from "react-toastify";
import { general, getImage } from "@/constants";
import { addEvent, updateEvent } from "@/api/src/acara";
import { Loader1 } from "@/components/atoms/CustomLoader";
import DateTimeRangePicker from "@/components/atoms/DateTimeRangePicker";
import { Cancel, Delete, Upload } from "@mui/icons-material";
import dayjs from "dayjs";
import { Avatar, IconButton } from "@mui/material";
import { uploadImages } from "@/api/src/dashboard";
import { useEventsState } from "@/context/EventsContext";

const defaultTime = dayjs(new Date());
const initData = {
  title: "",
  desc: "",
  prodi: general.prodi[0].name,
  schedule: {
    start_time: defaultTime,
    end_time: defaultTime,
  },
  rundown: [
    {
      time: {
        start: defaultTime,
        end: defaultTime,
      },
      session: "",
      speaker: "",
    },
  ],
  status: "upcoming",
  posters: [],
  location: {
    address: "",
    link_gmaps: "",
  },
  max_participants: 0,
  max_volunteers: 0,
  criteria_volunteers: "",
  certificate_template: {
    participant: "",
    volunteer: "",
  },
  payment_price: 0,
  payment_desc: "",
  event_link: "",
  is_volunteers: false,
  is_certificate: false,
  is_paid: false,
  is_online: false,
}
export default function ModalAddOrEditEvent({ isEdit = false }) {
  const { updateAppState } = useAppState();
  const { updateEventsState, currEvent } = useEventsState();
  const [isLoading, setIsLoading] = useState(false);
  const editedData = isEdit && {
    ...currEvent,
    schedule: {
      start_time: dayjs(currEvent.schedule.start_time),
      end_time: dayjs(currEvent.schedule.end_time),
    },
    rundown: currEvent.rundown.map((item) => ({
      ...item,
      time: {
        start: dayjs(item.time.start),
        end: dayjs(item.time.end),
      },
    })),
  };
  const editedDataPosters = isEdit && currEvent.posters.map((item) => getImage(item))

  const [images, setImages] = useState(isEdit ? editedDataPosters : initData.posters);
  const [formState, setFormState] = useState(isEdit ? editedData : initData);

  // Generalized Change Handler (for all input fields)
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleLocationChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  }, []);

  const handleScheduleChange = useCallback((value, name) => {
    setFormState((prev) => ({
      ...prev,
      schedule: { ...prev.schedule, [name]: value },
    }));
  }, []);
  // Fungsi untuk menangani perubahan input (termasuk nested di dalam rundown)
  const handleChangeRundown = (e, index, fieldTime, valueTime) => {
    if (fieldTime) {
      // Jika field yang diubah adalah bagian dari `time`
      setFormState((prevState) => {
        const updatedRundown = [...prevState.rundown];
        updatedRundown[index].time[fieldTime] = valueTime;
        console.log(updatedRundown);

        return { ...prevState, rundown: updatedRundown };
      });
    } else {
      const { name, value } = e.target;
      // Jika field berada di dalam rundown, tapi bukan `time`
      setFormState((prevState) => {
        const updatedRundown = [...prevState.rundown];
        updatedRundown[index][name] = value;

        return { ...prevState, rundown: updatedRundown };
      });
    }
  };
  const handleUploadImage = (event) => {
    const files = Array.from(event.target.files);

    // Filter gambar yang kurang dari atau sama dengan 5 MB
    const validFiles = files.filter((file) => file.size <= 5 * 1000 * 1000);
    const invalidFiles = files.filter((file) => file.size > 5 * 1000 * 1000);

    // Cek apakah ada gambar yang ukurannya lebih dari 5 MB
    if (invalidFiles.length) {
      toast.error("File tidak boleh lebih dari 5 MB", {
        theme: "colored",
      });
    }

    // Filter untuk mencegah duplikasi gambar berdasarkan nama dan ukuran
    const uniqueFiles = validFiles.filter((file) => {
      return !formState.posters.some(
        (existingFile) =>
          existingFile.name === file.name && existingFile.size === file.size
      );
    });

    // Cek apakah ada gambar yang sama
    if (uniqueFiles.length < validFiles.length) {
      toast.error("File tidak boleh sama", {
        theme: "colored",
      });
    }

    // Jika hanya ada gambar valid dan tidak duplikat, update state
    if (uniqueFiles.length) {
      const newImages = uniqueFiles.map((file) => URL.createObjectURL(file));
      const newFileImages = [...formState.posters, ...uniqueFiles];
      setImages((prevImages) => [...prevImages, ...newImages]);
      setFormState((prev) => ({
        ...prev,
        posters: newFileImages,
      }));
    }

    // Reset input file agar gambar yang invalid dihapus dari selection input
    // eslint-disable-next-line no-param-reassign
    event.target.value = null;
  };
  const removeImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
    setFormState((prev) => ({
      ...prev,
      posters: prev.posters.filter((_, index) => index !== indexToRemove),
    }));
  };
  const addRundown = () => {
    setFormState((prevState) => ({
      ...prevState,
      rundown: [
        ...prevState.rundown,
        {
          time: { start: defaultTime, end: defaultTime },
          session: "",
          speaker: "",
        },
      ],
    }));
  };

  const removeRundown = (index) => {
    const newRundown = formState.rundown.filter((_, i) => i !== index);
    setFormState((prevState) => ({
      ...prevState,
      rundown: newRundown,
    }));
  };
  // Fungsi validasi
  const validateForm = () => {
    const newErrors = {};

    // Validasi title, desc, dan status
    if (!formState.title.trim()) newErrors.title = "Title harus diisi!";
    if (!formState.desc.trim()) newErrors.desc = "Deskripsi harus diisi!";
    if (!formState.status.trim()) newErrors.status = "Status harus diisi!";

    // Validasi location
    if (!formState.location.address.trim())
      newErrors.address = "Alamat harus diisi!";
    if (!formState.location.link_gmaps.trim())
      newErrors.link_gmaps = "Link Gmaps harus diisi!";

    // Validasi rundown
    formState.rundown.forEach((item, index) => {
      if (!item.session.trim())
        newErrors[`rundown_${index}_session`] = `Sesi ${
          index + 1
        } harus diisi!`;
      if (!item.speaker.trim())
        newErrors[`rundown_${index}_speaker`] = `Pembicara ${
          index + 1
        } harus diisi!`;
    });

    // Validasi jumlah peserta dan volunteer
    if (formState.max_participants <= 0) {
      newErrors.max_participants = "Jumlah peserta harus lebih dari 0!";
    }
    if (formState.is_volunteers && formState.max_volunteers <= 0) {
      newErrors.max_volunteers = "Jumlah volunteer harus lebih dari 0!";
    }
    if (formState.is_paid) {
      if (formState.payment_price <= 0) {
        newErrors.payment_price = "Harga harus lebih dari 0!";
      }
      if (!formState.payment_desc.trim()) {
        newErrors.payment_desc = "Informasi Pembayaran harus diisi!";
      }
    }
    if (formState.is_online && !formState.event_link.trim()) {
      newErrors.event_link = "Link harus diisi jika online!";
    }
    // Kembalikan object error atau null jika tidak ada error
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const errors = validateForm(); // Panggil validasi
    console.log(errors);
    if (Object.keys(errors).length > 0) {
      // Jika ada error, tampilkan dengan toast
      Object.entries(errors).forEach(([, value]) => {
        toast.error(value, { theme: "colored" });
      });
      setIsLoading(false);
      return;
    }

    let posters = [];
    const schedule = {
      start_time: new Date(formState.schedule.start_time),
      end_time: new Date(formState.schedule.end_time),
    };
    const rundown = formState.rundown.map((item) => ({
      ...item,
      time: {
        start: new Date(item.time.start),
        end: new Date(item.time.end),
      },
    }));
    try {
      // Jika ada gambar, unggah secara paralel
      const postersFiles = formState.posters.filter((image) => image instanceof File);
      const oldPosters = formState.posters.filter((image) => typeof image === "string");
      if (postersFiles.length > 0) {
        const posterUploadPromises = postersFiles.map((image) => {
          const formData = new FormData();
          formData.append("image", image);
          return uploadImages(formData);
        });
        // eslint-disable-next-line no-undef
        const posterResponses = await Promise.all(posterUploadPromises);
        const posterUrls = posterResponses.map(
          (response) => response.data.fileName
        );
        
        posters = posterUrls;
      }
      const newFormState = {
        ...formState,
        schedule,
        rundown,
        posters: [...posters, ...oldPosters],
      };
      const apiCall = isEdit ? updateEvent(currEvent.id, newFormState) : addEvent(newFormState);
      await apiCall;
      toast.success("Data berhasil disimpan", { theme: "colored" });
      updateEventsState.refreshEvents();
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
            Tambah Acara
          </div>
          <div className="w-full lg:w-[80%] md:w-[80%] sm:w-[80%] p-6 space-y-4 md:space-y-6 sm:p-8 shadow-xl bg-white rounded-lg dark:border dark:bg-gray-800 dark:border-gray-700">
            <main className="space-y-4 sm:space-y-12">
              {renderInput({
                label: "Nama Acara",
                name: "title",
                value: formState["title"],
                onChange: handleChange,
              })}
              {renderTextArea({
                label: "Deskripsi Acara",
                name: "desc",
                value: formState["desc"],
                onChange: handleChange,
              })}
              {renderSchedule({
                label: "Waktu Pelaksanaan",
                name: "schedule",
                value: formState["schedule"],
                onChange: handleScheduleChange,
              })}
              {renderRundown({
                label: "Masukkan Rundown",
                name: "rundown",
                value: formState["rundown"],
                onChange: handleChangeRundown,
                addRundown,
                removeRundown,
              })}
              {renderInputLocation({
                label: "Lokasi",
                name: "location",
                value: formState["location"],
                onChange: handleLocationChange,
              })}
              {renderInput({
                label: "Max Peserta",
                name: "max_participants",
                type: "number",
                value: formState["max_participants"],
                onChange: handleChange,
              })}
              {renderCheckbox({
                label: "Perlu Volunteer",
                name: "is_volunteers",
                value: formState["is_volunteers"],
                onChange: handleChange,
              })}
              {formState.is_volunteers && (
                <div className="flex flex-col gap-2 col-span-2 w-full p-3 items-center dark:bg-gray-700 bg-white border border-gray-300 rounded-md">
                  {renderInput({
                    label: "Max Volunteer",
                    name: "max_volunteers",
                    type: "number",
                    value: formState["max_volunteers"],
                    onChange: handleChange,
                  })}
                  {renderTextArea({
                    label: "Kriteria (opsional)",
                    name: "criteria_volunteers",
                    value: formState["criteria_volunteers"],
                    onChange: handleChange,
                  })}
                </div>
              )}
              {renderCheckbox({
                label: "Berbayar",
                name: "is_paid",
                value: formState["is_paid"],
                onChange: handleChange,
              })}
              {formState.is_paid && (
                <div className="flex flex-col gap-2 col-span-2 w-full p-3 items-center dark:bg-gray-700 bg-white border border-gray-300 rounded-md">
                  {renderInput({
                    label: "Harga",
                    name: "payment_price",
                    type: "number",
                    value: formState["payment_price"],
                    onChange: handleChange,
                  })}
                  {renderTextArea({
                    label: "Informasi Pembayaran",
                    name: "payment_desc",
                    value: formState["payment_desc"],
                    onChange: handleChange,
                  })}
                </div>
              )}
              {renderCheckbox({
                label: "Tersedia Online",
                name: "is_online",
                value: formState["is_online"],
                onChange: handleChange,
              })}
              {formState.is_online && (
                <div className="flex flex-col gap-2 col-span-2 w-full p-3 items-center dark:bg-gray-700 bg-white border border-gray-300 rounded-md">
                  {renderInput({
                    label: "Link Acara Online",
                    name: "event_link",
                    value: formState["event_link"],
                    onChange: handleChange,
                  })}
                </div>
              )}
              {renderCheckbox({
                label: "Tersedia Sertifikat",
                name: "is_certificate",
                value: formState["is_certificate"],
                onChange: handleChange,
              })}
              {renderInputFile({
                label: "Upload Gambar",
                name: "posters",
                images,
                onChange: handleUploadImage,
                removeImage,
              })}
              {/* <div className="my-10" /> */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-2 focus:outline-none focus:ring-teal-700 font-medium rounded-lg lg:text-sm md:text-sm text-xs px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-300"
              >
                {isLoading ? (
                  <Loader1 className="w-5 h-5 text-white fill-teal-600" />
                ) : (
                  "Simpan"
                )}
              </button>
            </main>
          </div>
        </div>
      </div>
    </main>
  );
}
ModalAddOrEditEvent.propTypes = {
  isEdit: PropTypes.bool,
}

function renderInput({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block lg:text-sm md:text-sm sm:text-sm text-xs font-medium text-teal-800 dark:text-white mb-2"
      >
        {label}
      </label>
      <input
        autoComplete="off"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full col-span-2 bg-gray-50 border border-gray-300 text-teal-800 lg:text-sm md:text-sm sm:text-sm text-xs rounded-lg focus:ring-teal-600 focus:border-teal-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-teal-600"
        placeholder={label}
        required
      />
    </div>
  );
}
function renderInputLocation({ label, value, onChange }) {
  return (
    <div>
      <label
        htmlFor="address"
        className="block mb-2 lg:text-sm md:text-sm sm:text-sm text-xs font-medium text-teal-800 dark:text-white"
      >
        {label}
      </label>
      <div className="w-full p-3 grid grid-cols-3 gap-3 items-center dark:bg-gray-700 bg-white border border-gray-300 rounded-md">
        <label
          htmlFor="address"
          className="block lg:text-sm md:text-sm sm:text-sm text-xs font-medium text-teal-800 dark:text-white"
        >
          Maukkan Alamat :
        </label>
        <input
          autoComplete="off"
          type="text"
          name="address"
          value={value.address}
          onChange={onChange}
          className="w-full col-span-2 bg-gray-50 border border-gray-300 text-teal-800 lg:text-sm md:text-sm sm:text-sm text-xs rounded-lg focus:ring-teal-600 focus:border-teal-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-teal-600"
          placeholder="Masukkan Alamat"
          required
        />
        <label
          htmlFor="link_gmaps"
          className="block lg:text-sm md:text-sm sm:text-sm text-xs font-medium text-teal-800 dark:text-white"
        >
          Link Google Maps :
        </label>
        <input
          autoComplete="off"
          type="text"
          name="link_gmaps"
          value={value.link_gmaps}
          onChange={onChange}
          className="w-full col-span-2 bg-gray-50 border border-gray-300 text-teal-800 lg:text-sm md:text-sm sm:text-sm text-xs rounded-lg focus:ring-teal-600 focus:border-teal-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-teal-600"
          placeholder="Masukkan Link Google Maps"
          required
        />
      </div>
    </div>
  );
}
function renderTextArea({ label, name, value, onChange }) {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block mb-2 lg:text-sm md:text-sm sm:text-sm text-xs font-medium text-teal-800 dark:text-white"
      >
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-50 border border-gray-300 text-teal-800 lg:text-sm md:text-sm sm:text-sm text-xs rounded-lg focus:ring-teal-600 focus:border-teal-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-teal-600"
        placeholder={label}
        required
        rows="4"
      />
    </div>
  );
}
function renderCheckbox({ label, name, value, onChange }) {
  return (
    <div className="w-full flex items-center gap-2">
      <input
        type="checkbox"
        name={name}
        checked={value}
        onChange={onChange}
        required
        className="w-4 h-4"
      />
      <label
        htmlFor={name}
        className="block lg:text-sm md:text-sm sm:text-sm text-xs font-medium text-teal-800 dark:text-white"
      >
        {label}
      </label>
    </div>
  );
}
function renderInputFile({ label, name, images, onChange, removeImage }) {
  return (
    <div className="w-full">
      <label
        htmlFor="poster"
        className="w-full cursor-pointer mb-2 text-white bg-teal-600 hover:bg-teal-700 focus:ring-2 focus:outline-none focus:ring-teal-700 font-medium rounded-lg lg:text-sm md:text-sm text-xs px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-300"
      >
        <Upload className="mr-2" /> {label}
      </label>
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        id="poster"
        name={name}
        onChange={onChange}
        className="hidden"
        required
      />
      <div className="flex gap-2 mt-5">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <Avatar
              alt={`complaint pic ${index}`}
              src={image}
              className="w-[50px] h-[50px] border-2 border-teal-500"
            />
            <IconButton
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
              }}
              className="opacity-0 rounded-full hover:opacity-100 transition-opacity dark:hover:bg-black/30 hover:bg-black"
              onClick={() => removeImage(index)}
            >
              <Delete fontSize="small" className="text-red-500" />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
}
function renderSchedule({ label, value, onChange }) {
  return (
    <div className="w-full">
      <label className="block mb-5 lg:text-sm md:text-sm sm:text-sm text-xs font-medium text-teal-800 dark:text-white">
        {label}
      </label>
      <DateTimeRangePicker
        start={{
          label: "Mulai",
          name: "start_time",
          value: value.start_time,
        }}
        end={{
          label: "Selesai",
          name: "end_time",
          value: value.end_time,
        }}
        onChange={onChange}
        size="small"
      />
    </div>
  );
}
function renderRundown({ label, value, onChange, addRundown, removeRundown }) {
  return (
    <div>
      <label
        htmlFor="address"
        className="block mb-2 lg:text-sm md:text-sm sm:text-sm text-xs font-medium text-teal-800 dark:text-white"
      >
        {label}
      </label>
      {value.map((val, index) => (
        <div
          key={index}
          className="relative w-full pt-10 px-3 pb-3 grid grid-cols-3 gap-3 items-center dark:bg-gray-700 bg-white border border-gray-300 rounded-md mb-5"
        >
          {index !== 0 && (
            <div className="absolute top-0 right-0">
              <Cancel
                className="cursor-pointer ml-auto text-red-500"
                onClick={() => removeRundown(index)}
              />
            </div>
          )}
          <label
            htmlFor="address"
            className="block lg:text-sm md:text-sm sm:text-sm text-xs font-medium text-teal-800 dark:text-white"
          >
            Waktu :
          </label>
          <div className="col-span-2">
            <DateTimeRangePicker
              start={{
                label: "Mulai",
                name: "start",
                value: val.time.start,
              }}
              end={{
                label: "Selesai",
                name: "end",
                value: val.time.end,
              }}
              onChange={(dateValue, dateName) =>
                onChange(null, index, dateName, dateValue)
              }
              size="small"
            />
          </div>
          <label
            htmlFor="session"
            className="block lg:text-sm md:text-sm sm:text-sm text-xs font-medium text-teal-800 dark:text-white"
          >
            Sesi :
          </label>
          <input
            autoComplete="off"
            type="text"
            name="session"
            value={val.session}
            onChange={(e) => onChange(e, index)}
            className="w-full col-span-2 bg-gray-50 border border-gray-300 text-teal-800 lg:text-sm md:text-sm sm:text-sm text-xs rounded-lg focus:ring-teal-600 focus:border-teal-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-teal-600"
            placeholder="Masukkan Sesi"
            required
          />
          <label
            htmlFor="speaker"
            className="block lg:text-sm md:text-sm sm:text-sm text-xs font-medium text-teal-800 dark:text-white"
          >
            Pembicara :
          </label>
          <input
            autoComplete="off"
            type="text"
            name="speaker"
            value={val.speaker}
            onChange={(e) => onChange(e, index)}
            className="w-full col-span-2 bg-gray-50 border border-gray-300 text-teal-800 lg:text-sm md:text-sm sm:text-sm text-xs rounded-lg focus:ring-teal-600 focus:border-teal-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-teal-600"
            placeholder="Masukkan Speaker/Pembicara"
            required
          />
        </div>
      ))}
      <div className="flex justify-end">
        <button
          type="button"
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          onClick={addRundown}
        >
          + Tambah Sesi
        </button>
      </div>
    </div>
  );
}
