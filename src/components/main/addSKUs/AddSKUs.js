import { useParams } from "react-router-dom";
import ExcelJS from "exceljs";
import { TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import './AddSku.css';

export default function AddSKUs() {
    const params = useParams();
    const vendorCode = params.vendorCode;
    const [excelData, setExcelData] = useState([]);

    //ComponentDidMount
    useEffect(() => {
        return () => {
            // This code will run when the component is unmounted
            // You can perform any cleanup tasks here, such as unsubscribing from subscriptions
            console.log("Component unmounted");
        };
    }, []);

    const handleDownload = async () => {
        // Sample data for the Excel file
        const data = [
            [
                "SKU*",
                "Category*",
                "Brand*",
                "Product Title*",
                "HSN*",
                "EAN*",
                "Model Number*",
                "Size",
                "Color Family-Color",
                "Prdct L(cm)*",
                "Prdct B(cm)*",
                "Prdct H(cm)*",
                "Wght(kg)*",
                "MSTRCTN Box Qty*",
                "MSTRCTN L(cm)*",
                "MSTRCTN B(cm)*",
                "MSTRCTN H(cm)*",
                "Wght(kg)*",
                "MRP",
            ],
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

            // Iterate through data rows to find the maximum title length in the column
            // data.slice(1).forEach((row) => {
            //   const cellValue = row[columnIndex];
            //   if (cellValue && cellValue.length > maxTitleLength) {
            //     maxTitleLength = cellValue.length;
            //   }
            // });

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

    const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file);
  
      const worksheet = workbook.getWorksheet(1);
      const parsedData = [];
  
      worksheet.eachRow((row) => {
        parsedData.push(row.values);
      });
      const keys = []
      parsedData[0].splice(1).forEach(key => keys.push(key))
      console.log(keys)
      setExcelData(parsedData);
    };

    return (
        <div className="new-skus">
            <h1>Add New SKUs</h1>
            <button className="back-button">Back</button>
            <div className="vendor-info">
                <h2>Vendor Details</h2>
                <div className="row">
                    <div className="col">
                    <TextField
                    disabled
                    id="vendor-code"
                    label="Vendor Code"
                    value={"Vendor Code"}
                    fullWidth
                />
                <TextField
                    disabled
                    id="company-name"
                    label="Company Name"
                    value={"Company Name"}
                    fullWidth
                />
                   <TextField
                    disabled
                    id="state"
                    label="State"
                    value={"State"}
                    fullWidth
                />
                    </div>
                    <div className="col">
                    <TextField
                    disabled
                    id="country"
                    label="Country"
                    value={"Country"}
                    fullWidth
                />
                <TextField
                    disabled
                    id="product-category"
                    label="Product Category"
                    value={"Product Category"}
                    fullWidth
                />
                <button className="download-button" onClick={handleDownload}>Download Sample SKU Excel</button>
            
                    </div>
                </div>
                <div className="excel-section">
                <h2>Upload SKU Details</h2>
                </div>
                
                <TextField
                     type="file"
                     id="file-input"
                    className="file-input"
                     accept=".xlsx"
                     onChange={handleFileChange}
                />
            </div>
            
            <Typography variant="h6">Excel Data:</Typography>
            <pre>{JSON.stringify(excelData, null, 2)}</pre>
            <button onClick={handleDownload}>Download Sample SKU Excel</button>
        </div>
    );
}
