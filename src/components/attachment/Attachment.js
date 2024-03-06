import React, { useEffect, useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { FileDownload, FileUpload } from "@mui/icons-material";
import {
    openInBrowserExtensions,
    openInBrowserTypes,
} from "../../utilities/utils";

export default function Attachment({
    label,
    file,
    updateFile,
    downloadFile,
    required,
    submit,
    fileType,
}) {
    const [blobUrl, setBlobUrl] = useState(null);

    useEffect(() => {
        // This could be a Blob URL created and stored in state when the component mounts or in response to certain events
        // const url = URL.createObjectURL(file);
        // setBlobUrl(url);

        return () => {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [blobUrl]);

    const uploadFile = () => {
        const input = document.createElement("input");
        input.type = "file";
        if (fileType) input.accept = fileType;

        input.onchange = (e) => {
            const selectedFile = e.target.files[0];
            updateFile(selectedFile);
        };

        input.click();
    };

    const viewFile = () => {
        const extension = file.name.split(".").pop().toLowerCase();
        if (
            openInBrowserTypes.includes(file.type) ||
            openInBrowserExtensions.includes(extension)
        ) {
            const url = URL.createObjectURL(file);
            window.open(url, "_blank");
            setBlobUrl(url);
        } else {
            const url = URL.createObjectURL(file);
            const a = document.createElement("a");
            a.href = url;
            a.download = file.name;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    return (
        <TextField
            required={required}
            InputProps={{
                readOnly: true,
                endAdornment: (
                    <InputAdornment position="end">
                        {updateFile && (
                            <IconButton
                                aria-label="Upload a file"
                                onClick={uploadFile}
                            >
                                <FileUpload />
                            </IconButton>
                        )}
                        {(file || downloadFile) && (
                            <IconButton
                                aria-label="Open File"
                                onClick={downloadFile ? downloadFile : viewFile}
                            >
                                <FileDownload />
                            </IconButton>
                        )}
                    </InputAdornment>
                ),
            }}
            label={label}
            value={file?.name ? file.name : ""}
            fullWidth
            size="small"
            error={required && submit ? (file ? false : true) : false}
        />
    );
}
