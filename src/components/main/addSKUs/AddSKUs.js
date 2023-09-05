import { useParams } from "react-router-dom";
import ExcelJS from "exceljs";
import { Autocomplete, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import "./AddSku.css";

export default function AddSKUs() {
    const params = useParams();
    const vendorCode = params.vendorCode;
    const [excelData, setExcelData] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [vendor, setVendor] = useState(null);

    //ComponentDidMount
    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}vendor/all`)
            .then((response) => response.json())
            .then((res) => {
                let vendor = res.data.vendors.find(vendor => vendor.vendorCode == vendorCode)
                if(vendor)
                setVendor(vendor)
                setVendors(res.data.vendors);
            })
            .catch((error) => {
                console.error("API error:", error);
                // Handle the error
            });
        return () => {
            // This code will run when the component is unmounted
            // You can perform any cleanup tasks here, such as unsubscribing from subscriptions
            console.log("Component unmounted");
        };
    }, []);

    const updateVendor = async (field, fieldValue) => {
        console.log(field, fieldValue)
        setVendor(fieldValue)
    }

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

        const keys = [
            "skuCode",
            "category",
            "brand",
            "productTitle",
            "hsn",
            "ean",
            "modelNumber",
            "size",
            "colorFamilyColor",
            "productLengthCm",
            "productBreadthCm",
            "productHeightCm",
            "productWeightKg",
            "masterCartonQty",
            "masterCartonLengthCm",
            "masterCartonBreadthCm",
            "masterCartonHeightCm",
            "masterCartonWeightKg",
            "MRP",
            "vendorCode",
        ];
        for (let i = 1; i < parsedData.length; i++) {
            const row = parsedData[i].slice(1);
            console.log("row", i, row);
            // Do something with the form data, like sending it to a server
            const formData = new FormData();

            for (let i = 0; i < row.length; i++) {
                const value = row[i];
                if (value) formData.append(keys[i], value);
            }
            formData.append("vendorCode", vendor.vendorCode);

            // Data is valid, make an API request to send the data
            // Example using fetch API
            for (var key of formData.entries()) {
                console.log(key[0] + ", " + key[1]);
            }
            fetch(`${process.env.REACT_APP_SERVER_URL}sku/new`, {
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
        }
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
                        <Autocomplete
                            required
                            disablePortal
                            id="vendor-code"
                            options={vendors}
                            getOptionLabel={(option) => option.vendorCode}
                            renderInput={(params) => (
                                <TextField
                                    required
                                    {...params}
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: "new-password",
                                        style: { width: "auto" },
                                    }}
                                    label="Vendor Code"
                                />
                            )}
                            value={vendor}
                            onChange={(e, newValue) => setVendor(newValue)}
                        />
                        <Autocomplete
                            required
                            disablePortal
                            id="company-name"
                            options={vendors}
                            getOptionLabel={(option) => option.companyName}
                            renderInput={(params) => (
                                <TextField
                                    required
                                    {...params}
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: "new-password",
                                        style: { width: "auto" },
                                    }}
                                    label="Company Name"
                                />
                            )}
                            value={vendor}
                            onChange={(e, newValue) => setVendor(newValue)}
                        />
                        <TextField
                            id="state"
                            label="State"
                            value={vendor ? vendor.state : ""}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                        />
                    </div>
                    <div className="col">
                        <TextField
                            id="country"
                            label="Country"
                            value={vendor ? vendor.country : ""}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                        />
                        <TextField
                            id="product-category"
                            label="Product Category"
                            value={vendor ? vendor.productCategory : ""}
                            InputProps={{
                                readOnly: true,
                            }}
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
