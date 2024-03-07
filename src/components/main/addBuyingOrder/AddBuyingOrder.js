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
import "./ADDBuying.css";
import { ArrowBack, CheckCircleOutline } from "@mui/icons-material";
import Attachment from "../../attachment/Attachment";
import { labelToKey } from "../../../utilities/utils";
import { boFields, currencyList } from "../../../utilities/pofields";
import {
    boSheetDownload,
    getPOBuffer,
} from "../../../utilities/excelUtilities";
import { LoadingButton } from "@mui/lab";

export default function AddBuyingOrder() {
    const params = useParams();
    const vendorCode = params.vendorCode;
    const [vendor, setVendor] = useState(null);
    const [vendors, setVendors] = useState([]);
    const [excelData, setExcelData] = useState([]);
    const [currency, setCurrency] = useState("INR");
    const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");
    const [paymentTerms, setPaymentTerms] = useState("");
    const [buyingAtt, setBuyingAtt] = useState(null);
    const [submit, setSubmit] = useState(false);
    const [poAtt, setPOAtt] = useState(null);
    const [poCode, setPOCode] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [isPOSubmitted, setPOSubmitted] = useState(false);
    const [createdBy, setCreatedBy] = useState(null);
    
    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}vendor/all`)
            .then((response) => response.json())
            .then((res) => {
                setVendors(res.data.vendors);
                setLoading(false);
            })
            .catch((error) => {
                console.error("API error:", error);
                // Handle the error
            });
        if (vendorCode !== "new")
            fetch(`${process.env.REACT_APP_SERVER_URL}vendor/${vendorCode}`)
                .then((response) => response.json())
                .then((res) => {
                    setVendor(res.data.vendor);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("API error:", error);
                    // Handle the error
                });

        const poCodeUrl = `${process.env.REACT_APP_SERVER_URL}buying-order/`;
        fetch(poCodeUrl)
            .then((response) => response.json())
            .then((res) => {
                setPOCode(res.data.poCode);
            });
        return () => {
            // This code will run when the component is unmounted
            // You can perform any cleanup tasks here, such as unsubscribing from subscriptions
            console.log("Component unmounted");
        };
    }, [vendorCode]);

    const updateVendor = async (newVendor) => {
        if (newVendor?.vendorCode)
            fetch(
                `${process.env.REACT_APP_SERVER_URL}vendor/${newVendor.vendorCode}`
            )
                .then((response) => response.json())
                .then((res) => {
                    setVendor(res.data.vendor);
                })
                .catch((error) => {
                    console.error("API error:", error);
                    // Handle the error
                });
        else setVendor(null);
    };

    const updateFile = async (file) => {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file);

        const worksheet = workbook.getWorksheet(1);
        const parsedData = [];
        let labels = [];
        worksheet.eachRow((row, rowIndex) => {
            if (rowIndex === 1) {
                labels = row.values.slice(1); // slice(1) because ExcelJS rows are 1-based and row.values[0] is undefined
            } else {
                let rowData = row.values.slice(1);
                rowData = rowData.map((data) =>
                    typeof data === "object" ? data.text : data
                );
                const skuFieldsData = {};
                rowData.forEach((value, index) => {
                    const key = labelToKey(labels[index], boFields);
                    if (key) skuFieldsData[key] = value;
                });
                parsedData.push(skuFieldsData);
            }
        });

        setExcelData(parsedData);
        setBuyingAtt(file);
    };

    const getPOAtt = async () => {
        if (poAtt) return poAtt;
        const poBuffer = await getPOBuffer(
            excelData,
            vendor,
            poCode,
            currency,
            paymentTerms,
            createdBy,
            estimatedDeliveryDate
        );
        setPOAtt(poBuffer);
        return poBuffer;
    };

    const submitPOForVerification = async (e) => {
        e.preventDefault();
        setSubmit(true);
        if (!buyingAtt) return;
        setSubmitLoading(true);
        const formData = new FormData();
        formData.append("currency", currency);
        if (paymentTerms) formData.append("paymentTerms", paymentTerms);
        if (estimatedDeliveryDate)
            formData.append("estimatedDeliveryDate", estimatedDeliveryDate);
        formData.append("records", JSON.stringify(excelData));
        formData.append("vendorCode", vendor.vendorCode);
        formData.append("createdBy", createdBy);
        const poBuffer = await getPOAtt();
        formData.append("poCode", poCode);
        const blob = new Blob([poBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Convert the Blob to a File
        const excelFile = new File([blob], "po.xlsx", { type: blob.type });
        formData.append("poAttachment", excelFile);

        const response = await fetch(
            `${process.env.REACT_APP_SERVER_URL}buying-order/new`,
            {
                method: "POST",
                body: formData,
            }
        );
        const newBO = await response.json();
        if (newBO.success) {
            setPOSubmitted(true);
        } else {
            alert("Some error occurred. Please contact the tech team");
        }
        setSubmitLoading(false);
    };

    const previewPO = async (e) => {
        e.preventDefault();
        setSubmit(true);
        if (!buyingAtt) return;
        setPreviewLoading(true);
        const poAtt = await getPOAtt();
        // Create a URL for the Blob and create a temporary anchor element to trigger download
        const url = URL.createObjectURL(new Blob([poAtt]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "po.xlsx";
        a.click();

        // Clean up by revoking the Blob URL
        URL.revokeObjectURL(url);
        setPreviewLoading(false);
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
    else if (isPOSubmitted)
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
                        Your PO has been submitted for verification.
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
        <div className="new-pos">
            <Link to="/admin">
                <IconButton edge="start" color="inherit" aria-label="back">
                    <ArrowBack />
                    Back
                </IconButton>
            </Link>
            <form onSubmit={submitPOForVerification}>
                <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                    <Grid item xs={6}>
                        <h1>PO Creation</h1>
                    </Grid>
                    <Grid item xs={6} style={{ margin: "auto" }}>
                        <Attachment
                            label="Download Sample Buying Sheet Excel"
                            downloadFile={boSheetDownload}
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
                            onChange={(e, newValue) => updateVendor(newValue)}
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
                            onChange={(e, newValue) => updateVendor(newValue)}
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
                            value={vendor ? vendor.address.country : ""}
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
                            value={vendor ? vendor.address.state : ""}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={6}>
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
                            size="small"
                            onChange={(e, newValue) => setCurrency(newValue)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="estimated-delivery-dates"
                            label="Estimated Delivery Dates"
                            value={estimatedDeliveryDate}
                            fullWidth
                            size="small"
                            onChange={(e) =>
                                setEstimatedDeliveryDate(e.target.value)
                            }
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="payment-terms"
                            label="Payment Terms"
                            value={paymentTerms}
                            fullWidth
                            size="small"
                            onChange={(e) => setPaymentTerms(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            required
                            id="created-by"
                            label="Your Email"
                            value={createdBy}
                            fullWidth
                            size="small"
                            onChange={(e) => setCreatedBy(e.target.value)}
                            type="email"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Attachment
                            label="Upload Buying Order Sheet"
                            file={buyingAtt}
                            updateFile={(file) => updateFile(file)}
                            required={true}
                            submit={submit}
                            fileType=".xlsx"
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
                                        {boFields.map((tableHead, i) => (
                                            <TableCell key={i}>
                                                {tableHead.label}
                                            </TableCell>
                                        ))}
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
                                                {boFields.map((boField, i) => (
                                                    <TableCell
                                                        style={{
                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                        key={i}
                                                    >
                                                        {row[boField.key]}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    )}
                    <Grid item xs={6}>
                        {previewLoading ? (
                            <LoadingButton
                                variant="contained"
                                color="primary"
                                type="submit"
                                size="small"
                                fullWidth
                                loading
                            >
                                Preview PO
                            </LoadingButton>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                fullWidth
                                onClick={previewPO}
                                type="submit"
                            >
                                Preview PO
                            </Button>
                        )}
                    </Grid>
                    <Grid item xs={6}>
                        {submitLoading ? (
                            <LoadingButton
                                variant="contained"
                                color="primary"
                                type="submit"
                                size="small"
                                fullWidth
                                loading
                            >
                                Submit
                            </LoadingButton>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                size="small"
                                fullWidth
                            >
                                Send PO For Verification
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}
