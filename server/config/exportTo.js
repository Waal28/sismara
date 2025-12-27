import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDateTime, formatRupiah } from "./format";

// const data = [
//   { name: 'John', age: 30, job: 'Developer' },
//   { name: 'Jane', age: 25, job: 'Designer' }
// ];

export function ExportToXLSX(data, fileName) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export const exportEventToPdf = (acara, peserta = [], volunteer = []) => {
  const doc = new jsPDF();

  // Judul
  const title = "Detail Acara";
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  const titleWidth = doc.getTextWidth(title);
  const pageWidth = doc.internal.pageSize.getWidth();
  const xTitle = (pageWidth - titleWidth) / 2;
  doc.text(title, xTitle, 10);

  // Nama Acara
  doc.setFontSize(16);
  const eventTitleWidth = doc.getTextWidth(acara.title);
  const xEventTitle = (pageWidth - eventTitleWidth) / 2;
  doc.text(acara.title, xEventTitle, 20);

  // Informasi Umum
  doc.setFontSize(12);
  doc.setFont("times", "normal");
  doc.text(`Program Studi: ${acara.prodi}`, 10, 40);
  doc.text(
    `Lokasi: ${acara.is_online ? "Online" : acara.location.address}`,
    10,
    50
  );
  if (!acara.is_online) {
    doc.text(`Google Maps: ${acara.location.link_gmaps}`, 10, 60);
  }
  doc.text(`Deskripsi: ${acara.desc}`, 10, 70);
  doc.text(
    `Waktu Acara: ${formatDateTime(
      new Date(acara.schedule.start_time)
    )} - ${formatDateTime(new Date(acara.schedule.end_time))}`,
    10,
    80
  );

  // Rundown dalam tabel
  const rundownHeaders = ["Sesi", "Pembicara", "Mulai", "Selesai"];
  const rundownRows = acara.rundown.map((item) => [
    item.session,
    item.speaker,
    formatDateTime(new Date(item.time.start)),
    formatDateTime(new Date(item.time.end)),
  ]);

  autoTable(doc, {
    head: [rundownHeaders],
    body: rundownRows,
    startY: 90,
    theme: "grid",
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: [255, 255, 255],
      font: "times",
      fontStyle: "bold",
    },
    bodyStyles: { font: "times", fontSize: 10 },
  });

  // Informasi Tambahan
  let yPos = doc.lastAutoTable.finalY + 10;
  doc.setFont("times", "bold");
  doc.text("Informasi Tambahan:", 10, yPos);

  doc.setFont("times", "normal");
  doc.text(
    `Biaya: ${
      acara.is_paid ? `${formatRupiah(acara.payment_price)}` : "Gratis"
    }`,
    10,
    yPos + 10
  );
  if (acara.is_paid) {
    doc.text("Informasi Pembayaran:", 10, yPos + 20);
    doc.setFont("times", "bold");
    doc.text(acara.payment_desc, 20, yPos + 30);
    doc.setFont("times", "normal");
  }

  doc.text(`Status Acara: ${acara.status}`, 10, yPos + 50);
  doc.text(
    `Sertifikat: ${acara.is_certificate ? "Tersedia" : "Tidak Ada"}`,
    10,
    yPos + 60
  );

  // Tambah Max Participants
  doc.text(`Maksimum Peserta: ${acara.max_participants}`, 10, yPos + 70);

  // Informasi Volunteer
  if (acara.is_volunteers) {
    doc.text(`Maksimum Volunteer: ${acara.max_volunteers}`, 10, yPos + 80);
    doc.text(`Kriteria Volunteer: ${acara.criteria_volunteers}`, 10, yPos + 90);
  }

  // Data Peserta
  if (peserta.length > 0) {
    doc.setFont("times", "bold");
    doc.text("Daftar Peserta:", 10, yPos + 110);
    doc.setFont("times", "normal");

    const pesertaHeaders = ["Nama", "NPM", "Email", "Prodi", "Kehadiran"];
    const pesertaRows = peserta.map((item) => [
      item.mahasiswa.name,
      item.mahasiswa.npm,
      item.mahasiswa.email,
      item.mahasiswa.prodi,
      item.isPresent ? "Hadir" : "Tidak Hadir",
    ]);

    autoTable(doc, {
      head: [pesertaHeaders],
      body: pesertaRows,
      startY: yPos + 120,
      theme: "grid",
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        font: "times",
        fontStyle: "bold",
      },
      bodyStyles: { font: "times", fontSize: 10 },
    });
  }

  // Data Volunteer
  if (volunteer.length > 0) {
    doc.setFont("times", "bold");
    doc.text("Daftar Volunteer:", 10, doc.lastAutoTable.finalY + 10);
    doc.setFont("times", "normal");

    const volunteerHeaders = ["Nama", "NPM", "Email", "Prodi"];
    const volunteerRows = volunteer.map((item) => [
      item.mahasiswa.name,
      item.mahasiswa.npm,
      item.mahasiswa.email,
      item.mahasiswa.prodi,
    ]);

    autoTable(doc, {
      head: [volunteerHeaders],
      body: volunteerRows,
      startY: doc.lastAutoTable.finalY + 20,
      theme: "grid",
      headStyles: {
        fillColor: [231, 76, 60],
        textColor: [255, 255, 255],
        font: "times",
        fontStyle: "bold",
      },
      bodyStyles: { font: "times", fontSize: 10 },
    });
  }

  // Simpan PDF
  doc.save("laporan-acara.pdf");
};
