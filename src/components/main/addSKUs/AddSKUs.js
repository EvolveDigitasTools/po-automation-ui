import { Link, useParams } from "react-router-dom";
import ExcelJS from "exceljs";
import {
    Autocomplete,
    Button,
    CircularProgress,
    Container,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import "./AddSku.css";
import { ArrowBack, CheckCircleOutline } from "@mui/icons-material";
import Attachment from "../../attachment/Attachment";
import { skuSheetDownload } from "../../../utilities/excelUtilities";
import { convertToNumber, labelToKey } from "../../../utilities/utils";
import { skuFields } from "../../../utilities/pofields";
import { LoadingButton } from "@mui/lab";

export default function AddSKUs() {
    const params = useParams();
    const vendorCode = params.vendorCode;
    const [excelData, setExcelData] = useState([]);
    const [skuAtt, setSKUAtt] = useState(null);
    const [submit, setSubmit] = useState(false);
    const [vendors, setVendors] = useState([]);
    const [vendor, setVendor] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [createdBy, setCreatedBy] = useState("");

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/vendor/all`)
            .then((response) => response.json())
            .then((res) => {
                let vendor = res.data.vendors.find(
                    (vendor) => vendor.vendorCode === vendorCode
                );
                if (vendor) setVendor(vendor);
                setVendors(res.data.vendors);
                setLoading(false);
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
    }, [vendorCode]);

    const updateFile = async (file) => {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file);

        const worksheet = workbook.getWorksheet(1);
        const parsedData = [];
        let labels = [];
        worksheet.eachRow((row, rowIndex) => {
            if (rowIndex === 1) {
                labels = skuFields.map((field) => field.label);
            } else {
                let rowData = row.values.slice(1);
                rowData = rowData.map((data) =>
                    typeof data === "object" ? data.text : data
                );
                const skuFieldsData = {};
                rowData.forEach((value, index) => {
                    const key = labelToKey(labels[index], skuFields);
                    if (key) skuFieldsData[key] = value;
                });
                parsedData.push(skuFieldsData);
            }
        });
        if(isSKUDataValid(parsedData)){
            setExcelData(parsedData);
            setSKUAtt(file);
        }
        else {
            setExcelData([]);
            setSKUAtt(null);
        }
    };

    const isSKUDataValid = (data) => {
        let isValid = true, message = "";
        data.forEach((row) => {
            skuFields.forEach((field) => {
                if (field.required && !row[field.key]) {
                    isValid = false;
                    message = `Field ${field.label} is required`;
                    console.log(message, `Field ${field.label} is required`);
                }
                if(field.type === "number" && row[field.key] && isNaN(convertToNumber(row[field.key]))) {
                    isValid = false;
                    message = `Field ${field.label} should be a number`;
                    console.log(message, `Field ${field.label} should be a number`);
                }
                if(field.key === "ean")
                console.log(row[field.key], field.key, field.label, isNaN(parseInt(row[field.key])));
            });
        });
        if(!isValid)
        alert(message);
        return isValid;
    };

    const addSKUs = async (e) => {
        e.preventDefault();
        setSubmit(true);
        if (!skuAtt) return;
        setSubmitLoading(true);
        const formData = new FormData();
        // console.log(JSON.parse(JSON.stringify(excelData)))
        formData.append("createdBy", createdBy);
        formData.append("skus", JSON.stringify(excelData));
        const skuUrl = `${process.env.REACT_APP_SERVER_URL}/sku/new/${vendor.vendorCode}`;
        const skuResp = await fetch(skuUrl, {
            method: "POST",
            body: formData,
        });
        const skuData = await skuResp.json();
        if (skuData.success) {
            setSuccess(true);
            setSubmitLoading(false);
        } else {
            setSubmitLoading(false)
            alert("Some problem occured. Please check your sku sheet or contact tech team")
        }
    };
    if (loading)
        return (
            <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
                <Paper
                    elevation={3}
                    style={{ padding: "2rem", textAlign: "center" }}
                >
                    <CircularProgress />
                    <Typography variant="h4" gutterBottom>
                        Loading...
                    </Typography>
                </Paper>
            </Container>
        );
    else if (success)
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
                        Your SKUs have been submitted for review. It will be
                        added once verified.
                    </Typography>
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
                    <ArrowBack />
                    Back
                </IconButton>
            </Link>
            <form onSubmit={addSKUs}>
                <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                    <Grid item xs={6}>
                        <h1>Add New SKUs</h1>
                    </Grid>
                    <Grid item xs={6} style={{ margin: "auto" }}>
                        <Attachment
                            label="Download Sample SKU Excel"
                            downloadFile={skuSheetDownload}
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
                    {excelData.length > 0 && (
                        <Grid item xs={12}>
                            <TableContainer component={Paper}>
                                <Table
                                    style={{ tableLayout: "auto" }}
                                    size="small"
                                    aria-label="a dense table"
                                >
                                    <TableHead>
                                        <TableRow>
                                            {skuFields.map((tableHead, i) => (
                                                <TableCell key={i}>
                                                    {tableHead.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {excelData.map((row, i) => (
                                            <TableRow
                                                key={i}
                                                sx={{
                                                    "&:last-child td, &:last-child th":
                                                        { border: 0 },
                                                }}
                                            >
                                                {skuFields.map(
                                                    (skuField, i) => (
                                                        <TableCell
                                                            style={{
                                                                whiteSpace:
                                                                    "nowrap",
                                                            }}
                                                            key={i}
                                                        >
                                                            {row[skuField.key]}
                                                        </TableCell>
                                                    )
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        {submitLoading ? (
                            <LoadingButton
                                variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                                loading
                                size="small"
                            >
                                Submit
                            </LoadingButton>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                                size="small"
                            >
                                Submit
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}
