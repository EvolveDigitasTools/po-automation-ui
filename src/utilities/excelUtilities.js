import ExcelJS from "exceljs";
import { skuFields } from "./pofields";

export const skuSheetDownload = async () => {
        // Sample data for the Excel file
        const data = [
            skuFields.map(obj => obj.label),
            // Add more data here
        ];

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("SKUs");

        // Populate the worksheet with data
        data.forEach((row) => {
            worksheet.addRow(row);
        });

        data[0].forEach((title, columnIndex) => {
            const column = worksheet.getColumn(columnIndex + 1);
            let maxTitleLength = title.length;

            // Set the column width based on the maximum title length
            column.width = maxTitleLength + 2; // You can adjust the additional width as needed
        });

        // Generate a Blob from the workbook
        const blob = await workbook.xlsx.writeBuffer();

        // Create a URL for the Blob and create a temporary anchor element to trigger download
        const url = URL.createObjectURL(new Blob([blob]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "newSKU.xlsx";
        a.click();

        // Clean up by revoking the Blob URL
        URL.revokeObjectURL(url);
    };