import { useParams } from "react-router-dom";
import ExcelJS from "exceljs";
import { TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import './ADDBuying.css';

export default function AddBuyingOrder() {
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

    const generateExcel = async () => {
        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Order Details");

        // Define the data
        const data = [
            [],
            [
                "",
                "Ansan Technologies Pvt Ltd"
            ],
            [
                "",
                "Partner Name :",
                "",
                "XYZ",
                "",
                "",
                "",
                "BU :",
                "Pluugin"
            ],
            [
                "",
                "Partner Code :",
                "",
                "PEXYZ",
                "",
                "",
                "",
                "P.O No :", 
                "PE123"
            ],
            [
                "",
                "Partner Address :",
                "",
                "XYZ",
                "",
                "",
                "",
                "BM :",
                "E-Commerce"
            ],
            [
                "",
                "Contact Person :",
                "",
                "XYZ",
                "",
                "",
                "",
                "Currency :",
                "INR"
            ],
            [
                "",
                "Contact No :",
                "",
                "XYZ",
                "",
                "",
                "",
                "Date :",
                "XYZ - Current Date"
            ],
            [
                "",
                "Payment Terms :",
                "",
                "XYZ",
                "",
                "",
                "",
                "Buyer :",
                "XYZ - Email"
            ],
            [
                "",
                "GST No:",
                "",
                "XYZ",
                "",
                "",
                "",
                "GST No:",
                "XYZ"
            ],
            [
                "",
                "State Name and Code:",
                "",
                "XYZ",
                "",
                "",
                "",
                "State Name and Code:",
                "XYZ"
            ],
            [
                "",
                "Estimated Delivery Date :",
                "",
                "XYZ",
                "",
                "",
                "",
                "CIN:",
                "XYZ",
            ],
            [
                "",
                "Bill To :",
                "XYZ",
                "",
                "",
                "",
                "",
                "Ship To :",
                "XYZ"
            ],
            [
                "",
                "SR No",
                "SKU",
                "Product Title",
                "EAN",
                "Model Number",
                "Category",
                "Brand",
                "Size",
                "Color Family-Color",
                "Qty",
                "Unit Rate",
                "IGST Rate",
                "IGST Amount",
                "SGST Rate",
                "SGST Amount",
                "CGST Rate",
                "CGST Amount",
                "Amount (INR)",
            ],
            [
                "",
                1,
                "WPC-TTHOL-250ML",
                "WPC Tea Tree Hair Oil 250 ML",
                8906064134656,
                "WPCTTHOIL",
                "Beauty",
                "WPC",
                "None",
                "Black - Black",
                5,
                5,
                "",
                "9%",
                2.25,
                "9%",
                2.25,
                25.0,
            ],
            [
                2,
                "WPC-TTHOL-250ML",
                "WPC Tea Tree Hair Oil 250 ML",
                8906064134656,
                "WPCTTHOIL",
                "Beauty",
                "WPC",
                "None",
                "Black - Black",
                10,
                5,
                "",
                "9%",
                4.5,
                "9%",
                4.5,
                50.0,
            ],
            [
                3,
                "WPC-TTHOL-250ML",
                "WPC Tea Tree Hair Oil 250 ML",
                8906064134656,
                "WPCTTHOIL",
                "Beauty",
                "WPC",
                "None",
                "Black - Black",
                15,
                5,
                "",
                "9%",
                6.75,
                "9%",
                6.75,
                75.0,
            ],
            [
                4,
                "WPC-TTHOL-250ML",
                "WPC Tea Tree Hair Oil 250 ML",
                8906064134656,
                "WPCTTHOIL",
                "Beauty",
                "WPC",
                "None",
                "Black - Black",
                20,
                5,
                "",
                "9%",
                9.0,
                "9%",
                9.0,
                100.0,
            ],
            [
                5,
                "WPC-TTHOL-250ML",
                "WPC Tea Tree Hair Oil 250 ML",
                8906064134656,
                "WPCTTHOIL",
                "Beauty",
                "WPC",
                "None",
                "Black - Black",
                25,
                5,
                "",
                "9%",
                11.25,
                "9%",
                11.25,
                125.0,
            ],
        ];

        // Add data to the worksheet
        data.forEach((row) => {
            worksheet.addRow(row);
        });

        worksheet.mergeCells('B2', 'S2');

        worksheet.mergeCells('B3', 'C3');
        worksheet.mergeCells('B4', 'C4');
        worksheet.mergeCells('B5', 'C5');
        worksheet.mergeCells('B6', 'C6');
        worksheet.mergeCells('B7', 'C7');
        worksheet.mergeCells('B8', 'C8');
        worksheet.mergeCells('B9', 'C9');
        worksheet.mergeCells('B10', 'C10');
        worksheet.mergeCells('B11', 'C11');

        worksheet.mergeCells('D4', 'G4');
        worksheet.mergeCells('D3', 'G3');
        worksheet.mergeCells('D5', 'G5');
        worksheet.mergeCells('D6', 'G6');
        worksheet.mergeCells('D7', 'G7');
        worksheet.mergeCells('D8', 'G8');
        worksheet.mergeCells('D9', 'G9');
        worksheet.mergeCells('D10', 'G10');
        worksheet.mergeCells('D11', 'G11');
        worksheet.mergeCells('C12', 'G12')

        worksheet.mergeCells('I3', 'S3');
        worksheet.mergeCells('I4', 'S4');
        worksheet.mergeCells('I5', 'S5');
        worksheet.mergeCells('I6', 'S6');
        worksheet.mergeCells('I7', 'S7');
        worksheet.mergeCells('I8', 'S8');
        worksheet.mergeCells('I9', 'S9');
        worksheet.mergeCells('I10', 'S10');
        worksheet.mergeCells('I11', 'S11');
        worksheet.mergeCells('12', 'S12');

        // Set the columns' widths
        worksheet.columns.forEach((column) => {
            column.width = 15;
        });

        const blob = await workbook.xlsx.writeBuffer();

        // Create a URL for the Blob and create a temporary anchor element to trigger download
        const url = URL.createObjectURL(new Blob([blob]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "po.xlsx";
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
            <h1>Add New Buying Sheet</h1>
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

                <div className="row">
                    <div className="col">
                    <TextField
                    disabled
                    id="currency"
                    label="Currency"
                    value={"Currency"}
                    fullWidth
                />
                <TextField
                    disabled
                    id="payment-terms"
                    label="Payment Terms"
                    value={"Payment Terms"}
                    fullWidth
                />
                
                    </div>
                    <div className="col">
                    <TextField
                    disabled
                    id="estimated-delivery-dates"
                    label="Estimated Delivery Dates"
                    value={"Estimated Delivery Dates"}
                    fullWidth
                />
                
                 </div>
                </div>

                </div>
                
              
            </div>
            
            <Typography variant="h6">Excel Data:</Typography>
            <pre>{JSON.stringify(excelData, null, 2)}</pre>
            <button onClick={handleDownload}>Download Sample SKU Excel</button>
        </div>
    );
}
