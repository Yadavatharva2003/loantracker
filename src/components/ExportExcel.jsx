import React from "react";
import * as XLSX from "xlsx";

const ExportExcel = ({ transactions, chartRef }) => {
  const exportToExcel = () => {
    // Prepare worksheet data from transactions
    const wsData = transactions.map(
      ({ id, type, category, amount, date, description }) => ({
        ID: id,
        Type: type,
        Category: category,
        Amount: amount,
        Date: date,
        Description: description,
      })
    );

    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(wsData);

    XLSX.utils.book_append_sheet(wb, ws, "Transactions");

    // Optionally, export chart image as base64 and add to sheet (complex, skipping for now)

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, "loan_expense_transactions.xlsx");
  };

  return (
    <button
      onClick={exportToExcel}
      className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Export Transactions to Excel
    </button>
  );
};

export default ExportExcel;
