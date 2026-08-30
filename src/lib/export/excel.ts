import { downloadBlob } from "./csv";

export async function exportToExcel(
  filename: string,
  sheets: { name: string; rows: Record<string, string | number>[] }[]
) {
  // مستوردة ديناميكيًا: (1) لتقليل حجم الحزمة الأساسي (P2)، و(2) بديل عن
  // مكتبة xlsx التي تحمل ثغرة أمنية معروفة غير مُصلحة على npm (S6).
  const ExcelJS = (await import("exceljs")).default;
  const workbook = new ExcelJS.Workbook();

  sheets.forEach((sheet) => {
    const worksheet = workbook.addWorksheet(sheet.name);
    if (sheet.rows.length > 0) {
      worksheet.columns = Object.keys(sheet.rows[0]).map((key) => ({ header: key, key }));
      sheet.rows.forEach((row) => worksheet.addRow(row));
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  downloadBlob(blob, `${filename}.xlsx`);
}
