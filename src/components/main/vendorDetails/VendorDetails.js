import React, { useEffect, useState } from "react";
import {
    TextField,
    Box,
    Button,
    Stack,
    FormControlLabel,
    Checkbox,
    Fab,
    Autocomplete,
    Container,
    Divider,
    Paper,
    CircularProgress,
    Typography,
    Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import "./VendorDetails.css";
import { useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { CheckCircleOutline } from "@mui/icons-material";
import { getMimeTypeFromFileName } from "../../../util";
import Attachment from "../../attachment/Attachment";

export default function VendorDetails() {
    const [title, setTitle] = useState("")
    const [vendorCode, setVendorCode] = useState("")
    const [loading, setLoading] = useState(true)
    const [isReviewDone, setReviewDone] = useState(false)

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
    const [dynamicFieldsAttachments, setDynamicFieldsAttachments] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [denyOpen, setDenyOpen] = useState(false);
    const [denyReason, setDenyReason] = useState("");


    const params = useParams();
    const categories = ['Electronics & Mobiles', 'Appliances', 'Sports & Outdoors', 'Fashion & Apparel', 'Pet Supplies', 'Health & Welness', 'Baby Products', 'Beauty & Personal Care', 'Grocery'];

    //ComponentDidMount
    useEffect(() => {
        const getFile = async (idType, id) => {
            const fileDetailsUrl = `${process.env.REACT_APP_SERVER_URL}file/${idType}/${id}`
            const fileResponse = await fetch(fileDetailsUrl);
            const fileJson = await fileResponse.json();
            const file = fileJson?.data?.file
            if (file)
                return new File([new Blob([new Uint8Array(file.fileContent.data)])], file.fileName, { type: getMimeTypeFromFileName(file.fileName) });
            return file;
        }
        const checkAndUseValidationToken = async () => {
            const validateToken = params.validateToken;

            if (validateToken) {
                const decodedToken = jwtDecode(validateToken);
                console.log(decodedToken)
                if (decodedToken.type == "new-vendor") {
                    const getVendorDetailsUrl = `${process.env.REACT_APP_SERVER_URL}vendor/${decodedToken.vendorCode}`
                    const vendorResponse = await fetch(getVendorDetailsUrl);
                    console.log(vendorResponse)
                    const vendorJson = await vendorResponse.json();
                    const vendorDetails = vendorJson.data.vendor;
                    const gstAtt = await getFile('gstAttVendorId', vendorDetails.id)
                    const proofAtt = await getFile('vendorBankId', vendorDetails.vendorBank.id)
                    const agreementAtt = await getFile('agreementAttVendorId', vendorDetails.id)
                    console.log(vendorDetails)
                    const { isVerified, companyName, productCategory, contactPerson, gst, address, vendorBank } = vendorDetails
                    if (isVerified)
                        setReviewDone(true)
                    else {
                        setTitle("Verify Vendor Details")
                        setCompanyName(companyName);
                        setProductCategory(productCategory);
                        setContactPersonName(contactPerson.name);
                        setContactPersonEmail(contactPerson.email);
                        setContactPersonPhone(contactPerson.phoneNumber);
                        setGst(gst);
                        setGstAttachment(gstAtt);
                        setAddressLine1(address.addressLine1)
                        if (address.addressLine2)
                            setAddressLine2(address.addressLine2)
                        setCountry(address.country)
                        setState(address.state)
                        setCity(address.city)
                        setPostalCode(address.postalCode)
                        setBeneficiary(vendorBank.beneficiaryName)
                        setBankName(vendorBank.bankName)
                        setAccountNumber(vendorBank.accountNumber)
                        setBranch(vendorBank.branch)
                        setIfsc(vendorBank.ifsc)
                        setBankAttachment(proofAtt)
                        setAgreementAttachment(agreementAtt)
                    }
                }
                setVendorCode(decodedToken.vendorCode)
            }
            setLoading(false)
        }

        checkAndUseValidationToken();

        return () => {
            // This code will run when the component is unmounted
            // You can perform any cleanup tasks here, such as unsubscribing from subscriptions
            console.log("Component unmounted");
        };
    }, []);

    const validateNewVendor = async (e, isRecordValid) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData();
        formData.append("vendorCode", vendorCode);
        formData.append("isValid", isRecordValid);
        if (!isRecordValid)
            formData.append("reason", denyReason);

        const validateVendorUrl = `${process.env.REACT_APP_SERVER_URL}vendor/validate`
        const validationResponse = await fetch(validateVendorUrl, {
            method: "POST",
            body: formData
        });
        const vendorJson = await validationResponse.json();
        if (vendorJson.success) {
            setReviewDone(true)
            setLoading(false)
        }
    }

    const onCountryChange = (e, newValue) => { };

    const onStateChange = (e, newValue) => { };

    const handleSubmit = (e) => { };

    const handleFieldChange = (e, index, fieldToUpdate) => {
        const newFields = [...dynamicFields];
        const newFieldsAttachs = [...dynamicFieldsAttachments];
        if (fieldToUpdate == "attachment") {
            newFieldsAttachs[index] = e.target.files[0];
            setDynamicFieldsAttachments(newFieldsAttachs);
        } else {
            newFields[index][fieldToUpdate] = e.target.value;
            setDynamicFields(newFields);
        }
    };

    const addNewField = () => {
        setDynamicFields([...dynamicFields, { key: "", value: "" }]);
        setDynamicFieldsAttachments([...dynamicFieldsAttachments, null]);
    };

    const handleRemoveField = (index) => {
        const newFields = dynamicFields.filter((_, i) => i !== index);
        const newFieldsAttachs = dynamicFieldsAttachments.filter(
            (_, i) => i !== index
        );
        setDynamicFields(newFields);
        setDynamicFieldsAttachments(newFieldsAttachs);
    };

    const downloadAttachment = async (e, fileType) => {
        e.preventDefault();
        let attachment
        if (fileType == "gstAtt")
            attachment = gstAttachment
        else if (fileType == "bankAtt")
            attachment = bankAttachment
        else if (fileType == "agreementAtt")
            attachment = agreementAttachment
        // Convert buffer to Blob

        const blob = new Blob([new Uint8Array(attachment.fileContent.data)], { type: getMimeTypeFromFileName(attachment.fileName) });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");

        // Clean up by revoking the Blob URL
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
                        Your review is done. Details are mailed to creator of vendor
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
    else
        return (
            <div className="vendor-main-container">
                <h1>{title}</h1>
                <Stack component="form" onSubmit={handleSubmit}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={12}>
                            <h2>Company Details</h2>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                InputProps={{
                                    readOnly: true,
                                }}
                                id="company-name"
                                label="Company Name"
                                value={companyName}
                                fullWidth
                                size="small"
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                disablePortal
                                id="category"
                                InputProps={{
                                    readOnly: true,
                                }}
                                options={categories}
                                renderInput={(params) => (
                                    <TextField
                                        required
                                        {...params}
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: "new-password",
                                            style: { width: "auto" },
                                        }}
                                        label="Category"
                                    />
                                )}
                                fullWidth
                                size="small"
                                value={productCategory}
                                onChange={(e, newValue) => setProductCategory(newValue)}
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
                                onChange={(e) => setContactPersonName(e.target.value)}
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
                                onChange={(e) => setContactPersonEmail(e.target.value)}
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
                                onChange={(e) => setContactPersonPhone(e.target.value)}
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
                                onChange={(e) => setAddressLine1(e.target.value)}
                            />
                        </Grid>
                        {addressLine2 &&
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
                                    onChange={(e) => setAddressLine2(e.target.value)}
                                />
                            </Grid>
                        }
                        <Grid item xs={6}>
                            <Autocomplete
                                id="country"
                                InputProps={{
                                    readOnly: true,
                                }}
                                options={countries}
                                autoHighlight
                                fullWidth
                                size="small"
                                renderOption={(props, option) => (
                                    <Box
                                        component="li"
                                        sx={{
                                            "& > img": { mr: 2, flexShrink: 0 },
                                        }}
                                        {...props}
                                    >
                                        <img
                                            loading="lazy"
                                            width="20"
                                            src={`https://flagcdn.com/w20/${option.country_short_name.toLowerCase()}.png`}
                                            srcSet={`https://flagcdn.com/w40/${option.country_short_name.toLowerCase()}.png 2x`}
                                            alt=""
                                        />
                                        {option.country_name} (
                                        {option.country_short_name})
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        required
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        {...params}
                                        label="Choose a country"
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: "new-password", // disable autocomplete and autofill
                                            style: { width: "auto" },
                                        }}
                                    />
                                )}
                                value={country}
                                onChange={onCountryChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                disablePortal
                                InputProps={{
                                    readOnly: true,
                                }}
                                id="state"
                                options={states}
                                renderInput={(params) => (
                                    <TextField
                                        required
                                        {...params}
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: "new-password",
                                            style: { width: "auto" },
                                        }}
                                        label="State"
                                    />
                                )}
                                fullWidth
                                size="small"
                                value={state}
                                onChange={onStateChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                disablePortal
                                id="city"
                                InputProps={{
                                    readOnly: true,
                                }}
                                options={cities}
                                renderInput={(params) => (
                                    <TextField
                                        required
                                        {...params}
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: "new-password",
                                            style: { width: "auto" },
                                        }}
                                        label="City"
                                    />
                                )}
                                fullWidth
                                size="small"
                                value={city}
                                onChange={(e, newValue) => setCity(newValue)}
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
                        <Grid className="agreementLabel" item xs={6}>
                            <h4>Signed and Stamped Agreement by Both Parties</h4>
                        </Grid>
                        <Grid item xs={6}>
                            <Attachment
                                label="Agreement Attachment"
                                file={agreementAttachment}
                            />
                        </Grid>
                        <Grid item xs={6}>
                        </Grid>
                        <Grid item xs={6}>
                        </Grid>
                    </Grid>
                    <div className="other-details">

                        <div className="row">
                            <div className="col">
                                <Box>
                                    {msme && <TextField
                                        id="msme"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        label="MSME"
                                        value={msme}
                                        onChange={(e) => setMsme(e.target.value)}
                                    />}
                                    {coi && <TextField
                                        id="coi"
                                        label="COI"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        value={coi}
                                        onChange={(e) => setCoi(e.target.value)}
                                    />}
                                    {tradeMark && <TextField
                                        id="trade-mark"
                                        label="Trade Mark"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        value={tradeMark}
                                        onChange={(e) =>
                                            setTradeMark(e.target.value)
                                        }
                                    />}
                                </Box>
                            </div>
                            <div className="col" style={{ marginTop: '-5px!important' }}>

                                {msme && <Button variant="contained" className="full-width-button" color="primary" type="MSME " onClick={(e) => downloadAttachment(e, 'msmeAtt')}>MSME</Button>}

                                {coi && <Button variant="contained" className="full-width-button" color="primary" type="COI " onClick={(e) => downloadAttachment(e, 'coiAtt')}>COI</Button>}

                                {tradeMark && <Button variant="contained" className="full-width-button" color="primary" type="Trade " onClick={(e) => downloadAttachment(e, 'tradeAtt')}>Trade</Button>}

                            </div>
                        </div>
                    </div>

                    {dynamicFields.map((field, index) => (
                        <div key={index}>
                            <div className="row dynamic-row">
                                <div className="col">
                                    <div className="row inner-dynamic">
                                        <div className="col">
                                            <TextField
                                                required
                                                label="Key"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                value={field.key}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        e,
                                                        index,
                                                        "key"
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="col">
                                            <TextField
                                                label="Value"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                value={field.value}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        e,
                                                        index,
                                                        "value"
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="row inner-dynamic-fab">
                                        <div className="col">
                                            <TextField
                                                type="file"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                className="file-input"
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        e,
                                                        index,
                                                        "attachment"
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="col">
                                            <Fab
                                                color="error"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                aria-label="delete"
                                                className="dynamic-icon"
                                                onClick={() =>
                                                    handleRemoveField(index)
                                                }
                                            >
                                                <DeleteIcon />
                                            </Fab>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <br />
                    <Divider />
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                onChange={(e) => setCheckboxChecked(e.target.checked)}
                            />
                        }
                        label="I confirm that I have reviewed and verified all the details and documents in this form"
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
                                    onClick={(e) => validateNewVendor(e, true)}
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
                                    onClick={(e) => validateNewVendor(e, false)}
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
                </Stack>
            </div>
        );
}
