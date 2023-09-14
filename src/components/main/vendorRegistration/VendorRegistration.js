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
    Paper,
    Typography,
    CircularProgress,
    Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import "./vendorRegistration.css";
import { CheckCircleOutline } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import Attachment from "../../attachment/Attachment";
import { getMimeTypeFromFileName } from "../../../util";

export default function VendorRegistration() {
    const [isDetailSubmitted, setIsDetailSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("Vendor Registration");
    const [commentData, setCommentData] = useState("");
    const [submit, setSubmit] = useState(false)
    const params = useParams();

    const [companyName, setCompanyName] = useState("");
    const [contactPersonName, setContactPersonName] = useState("");
    const [contactPersonEmail, setContactPersonEmail] = useState("");
    const [contactPersonPhone, setContactPersonPhone] = useState("");
    const [isValidPhone, setIsValidPhone] = useState(true);
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
    const [countryStateCityData, setCountryStateCityData] = useState([]);
    const [stateCityData, setStateCityData] = useState([]);
    const [cityData, setCityData] = useState([]);
    const categories = [
        "Electronics & Mobiles",
        "Appliances",
        "Sports & Outdoors",
        "Fashion & Apparel",
        "Pet Supplies",
        "Health & Welness",
        "Baby Products",
        "Beauty & Personal Care",
        "Grocery",
    ];

    //ComponentDidMount
    useEffect(() => {
        const checkAndUseValidationToken = async () => {
            const validateToken = params.validateToken;

            if (validateToken) {
                const decodedToken = jwtDecode(validateToken);
                if (decodedToken.type == "vendor-fail") {
                    const getVendorDetailsUrl = `${process.env.REACT_APP_SERVER_URL}vendor/${decodedToken.vendorCode}`
                    const vendorResponse = await fetch(getVendorDetailsUrl);
                    const vendorJson = await vendorResponse.json();
                    const vendorDetails = vendorJson.data.vendor;
                    const { isVerified, companyName, comments, productCategory, contactPerson, gst, gstAtt, address, vendorBank, agreementAtt } = vendorDetails
                    setTitle("Update Vendor Details")
                    let comment = ""
                    comments.forEach(commentData => comment = comment.concat(commentData.comment + "\n"));
                    setCommentData(comment)
                    setCompanyName(companyName);
                    setProductCategory(productCategory);
                    setContactPersonName(contactPerson.name);
                    setContactPersonEmail(contactPerson.email);
                    setContactPersonPhone(contactPerson.phoneNumber);
                    setGst(gst);
                    let blob = new Blob([new Uint8Array(gstAtt.fileContent.data)]);
                    const gstFile = new File([blob], gstAtt.fileName, { type: getMimeTypeFromFileName(gstAtt.fileName) });
                    setGstAttachment(gstFile);
                    setAddressLine1(address.addressLine1)
                    if (address.addressLine2)
                        setAddressLine2(address.addressLine2)
                    const tempCountry = countryStateCityData.find(country => country.name == address.country)
                    setCountry(tempCountry)
                    if (tempCountry.states.length > 0) {
                        setStateCityData(tempCountry.states)
                        const tempState = tempCountry.states.find(state => state.name == address.state)
                        setState(tempState)
                        if (tempState.cities.length > 0) {
                            setCityData(tempState.cities)
                            const tempCity = tempState.cities.find(city => city.name == address.city)
                            setCity(tempCity)
                        }
                        else {
                            setCityData([{ name: "Not Applicable" }])
                            setCity({ name: "Not Applicable" })
                        }
                    }
                    else {
                        setStateCityData([{ name: "Not Applicable", cities: [{ name: "Not Applicable" }] }])
                        setState({ name: "Not Applicable", cities: [{ name: "Not Applicable" }] })
                        setCityData([{ name: "Not Applicable" }])
                        setCity({ name: "Not Applicable" })
                    }
                    setPostalCode(address.postalCode)
                    setBeneficiary(vendorBank.beneficiaryName)
                    setBankName(vendorBank.bankName)
                    setAccountNumber(vendorBank.accountNumber)
                    setBranch(vendorBank.branch)
                    setIfsc(vendorBank.ifsc)
                    blob = new Blob([new Uint8Array(vendorBank.proofAtt.fileContent.data)]);
                    const bankAttFile = new File([blob], vendorBank.proofAtt.fileName, { type: getMimeTypeFromFileName(vendorBank.proofAtt.fileName) });
                    setBankAttachment(bankAttFile)
                    blob = new Blob([new Uint8Array(agreementAtt.fileContent.data)]);
                    const agreementAttFile = new File([blob], agreementAtt.fileName, { type: getMimeTypeFromFileName(agreementAtt.fileName) });
                    setAgreementAttachment(agreementAttFile)
                }
                // setVendorCode(decodedToken.vendorCode)
            }
        }

        const getCountryStateCitydata = async () => {
            const countryStateCityDataURL = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bstates%2Bcities.json";
            const dataResponse = await fetch(countryStateCityDataURL)
            const data = await dataResponse.json();
            setCountryStateCityData(data);
        }

        const asyncUseEffect = async () => {
            await getCountryStateCitydata();
            await checkAndUseValidationToken();
            setLoading(false)
        }
        asyncUseEffect()

        return () => {
            // This code will run when the component is unmounted
            // You can perform any cleanup tasks here, such as unsubscribing from subscriptions
            // console.log("Component unmounted");
        };
    }, []);

    const onPhoneChange = (e) => {
        const inputValue = e.target.value;
        const phoneNumberPattern = /^\+?\d{1,4}[-.\/\s]?\(?\d{1,4}\)?[-.\/\s]?\d{1,9}[-.\/\s]?\d{1,9}[-.\/\s]?\d{1,9}$/; // Adjust this regex based on your specific validation criteria

        // Test if the input matches the phone number pattern
        const isValidPhoneNumber = phoneNumberPattern.test(inputValue);

        setContactPersonPhone(inputValue);
        setIsValidPhone(isValidPhoneNumber);
    };

    const onCountryChange = (e, newValue) => {
        e.preventDefault();
        if (!newValue) {
            setStateCityData([]);
            setCityData([]);
            setCountry(null);
            setState(null);
            setCity(null);
            return;
        }
        setCountry(newValue);
        if (newValue.states && newValue.states.length > 0)
            setStateCityData(newValue.states);
        else
            setStateCityData([{ name: "Not Applicable", cities: [{ name: "Not Applicable" }] }]);
        setState(null);
        setCity(null);
        setCityData([]);
    };

    const onStateChange = (e, newValue) => {
        e.preventDefault();
        if (!newValue) {
            setCityData([]);
            setState(null);
            setCity(null);
            return;
        }
        let cityData = newValue.cities;
        setState(newValue);
        if (cityData.length > 0) setCityData(cityData);
        else setCityData([{ name: "Not Applicable" }]);
        setCity(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!gstAttachment || !bankAttachment || !agreementAttachment) {
            setSubmit(true)
            return
        }
        setLoading(true);
        // Do something with the form data, like sending it to a server
        const formData = new FormData();

        formData.append("companyName", companyName);
        formData.append("contactPersonName", contactPersonName);
        formData.append("contactPersonEmail", contactPersonEmail);
        formData.append("contactPersonPhone", contactPersonPhone);
        formData.append("productCategory", productCategory);
        formData.append("gst", gst);
        formData.append("addressLine1", addressLine1);
        if (addressLine2) formData.append("addressLine2", addressLine2);
        formData.append("country", country.name);
        formData.append("state", state.name);
        formData.append("city", city.name);
        formData.append("postalCode", postalCode);
        formData.append("beneficiary", beneficiary);
        formData.append("accountNumber", accountNumber);
        formData.append("ifsc", ifsc);
        formData.append("bankName", bankName);
        formData.append("branch", branch);
        if (coi.length > 0) formData.append("coi", coi);
        if (msme.length > 0) formData.append("msme", msme);
        if (tradeMark.length > 0) formData.append("tradeMark", tradeMark);
        if (dynamicFields.length > 0)
            formData.append("otherFields", JSON.stringify(dynamicFields));

        // Append file attachments to formData
        formData.append("gstAttachment", gstAttachment);
        formData.append("bankAttachment", bankAttachment);
        if (coiAttachment) formData.append("coiAttachment", coiAttachment);
        if (msmeAttachment) formData.append("msmeAttachment", msmeAttachment);
        if (tradeAttachment)
            formData.append("tradeAttachment", tradeAttachment);
        formData.append("agreementAttachment", agreementAttachment);
        if (dynamicFields.length > 0) {
            for (let i = 0; i < dynamicFieldsAttachments.length; i++) {
                formData.append(
                    `otherFieldsAttachments-${dynamicFields[i].key}`,
                    dynamicFieldsAttachments[i]
                );
            }
        }

        // Data is valid, make an API request to send the data
        // Example using fetch API
        // for (var key of formData.entries()) {
        //     console.log(key[0] + ", " + key[1]);
        // }
        fetch(`${process.env.REACT_APP_SERVER_URL}vendor/new`, {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                setIsDetailSubmitted(true);
                setLoading(false);
                // console.log("API response:", data);
                // Handle the response as needed
            })
            .catch((error) => {
                console.error("API error:", error);
                // Handle the error
            });
    };

    const handleFieldChange = (e, index, fieldToUpdate) => {
        const newFields = [...dynamicFields];
        const newFieldsAttachs = [...dynamicFieldsAttachments];
        if (fieldToUpdate == "attachment") {
            newFieldsAttachs[index] = e;
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
    else if (isDetailSubmitted)
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
                        Your registration is succesful, you can contact our team for purchase order.
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

                {commentData.length > 0 && (
                    <TextField
                        id="comments"
                        label="Problem(s)"
                        multiline
                        rows={4}
                        value={commentData}
                        fullWidth
                        size="small"
                        variant="outlined"
                        InputProps={{
                            style: { color: "rgb(117 191 176)" },
                            readOnly: true,
                        }}
                        InputLabelProps={{
                            style: { color: "rgb(117 191 176)" },
                        }}
                    />
                )}

                <Stack component="form" onSubmit={handleSubmit}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={12}>
                            <h2>Company Details</h2>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
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
                                size="small"
                                id="category"
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
                                value={productCategory}
                                onChange={(e, newValue) =>
                                    setProductCategory(newValue)
                                }
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                id="contact-person-name"
                                label="Contact Person Name"
                                value={contactPersonName}
                                onChange={(e) =>
                                    setContactPersonName(e.target.value)
                                }
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                id="contact-person-email"
                                label="Contact Person Email"
                                type="email"
                                value={contactPersonEmail}
                                onChange={(e) =>
                                    setContactPersonEmail(e.target.value)
                                }
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                id="contact-person-phone"
                                label="Contact Person Phone"
                                value={contactPersonPhone}
                                onChange={onPhoneChange}
                                error={!isValidPhone}
                                helperText={!isValidPhone ? 'Invalid phone number' : ''}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                id="gst"
                                label="GST"
                                value={gst}
                                onChange={(e) => setGst(e.target.value)}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Attachment
                                label="GST Attachment"
                                file={gstAttachment}
                                updateFile={(file) =>
                                    setGstAttachment(file)
                                }
                                required={true}
                                submit={submit}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <h2>Address</h2>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="address-line-1"
                                label="Address Line 1"
                                value={addressLine1}
                                fullWidth
                                size="small"
                                onChange={(e) => setAddressLine1(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                size="small"
                                id="address-line-2"
                                label="Address Line 2"
                                value={addressLine2}
                                onChange={(e) => setAddressLine2(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                id="country"
                                options={countryStateCityData}
                                autoHighlight
                                getOptionLabel={(option) =>
                                    option.name ? option.name : ""
                                }
                                renderOption={(props, option) => (
                                    <Box
                                        component="li"
                                        sx={{
                                            "& > img": {
                                                mr: 2,
                                                flexShrink: 0,
                                            },
                                        }}
                                        {...props}
                                    >
                                        <img
                                            loading="lazy"
                                            width="20"
                                            src={`https://flagcdn.com/w20/${option.iso2.toLowerCase()}.png`}
                                            srcSet={`https://flagcdn.com/w40/${option.iso2.toLowerCase()}.png 2x`}
                                            alt=""
                                        />
                                        {option.name} ({option.iso2})
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        required
                                        {...params}
                                        label="Choose a country"
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: "new-password", // disable autocomplete and autofill
                                            style: { width: "auto" },
                                        }}
                                    />
                                )}
                                size="small"
                                value={country}
                                onChange={onCountryChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                disablePortal
                                size="small"
                                id="state"
                                options={stateCityData}
                                getOptionLabel={(option) =>
                                    option.name ? option.name : ""
                                }
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
                                value={state}
                                onChange={onStateChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                disablePortal
                                size="small"
                                id="city"
                                options={cityData}
                                getOptionLabel={(option) =>
                                    option.name ? option.name : ""
                                }
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
                                value={city}
                                onChange={(e, newValue) =>
                                    setCity(newValue)
                                }
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                label="Postal Code"
                                id="postal-code"
                                type="number"
                                value={postalCode}
                                onChange={(e) =>
                                    setPostalCode(e.target.value)
                                }
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <h2>Bank Details</h2>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                id="beneficiary"
                                label="Beneficiary Name"
                                value={beneficiary}
                                onChange={(e) =>
                                    setBeneficiary(e.target.value)
                                }
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                id="bank-name"
                                label="Bank Name"
                                value={bankName}
                                onChange={(e) =>
                                    setBankName(e.target.value)
                                }
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                id="ac-num"
                                label="Account Number"
                                value={accountNumber}
                                onChange={(e) =>
                                    setAccountNumber(e.target.value)
                                }
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                id="branch"
                                label="Branch"
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                id="ifsc"
                                label="IFSC"
                                value={ifsc}
                                onChange={(e) => setIfsc(e.target.value)}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Attachment
                                label="Bank Proof"
                                file={bankAttachment}
                                updateFile={(file) =>
                                    setBankAttachment(file)
                                }
                                required={true}
                                submit={submit}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <h2>Other Details</h2>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="msme"
                                label="MSME"
                                value={msme}
                                onChange={(e) =>
                                    setMsme(e.target.value)
                                }
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Attachment
                                label="MSME Attachment"
                                file={msmeAttachment}
                                updateFile={(file) => setMsmeAttachment(file)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="coi"
                                label="COI"
                                value={coi}
                                onChange={(e) => setCoi(e.target.value)}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Attachment
                                label="COI Attachment"
                                file={coiAttachment}
                                updateFile={(file) => setCoiAttachment(file)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="trade-mark"
                                label="Trade Mark"
                                value={tradeMark}
                                onChange={(e) =>
                                    setTradeMark(e.target.value)
                                }
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Attachment
                                label="Trade Mark Attachment"
                                file={tradeAttachment}
                                updateFile={(file) => setTradeAttachment(file)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <h4>
                                Signed and Stamped Agreement by Both
                                Parties
                            </h4>
                        </Grid>
                        <Grid item xs={6}>
                            <Attachment
                                label="Agreement Attachment"
                                file={agreementAttachment}
                                updateFile={(file) => setAgreementAttachment(file)}
                                required={true}
                                submit={submit}
                            />
                        </Grid>
                        {dynamicFields.map((field, index) => (
                            <>
                                <Grid item xs={2}>
                                    <TextField
                                        required
                                        label="Key"
                                        value={field.key}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                e,
                                                index,
                                                "key"
                                            )
                                        }
                                        fullWidth
                                        size="small"
                                    />

                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        label="Value"
                                        value={field.value}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                e,
                                                index,
                                                "value"
                                            )
                                        }
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={5.3}>
                                    <Attachment
                                        label="Attachment"
                                        file={dynamicFieldsAttachments[index]}
                                        updateFile={(file) => handleFieldChange(file, index, "attachment")}
                                    />
                                </Grid>
                                <Grid item xs={0.7}>
                                    <Fab
                                        color="error"
                                        aria-label="delete"
                                        className="dynamic-icon"
                                        onClick={() =>
                                            handleRemoveField(index)
                                        }
                                    >
                                        <DeleteIcon />
                                    </Fab>
                                </Grid>
                            </>
                        ))}
                        <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                            <Fab
                                color="primary"
                                className="dynamic-icon"
                                aria-label="add"
                                onClick={addNewField}
                            >
                                <AddIcon />
                            </Fab>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" type="submit" fullWidth
                                size="small">
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </Stack>
            </div>
        );
}
