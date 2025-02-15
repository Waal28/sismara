import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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

export const exportEventToPdf = (data) => {
  const doc = new jsPDF();
  const title = "Laporan Acara";

  // Set font ke Times New Roman dan buat judul menjadi bold
  doc.setFont("times", "bold");
  doc.setFontSize(18);

  // Menghitung posisi horizontal untuk memusatkan teks
  const titleWidth = doc.getTextWidth(title); // Mendapatkan lebar teks
  const pageWidth = doc.internal.pageSize.getWidth(); // Mendapatkan lebar halaman
  const xPosition = (pageWidth - titleWidth) / 2; // Menghitung posisi X untuk memusatkan

  // Posisi vertikal
  const yPosition = 10; // Anda bisa sesuaikan posisi vertikal sesuai kebutuhan

  // Menambahkan teks judul di tengah
  doc.text(title, xPosition, yPosition);
  // Set font ke Times New Roman dan buat judul menjadi bold
  doc.setFont("times", "bold");
  doc.setFontSize(18);

  // Menghitung posisi horizontal untuk memusatkan teks
  const titleWidth1 = doc.getTextWidth(data.title); // Mendapatkan lebar teks
  const pageWidth1 = doc.internal.pageSize.getWidth(); // Mendapatkan lebar halaman
  const xPosition1 = (pageWidth1 - titleWidth1) / 2; // Menghitung posisi X untuk memusatkan
  // Posisi vertikal
  const yPosition1 = 20; // Anda bisa sesuaikan posisi vertikal sesuai kebutuhan
  doc.text(data.title, xPosition1, yPosition1);

  // Set font size untuk teks biasa
  doc.setFontSize(12);
  doc.setFont("times", "normal");

  // Tambahkan informasi umum
  doc.setFont("times", "normal");
  doc.text(`Lokasi: ${data.location.address}`, 10, 40);
  doc.text(`Link Acara: ${data.event_link}`, 10, 50);
  doc.text(`Deskripsi: ${data.desc}`, 10, 60);

  // Tambahkan rundown ke dalam tabel
  const rundownHeaders = ["Sesi", "Pembicara", "Waktu Mulai", "Waktu Selesai"];
  const rundownRows = data.rundown.map((item) => [
    item.session,
    item.speaker,
    new Date(item.time.start).toLocaleString(),
    new Date(item.time.end).toLocaleString(),
  ]);

  autoTable(doc, {
    head: [rundownHeaders],
    body: rundownRows,
    startY: 70,
    theme: "grid",
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: [255, 255, 255],
      font: "times",
      fontStyle: "bold",
    }, // Bold header
    bodyStyles: { font: "times", fontSize: 10 },
  });

  // Tambahkan informasi tambahan (Bold pada harga dan status pembayaran)
  doc.text("Informasi Tambahan:", 10, doc.lastAutoTable.finalY + 10);

  doc.setFont("times", "normal");
  doc.text(`- Biaya:`, 10, doc.lastAutoTable.finalY + 20);
  doc.setFont("times", "bold");
  doc.text(`${data.payment_price}`, 60, doc.lastAutoTable.finalY + 20); // Dibold

  doc.setFont("times", "normal");
  doc.text(`- Status Acara:`, 10, doc.lastAutoTable.finalY + 30);
  doc.setFont("times", "bold");
  doc.text(`${data.status}`, 60, doc.lastAutoTable.finalY + 30); // Dibold

  // Simpan PDF
  doc.save("laporan-acara.pdf");
};
