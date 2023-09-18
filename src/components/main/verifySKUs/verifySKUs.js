import { Link, useParams } from "react-router-dom";
import ExcelJS from "exceljs";
import { Autocomplete, Box, Button, Checkbox, CircularProgress, Container, Divider, FormControlLabel, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ArrowBack, CheckCircleOutline } from "@mui/icons-material";
import Attachment from "../../attachment/Attachment";
import jwtDecode from "jwt-decode";

export default function VerifySKUs() {
    const params = useParams();
    const [vendorCode, setVendorCode] = useState("");
    const [skus, setSkus] = useState([])
    const [vendor, setVendor] = useState(null);
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [denyOpen, setDenyOpen] = useState(false);
    const [denyReason, setDenyReason] = useState("");
    const [loading, setLoading] = useState(true)
    const [isReviewDone, setReviewDone] = useState(false)

    //ComponentDidMount
    useEffect(() => {
        const validateToken = params.validateToken;
        let vendorCode = params.vendorCode;
        const decodedToken = jwtDecode(validateToken);
        vendorCode = decodedToken.vendorCode
        fetch(`${process.env.REACT_APP_SERVER_URL}sku/unverified/${vendorCode}`)
            .then((response) => response.json())
            .then((res) => {
                console.log(res.data.skus)
                setSkus(res.data.skus);
                setVendorCode(vendorCode)
                setLoading(false)
            })
            .catch((error) => {
                console.error("API error:", error);
                // Handle the error
            });
        fetch(`${process.env.REACT_APP_SERVER_URL}vendor/${vendorCode}`)
            .then((response) => response.json())
            .then((res) => {
                setVendor(res.data.vendor)
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

    const validateNewSKUs = async (e, isRecordValid) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData();
        formData.append("vendorCode", vendorCode);
        formData.append("isValid", isRecordValid);
        if (!isRecordValid)
            formData.append("reason", denyReason);

        const validateSKUUrl = `${process.env.REACT_APP_SERVER_URL}sku/review`
        const validationResponse = await fetch(validateSKUUrl, {
            method: "POST",
            body: formData
        });
        const skuJSON = await validationResponse.json();
        if (skuJSON.success) {
            setReviewDone(true)
            setLoading(false)
        }
    }
    
    if (loading)
        return (
            <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
                <Paper elevation={3} style={{ padding: "2rem", textAlign: "center" }}>
                    <CircularProgress />
                    <Typography variant="h4" gutterBottom>
                        Loading...
                    </Typography>
                </Paper>
            </Container>
        );
    else if (isReviewDone)
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
                        Your skus has been verified. You can start adding Po with the skus.
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
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12}>
                    <h1>Review SKUs</h1>
                </Grid>
                <Grid item xs={12}>
                    <h2>Vendor Details</h2>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="vendor-code"
                        label="Vendor Code"
                        value={vendorCode}
                        InputProps={{
                            readOnly: true,
                        }}
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="company-name"
                        label="Company Name"
                        value={vendor ? vendor.companyName : ""}
                        InputProps={{
                            readOnly: true,
                        }}
                        fullWidth
                        size="small"
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
                {skus.length > 0 && <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table style={{ tableLayout: 'auto' }} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    {Object.keys(skus[0]).map((tableHead, i) => <TableCell key={i}>{tableHead}</TableCell>)}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {skus.map((row, i) => (
                                    <TableRow
                                        key={i}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        {Object.values(row).map((value, i) => <TableCell style={{ whiteSpace: "nowrap" }} key={i}>{value}</TableCell>)}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>}
            </Grid>
            <Divider />
            {params.validateToken &&
                <>
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                onChange={(e) => setCheckboxChecked(e.target.checked)}
                            />
                        }
                        label="I confirm that I have reviewed and verified all the skus details."
                    />
                    {checkboxChecked && (
                        <Box mt={5} display="flex" justifyContent="center">
                            <Box mx={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="small"
                                    style={{ borderRadius: '50px', fontSize: '18px', fontWeight: '600', textTransform: 'none' }}
                                    onClick={(e) => validateNewSKUs(e, true)}
                                >
                                    Approve
                                </Button>
                            </Box>
                            <Box mx={2}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    fullWidth
                                    size="small"
                                    onClick={() => setDenyOpen(true)}
                                    style={{ borderRadius: '50px', fontSize: '18px', fontWeight: '600', textTransform: 'none' }}
                                >
                                    Reject
                                </Button>
                            </Box>
                        </Box>
                    )}
                    {denyOpen && checkboxChecked && (
                        <Box mt={5} display="flex" justifyContent="center">
                            <Box mx={2} width="75%">
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="deny-reason"
                                    label="Denial Reason"
                                    type="text"
                                    fullWidth
                                    size="small"
                                    multiline // Added multiline property
                                    rows={4} // Added rows property
                                    value={denyReason}
                                    onChange={(e) => setDenyReason(e.target.value)}
                                    style={{ borderRadius: '50px', fontSize: '18px', fontWeight: '600' }}
                                />
                            </Box>
                            <Box mx={2} display="flex" justifyContent="center" alignItems="center">
                                <Button
                                    onClick={(e) => validateNewSKUs(e, false)}
                                    color="primary"
                                    fullWidth
                                    size="small"
                                    style={{ borderRadius: '50px', fontSize: '18px', fontWeight: '600', textTransform: 'none', width: '200px' }}
                                >
                                    Submit
                                </Button>
                            </Box>
                        </Box>
                    )}
                </>
            }
        </div>
    );
}
