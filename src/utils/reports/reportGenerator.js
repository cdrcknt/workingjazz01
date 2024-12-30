import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// PDF generation
export const generatePDF = (data, title, dateRange) => {
  const doc = new jsPDF();
  
  // Add header with Jazz Coffee branding
  doc.setFontSize(20);
  doc.text('Jazz Coffee', 105, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text(title, 105, 30, { align: 'center' });
  
  // Add date range if provided
  if (dateRange) {
    doc.setFontSize(10);
    const startDate = new Date(dateRange.start).toLocaleDateString();
    const endDate = new Date(dateRange.end).toLocaleDateString();
    doc.text(`Period: ${startDate} - ${endDate}`, 105, 40, { align: 'center' });
  }
  
  // Add table with data
  doc.autoTable({
    head: [Object.keys(data[0])],
    body: data.map(Object.values),
    startY: dateRange ? 50 : 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] }, // Blue color
    alternateRowStyles: { fillColor: [249, 250, 251] }, // Light gray for alternate rows
    margin: { top: 50 }
  });
  
  return doc;
};

// Excel generation
export const generateExcel = (data, title) => {
  const wb = XLSX.utils.book_new();
  
  // Add metadata
  wb.Props = {
    Title: title,
    CreatedDate: new Date()
  };
  
  // Convert data to worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Set column widths
  const colWidths = Object.keys(data[0]).map(key => ({
    wch: Math.max(key.length, ...data.map(row => String(row[key]).length))
  }));
  ws['!cols'] = colWidths;
  
  // Add the worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, title.slice(0, 31)); // Excel sheet names limited to 31 chars
  
  return wb;
};

// CSV generation
export const generateCSV = (data) => {
  const headers = Object.keys(data[0]);
  
  // Convert values to CSV format, handling special characters
  const processValue = (value) => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')
      ? `"${stringValue.replace(/"/g, '""')}"` 
      : stringValue;
  };
  
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => processValue(row[header])).join(','))
  ].join('\n');
  
  return csvContent;
};

// Helper function to format date ranges
export const formatDateRange = (startDate, endDate) => {
  const formatDate = (date) => new Date(date).toLocaleDateString();
  return {
    start: formatDate(startDate),
    end: formatDate(endDate)
  };
};