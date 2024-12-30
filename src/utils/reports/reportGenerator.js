import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const generatePDF = (data, title, dateRange) => {
  const doc = new jsPDF();
  
  // Add header with Jazz Coffee branding
  doc.setFontSize(20);
  doc.text('Jazz Coffee', 105, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text(title, 105, 30, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Period: ${dateRange.start} - ${dateRange.end}`, 105, 40, { align: 'center' });
  
  // Add table with data
  doc.autoTable({
    head: [Object.keys(data[0])],
    body: data.map(Object.values),
    startY: 50,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 133, 244] }
  });
  
  return doc;
};

export const generateExcel = (data, title) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, title);
  return wb;
};

export const generateCSV = (data) => {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header]).join(','))
  ].join('\n');
  return csvContent;
};