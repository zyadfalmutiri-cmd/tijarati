import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportToPDF(
  title: string,
  sections: { heading: string; rows: (string | number)[][]; columns: string[] }[],
  filename: string
) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(new Date().toLocaleDateString("en-GB"), 14, 25);

  let cursorY = 32;
  sections.forEach((section) => {
    doc.setFontSize(12);
    doc.setTextColor(20);
    doc.text(section.heading, 14, cursorY);
    autoTable(doc, {
      startY: cursorY + 4,
      head: [section.columns],
      body: section.rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [109, 94, 247] },
      margin: { left: 14, right: 14 },
    });
    // @ts-ignore - lastAutoTable is injected by the plugin
    cursorY = (doc as any).lastAutoTable.finalY + 12;
  });

  doc.save(`${filename}.pdf`);
}
