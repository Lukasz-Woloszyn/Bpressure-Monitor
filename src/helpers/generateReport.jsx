import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { utils, writeFile } from "xlsx";
import Papa from "papaparse";

export const generateReport = (results, format) => {
  const sortedResults = results.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB - dateA; // sortowanie malejąco
  });
  switch (format) {
    case "pdf":
      generatePDF(sortedResults);
      break;
    case "xlsx":
      generateXLSX(sortedResults);
      break;
    case "csv":
      generateCSV(sortedResults);
      break;
    case "txt":
      generateTXT(sortedResults);
      break;
    default:
      throw new Error("Unsupported file format");
  }
};

const createFileName = () => {
  const today = new Date();
  const year = String(today.getFullYear()).slice(-2); // ostatnie dwie cyfry roku
  const month = String(today.getMonth() + 1).padStart(2, "0"); // dodanie 1 do miesiąca - liczone od zera
  const day = String(today.getDate()).padStart(2, "0"); // dodanie 0 jeśli miesiąc jednocyfrowy

  return `Blood_Pressure_Monitor-${year}_${month}_${day}`;
};

const generatePDF = (results) => {
  const doc = new jsPDF();
  doc.text("Results Report", 10, 10);

  const headers = [
    "Date",
    "Time",
    "Systolic Pressure",
    "Diastolic Pressure",
    "Pulse",
  ];

  const data = results.map((result) => [
    result.date,
    result.time,
    result.systolicValue,
    result.diastolicValue,
    result.pulseValue,
  ]);

  doc.autoTable({
    head: [headers],
    body: data,
    startY: 20,
  });

  doc.save(createFileName() + ".pdf");
};

const generateXLSX = (results) => {
  const data = results.map((result) => ({
    Date: result.date,
    Time: result.time,
    "Systolic Pressure": result.systolicValue,
    "Diastolic Pressure": result.diastolicValue,
    Pulse: result.pulseValue,
  }));

  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Results");
  writeFile(wb, createFileName() + ".xlsx");
};

const generateCSV = (results) => {
  const data = results.map((result) => ({
    Date: result.date,
    Time: result.time,
    "Systolic Pressure": result.systolicValue,
    "Diastolic Pressure": result.diastolicValue,
    Pulse: result.pulseValue,
  }));

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", createFileName() + ".csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const generateTXT = (results) => {
  const headers = "Date\tTime\tSystolic Pressure\tDiastolic Pressure\tPulse\n";
  const data = results
    .map(
      (result) =>
        `${result.date}\t${result.time}\t${result.systolicValue}\t${result.diastolicValue}\t${result.pulseValue}`
    )
    .join("\n");

  const txt = headers + data;
  const blob = new Blob([txt], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", createFileName() + ".txt");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
