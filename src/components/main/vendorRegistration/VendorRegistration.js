import React, { useState } from "react";
import {
    TextField,
    Box,
    Button,
    Stack,
    FormControlLabel,
    Checkbox,
    Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import "./vendorRegistration.css";

export default function VendorRegistration() {
    const [companyName, setCompanyName] = useState("");
    const [gst, setGst] = useState("");
    const [gstAttachment, setGstAttachment] = useState(null);
    const [address, setAddress] = useState("");
    const [isInternational, setInternational] = useState(false);
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
    const [agreement, setAgreement] = useState("");
    const [agreementAttachment, setAgreementAttachment] = useState(null);
    const [dynamicFields, setDynamicFields] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Do something with the form data, like sending it to a server
    };

    const handleFieldChange = (e, index, fieldToUpdate) => {
        const newFields = [...dynamicFields];
        newFields[index][fieldToUpdate] =
            fieldToUpdate == "attachment" ? e.target.files[0] : e.target.value;
        setDynamicFields(newFields);
    };

    const addNewField = () => {
        setDynamicFields([
            ...dynamicFields,
            { key: "", value: "", attachment: null },
        ]);
    };

    const handleRemoveField = (index) => {
        const newFields = dynamicFields.filter((_, i) => i !== index);
        setDynamicFields(newFields);
    };

    return (
        <div className="vendor-main-container">
            <h1>Vendor Registration</h1>
            <Stack component="form" onSubmit={handleSubmit}>
                <div className="company-details">
                    <h2>Compnay Details</h2>
                    <TextField
                        required
                        className="full-width"
                        id="company-name"
                        label="Company Name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <div className="row">
                        <div className="col">
                            <TextField
                                required
                                id="address"
                                label="Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
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
                            <Box>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            value={isInternational}
                                            onChange={(e) =>
                                                setInternational(e.target.value)
                                            }
                                        />
                                    }
                                    className="checkbox-first"
                                    label="Is Company International?"
                                />
                            </Box>
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
                                    required
                                    id="msme"
                                    label="MSME"
                                    value={msme}
                                    onChange={(e) => setMsme(e.target.value)}
                                />
                                <TextField
                                    required
                                    id="coi"
                                    label="COI"
                                    value={coi}
                                    onChange={(e) => setCoi(e.target.value)}
                                />
                                <TextField
                                    required
                                    id="trade-mark"
                                    label="Trade Mark"
                                    value={tradeMark}
                                    onChange={(e) =>
                                        setTradeMark(e.target.value)
                                    }
                                />
                                <TextField
                                    required
                                    id="agreement"
                                    label="Signed and Stamped Agreement by Both Parties"
                                    value={agreement}
                                    onChange={(e) =>
                                        setAgreement(e.target.value)
                                    }
                                />
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
                            onChange={(e) => handleFieldChange(e, index, "key")}
                        />
                            </div>
                            <div className="col">
                            <TextField
                            required
                            label="Value"
                            value={field.value}
                            onChange={(e) =>
                                handleFieldChange(e, index, "value")
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
                                handleFieldChange(e, index, "attachment")
                            }
                        />
                          </div>
                        <div className="col">
                        <Fab
                            color="error"
                            aria-label="delete"
                            className="dynamic-icon"
                            onClick={() => handleRemoveField(index)}
                        >
                            <DeleteIcon />
                        </Fab>
                        </div>
                       
                        </div>
                        </div>
                      </div>
                       
                       
                        
                    </div>
                ))}

                <Fab color="primary" className="dynamic-icon" aria-label="add" onClick={addNewField}>
                    <AddIcon />
                </Fab>

                <Button variant="contained" color="primary" type="submit">
                    Submit
                </Button>
            </Stack>
        </div>
    );
}
