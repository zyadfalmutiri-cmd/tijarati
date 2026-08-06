import * as XLSX from "xlsx";

export function exportToExcel(filename: string, sheets: { name: string; rows: Record<string, string | number>[] }[]) {
  const workbook = XLSX.utils.book_new();
  sheets.forEach((sheet) => {
    const worksheet = XLSX.utils.json_to_sheet(sheet.rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
  });
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
