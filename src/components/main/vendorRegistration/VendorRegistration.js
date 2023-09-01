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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import "./vendorRegistration.css";

export default function VendorRegistration() {
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
    const categories = ['Electronics & Mobiles', 'Appliances', 'Sports & Outdoors', 'Fashion & Apparel', 'Pet Supplies', 'Health & Welness', 'Baby Products', 'Beauty & Personal Care', 'Grocery'];

    //ComponentDidMount
    useEffect(() => {
        const url = "https://www.universal-tutorial.com/api/countries";
        const headers = new Headers();
        headers.append(
            "Authorization",
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJqYXRpbmErdW5pdmVyc2V0dXRvcmlhbEBldm9sdmVkaWdpdGFzLmNvbSIsImFwaV90b2tlbiI6Im5HV05lWkNXSTBfUnFPTlE1UjcxQ1daeHl1TEVxSmxKQ3BiaVdCd1B0bFBSQWNIaTFRR1FWRDZPT01TZVJqYkQ2MkEifSwiZXhwIjoxNjkzNTY0MjE0fQ.j9TgSc-LgGp9Z6t0Nf6cfQhSL0YGhSeW6gbhf3faheM"
        );
        headers.append("Accept", "application/json");

        const requestOptions = {
            method: "GET",
            headers: headers,
        };

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setCountries(data);
            })
            .catch((error) => {
                console.error("Error submitting address:", error);
            });

        return () => {
            // This code will run when the component is unmounted
            // You can perform any cleanup tasks here, such as unsubscribing from subscriptions
            console.log("Component unmounted");
        };
    }, []);

    const onCountryChange = (e, newValue) => {
        e.preventDefault();
        if (!newValue) {
            setStates([]);
            setCities([]);
            setCountry(null);
            setState(null);
            setCity(null);
            return;
        }
        const url = `https://www.universal-tutorial.com/api/states/${newValue.country_name}`;
        const headers = new Headers();
        headers.append(
            "Authorization",
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJqYXRpbmErdW5pdmVyc2V0dXRvcmlhbEBldm9sdmVkaWdpdGFzLmNvbSIsImFwaV90b2tlbiI6Im5HV05lWkNXSTBfUnFPTlE1UjcxQ1daeHl1TEVxSmxKQ3BiaVdCd1B0bFBSQWNIaTFRR1FWRDZPT01TZVJqYkQ2MkEifSwiZXhwIjoxNjkzNTY0MjE0fQ.j9TgSc-LgGp9Z6t0Nf6cfQhSL0YGhSeW6gbhf3faheM"
        );
        headers.append("Accept", "application/json");

        const requestOptions = {
            method: "GET",
            headers: headers,
        };

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setCountry(newValue);
                setStates(data.map((stateObject) => stateObject.state_name));
                setState(null);
                setCity(null);
            })
            .catch((error) => {
                console.error("Error submitting address:", error);
            });
    };

    const onStateChange = (e, newValue) => {
        e.preventDefault();
        if (!newValue) {
            setCities([]);
            setState(null);
            setCity(null);
            return;
        }
        const url = `https://www.universal-tutorial.com/api/cities/${newValue}`;
        const headers = new Headers();
        headers.append(
            "Authorization",
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJqYXRpbmErdW5pdmVyc2V0dXRvcmlhbEBldm9sdmVkaWdpdGFzLmNvbSIsImFwaV90b2tlbiI6Im5HV05lWkNXSTBfUnFPTlE1UjcxQ1daeHl1TEVxSmxKQ3BiaVdCd1B0bFBSQWNIaTFRR1FWRDZPT01TZVJqYkQ2MkEifSwiZXhwIjoxNjkzNTY0MjE0fQ.j9TgSc-LgGp9Z6t0Nf6cfQhSL0YGhSeW6gbhf3faheM"
        );
        headers.append("Accept", "application/json");

        const requestOptions = {
            method: "GET",
            headers: headers,
        };

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setState(newValue);
                if(data.length > 0)
                setCities(data.map((cityObject) => cityObject.city_name));
                else
                setCities(['Not Applicable']);
                setCity(null);
            })
            .catch((error) => {
                console.error("Error submitting address:", error);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Do something with the form data, like sending it to a server
        const formData = new FormData();

        formData.append("companyName", companyName);
        formData.append("contactPersonName", contactPersonName);
        formData.append("contactPersonEmail", contactPersonEmail);
        formData.append("contactPersonPhone", contactPersonPhone);
        formData.append("productCategory", productCategory);
        formData.append("gst", gst);
        formData.append("addressLine1", addressLine1);
        if(addressLine2)
        formData.append("addressLine2", addressLine2);
        formData.append("country", country.country_name);
        formData.append("state", state);
        formData.append("city", city);
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
        for (var key of formData.entries()) {
            console.log(key[0] + ", " + key[1]);
        }
        fetch(`${process.env.REACT_APP_SERVER_URL}vendor/new`, {
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
    };

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

    return (
        <div className="vendor-main-container">
            <h1>Vendor Registration</h1>
            <Stack component="form" onSubmit={handleSubmit}>
                <div className="company-details">
                    <h2>Compnay Details</h2>
                    <TextField
                        required
                        id="company-name"
                        label="Company Name"
                        value={companyName}
                        fullWidth
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <div className="row">
                        <div className="col">
                            <Autocomplete
                                disablePortal
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
                                onChange={(e, newValue) => setProductCategory(newValue)}
                            />
                            <TextField
                                required
                                id="contact-person-email"
                                label="Contact Person Email"
                                type="email"
                                value={contactPersonEmail}
                                onChange={(e) => setContactPersonEmail(e.target.value)}
                            />
                            <TextField
                                required
                                id="gst"
                                label="GST"
                                value={gst}
                                onChange={(e) => setGst(e.target.value)}
                            />
                        </div>
                        <div className="col">
                            <TextField
                                required
                                id="contact-person-name"
                                label="Contact Person Name"
                                value={contactPersonName}
                                onChange={(e) => setContactPersonName(e.target.value)}
                            />
                            <TextField
                                required
                                id="contact-person-phone"
                                label="Contact Person Phone"
                                value={contactPersonPhone}
                                onChange={(e) => setContactPersonPhone(e.target.value)}
                            />
                            <Box>
                                <TextField
                                    required
                                    id="gst-attch"
                                    type="file"
                                    className="file-first file-input"
                                    onChange={(e) =>
                                        setGstAttachment(e.target.files[0])
                                    }
                                />
                            </Box>
                        </div>
                    </div>
                </div>
                <div className="address">
                    <h2>Address</h2>
                    <TextField
                        required
                        className="full-width"
                        id="address-line-1"
                        label="Address Line 1"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                    />
                    <TextField
                        className="full-width"
                        id="address-line-2"
                        label="Address Line 2"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                    />
                    <div className="row">
                        <div className="col">
                            <Autocomplete
                                id="country"
                                options={countries}
                                autoHighlight
                                getOptionLabel={(option) => option.country_name}
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
                            <Autocomplete
                                disablePortal
                                id="city"
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
                                value={city}
                                onChange={(e, newValue) => setCity(newValue)}
                            />
                        </div>
                        <div className="col">
                            <Autocomplete
                                disablePortal
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
                                value={state}
                                onChange={onStateChange}
                            />
                            <TextField
                                required
                                label="Postal Code"
                                id="postal-code"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="bank-details">
                    <h2>Bank Details</h2>
                    <div className="row">
                        <div className="col">
                            <TextField
                                required
                                id="beneficiary"
                                label="Beneficiary Name"
                                value={beneficiary}
                                onChange={(e) => setBeneficiary(e.target.value)}
                            />
                            <TextField
                                required
                                id="ac-num"
                                label="Account Number"
                                value={accountNumber}
                                onChange={(e) =>
                                    setAccountNumber(e.target.value)
                                }
                            />
                            <TextField
                                required
                                id="ifsc"
                                label="IFSC"
                                value={ifsc}
                                onChange={(e) => setIfsc(e.target.value)}
                            />
                        </div>
                        <div className="col">
                            <TextField
                                required
                                id="bank-name"
                                label="Bank Name"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                            />
                            <TextField
                                required
                                id="branch"
                                label="Branch"
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                            />
                            <TextField
                                required
                                type="file"
                                label="Bank Proof"
                                id="bank-attch"
                                onChange={(e) =>
                                    setBankAttachment(e.target.files[0])
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="other-details">
                    <h2>Other Details</h2>

                    <div className="row">
                        <div className="col">
                            <Box>
                                <TextField
                                    id="msme"
                                    label="MSME"
                                    value={msme}
                                    onChange={(e) => setMsme(e.target.value)}
                                />
                                <TextField
                                    id="coi"
                                    label="COI"
                                    value={coi}
                                    onChange={(e) => setCoi(e.target.value)}
                                />
                                <TextField
                                    id="trade-mark"
                                    label="Trade Mark"
                                    value={tradeMark}
                                    onChange={(e) =>
                                        setTradeMark(e.target.value)
                                    }
                                />
                                <h4>
                                    Signed and Stamped Agreement by Both Parties
                                </h4>
                            </Box>
                        </div>
                        <div className="col">
                            <TextField
                                type="file"
                                id="msme-attch"
                                className="file-input"
                                onChange={(e) =>
                                    setMsmeAttachment(e.target.files[0])
                                }
                            />

                            <TextField
                                type="file"
                                id="coi-attch"
                                className="file-input"
                                onChange={(e) =>
                                    setCoiAttachment(e.target.files[0])
                                }
                            />
                            <TextField
                                type="file"
                                id="trade-attch"
                                className="file-input"
                                onChange={(e) =>
                                    setTradeAttachment(e.target.files[0])
                                }
                            />
                            <TextField
                                required
                                type="file"
                                className="file-input"
                                id="msme-attch"
                                onChange={(e) =>
                                    setAgreementAttachment(e.target.files[0])
                                }
                            />
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

                <Fab
                    color="primary"
                    className="dynamic-icon"
                    aria-label="add"
                    onClick={addNewField}
                >
                    <AddIcon />
                </Fab>

                <Button variant="contained" color="primary" type="submit">
                    Submit
                </Button>
            </Stack>
        </div>
    );
}
