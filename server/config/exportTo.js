import * as XLSX from "xlsx";

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
