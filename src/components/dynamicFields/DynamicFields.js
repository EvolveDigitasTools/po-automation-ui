import React, { Fragment } from "react";
import { TextField, Grid, Fab } from "@mui/material";
import Attachment from "../attachment/Attachment";
import { Add, Delete } from "@mui/icons-material";
import { downloadAttachment } from "../../utilities/utils";

export default function DynamicFields({
    fields,
    fieldsAttachments,
    onFieldsChange,
    onFieldsAttachmentsChange,
    editMode,
}) {
    const handleFieldChange = (e, index, fieldToUpdate) => {
        const newFields = [...fields];
        const newFieldsAttachs = [...fieldsAttachments];
        if (fieldToUpdate === "attachment") {
            newFieldsAttachs[index] = e;
            onFieldsAttachmentsChange(newFieldsAttachs);
        } else {
            newFields[index][fieldToUpdate] = e.target.value;
            onFieldsChange(newFields);
        }
    };

    const handleRemoveField = (index) => {
        const newFields = fields.filter((_, i) => i !== index);
        const newFieldsAttachs = fieldsAttachments.filter(
            (_, i) => i !== index
        );
        onFieldsChange(newFields);
        onFieldsAttachmentsChange(newFieldsAttachs);
    };

    const addNewField = () => {
        onFieldsChange([...fields, { key: "", value: "" }]);
        onFieldsAttachmentsChange([...fieldsAttachments, null]);
    };

    if (editMode)
        return (
            <Fragment>
                {fields.map((field, index) => (
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
                                file={fieldsAttachments[index]}
                                updateFile={(file) =>
                                    handleFieldChange(file, index, "attachment")
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
                        onClick={addNewField} 
                        variant="extended"
                        size="small"
                    >
                        <Add sx={{ mr: 1 }} />
                        Add More Fields
                    </Fab>
                </Grid>
            </Fragment>
        );
    else
        return fields.map((field, index) => (
            <Fragment key={index}>
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
                        file={fieldsAttachments[index]}
                        downloadFile={(editMode || !fieldsAttachments[index] ? null : () => downloadAttachment(fieldsAttachments[index]))}
                    />
                </Grid>
            </Fragment>
        ));
}
