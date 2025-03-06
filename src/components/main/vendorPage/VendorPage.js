import { useState } from "react";
import Loading from "../../loading/Loading";
import Success from "../../success/Succes";
import { Link } from "react-router-dom";
import {
    Autocomplete,
    Button,
    Grid,
    IconButton,
    Stack,
    TextField,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Attachment from "../../attachment/Attachment";
import Address from "../../address/Address";
import "./VendorPage.css";
import DynamicFields from "../../dynamicFields/DynamicFields";
import { LoadingButton } from "@mui/lab";

const configDetails = {
    title: {
        "new-vendor": "",
        "update-vendor": "Update Vendor Details",
        "view-vendor": "",
        "verify-vendor": "Verify Vendor Details",
    },
};
const CHUNK_SIZE = 2*1024*1024;

const companyCategories = [
    "Electronics & Mobiles",
    "Appliances",
    "Sports & Outdoors",
    "Fashion & Apparel",
    "Pet Supplies",
    "Health & Welness",
    "Baby Products",
    "Beauty & Personal Care",
    "Grocery",
    "Others",
];

const isPhoneValid = (phoneNumber) => {
    const phoneNumberPattern =
        /^\+?\d{1,4}[-.\/\s]?\(?\d{1,4}\)?[-.\/\s]?\d{1,9}[-.\/\s]?\d{1,9}[-.\/\s]?\d{1,9}$/;
    if (phoneNumber === "") return true;
    return phoneNumberPattern.test(phoneNumber);
};

const isGSTValid = (gstNumber) => {
    const gstRegex =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[A-Z0-9]{1}$/;
    if (gstNumber === "") return true;
    return gstRegex.test(gstNumber);
};

const convertEntityNameToId = (entityName) => {
    return entityName.charAt(0).toLowerCase() + entityName.slice(1) + "Id";
}

const vendorFields = [
    {
        id: "heading-company-details",
        label: "Company Details",
        fieldType: "head",
        uiWidth: "full",
    },
    {
        id: "companyName",
        label: "Company Name",
        fieldType: "text",
        uiWidth: "full",
        isRequired: true,
    },
    {
        id: "productCategory",
        label: "Category",
        fieldType: "autocomplete",
        options: companyCategories,
        isRequired: true,
    },
    {
        id: "contactPersonName",
        label: "Contact Person Name",
        fieldType: "text",
        isRequired: true,
    },
    {
        id: "contactPersonEmail",
        label: "Contact Person Email",
        contentType: "email",
        fieldType: "text",
        isRequired: true
    },
    {
        id: "contactPersonPhone",
        label: "Contact Person Phone",
        fieldType: "text",
        isRequired: true,
        isDataValid: isPhoneValid,
        errorMessage: "Invalid phone number",
    },
    {
        id: "gstId",
        label: "GST Number",
        fieldType: "text",
        isRequired: true,
        isDataValid: isGSTValid,
        errorMessage: "Invalid GST Number",
    },
    {
        id: "gst-attachment",
        label: "GST Attachment",
        fieldType: "attachment",
        isRequired: true,
        attachmentType: "GST",
        entityName: "VendorAttachments"
    },
    {
        id: "address",
        fieldType: "address",
        uiWidth: "full",
        destructForApi: true,
        destructSettings: {
            country: "name",
            state: "name",
            city: "name",
        },
    },
    {
        id: "heading-bank-details",
        label: "Bank Details",
        fieldType: "head",
        uiWidth: "full",
    },
    {
        id: "beneficiary",
        label: "Beneficiary Name",
        fieldType: "text",
        isRequired: true,
    },
    {
        id: "bankName",
        label: "Bank Name",
        fieldType: "text",
        isRequired: true,
    },
    {
        id: "accountNumber",
        label: "Account Number",
        fieldType: "text",
        isRequired: true,
    },
    {
        id: "branch",
        label: "Branch",
        fieldType: "text",
        isRequired: true,
    },
    {
        id: "ifsc",
        label: "IFSC",
        fieldType: "text",
        isRequired: true,
    },
    {
        id: "bank-proof",
        label: "Bank Proof",
        fieldType: "attachment",
        isRequired: true,
        attachmentType: "bankProof",
        entityName: "VendorBank"
    },
    {
        id: "heading-other-details",
        label: "Other Details",
        fieldType: "head",
        uiWidth: "full",
    },
    {
        id: "msmeId",
        label: "MSME Id",
        fieldType: "text",
    },
    {
        id: "msme-attachment",
        label: "MSME Attachment",
        fieldType: "attachment",
        attachmentType: "MSME",
        entityName: "VendorAttachments"
    },
    {
        id: "coiId",
        label: "COI Id",
        fieldType: "text"
    },
    {
        id: "coi-attachment",
        label: "COI",
        fieldType: "attachment",
        attachmentType: "COI",
        entityName: "VendorAttachments"
    },
    {
        id: "tradeMarkId",
        label: "Trade Mark",
        fieldType: "text",
    },
    {
        id: "trade-mark-attachment",
        label: "Trade Mark Attachment",
        fieldType: "attachment",
        attachmentType: "TradeMark",
        entityName: "VendorAttachments"
    },
    {
        id: "heading-signed-agreement",
        label: "Signed and Stamped Agreement by both Parties",
        fieldType: "label",
    },
    {
        id: "agreement-attachment",
        label: "Agreement Attachment",
        fieldType: "attachment",
        isRequired: true,
        attachmentType: "Agreement",
        entityName: "VendorAttachments"
    },
];

const getDefaultVendorData = () => {
    const defaultVendorData = {};
    vendorFields.forEach((vendorField) => {
        if (vendorField.fieldType === "head") return;
        defaultVendorData[vendorField.id] = getFieldTypeDefault(
            vendorField.fieldType
        );
    });
    return defaultVendorData;
};

const getFieldTypeDefault = (fieldType) => {
    switch (fieldType) {
        case "text":
            return "";
        case "attachment":
            return null;
        case "address":
            return {
                addressLine1: "",
                addressLine2: "",
                country: null,
                state: null,
                city: null,
                postalCode: "",
            };
        default:
            return null;
    }
};

const isEditMode = (mode) => {
    return ["new-vendor", "update-vendor"].includes(mode);
};

export default function VendorPage() {
    const [processStage, setProcessStage] = useState("process");
    const [vendorSubmitLoading, setVendorSubmitLoading] = useState(false);
    const [mode, setMode] = useState("new-vendor");
    const [commentData, setCommentData] = useState("");
    const [countryStateCityData, setCountryStateCityData] = useState([]);
    const [vendorData, setVendorData] = useState(getDefaultVendorData());
    const [isSubmitPressed, setSubmitPressed] = useState(false);
    const [dynamicFields, setDynamicFields] = useState([]);
    const [dynamicFieldsAttachments, setDynamicFieldsAttachments] = useState(
        []
    );
    const [isLocalVendorRegistration, setLocalVendorRegistration] =
        useState(false);
    const [localEmail, setLocalEmail] = useState("");

    //ComponentDidMount
    // useEffect(() => {
    //     const getCountryStateCitydata = async () => {
    //         const countryStateCityDataURL =
    //             "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bstates%2Bcities.json";
    //         const dataResponse = await fetch(countryStateCityDataURL);
    //         const data = await dataResponse.json();
    //         setCountryStateCityData(data);
    //         return data;
    //     };

    //     const asyncUseEffect = async () => {
    //         await getCountryStateCitydata();
    //         setProcessStage("working"); //TODO think of a better name for working stage
    //     };
    //     asyncUseEffect();

    //     fetch(`${process.env.REACT_APP_SERVER_URL}`)
    //         .then((response) => {
    //             console.log("API is working");
    //         })
    //         .catch((error) => {
    //             setMode("");
    //             console.error("API error:", error);
    //         });

    //     return () => {
    //         // This code will run when the component is unmounted
    //         // You can perform any cleanup tasks here, such as unsubscribing from subscriptions
    //         // console.log("Component unmounted");
    //     };
    // }, []);

    const updateVendorField = (vendorFieldId, updatedData) => {
        setVendorData({
            ...vendorData,
            [vendorFieldId]: updatedData,
        });
    };

    const submit = async (e) => {
        e.preventDefault();
        setVendorSubmitLoading(true);
        setSubmitPressed(true);
        if (!areAllDetailsSubmitted()) {
            setVendorSubmitLoading(false);
            return;
        }
        setVendorSubmitLoading(false); //temp
        const vendorRelatedIds = await createVendor();
        if (vendorRelatedIds) {
            await uploadVendorAttachments(vendorRelatedIds)
        } else {
            setVendorSubmitLoading(false);
        }
    };

    const createVendor = async () => {
        const formData = new FormData();

        vendorFields
            .filter(
                (vendorField) =>
                    !vendorField.fieldType.includes("head", "attachment")
            )
            .forEach((vendorField) => {
                if (vendorField.destructForApi) {
                    for (let vendorFieldEntry in vendorData[vendorField.id]) {
                        let destructSetting =
                            vendorField.destructSettings[vendorFieldEntry];
                        if (destructSetting)
                            formData.append(
                                vendorFieldEntry,
                                vendorData[vendorField.id][vendorFieldEntry][
                                destructSetting
                                ]
                            );
                        else if (vendorData[vendorField.id][vendorFieldEntry] && vendorData[vendorField.id][vendorFieldEntry].length > 0)
                            formData.append(
                                vendorFieldEntry,
                                vendorData[vendorField.id][vendorFieldEntry]
                            );
                    }
                } else if (
                    vendorData[vendorField.id] &&
                    vendorData[vendorField.id].length > 0
                )
                    formData.append(vendorField.id, vendorData[vendorField.id]);
            });
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/vendor/new-start`, {
            method: "POST",
            body: formData,
        })
        const jsonResponse = await response.json();
        if (jsonResponse.success) {
            return jsonResponse.data
        } else {
            alert(response.message + "/nPlease contact the admin and you can take this screenshot to share with team");
            return null;
        }
    };

    const uploadVendorAttachments = async (vendorRelatedIds) => {
        vendorFields.filter(vendorField => vendorField.fieldType === "attachment").forEach(async (vendorField) => {
            if (vendorData[vendorField.id]) {
                const attachmentBody = {
                    file: vendorData[vendorField.id],
                    attachmentType: vendorField.attachmentType,
                    entityName: vendorField.entityName,
                    entityId: vendorRelatedIds[convertEntityNameToId(vendorField.entityName)]
                }
                await uploadAttachment(attachmentBody);
            }
        });

        dynamicFieldsAttachments.forEach(async (dynamicFieldAttachment, i) => {
            if (dynamicFieldAttachment) {
                const attachmentBody = {
                    file: dynamicFieldAttachment,
                    attachmentType: 'otherField',
                    entityName: 'VendorOther',
                    entityId: vendorRelatedIds['otherFields'].find(otherField => otherField.key === dynamicFields[i].key).id
                }
                await uploadAttachment(attachmentBody);
            }
        });
    };

    const uploadAttachment = async (attachmentBody) => {
        const totalChunks = Math.ceil(attachmentBody.file.size / CHUNK_SIZE);
        const formData = new FormData();
        formData.append("name", attachmentBody.file.name);
        formData.append("mimeType", attachmentBody.file.type);
        formData.append("totalSizeInBytes", attachmentBody.file.size);
        formData.append("totalChunks", totalChunks)
        formData.append("attachmentType", attachmentBody.attachmentType);
        formData.append("entityName", attachmentBody.entityName);
        formData.append("entityId", attachmentBody.entityId);
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/attachment/init`, {
            method: "POST",
            body: formData,
        });
        const jsonResponse = await response.json();
        if (!jsonResponse.success) {
            alert(jsonResponse.message + "/nPlease contact the admin and you can take this screenshot to share with team");
        }
        const attachmentId = jsonResponse.data.attachmentId;
        const uploadPromises = [];
        for (let i = 0; i < totalChunks; i++) {
            const chunk = attachmentBody.file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
            const formData = new FormData();
            formData.append('attachmentId', attachmentId);
            formData.append('chunkIndex', i);
            formData.append('file', chunk);

            // Create a promise for the current chunk upload
            const promise = fetch(`${process.env.REACT_APP_SERVER_URL}/attachment/uploadChunk`, {
                method: 'POST',
                body: formData,
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`Chunk ${i} failed to upload`);
                }
                return response.json();
            });

            uploadPromises.push(promise);
        }

        // Run all uploads in parallel
        try {
            await Promise.all(uploadPromises);
            console.log("All chunks uploaded successfully");
        } catch (error) {
            console.error("Error uploading one or more chunks:", error);
        }
    }

    const areAllDetailsSubmitted = () => {
        const requiredAttachments = vendorFields.filter(
            (vendorField) =>
                vendorField.fieldType === "attachment" && vendorField.isRequired
        );
        for (let requiredAttachment of requiredAttachments) {
            if (!vendorData[requiredAttachment.id]) return false;
        }
        return true;
    };

    const renderVendorField = (vendorField) => {
        if (vendorField.fieldType === "head")
            return <h2>{vendorField.label}</h2>;
        else if (vendorField.fieldType === "label")
            return <h4 className="label">{vendorField.label}</h4>;
        else if (vendorField.fieldType === "attachment")
            return (
                <Attachment
                    label={vendorField.label}
                    file={vendorData[vendorField.id]}
                    updateFile={(file) =>
                        updateVendorField(vendorField.id, file)
                    }
                    required={vendorField.isRequired}
                    submit={isSubmitPressed}
                />
            );
        else if (vendorField.fieldType === "autocomplete" && isEditMode(mode)) {
            return (
                <Autocomplete
                    disablePortal
                    id={vendorField.id}
                    size="small"
                    options={vendorField.options}
                    getOptionLabel={vendorField.getOptionLabel}
                    renderOption={vendorField.renderOption}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={vendorField.label}
                            required={vendorField.isRequired}
                        />
                    )}
                    value={vendorData[vendorField.id]}
                    onChange={(e, newValue) =>
                        updateVendorField(vendorField.id, newValue)
                    }
                />
            );
        } else if (vendorField.fieldType === "address") {
            return (
                <Address
                    value={vendorData[vendorField.id]}
                    onChange={(newData) =>
                        updateVendorField(vendorField.id, newData)
                    }
                    editMode={isEditMode(mode)}
                />
            );
        } else
            return (
                <TextField
                    required={vendorField.isRequired ? true : false}
                    InputProps={{
                        readOnly: isEditMode(mode) ? false : true,
                    }}
                    id={vendorField.id}
                    label={vendorField.label}
                    value={vendorData[vendorField.id]}
                    fullWidth
                    type={vendorField.contentType ?? "text"}
                    size="small"
                    onChange={(e) =>
                        updateVendorField(vendorField.id, e.target.value)
                    }
                    error={
                        vendorField.isDataValid
                            ? !vendorField.isDataValid(
                                vendorData[vendorField.id]
                            )
                            : false
                    }
                    helperText={
                        (
                            vendorField.isDataValid
                                ? !vendorField.isDataValid(
                                    vendorData[vendorField.id]
                                )
                                : false
                        )
                            ? vendorField.errorMessage
                            : ""
                    }
                />
            );
    };

    if (processStage === "loading") return <Loading />;
    else if (processStage === "success")
        return (
            <Success
                successTitle="Submission Successful"
                successBody="Your review is done. Details are mailed to creator of vendor"
            />
        );
    else
        return (
            <div className="vendor-main-container">
                {window.location.pathname === "/admin/vendor-registration" && (
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
                <h1>{configDetails.title[mode]}</h1>

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

                <Stack component="form" onSubmit={submit}>
                    <Grid
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                        {vendorFields.map((vendorField) => {
                            return (
                                <Grid
                                    key={vendorField.id}
                                    item
                                    xs={vendorField.uiWidth === "full" ? 12 : 6}
                                    className={
                                        vendorField.fieldType + "_parent"
                                    }
                                >
                                    {renderVendorField(vendorField)}
                                </Grid>
                            );
                        })}
                        <DynamicFields
                            fields={dynamicFields}
                            fieldsAttachments={dynamicFieldsAttachments}
                            onFieldsChange={(updateFields) =>
                                setDynamicFields(updateFields)
                            }
                            onFieldsAttachmentsChange={(updatedAttachments) =>
                                setDynamicFieldsAttachments(updatedAttachments)
                            }
                            editMode={isEditMode(mode)}
                        />
                        {isLocalVendorRegistration && (
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    id="email"
                                    label="Your Email"
                                    type="email"
                                    value={localEmail}
                                    onChange={(e) =>
                                        setLocalEmail(e.target.value)
                                    }
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                        )}
                        {isLocalVendorRegistration && <Grid item xs={6}></Grid>}
                        <Grid item xs={12}>
                            {vendorSubmitLoading ? (
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
                </Stack>
            </div>
        );
}
