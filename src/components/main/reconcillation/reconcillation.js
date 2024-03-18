import { Link, useParams } from "react-router-dom";
import ExcelJS from "exceljs";
import {
    Button,
    CircularProgress,
    Container,
    Fab,
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
import { Fragment, useEffect, useState } from "react";
import "./reconcillation.css";
import {
    Add,
    ArrowBack,
    CheckCircleOutline,
    Delete,
} from "@mui/icons-material";
import Attachment from "../../attachment/Attachment";
import { getFile, labelToKey } from "../../../utilities/utils";
import { reconcillationFields } from "../../../utilities/pofields";
import { reconcillationSheetDownload } from "../../../utilities/excelUtilities";
import { LoadingButton } from "@mui/lab";
import { updateFile } from "../../../util";

export default function Reconcillation() {
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [poRecords, setPoRecords] = useState([]);
    const params = useParams();
    const poCode = params.poCode;
    const [reconcillationSheet, setReconcillationSheet] = useState([]);
    const [reconcillationAtt, setReconcillationAtt] = useState(null);
    const [buyingOrder, setBuyingOrder] = useState({});
    const [submit, setSubmit] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [packagingAtt, setPackagingAtt] = useState(null);
    const [invoiceAtts, setInvoiceAtts] = useState([
        { id: "new", attachment: null },
    ]);
    const [comment, setComment] = useState("");
    const [dynamicFields, setDynamicFields] = useState([]);
    const [dynamicFieldsAttachments, setDynamicFieldsAttachments] = useState(
        []
    );

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}reconcillation/${poCode}`)
            .then((response) => response.json())
            .then(async (res) => {
                const buyingOrderRes = res.data.buyingOrder;
                setPoRecords(res.data.poRecords);
                setBuyingOrder(buyingOrderRes);
                setPackagingAtt(
                    await getFile("buyingOrderIdPackaging", buyingOrderRes.id)
                );
                const reconcillationFile = await getFile(
                    "buyingOrderIdGRNSheet",
                    buyingOrderRes.id
                );
                if (reconcillationFile) {
                    setReconcillationAtt(reconcillationFile);
                    updateReconcillationFile(reconcillationFile);
                }
                const invoiceAttsResponse = await Promise.all(
                    buyingOrderRes.invoiceAtts.map(async (invoiceAttData) => {
                        return {
                            id: invoiceAttData.id,
                            attachment: await getFile(
                                "invoiceAttId",
                                invoiceAttData.id
                            ),
                        };
                    })
                );
                const dynamicFieldsRes = buyingOrderRes.otherFields.map(
                    (otherField) => {
                        return {
                            key: otherField.otherKey,
                            value: otherField.otherValue ?? "",
                        };
                    }
                );
                const dynamicFieldsAttsRes = await Promise.all(
                    buyingOrderRes.otherFields.map(async (otherField) => {
                        return await getFile(
                            "buyingOrderOtherId",
                            otherField.id
                        );
                    })
                );
                setDynamicFields(dynamicFieldsRes);
                setDynamicFieldsAttachments(dynamicFieldsAttsRes);
                if (invoiceAttsResponse.length > 0)
                    setInvoiceAtts(invoiceAttsResponse);
                if (buyingOrderRes.grnComment)
                    setComment(buyingOrderRes.grnComment);
                setLoading(false);
            });
    }, [poCode]);

    const updateReconcillationFile = async (file) => {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file);

        const worksheet = workbook.getWorksheet(1);
        const parsedData = [];
        let labels = [];
        worksheet.eachRow((row, rowIndex) => {
            if (rowIndex === 1) {
                labels = row.values.slice(1); // slice(1) because ExcelJS rows are 1-based and row.values[0] is undefined
            } else {
                let rowData = row.values.slice(1).map((cell) => {
                    if (typeof cell === "object" && cell.formula) {
                        // Check if the result is a number and round it if so
                        return typeof cell.result === "number"
                            ? Math.round(cell.result * 100) / 100
                            : cell.result;
                    } else if (typeof cell === "object" && cell.text) {
                        return cell.text;
                    }
                    // If directly a number, round it, otherwise return the cell value
                    return typeof cell === "number"
                        ? Math.round(cell * 100) / 100
                        : cell;
                });
                const reconcillationData = {};
                rowData.forEach((value, index) => {
                    const key = labelToKey(labels[index], reconcillationFields);
                    if (key) reconcillationData[key] = value;
                });
                parsedData.push(reconcillationData);
            }
        });

        setReconcillationSheet(parsedData);
        setReconcillationAtt(file);
    };

    const addNewInvoiceAtt = () => {
        setInvoiceAtts([...invoiceAtts, { id: "new", attachment: null }]);
    };
    const allAttachmentsSubmitted = () => {
        if (!reconcillationAtt) return false;
        for (let i = 0; i < invoiceAtts.length; i++) {
            const invoiceAtt = invoiceAtts[i];
            if (!invoiceAtt.attachment) return false;
        }
        return true;
    };

    const allDynamicFieldKeysUnique = () => {
        const seenKeys = new Set();
        for (const dynamicField of dynamicFields) {
            if (seenKeys.has(dynamicField.key)) {
                alert("All the other attachments must have unique keys");
                return false;
            }
            seenKeys.add(dynamicField.key);
        }
        return true;
    };

    const updateGRN = async (e) => {
        e.preventDefault();
        setSubmit(true);
        if (!allAttachmentsSubmitted()) return;
        if (!allDynamicFieldKeysUnique()) return;
        setSubmitLoading(true);
        const formData = new FormData();
        if (comment && comment.length > 0) formData.append("comment", comment);
        if (dynamicFields.length > 0)
            formData.append("otherFields", JSON.stringify(dynamicFields));

        const response = await fetch(
            `${process.env.REACT_APP_SERVER_URL}reconcillation/${poCode}`,
            {
                method: "PUT",
                body: formData,
            }
        );
        const updatePO = await response.json();
        if (updatePO.success) {
            if (packagingAtt)
                await updateFile(
                    "GRNPackaging",
                    packagingAtt,
                    "buyingOrderIdPackaging",
                    buyingOrder.id
                );
            await updateFile(
                "GRNSheet",
                reconcillationAtt,
                "buyingOrderIdGRNSheet",
                buyingOrder.id
            );
            for (let i = 0; i < invoiceAtts.length; i++) {
                const invoiceAtt = invoiceAtts[i];
                const invoiceFormData = new FormData();
                invoiceFormData.append("invoiceAtt", invoiceAtt.attachment);
                await fetch(
                    `${
                        process.env.REACT_APP_SERVER_URL
                    }reconcillation/invoice/${
                        invoiceAtt.id === "new" ? buyingOrder.id : invoiceAtt.id
                    }`,
                    {
                        method: invoiceAtt.id === "new" ? "POST" : "PUT",
                        body: invoiceFormData,
                    }
                );
            }
            const invoicesToBeDeleted = buyingOrder.invoiceAtts.filter(
                (oldInvoiceAtt) =>
                    !invoiceAtts.some(
                        (newInvoiceAtt) => newInvoiceAtt.id === oldInvoiceAtt.id
                    )
            );

            for (let i = 0; i < invoicesToBeDeleted.length; i++) {
                const invoice = invoicesToBeDeleted[i];
                await fetch(
                    `${process.env.REACT_APP_SERVER_URL}reconcillation/invoice/${invoice.id}`,
                    {
                        method: "DELETE",
                    }
                );
            }
            const otherFields = updatePO.data.otherFields;
            for (let i = 0; i < otherFields.length; i++) {
                const otherField = otherFields[i];
                await updateFile(
                    `grnOther-${otherField.key}`,
                    dynamicFieldsAttachments[i],
                    "buyingOrderOtherId",
                    otherField.id
                );
            }
            setSuccess(true);
        } else {
            alert("Some error occurred. Please contact the tech team");
        }
        setSubmitLoading(false);
    };

    const handleInvoiceChange = (file, index) => {
        const invoiceTempAtts = [...invoiceAtts];
        invoiceTempAtts[index].attachment = file;
        setInvoiceAtts(invoiceTempAtts);
    };

    const removeInvoice = (index) => {
        const invoiceTempAtts = invoiceAtts.filter((_, i) => i !== index);
        setInvoiceAtts(invoiceTempAtts);
    };

    const handleFieldChange = (e, index, fieldToUpdate) => {
        const newFields = [...dynamicFields];
        const newFieldsAttachs = [...dynamicFieldsAttachments];
        if (fieldToUpdate === "attachment") {
            newFieldsAttachs[index] = e;
            setDynamicFieldsAttachments(newFieldsAttachs);
        } else {
            newFields[index][fieldToUpdate] = e.target.value;
            setDynamicFields(newFields);
        }
    };

    const handleRemoveField = (index) => {
        const newFields = dynamicFields.filter((_, i) => i !== index);
        const newFieldsAttachs = dynamicFieldsAttachments.filter(
            (_, i) => i !== index
        );
        setDynamicFields(newFields);
        setDynamicFieldsAttachments(newFieldsAttachs);
    };

    const addNewField = () => {
        setDynamicFields([...dynamicFields, { key: "", value: "" }]);
        setDynamicFieldsAttachments([...dynamicFieldsAttachments, null]);
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
                        Your GRN details are updated successfully
                    </Typography>
                    <Link to="/admin/po-records">
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginTop: "1rem" }}
                        >
                            Go Back
                        </Button>
                    </Link>
                </Paper>
            </Container>
        );

    return (
        <div className="reconcillation">
            <Link to="/admin/po-records">
                <IconButton edge="start" color="inherit" aria-label="back">
                    <ArrowBack />
                    Back
                </IconButton>
            </Link>
            <form onSubmit={updateGRN}>
                <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                    <Grid item xs={6} style={{ margin: "auto" }}>
                        <h3 style={{ margin: "auto" }}>GRN</h3>
                    </Grid>
                    <Grid item xs={6} style={{ margin: "auto" }}>
                        <Attachment
                            label="Download Reconcillation Sheet Excel"
                            downloadFile={() =>
                                reconcillationSheetDownload(poRecords)
                            }
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Attachment
                            label="Upload Packaging List"
                            file={packagingAtt}
                            updateFile={(file) => setPackagingAtt(file)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Attachment
                            label="Upload Reconcillation Sheet"
                            file={reconcillationAtt}
                            updateFile={(file) =>
                                updateReconcillationFile(file)
                            }
                            required={true}
                            submit={submit}
                            fileType=".xlsx"
                        />
                    </Grid>
                    {reconcillationSheet.length > 0 && (
                        <Grid item xs={12}>
                            <TableContainer component={Paper}>
                                <Table
                                    style={{ tableLayout: "auto" }}
                                    size="small"
                                    aria-label="a dense table"
                                >
                                    <TableHead>
                                        <TableRow>
                                            {reconcillationFields.map(
                                                (tableHead, i) => (
                                                    <TableCell key={i}>
                                                        {tableHead.label}
                                                    </TableCell>
                                                )
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {reconcillationSheet.map((row, i) => (
                                            <TableRow
                                                key={i}
                                                sx={{
                                                    "&:last-child td, &:last-child th":
                                                        { border: 0 },
                                                }}
                                            >
                                                {reconcillationFields.map(
                                                    (
                                                        reconcillationField,
                                                        i
                                                    ) => (
                                                        <TableCell
                                                            style={{
                                                                whiteSpace:
                                                                    "nowrap",
                                                            }}
                                                            key={i}
                                                        >
                                                            {
                                                                row[
                                                                    reconcillationField
                                                                        .key
                                                                ]
                                                            }
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
                        <TextField
                            autoFocus
                            margin="dense"
                            id="deny-reason"
                            label="Comments"
                            type="text"
                            fullWidth
                            size="small"
                            multiline // Added multiline property
                            rows={3} // Added rows property
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <h4 style={{ margin: "auto" }}>Invoice(s)</h4>
                    </Grid>
                    {invoiceAtts.map((invoiceAtt, i) => (
                        <Fragment key={i}>
                            <Grid item xs={i === 0 ? 6 : 5.3}>
                                <Attachment
                                    label={`Invoice Drop ${i + 1}`}
                                    file={invoiceAtt.attachment}
                                    updateFile={(file) =>
                                        handleInvoiceChange(file, i)
                                    }
                                    required={true}
                                    submit={submit}
                                />
                            </Grid>
                            {i !== 0 && (
                                <Grid item xs={0.7}>
                                    <Fab
                                        color="error"
                                        aria-label="delete"
                                        onClick={() => removeInvoice(i)}
                                        size="small"
                                    >
                                        <Delete />
                                    </Fab>
                                </Grid>
                            )}
                        </Fragment>
                    ))}
                    <Grid
                        item
                        xs={12}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Fab
                            color="primary"
                            className="dynamic-icon"
                            aria-label="add"
                            onClick={addNewInvoiceAtt}
                            size="small"
                        >
                            <Add />
                        </Fab>
                    </Grid>
                    <Grid item xs={12}>
                        <h4 style={{ margin: "auto" }}>Other Attachments</h4>
                    </Grid>
                    {dynamicFields.map((field, index) => (
                        <Fragment key={index}>
                            <Grid item xs={2}>
                                <TextField
                                    required
                                    label="Key"
                                    value={field.key}
                                    onChange={(e) =>
                                        handleFieldChange(e, index, "key")
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
                                        handleFieldChange(e, index, "value")
                                    }
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={5.3}>
                                <Attachment
                                    label="Attachment"
                                    file={dynamicFieldsAttachments[index]}
                                    updateFile={(file) =>
                                        handleFieldChange(
                                            file,
                                            index,
                                            "attachment"
                                        )
                                    }
                                />
                            </Grid>
                            <Grid item xs={0.7}>
                                <Fab
                                    color="error"
                                    aria-label="delete"
                                    className="dynamic-icon"
                                    onClick={() => handleRemoveField(index)}
                                    size="small"
                                >
                                    <Delete />
                                </Fab>
                            </Grid>
                        </Fragment>
                    ))}
                    <Grid
                        item
                        xs={12}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Fab
                            color="primary"
                            className="dynamic-icon"
                            aria-label="add"
                            onClick={addNewField}
                            size="small"
                        >
                            <Add />
                        </Fab>
                    </Grid>
                    <Grid item xs={12}>
                        {submitLoading ? (
                            <LoadingButton
                                variant="contained"
                                color="primary"
                                type="submit"
                                size="small"
                                fullWidth
                                loading
                            >
                                Update
                            </LoadingButton>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                size="small"
                                fullWidth
                            >
                                Update
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}
