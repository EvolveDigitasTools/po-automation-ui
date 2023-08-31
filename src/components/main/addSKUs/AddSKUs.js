import { useParams } from "react-router-dom"
import ExcelJS from 'exceljs';

export default function AddSKUs() {
    const params = useParams();
    const vendorCode = params.vendorCode;

    const handleDownload = async () => {
        // Sample data for the Excel file
        const data = [
          ['SKU*', 'Category*', 'Product Name*', 'HSN*', 'EAN*', 'MRP*', 'Prdct L(cm)*', 'Prdct B(cm)*', 'Prdct H(cm)*', 'Wght(kg)*', 'MSTRCTN Box Qty*', 'MSTRCTN L(cm)*', 'MSTRCTN B(cm)*', 'MSTRCTN H(cm)*', 'Wght(kg)*']
          // Add more data here
        ];
    
        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('SKUs');
    
        // Populate the worksheet with data
        data.forEach((row) => {
          worksheet.addRow(row);
        });
    
        // Generate a Blob from the workbook
        const blob = await workbook.xlsx.writeBuffer();
    
        // Create a URL for the Blob and create a temporary anchor element to trigger download
        const url = URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'newSKU.xlsx';
        a.click();
    
        // Clean up by revoking the Blob URL
        URL.revokeObjectURL(url);
      };

    return (<div>
        <button onClick={handleDownload}>Download Sample SKU Excel</button>
    </div>)
}