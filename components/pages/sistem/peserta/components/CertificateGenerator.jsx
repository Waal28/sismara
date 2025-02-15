import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Typography, Button, Slider, Box, Tooltip } from "@mui/material";
import { DownloadIcon, ImageUploadIcon } from "@/components/atoms/CustomIcon";
import {
  downloadEventCertificate,
  uploadEventCertificate,
} from "@/api/src/acara";
import { toast } from "react-toastify";
import { uploadImages } from "@/api/src/dashboard";
// import { getImage } from "@/constants";
import { useAppState } from "@/context/AppStateContext";
import { getImgCert } from "@/constants";

const EX_NAME = "ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901112131415";
const CANVAS_WIDTH = 800; // Ukuran canvas tetap (logis)
const CANVAS_HEIGHT = 600; // Ukuran canvas tetap (logis)
const MAX_CHARACTERS = 20; // Maksimal karakter pada input nama
const POSITION = { x: 400, y: 200 };
const FONTFAMILY = "Arial"; // Pilihan font family
const FONTSIZE = 30; // Ukuran font default
const COLOR = "#000000";

function CertificateGenerator({
  event,
  certificateFor,
  fetchEvent = async () => {},
  isFromProfileMhs = false,
}) {
  const { updateAppState, currentUser } = useAppState();
  const [state, setState] = useState({
    loading: false,
    template: null,
    image: null,
    name: EX_NAME.slice(0, MAX_CHARACTERS),
    maxCharacters: MAX_CHARACTERS,
    position: POSITION,
    dragging: false,
    offset: { x: 0, y: 0 },
    fontSize: FONTSIZE,
    fontFamily: FONTFAMILY,
    fontColor: COLOR,
  });
  const {
    loading,
    template,
    image,
    name,
    maxCharacters,
    position,
    dragging,
    offset,
    fontSize,
    fontFamily,
    fontColor,
  } = state;
  const canvasRef = useRef(null); // Referensi untuk elemen canvas
  function updateState(newValue) {
    setState((prev) => ({ ...prev, ...newValue }));
  }
  // Fungsi untuk mengunggah gambar template sertifikat
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    // Cek apakah ada file yang di-upload
    if (!file) {
      toast.error("File tidak boleh kosong", {
        theme: "colored",
      });
      return; // Jika tidak ada file, langsung keluar dari fungsi
    }
    const invalidFiles = file.size > 5 * 1000 * 1000;

    // Cek apakah ada gambar yang ukurannya lebih dari 5 MB
    if (invalidFiles) {
      toast.error("File tidak boleh lebih dari 5 MB", {
        theme: "colored",
      });
      return;
    }
    updateState({
      image: URL.createObjectURL(file),
      template: file,
    });
  };

  // Fungsi untuk mulai dragging teks
  const startDragging = (e) => {
    updateState({ dragging: true });
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - position.x;
    const y = e.clientY - rect.top - position.y;
    updateState({ offset: { x, y } });
  };

  // Fungsi untuk menghentikan dragging
  const stopDragging = () => {
    updateState({ dragging: false });
  };

  // Fungsi untuk menggeser teks saat dragging
  const handleDragging = (e) => {
    if (dragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - offset.x;
      const y = e.clientY - rect.top - offset.y;
      updateState({ position: { x, y } });
    }
  };

  // Fungsi untuk menggambar template dan teks di canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const templateImage = new Image();

    templateImage.src = image;

    templateImage.onload = () => {
      // Tetapkan ukuran fisik canvas tetap
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;

      // Gambar template ke canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Bersihkan canvas
      ctx.drawImage(templateImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Gambar teks (nama) yang bisa digeser
      ctx.font = `${fontSize}px ${fontFamily}`; // Atur ukuran font dan font family
      ctx.textAlign = "center";
      ctx.fillStyle = fontColor; // Atur warna font
      ctx.fillText(name, position.x, position.y);
    };
  };

  // Fungsi untuk menyimpan sertifikat
  async function handleSave() {
    updateState({ loading: true });
    let payload = {
      certificateFor,
      data: {
        position,
        fontSize,
        fontFamily,
        fontColor,
        maxCharacters,
      },
    };
    const formData = new FormData();
    formData.append("image", template);
    try {
      if (template) {
        const templateRes = await uploadImages(formData);
        const templateUrl = templateRes.data.fileName;
        payload.data.template = templateUrl;
      }
      await uploadEventCertificate(event.id, payload);
      await fetchEvent({ id: event.id, event });
      toast.success("Sertifikat berhasil disimpan", { theme: "colored" });
      handleCloseModal();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Terjadi kesalahan", {
        theme: "colored",
      });
    } finally {
      updateState({ loading: false });
    }
  }
  const handleDownload = () => {
    if (!canvasRef.current || !image) {
      toast.error("Sertifikat belum tersedia", {
        theme: "colored",
      });
      return;
    }

    // Menggunakan canvas.toBlob untuk menghasilkan file Blob
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "certificate.png";
        link.click();

        // Membersihkan URL objek untuk menghindari memory leak
        URL.revokeObjectURL(link.href);
      }
    }, "image/png");
  };
  async function downloadCertificate(fileName) {
    updateState({ loading: true });
    try {
      const res = await downloadEventCertificate({ fileName });
      updateState({ image: getImgCert(res.data) });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Terjadi kesalahan", {
        theme: "colored",
      });
    } finally {
      updateState({ loading: false });
    }
  }
  const handleCloseModal = () => updateAppState.modal({ open: false });

  // Render ulang setiap kali gambar, posisi, atau ukuran font berubah
  useEffect(() => {
    if (image) {
      drawCanvas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, name, position, fontSize, fontFamily, fontColor]);

  useEffect(() => {
    const field = certificateFor === "Peserta" ? "participant" : "volunteer";
    const certTemplate = event.certificate_template[field];
    const participantName = isFromProfileMhs && currentUser.name;
    if (certTemplate.template) {
      downloadCertificate(certTemplate.template);
    }
    updateState({
      name:
        (certTemplate?.maxCharacters &&
          participantName &&
          participantName.slice(0, certTemplate?.maxCharacters)) ||
        EX_NAME.slice(0, MAX_CHARACTERS),
      position: certTemplate?.position || POSITION,
      fontSize: certTemplate?.fontSize || FONTSIZE,
      fontFamily: certTemplate?.fontFamily || FONTFAMILY,
      fontColor: certTemplate?.fontColor || COLOR,
      maxCharacters: certTemplate?.maxCharacters || MAX_CHARACTERS,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, certificateFor]);

  return (
    <React.Fragment>
      {isFromProfileMhs && event.is_certificate && (
        <Tooltip title="Unduh Sertifikat" placement="left">
          <div
            onClick={handleDownload}
            className="absolute lg:top-5 top-2 lg:right-5 right-2 z-50 w-fit h-fit"
          >
            <DownloadIcon className="lg:w-8 w-7 lg:h-8 h-7 p-1 rounded-full bg-white text-blue-500 transition-all duration-300 transform hover:text-blue-400 hover:scale-105 dark:bg-gray-800" />
          </div>
        </Tooltip>
      )}
      <main
        className={`${
          isFromProfileMhs ? "hidden" : ""
        } absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl sm:w-[85%] w-[90%] max-h-screen overflow-auto`}
      >
        <div className="w-full dark:bg-gray-900 bg-white rounded-3xl dark:text-white text-gray-800 p-5 sm:p-10">
          <Typography variant="h4" align="center" gutterBottom>
            Generate Sertifikat {certificateFor}
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            {event.title}
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mt-5">
            <section className="p-5 dark:bg-gray-800 dark:text-white text-gray-800 rounded-xl border border-gray-300 dark:border-none shadow-md">
              <Box mt={2}>
                <Typography gutterBottom>Max Karakter</Typography>
                <input
                  type="number"
                  value={maxCharacters}
                  onChange={(e) => {
                    updateState({
                      maxCharacters: e.target.value,
                      name: EX_NAME.slice(0, e.target.value),
                    });
                  }}
                  className="w-full bg-gray-50 border border-gray-300 text-teal-800 lg:text-sm md:text-sm sm:text-sm text-xs rounded-lg focus:ring-teal-600 focus:border-teal-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-teal-600"
                />
              </Box>
              <Box mt={2}>
                <Typography gutterBottom>Ukuran Font</Typography>
                <Slider
                  value={fontSize}
                  min={10}
                  max={100}
                  valueLabelDisplay="auto"
                  onChange={(e, value) => updateState({ fontSize: value })}
                />
              </Box>
              <Box mt={2}>
                <Typography gutterBottom>Jenis Font</Typography>
                <select
                  value={fontFamily}
                  onChange={(e) => updateState({ fontFamily: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 text-teal-800 lg:text-sm md:text-sm sm:text-sm text-xs rounded-lg focus:ring-teal-600 focus:border-teal-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-teal-600"
                  required
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Georgia">Georgia</option>
                </select>
              </Box>
              <Box mt={2}>
                <Typography gutterBottom>Warna Font</Typography>
                <div className="relative w-10 h-10 rounded-full z-10 overflow-hidden">
                  <input
                    type="color"
                    value={fontColor}
                    onChange={(e) => updateState({ fontColor: e.target.value })}
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 z-0"
                  />
                </div>
              </Box>
            </section>
            <section className="p-5 sm:col-span-3 dark:bg-gray-800 dark:text-white text-gray-800 rounded-xl border border-gray-300 dark:border-none shadow-md">
              <Typography variant="h6" gutterBottom>
                Preview Sertifikat
              </Typography>
              <div className="w-full overflow-hidden flex justify-center items-center mt-5">
                {image ? (
                  <canvas
                    ref={canvasRef}
                    style={styles.canvas}
                    onMouseDown={startDragging}
                    onMouseMove={handleDragging}
                    onMouseUp={stopDragging}
                    onMouseLeave={stopDragging}
                  />
                ) : (
                  <div className="mt-[10%]">
                    <label htmlFor="template-upload">
                      <Button
                        disabled={loading}
                        variant="contained"
                        component="span"
                        sx={styles.button}
                      >
                        <ImageUploadIcon className="mr-2 h-6 w-6" />
                        Upload Template
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            </section>
          </div>
          <input
            id="template-upload"
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
          />
          {image && (
            <div className="flex gap-5 mt-5 justify-end">
              <label htmlFor={!loading ? "template-upload" : ""}>
                <Button
                  disabled={loading}
                  component="span"
                  variant="contained"
                  color="primary"
                  sx={styles.button}
                >
                  Ganti Template
                </Button>
              </label>
              <Button
                disabled={loading}
                variant="contained"
                color="primary"
                sx={styles.button}
                onClick={handleSave}
              >
                Simpan
              </Button>
            </div>
          )}
        </div>
      </main>
    </React.Fragment>
  );
}
const styles = {
  button: {
    textTransform: "none",
    "&.Mui-disabled": {
      backgroundColor: "grey.500", // Warna background saat disabled
      color: "white", // Warna teks saat disabled
    },
  },
  canvas: {
    border: "1px solid black",
    cursor: "move",
    width: "100%", // Atur lebar agar responsif secara visual
    maxWidth: "800px", // Sesuai dengan ukuran asli canvas
    height: "auto", // Otomatis menyesuaikan tinggi
  },
};
CertificateGenerator.propTypes = {
  event: PropTypes.object.isRequired,
  certificateFor: PropTypes.string.isRequired,
  fetchEvent: PropTypes.func,
  isFromProfileMhs: PropTypes.bool,
};

export default CertificateGenerator;
