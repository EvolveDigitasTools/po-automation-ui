import React, { useEffect, useState } from "react";
import {
    TextField,
    Box,
    Button,
    Stack,
    FormControlLabel,
    Checkbox,
    Container,
    Divider,
    Paper,
    CircularProgress,
    Typography,
    Grid,
    IconButton,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
} from "@mui/material";
import "./VendorDetails.css";
import { Link, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { ArrowBack, CheckCircleOutline } from "@mui/icons-material";
import Attachment from "../../attachment/Attachment";
import { getFile } from "../../../utilities/utils";

export default function VendorDetails() {
    const [title, setTitle] = useState("");
    const [vendorCode, setVendorCode] = useState("");
    const [loading, setLoading] = useState(true);
    const [isReviewDone, setReviewDone] = useState(false);

    const [companyName, setCompanyName] = useState("");
    const [contactPersonName, setContactPersonName] = useState("");
    const [contactPersonEmail, setContactPersonEmail] = useState("");
    const [contactPersonPhone, setContactPersonPhone] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [gst, setGst] = useState("");
    const [gstAttachment, setGstAttachment] = useState(null);
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState(null);
    const [postalCode, setPostalCode] = useState("");
    const [beneficiary, setBeneficiary] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [ifsc, setIfsc] = useState("");
    const [bankName, setBankName] = useState("");
    const [branch, setBranch] = useState("");
    const [bankAttachment, setBankAttachment] = useState(null);
    const [coi, setCoi] = useState("");
    const [coiAttachment, setCoiAttachment] = useState(null);
    const [msme, setMsme] = useState("");
    const [msmeAttachment, setMsmeAttachment] = useState(null);
    const [tradeMark, setTradeMark] = useState("");
    const [tradeAttachment, setTradeAttachment] = useState(null);
    const [agreementAttachment, setAgreementAttachment] = useState(null);
    const [dynamicFields, setDynamicFields] = useState([]);
    const [dynamicFieldsAttachments, setDynamicFieldsAttachments] = useState(
        []
    );
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [denyOpen, setDenyOpen] = useState(false);
    const [denyReason, setDenyReason] = useState("");
    const [vendor, setVendor] = useState(null);

    const params = useParams();

    //ComponentDidMount
    useEffect(() => {
        const checkAndUseValidationToken = async () => {
            const validateToken = params.validateToken;
            let vendorCode = params.vendorCode;
            if (!vendorCode && validateToken) {
                const decodedToken = jwtDecode(validateToken);
                vendorCode = decodedToken.vendorCode;
            }

            if (vendorCode) {
                const getVendorDetailsUrl = `${process.env.REACT_APP_SERVER_URL}vendor/${vendorCode}`;
                const vendorResponse = await fetch(getVendorDetailsUrl);
                const vendorJson = await vendorResponse.json();
                const vendorDetails = vendorJson.data.vendor;
                const gstAtt = await getFile(
                    "gstAttVendorId",
                    vendorDetails.id
                );
                const proofAtt = await getFile(
                    "vendorBankId",
                    vendorDetails.vendorBank.id
                );
                const agreementAtt = await getFile(
                    "agreementAttVendorId",
                    vendorDetails.id
                );
                const {
                    isVerified,
                    companyName,
                    productCategory,
                    contactPerson,
                    gst,
                    address,
                    vendorBank,
                    msme,
                    coi,
                    tradeMark,
                    otherFields,
                } = vendorDetails;
                if (isVerified && params.validateToken) setReviewDone(true);
                else {
                    setTitle("Verify Vendor Details");
                    setCompanyName(companyName);
                    setProductCategory(productCategory);
                    setContactPersonName(contactPerson.name);
                    setContactPersonEmail(contactPerson.email);
                    setContactPersonPhone(contactPerson.phoneNumber);
                    setGst(gst);
                    setGstAttachment(gstAtt);
                    setAddressLine1(address.addressLine1);
                    if (address.addressLine2)
                        setAddressLine2(address.addressLine2);
                    setCountry(address.country);
                    setState(address.state);
                    setCity(address.city);
                    setPostalCode(address.postalCode);
                    setBeneficiary(vendorBank.beneficiaryName);
                    setBankName(vendorBank.bankName);
                    setAccountNumber(vendorBank.accountNumber);
                    setBranch(vendorBank.branch);
                    setIfsc(vendorBank.ifsc);
                    setBankAttachment(proofAtt);
                    setAgreementAttachment(agreementAtt);
                    if (msme) setMsme(msme);
                    let msmeAtt = await getFile(
                        "msmeAttVendorId",
                        vendorDetails.id
                    );
                    setMsmeAttachment(msmeAtt);
                    if (coi) setCoi(coi);
                    let coiAtt = await getFile(
                        "coiAttVendorId",
                        vendorDetails.id
                    );
                    setCoiAttachment(coiAtt);
                    if (tradeMark) setTradeMark(tradeMark);
                    let tradeMarkAtt = await getFile(
                        "tradeMarkAttVendorId",
                        vendorDetails.id
                    );
                    setTradeAttachment(tradeMarkAtt);
                    if (otherFields && otherFields.length > 0) {
                        let dynamicFieldsAttachs = [];
                        for (let i = 0; i < otherFields.length; i++) {
                            const otherField = otherFields[i];
                            let otherAttach = await getFile(
                                "vendorOtherId",
                                otherField.id
                            );
                            dynamicFieldsAttachs.push(otherAttach);
                        }
                        setDynamicFieldsAttachments(dynamicFieldsAttachs);
                        setDynamicFields(
                            otherFields.map((otherField) => {
                                return {
                                    key: otherField.otherKey,
                                    value: otherField.otherValue,
                                };
                            })
                        );
                    }
                    setVendor(vendorDetails);
                }
                setVendorCode(vendorCode);
            }
            setLoading(false);
        };

        checkAndUseValidationToken();

        return () => {
            // This code will run when the component is unmounted
            // You can perform any cleanup tasks here, such as unsubscribing from subscriptions
        };
    }, [params]);

    const validateNewVendor = async (e, isRecordValid) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("vendorCode", vendorCode);
        formData.append("isValid", isRecordValid);
        if (!isRecordValid) formData.append("reason", denyReason);

        const validateVendorUrl = `${process.env.REACT_APP_SERVER_URL}vendor/validate`;
        const validationResponse = await fetch(validateVendorUrl, {
            method: "POST",
            body: formData,
        });
        const vendorJson = await validationResponse.json();
        if (vendorJson.success) {
            setReviewDone(true);
            setLoading(false);
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
                        Your review is done. Details are mailed to creator of
                        vendor
                    </Typography>
                </Paper>
            </Container>
        );
    else
        return (
            <div className="vendor-main-container">
                {params.vendorCode && (
                    <Link to="/admin">
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="back"
                        >
                            <ArrowBack />
                            Back
                        </IconButton>
                    </Link>
                )}
                <h1>{title}</h1>
                <Stack component="form">
                    <Grid
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                        <Grid item xs={12}>
                            <h2>Company Details</h2>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                InputProps={{
                                    readOnly: true,
                                }}
                                id="company-name"
                                label="Company Name"
                                value={companyName}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="category"
                                InputProps={{
                                    readOnly: true,
                                }}
                                label="Category"
                                fullWidth
                                size="small"
                                value={productCategory}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                InputProps={{
                                    readOnly: true,
                                }}
                                id="contact-person-name"
                                label="Contact Person Name"
                                fullWidth
                                size="small"
                                value={contactPersonName}
                                onChange={(e) =>
                                    setContactPersonName(e.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                InputProps={{
                                    readOnly: true,
                                }}
                                id="contact-person-email"
                                label="Contact Person Email"
                                type="email"
                                fullWidth
                                size="small"
                                value={contactPersonEmail}
                                onChange={(e) =>
                                    setContactPersonEmail(e.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                InputProps={{
                                    readOnly: true,
                                }}
                                id="contact-person-phone"
                                label="Contact Person Phone"
                                fullWidth
                                size="small"
                                value={contactPersonPhone}
                                onChange={(e) =>
                                    setContactPersonPhone(e.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                InputProps={{
                                    readOnly: true,
                                }}
                                id="gst"
                                label="GST"
                                fullWidth
                                size="small"
                                value={gst}
                                onChange={(e) => setGst(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Attachment
                                label="GST Attachment"
                                file={gstAttachment}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <h2>Address</h2>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                size="small"
                                id="address-line-1"
                                label="Address Line 1"
                                value={addressLine1}
                                onChange={(e) =>
                                    setAddressLine1(e.target.value)
                                }
                            />
                        </Grid>
                        {addressLine2 && (
                            <Grid item xs={12}>
                                <TextField
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    id="address-line-2"
                                    label="Address Line 2"
                                    fullWidth
                                    size="small"
                                    value={addressLine2}
                                />
                            </Grid>
                        )}
                        <Grid item xs={6}>
                            <TextField
                                id="country"
                                InputProps={{
                                    readOnly: true,
                                }}
                                label="Country"
                                fullWidth
                                size="small"
                                value={country}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                InputProps={{
                                    readOnly: true,
                                }}
                                id="state"
                                label="State"
                                fullWidth
                                size="small"
                                value={state}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="city"
                                InputProps={{
                                    readOnly: true,
                                }}
                                label="City"
                                fullWidth
                                size="small"
                                value={city}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                InputProps={{
                                    readOnly: true,
                                }}
                                label="Postal Code"
                                id="postal-code"
                                fullWidth
                                size="small"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <h2>Bank Details</h2>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                InputProps={{
                                    readOnly: true,
                                }}
                                id="beneficiary"
                                label="Beneficiary Name"
                                fullWidth
                                size="small"
                                value={beneficiary}
                                onChange={(e) => setBeneficiary(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                InputProps={{
                                    readOnly: true,
                                }}
                                id="bank-name"
                                label="Bank Name"
                                fullWidth
                                size="small"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                InputProps={{
                                    readOnly: true,
                                }}
                                id="ac-num"
                                label="Account Number"
                                fullWidth
                                size="small"
                                value={accountNumber}
                                onChange={(e) =>
                                    setAccountNumber(e.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                InputProps={{
                                    readOnly: true,
                                }}
                                id="branch"
                                label="Branch"
                                fullWidth
                                size="small"
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                InputProps={{
                                    readOnly: true,
                                }}
                                id="ifsc"
                                label="IFSC"
                                fullWidth
                                size="small"
                                value={ifsc}
                                onChange={(e) => setIfsc(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Attachment
                                label="Bank Proof"
                                file={bankAttachment}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <h2>Other Details</h2>
                        </Grid>
                        {(msme || msmeAttachment) && (
                            <Grid item xs={6}>
                                <TextField
                                    id="msme"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    label="MSME"
                                    value={msme}
                                    fullWidth
                                    size="small"
                                    onChange={(e) => setMsme(e.target.value)}
                                />
                            </Grid>
                        )}
                        {(msme || msmeAttachment) && (
                            <Grid item xs={6}>
                                <Attachment
                                    label="MSME Attachment"
                                    file={msmeAttachment}
                                />
                            </Grid>
                        )}
                        {(coi || coiAttachment) && (
                            <Grid item xs={6}>
                                <TextField
                                    id="coi"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    label="COI"
                                    value={coi}
                                    fullWidth
                                    size="small"
                                    onChange={(e) => setCoi(e.target.value)}
                                />
                            </Grid>
                        )}
                        {(coi || coiAttachment) && (
                            <Grid item xs={6}>
                                <Attachment
                                    label="COI Attachment"
                                    file={coiAttachment}
                                />
                            </Grid>
                        )}
                        {(tradeMark || tradeAttachment) && (
                            <Grid item xs={6}>
                                <TextField
                                    id="trade-mark"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    label="Trade Mark"
                                    value={tradeMark}
                                    fullWidth
                                    size="small"
                                    onChange={(e) =>
                                        setTradeMark(e.target.value)
                                    }
                                />
                            </Grid>
                        )}
                        {(tradeMark || tradeAttachment) && (
                            <Grid item xs={6}>
                                <Attachment
                                    label="Trade Mark Attachment"
                                    file={tradeAttachment}
                                />
                            </Grid>
                        )}
                        <Grid className="agreementLabel" item xs={6}>
                            <h4>
                                Signed and Stamped Agreement by Both Parties
                            </h4>
                        </Grid>
                        <Grid item xs={6}>
                            <Attachment
                                label="Agreement Attachment"
                                file={agreementAttachment}
                            />
                        </Grid>
                        {dynamicFields.map((field, index) => (
                            <>
                                <Grid item xs={6}>
                                    <TextField
                                        label={field.key}
                                        value={field.value}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Attachment
                                        label="Attachment"
                                        file={dynamicFieldsAttachments[index]}
                                    />
                                </Grid>
                            </>
                        ))}
                        {params.vendorCode && vendor?.skus.length > 0 && (
                            <Grid item xs={12}>
                                <h2>SKUs</h2>
                            </Grid>
                        )}
                        {params.vendorCode && vendor?.skus.length > 0 && (
                            <Grid item xs={12}>
                                <TableContainer component={Paper}>
                                    <Table
                                        style={{ tableLayout: "auto" }}
                                        size="small"
                                        aria-label="a dense table"
                                    >
                                        <TableHead>
                                            <TableRow>
                                                {Object.keys(
                                                    vendor.skus[0]
                                                ).map((tableHead, i) => (
                                                    <TableCell key={i}>
                                                        {tableHead}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {vendor.skus.map((row, i) => (
                                                <TableRow
                                                    key={i}
                                                    sx={{
                                                        "&:last-child td, &:last-child th":
                                                            { border: 0 },
                                                    }}
                                                >
                                                    {Object.values(row).map(
                                                        (value, i) => (
                                                            <TableCell
                                                                style={{
                                                                    whiteSpace:
                                                                        "nowrap",
                                                                }}
                                                                key={i}
                                                            >
                                                                {value}
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
                    </Grid>
                    <br />
                    <Divider />
                    {params.validateToken && (
                        <>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="primary"
                                        onChange={(e) =>
                                            setCheckboxChecked(e.target.checked)
                                        }
                                    />
                                }
                                label="I confirm that I have reviewed and verified all the details and documents in this form"
                            />
                            {checkboxChecked && (
                                <Box
                                    mt={5}
                                    display="flex"
                                    justifyContent="center"
                                >
                                    <Box mx={2}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            size="small"
                                            style={{
                                                borderRadius: "50px",
                                                fontSize: "18px",
                                                fontWeight: "600",
                                                textTransform: "none",
                                            }}
                                            onClick={(e) =>
                                                validateNewVendor(e, true)
                                            }
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
                                            style={{
                                                borderRadius: "50px",
                                                fontSize: "18px",
                                                fontWeight: "600",
                                                textTransform: "none",
                                            }}
                                        >
                                            Reject
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                            {denyOpen && checkboxChecked && (
                                <Box
                                    mt={5}
                                    display="flex"
                                    justifyContent="center"
                                >
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
                                            onChange={(e) =>
                                                setDenyReason(e.target.value)
                                            }
                                            style={{
                                                borderRadius: "50px",
                                                fontSize: "18px",
                                                fontWeight: "600",
                                            }}
                                        />
                                    </Box>
                                    <Box
                                        mx={2}
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <Button
                                            onClick={(e) =>
                                                validateNewVendor(e, false)
                                            }
                                            color="primary"
                                            fullWidth
                                            size="small"
                                            style={{
                                                borderRadius: "50px",
                                                fontSize: "18px",
                                                fontWeight: "600",
                                                textTransform: "none",
                                                width: "200px",
                                            }}
                                        >
                                            Submit
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </>
                    )}
                </Stack>
            </div>
        );
}
