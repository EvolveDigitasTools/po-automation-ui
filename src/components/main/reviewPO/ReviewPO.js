import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, CircularProgress, Container, Divider, FormControlLabel, Grid, Paper, TextField, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { binaryStringToBlob, getMimeTypeFromFileName } from '../../../util';
import Handsontable from 'handsontable';
import Attachment from '../../attachment/Attachment';

export default function ReviewPO() {
    const params = useParams();
    const [loading, setLoading] = useState(true)
    const [poCode, setPoCode] = useState('')
    const [denyReason, setDenyReason] = useState("");
    const [isReviewDone, setReviewDone] = useState(false)
    const [denyOpen, setDenyOpen] = useState(false);
    const [buyingOrder, setBuyingOrder] = useState(null);
    const [vendor, setVendor] = useState(null);
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [poFile, setPoFile] = useState(null);


    useEffect(() => {
        const validateToken = params.validateToken;
        const decodedToken = jwtDecode(validateToken);
        const poCode = decodedToken.vendorCode
        fetch(`${process.env.REACT_APP_SERVER_URL}buying-order/${poCode}`)
            .then((response) => response.json())
            .then((res) => {
                console.log(res)
                const fileDetailsUrl = `${process.env.REACT_APP_SERVER_URL}file/${'buyingOrderId'}/${res.data.buyingOrder.id}`
                fetch(fileDetailsUrl)
                    .then(res => res.json())
                    .then(data => {
                        let file = data.data.file
                        let nFile = new File([binaryStringToBlob(file.fileContent, getMimeTypeFromFileName(file.fileName))], file.fileName, { type: getMimeTypeFromFileName(file.fileName) });
                        setPoFile(nFile);
                    })
                setBuyingOrder(res.data.buyingOrder)
                setVendor(res.data.buyingOrder.vendor)
            })
            .catch((error) => {
                console.error("API error:", error);
                // Handle the error
            });
        setPoCode(poCode)
        setLoading(false);
        return () => {
        };
    }, []);

    const validateNewPO = async (e, isRecordValid) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData();
        formData.append("poCode", poCode);
        formData.append("isValid", isRecordValid);
        if (!isRecordValid)
            formData.append("reason", denyReason);

        const validateSKUUrl = `${process.env.REACT_APP_SERVER_URL}buying-order/review`
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

    const downloadFile = async (e) => {
        e.preventDefault()
        const url = URL.createObjectURL(poFile);
        const a = document.createElement("a");
        a.href = url;
        a.download = poFile.name;
        a.click();
        URL.revokeObjectURL(url);
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

    return (
        <div style={{ padding: "40px" }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12}>
                    <h1>Review PO</h1>
                </Grid>
                <Grid item xs={12}>
                    <h2>Vendor Details</h2>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="vendor-code"
                        label="Vendor Code"
                        value={vendor ? vendor.vendorCode : ""}
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
                <Grid item xs={6}>
                    <TextField
                        id="currency"
                        label="Currency"
                        value={buyingOrder ? buyingOrder.currency : ""}
                        InputProps={{
                            readOnly: true,
                        }}
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="estimated-delivery-dates"
                        label="Estimated Delivery Dates"
                        value={buyingOrder ? buyingOrder.estimatedDeliveryDate : ""}
                        InputProps={{
                            readOnly: true,
                        }}
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="payment-terms"
                        label="Payment Terms"
                        value={buyingOrder ? buyingOrder.paymentTerms : ""}
                        InputProps={{
                            readOnly: true,
                        }}
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="created-by"
                        label="PO Created By"
                        value={buyingOrder ? buyingOrder.createdBy : ""}
                        InputProps={{
                            readOnly: true,
                        }}
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid item xs={6}>
                    <Attachment
                        label="Preview PO"
                        file={poFile}
                        fileType=".xlsx"
                        downloadFile={downloadFile}
                    />
                </Grid>

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
                        label="I confirm that I have reviewed and verified all the po details."
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
                                    onClick={(e) => validateNewPO(e, true)}
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
                                    onClick={(e) => validateNewPO(e, false)}
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
};
