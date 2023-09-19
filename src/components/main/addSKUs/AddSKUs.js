import { Link, useParams } from "react-router-dom";
import ExcelJS from "exceljs";
import { Autocomplete, Button, Container, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import "./AddSku.css";
import { ArrowBack, CheckCircleOutline } from "@mui/icons-material";
import Attachment from "../../attachment/Attachment";

export default function AddSKUs() {
    const params = useParams();
    const vendorCode = params.vendorCode;
    const [excelData, setExcelData] = useState([]);
    const [skuAtt, setSKUAtt] = useState(null);
    const [submit, setSubmit] = useState(false)
    const [vendors, setVendors] = useState([]);
    const [vendor, setVendor] = useState(null);
    const [success, setSuccess] = useState(false);
    const [createdBy, setCreatedBy] = useState("");

    //ComponentDidMount
    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}vendor/all`)
            .then((response) => response.json())
            .then((res) => {
                let vendor = res.data.vendors.find(vendor => vendor.vendorCode == vendorCode)
                if (vendor)
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

    const updateFile = async (file) => {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file);

        const worksheet = workbook.getWorksheet(1);
        const parsedData = [];

        worksheet.eachRow((row) => {
            parsedData.push(row.values);
        });

        setExcelData(parsedData)
        setSKUAtt(file)
    }

    const handleFileChange = async (e) => {
        e.preventDefault();
        setSubmit(true)
        if (!skuAtt)
            return
        const parsedData = excelData

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
        let successRows = 0
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
            formData.append("createdBy", createdBy);

            // Data is valid, make an API request to send the data
            // Example using fetch API
            for (var key of formData.entries()) {
                console.log(key[0] + ", " + key[1]);
            }
            const skuUrl = `${process.env.REACT_APP_SERVER_URL}sku/new`
            const skuResp = await fetch(skuUrl, {
                method: "POST",
                body: formData,
            })
            const skuData = await skuResp.json()
            if(skuData.success)
            successRows++;
        }
        if(successRows == (parsedData.length-1)){
            const mailFormData = new FormData();
            mailFormData.append("vendorCode", vendor.vendorCode)
            const sendMailSkuURL = `${process.env.REACT_APP_SERVER_URL}sku/send-verify-mail`
            const mailSKUResp = await fetch(sendMailSkuURL, {
                method: "POST",
                body: mailFormData,
            })
            const mailData = await mailSKUResp.json()
            if(mailData.success)
            setSuccess(true)
        }
    };
    if (success)
        return (
            <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
                <Paper
                    elevation={3}
                    style={{ padding: "2rem", textAlign: "center" }}
                >
                    <CheckCircleOutline
                        sx={{ fontSize: 100, color: "green" }}
                    />
                    <Typography variant="h4" gutterBottom>
                        Submission Successful
                    </Typography>
                    <Typography variant="body1">
                        Your SKUs have been submitted for review. It will be added once verified.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "1rem" }}
                        onClick={() => window.location.reload()}
                    >
                        Go Back
                    </Button>
                </Paper>
            </Container>
        );

    return (
        <div className="new-skus">
            <Link to="/admin">
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="back"
                // onClick={() => handleBack()}
                >
                    <ArrowBack />Back
                </IconButton>
            </Link>
            <form onSubmit={handleFileChange}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <h1>Add New SKUs</h1>
                    </Grid>
                    <Grid item xs={6} style={{ margin: "auto" }}>
                        <Attachment
                            label="Download Sample SKU Excel"
                            downloadFile={handleDownload}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <h2>Vendor Details</h2>
                    </Grid>
                    <Grid item xs={6}>
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
                            size="small"
                            value={vendor}
                            onChange={(e, newValue) => setVendor(newValue)}
                        />
                    </Grid>
                    <Grid item xs={6}>
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
                            size="small"
                            value={vendor}
                            onChange={(e, newValue) => setVendor(newValue)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="product-category"
                            label="Product Category"
                            value={vendor ? vendor.productCategory : ""}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="country"
                            label="Country"
                            value={vendor ? vendor.country : ""}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="state"
                            label="State"
                            value={vendor ? vendor.state : ""}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Attachment
                            label="Upload SKU Sheet"
                            file={skuAtt}
                            updateFile={(file) => updateFile(file)}
                            required={true}
                            submit={submit}
                            fileType=".xlsx"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="created-by"
                            label="Created By"
                            value={createdBy}
                            onChange={(e) => setCreatedBy(e.target.value)}
                            required
                            type="email"
                            fullWidth
                            size="small"
                        />
                    </Grid>
                    {excelData.length > 0 && <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table style={{ tableLayout: 'auto' }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        {excelData[0].slice(1).map((tableHead, i) => <TableCell key={i}>{tableHead}</TableCell>)}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {excelData.slice(1).map((row, i) => (
                                        <TableRow
                                            key={i}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            {row.map((value, i) => <TableCell style={{ whiteSpace: "nowrap" }} key={i}>{value}</TableCell>)}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>}
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit" fullWidth size="small">
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}
