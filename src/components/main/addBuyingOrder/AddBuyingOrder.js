import { useParams } from "react-router-dom";
import ExcelJS from "exceljs";
import {
    Autocomplete,
    Button,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import "./ADDBuying.css";

export default function AddBuyingOrder() {
    const params = useParams();
    const vendorCode = params.vendorCode;
    const [excelData, setExcelData] = useState([]);
    const [currency, setCurrency] = useState("INR");
    const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");
    const [paymentTerms, setPaymentTerms] = useState("");
    const [buyingSheet, setBuyingSheet] = useState(null);
    const currencyList = ["INR", "USD", "AED", "SAR", "TAKA"];

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
            ["SKU*", "expected_qty*", "unit_cost*", "GST_%*"],
            // Add more data here
        ];

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Buying Sheet");

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
        a.download = "newBuyingSheet.xlsx";
        a.click();

        // Clean up by revoking the Blob URL
        URL.revokeObjectURL(url);
    };

    const downloadPO = async (e) => {
        e.preventDefault();
        const buyingExcel = new ExcelJS.Workbook();
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        await buyingExcel.xlsx.load(buyingSheet);

        const buyingOrderSheet = buyingExcel.getWorksheet(1);
        const parsedData = [];

        buyingOrderSheet.eachRow((row) => {
            parsedData.push(row.values);
        });

        console.log(parsedData);

        const records = [];
        const buyingRecordsKey = ["skuCode", "expectedQty", "unitCost", "gst"];
        const formData = new FormData();
        for (let i = 1; i < parsedData.length; i++) {
            const row = parsedData[i].slice(1);
            console.log("row", i, row);
            // Do something with the form data, like sending it to a server
            const record = {};

            for (let i = 0; i < row.length; i++) {
                const value = row[i];
                if (value) record[buyingRecordsKey[i]] = value;
            }
            records.push(record);
        }
        formData.append("currency", currency);
        if (paymentTerms) formData.append("paymentTerms", paymentTerms);
        if (estimatedDeliveryDate)
            formData.append("estimatedDeliveryDate", estimatedDeliveryDate);
        formData.append("records", JSON.stringify(records));
        formData.append("vendorCode", vendorCode);

        // Data is valid, make an API request to send the data
        // Example using fetch API
        for (var key of formData.entries()) {
            console.log(key[0] + ", " + key[1]);
        }
        fetch(`${process.env.REACT_APP_SERVER_URL}buying-order/new`, {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("API response:", data);
                // Handle the response as needed
            })
            .catch((error) => {
                console.error("API error:", error);
                // Handle the error
            });
        setExcelData(parsedData);
        // Create a new workbook
        const poWorkbook = new ExcelJS.Workbook();
        const poSheet = poWorkbook.addWorksheet("Order Details");

        // Define the data
        const data = [
            [],
            ["", "Ansan Technologies Pvt Ltd"],
            ["", "Partner Name :", "", "XYZ", "", "", "", "BU :", "Pluugin"],
            [
                "",
                "Partner Code :",
                "",
                "PEXYZ",
                "",
                "",
                "",
                "P.O No :",
                "PE123",
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
                "E-Commerce",
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
                currency,
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
                formattedDate,
            ],
            [
                "",
                "Payment Terms :",
                "",
                paymentTerms,
                "",
                "",
                "",
                "Buyer :",
                "XYZ - Email",
            ],
            ["", "GST No:", "", "XYZ", "", "", "", "GST No:", "XYZ"],
            [
                "",
                "State Name and Code:",
                "",
                "XYZ",
                "",
                "",
                "",
                "State Name and Code:",
                "XYZ",
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
                "Noida, FC – 2 & 4, Film City, Sector 16A, Noida, Uttar Pradesh 201301",
                "",
                "",
                "",
                "",
                "Ship To :",
                "Noida, FC – 2 & 4, Film City, Sector 16A, Noida, Uttar Pradesh 201301",
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
        ];

        for (let i = 0; i < records.length; i++) {
            data.splice(13 + i, 0, [
                "", 
                i + 1,
                records[i].skuCode,
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                records[i].expectedQty,
                records[i].unitCost,
                "",
                "",
                "",
                "",
                "",
                "",
                records[i].expectedQty*records[i].unitCost
            ]);
        }

        // Add data to the worksheet
        data.forEach((row) => {
            poSheet.addRow(row);
        });

        poSheet.mergeCells("B2", "S2");

        poSheet.mergeCells("B3", "C3");
        poSheet.mergeCells("B4", "C4");
        poSheet.mergeCells("B5", "C5");
        poSheet.mergeCells("B6", "C6");
        poSheet.mergeCells("B7", "C7");
        poSheet.mergeCells("B8", "C8");
        poSheet.mergeCells("B9", "C9");
        poSheet.mergeCells("B10", "C10");
        poSheet.mergeCells("B11", "C11");

        poSheet.mergeCells("D4", "G4");
        poSheet.mergeCells("D3", "G3");
        poSheet.mergeCells("D5", "G5");
        poSheet.mergeCells("D6", "G6");
        poSheet.mergeCells("D7", "G7");
        poSheet.mergeCells("D8", "G8");
        poSheet.mergeCells("D9", "G9");
        poSheet.mergeCells("D10", "G10");
        poSheet.mergeCells("D11", "G11");
        poSheet.mergeCells("C12", "G12");

        poSheet.mergeCells("I3", "S3");
        poSheet.mergeCells("I4", "S4");
        poSheet.mergeCells("I5", "S5");
        poSheet.mergeCells("I6", "S6");
        poSheet.mergeCells("I7", "S7");
        poSheet.mergeCells("I8", "S8");
        poSheet.mergeCells("I9", "S9");
        poSheet.mergeCells("I10", "S10");
        poSheet.mergeCells("I11", "S11");
        poSheet.mergeCells("12", "S12");

        // Set the columns' widths
        poSheet.columns.forEach((column) => {
            column.width = 15;
        });

        const blob = await poWorkbook.xlsx.writeBuffer();

        // Create a URL for the Blob and create a temporary anchor element to trigger download
        const url = URL.createObjectURL(new Blob([blob]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "po.xlsx";
        a.click();

        // Clean up by revoking the Blob URL
        URL.revokeObjectURL(url);
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
                        <button
                            className="download-button"
                            onClick={handleDownload}
                        >
                            Download Sample Buying Sheet Excel
                        </button>
                    </div>
                </div>
                <div className="excel-section">
                    <h2>Upload Buying Sheet Details</h2>

                    <Stack component="form" onSubmit={downloadPO}>
                        <div className="row">
                            <div className="col">
                                <Autocomplete
                                    required
                                    disablePortal
                                    id="currency"
                                    options={currencyList}
                                    renderInput={(params) => (
                                        <TextField
                                            required
                                            {...params}
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: "new-password",
                                                style: { width: "auto" },
                                            }}
                                            label="Currency"
                                        />
                                    )}
                                    value={currency}
                                    onChange={(e, newValue) =>
                                        setCurrency(newValue)
                                    }
                                />
                                <TextField
                                    id="payment-terms"
                                    label="Payment Terms"
                                    value={paymentTerms}
                                    fullWidth
                                    onChange={(e) =>
                                        setPaymentTerms(e.target.value)
                                    }
                                />
                            </div>
                            <div className="col">
                                <TextField
                                    id="estimated-delivery-dates"
                                    label="Estimated Delivery Dates"
                                    value={estimatedDeliveryDate}
                                    fullWidth
                                    onChange={(e) =>
                                        setEstimatedDeliveryDate(e.target.value)
                                    }
                                />
                                <TextField
                                    required
                                    id="buying-sheet"
                                    type="file"
                                    label="Buying Sheet"
                                    className="file-first file-input"
                                    fullWidth
                                    onChange={(e) =>
                                        setBuyingSheet(e.target.files[0])
                                    }
                                />
                            </div>
                        </div>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            Download Purchase Order Excel
                        </Button>
                    </Stack>
                </div>
            </div>

            <Typography variant="h6">Excel Data:</Typography>
            <pre>{JSON.stringify(excelData, null, 2)}</pre>
        </div>
    );
}
